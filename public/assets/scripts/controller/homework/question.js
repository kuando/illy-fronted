define([], function() {

    var local_question_view_ani = 'a-bounceinL';
    var wx = avalon.wx;
    
    // 录音对象相关属性和方法, 因为wx的sdk方法都是独立作用域的回调，需要一个全局的存储对象
    var record = {
        startTime: 0,
        endTime: 0,
        duration: 5,
        localId: '', // core!
        dropFlag: false, // 是否放弃本录音题的标记
        timeout: 'timeout', // timeoutId, just need it, whatever name can do!
        remainTimeTimer: null, // remain time timer
        showTimeoutDelay: 45, // second, define when show the timeout
        recordTooShortTipsLastTime: 1.5, // 录音时间过短提示信息持续时间
        showTimeOutLayer: function() {
            // 给个遮罩， 10秒倒计时开始, 并会自动停止录音并上传
            var timeoutMask = avalon.$('.timeout-mask');
            var isRecording = avalon.$('.isRecording'); 
            record.layerUiChange();
            // time to show
            record.remainTimeTimer = setInterval(function() {
                var time = timeoutMask && parseInt(timeoutMask.innerHTML, 10);
                timeoutMask && ( timeoutMask.innerHTML = time > 0 ? time - 1 : 10);
                if (time == 0) { question.stopRecord(); clearInterval(record.remainTimeTimer); } // core! should stop it.
            }, 1000)
            // recover the ui when time enough, 18s is enough
            setTimeout(function() {
                record.layerUiRecover();
            }, 18000); 
        },
        layerUiChange: function() { // inner fn of showTimeoutLayer
            var timeoutMask = avalon.$('.timeout-mask');
            var isRecording = avalon.$('.isRecording'); 
            // change some ui for mask
            timeoutMask && (timeoutMask.style.display = 'inline-block'); // show mask
            isRecording && isRecording.classList.add('timeout');
        },
        layerUiRecover: function() { // inner fn of showTimeoutLayer
            var timeoutMask = avalon.$('.timeout-mask');
            var isRecording = avalon.$('.isRecording'); 
            var remainTimeTimer = record.remainTimeTimer;
            remainTimeTimer && clearInterval(remainTimeTimer);
            timeoutMask && ( timeoutMask.innerHTML = '10' ); 
            timeoutMask && ( timeoutMask.style.display = 'none' );
            isRecording && isRecording.classList.remove('timeout');
        },
        showTips: function() {
            var recordTips = avalon.$('.record-tips');
            recordTips && ( recordTips.style.display = 'inline-block' );
        },
        hideTips: function() {
            var recordTips = avalon.$('.record-tips');
            recordTips && ( recordTips.style.display = 'none' );
        }
    }; 

    // 每一个具体的题目控制器
    var question = avalon.define({
        $id: "question",
        homeworkId: avalon.vmodels.detail.homeworkId, // 直接取，这种固定值不需要动态获取
        exercise: {}, // 本题所有数据
        total: 0, // 直接取不行,fuck bug... waste much time... 201507222006
        currentId: 0, // current exerciseId, 当前题id
        userAnswer: '', // 忠实于用户答案, 最多加个trim()
        localAnswers: [], // 本地保存本次作业当前所有做过的题的答案，length就是做到过哪一题了, core!!!
        right: null, // 做对与否, 录音题始终设为right(Em~...), 控制一些显隐逻辑(null, true, false)
        hasNext: false, // 是否有下一题？
        isRecording: false, // whether recording now, for ms-class 
        showPlayRecordBtn: false, // 是否显示播放录音按钮
        next: function() { // 点击进入下一题
            // 只处理页面跳转进入下一题
            avalon.router.go('app.detail.question', {homeworkId: question.homeworkId, questionId: question.currentId + 1});
        },
        startRecord: function() {
            
            /** 
             *  开始微信录音api
             *  隐藏一些ui
             *  标记开始录音
             *  记录开始录音时间
             *  注册wx超时录音api
             *  注册超时ui提示timeout
             */

            wx.startRecord();
            record.hideTips(); // for strong
            question.isRecording = true;
            var startTime = Date.now(); // 记录开始录音时间，便于过长提示或者太短的舍弃
            record.startTime = startTime;

            // 开始录音时就要注册这个函数，走到这就说明超时了，没点停止就自动完成, 2号获取路径
            wx.onVoiceRecordEnd({
                // 录音时间超过一分钟没有停止的时候会执行complete回调
                complete: function(res) {
                    var localId = res.localId;
                    record.localId = localId;
                    question.uploadRecord(); // 上传录音，得到serverId
                }
            })
            // 同时设置ui来提示快到时间了
            record.timeout = setTimeout(function() {
                record.showTimeOutLayer();
            }, record.showTimeoutDelay * 1000) // 秒
        },
        stopRecord: function() {

            /**
             *  停止ui
             *  停止正在录音标记
             *  停止时间记录
             *  判断长短是否合法？
             */

            question.isRecording = false;
            avalon.$('.timeout-mask').style.display = 'none';
            // 能到这一步就该先清理ui上的倒计时，再统计时间来做相应操作
            record.timeout && clearTimeout(record.timeout); // for strong
            var endTime = Date.now();
            record.endTime = endTime;
            var duration = ( record.endTime - record.startTime ) / 1000; // 间隔时间， 单位秒 
            record.duration = duration;
            if (duration < 5) { // 小于五秒
                // alert('对不起，录制时间过短，请重新录制！'); // ios 点击穿透bug... fuck
                record.showTips();
                setTimeout(function() {
                    record.hideTips();
                }, record.recordTooShortTipsLastTime * 1000)
                wx.stopRecord({
                    // do nothing, just stop, fix bug
                });
            } else { // 正常结束，取结果, 1号获取路径
                wx.stopRecord({
                    success: function(res) {
                        var localId = res.localId;
                        record.localId = localId;
                        question.uploadRecord();
                        question.showPlayRecordBtn = true;
                    }
                })
                var recordTotalTime = avalon.$('.record-total-time')
                recordTotalTime && ( recordTotalTime.innerHTML = parseInt(duration, 10) ); // 设置录音时长
            }
        },
        playRecord: function() {

            /** 
             *  如果localId有，就播放，没有就提示
             */

            var localId = record.localId;
            if (localId == '') {
                alert("录制不成功，请重试！");
                console.log('no localId');
                //console.log(record);
                return ;
            }
            wx.playVoice({
                localId: localId
            });
        },
        stopPlayRecord: function() {

            /** 
             *  没有localId就返回，有就停止
             */

            var localId = record.localId;
            if (localId == '') {
                return ;
            }
            wx.stopVoice({
                localId: localId // 需要停止的音频的本地ID，由stopRecord接口获得
            })
        },
        uploadRecord: function() {

            /**
             *  没有localId就提示
             *  有localId就上传
             */

            var localId = record.localId;
            if (localId == '') {
                alert('对不起,上传失败!');
                console.log('上传失败，没有localId, localId为：' + localId);
                //console.log(record); // print global record array
                return;
            }
            wx.uploadVoice({
                localId: localId,
                isShowProgressTips: 1,
                success: function(res) {
                    var serverId = res.serverId; // 返回音频的服务端ID
                    question.userAnswer = serverId; // 这才是需要往后端发送的数据,供后端下载
                }
            })
        },
        checkAnswer: function() { // check answer and collect info for Collect

            /** 
             *  首先防御后退更改答案, 停止播放录音(执行呗，反正无害...)
             *  1. 如果为录音题, 做相关判断和统计
             *  2. 不是录音题
             *        如果没做，提示并停止检查
             *        做了检查对错, 做好相关统计，加入本地答案列表
             */

            if (question.localAnswers.length >= question.currentId) {
                console.log("不可更改答案!");
                return;
            }
            question.stopPlayRecord();
            var detailVM = avalon.getPureModel('detail');
            // if map3, collect info and push to the AudioCollect
            if (question.exercise && question.exercise.eType == 3) {
                question.stopRecord(); // checkAnswer click, means record must stop
                // do sth to check record or not
                // push and return. (id, answer)
                // mark!!! set the question.userAnswer!!!!!!!!!!!!
                var audioAnswer = question.userAnswer;
                var flag = record.dropFlag;
                if (audioAnswer == '' && !flag) { alert("本题未保存录音，请继续！"); record.dropFlag = true; return; }
                if (audioAnswer == '' && flag) { alert("您已放弃本题，请继续！"); }
                
                question.right = true; // right it for next
                detailVM.audioAnswers.push({exerciseId: question.currentId, answer: audioAnswer});
                question.localAnswers.push(audioAnswer); // bug fix, also need push
                return;
            }
            if (question.userAnswer == '') { alert("请选择至少一个答案！"); return; }
            
            // update the right attr, question.right = null for default, 不是null说明这题做过了，直接显示答案（处理后退的）
            if ( question.exercise && (question.exercise.answer === question.userAnswer.trim()) ) {
                question.right = true;
                //alert("答对了");
            } else {
                question.right = false;
                //alert("答错了");
                // collect info and push to the wrongCollect
                var radioAnswer = question.userAnswer;
                //alert(radioAnswer);
                detailVM.wrongCollect.push({exerciseId: question.currentId, answer: radioAnswer});  
            }
            question.localAnswers.push(record.localId);
            //avalon.log(question.localAnswers);
        }, // checkAnswer end
        submit: function() {

            /** 
             *  通知父vm提交(父vm决定提交跳转逻辑，此处简化)
             */

            avalon.vmodels.detail.submit();
        } 
    });

    var requestAuth = false; // 申请录音权限, do it only once, 非核心数据，不应该放在vm里!
    return avalon.controller(function($ctrl) {

        var rootView = document.querySelector('.app');
        var questionView = document.querySelector('.question');

        var question_view_ani = local_question_view_ani || (avalon.illyGlobal && avalon.illyGlobal.question_view_ani); // question视图切换动画配置
        var detailModel = avalon.getPureModel('detail');
        var exercises = detailModel.exercises;

        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        }
        // 进入视图, 对复用的数据进行重置或清空操作！
        $ctrl.$onEnter = function(params) {

            // clear some record data
            record.startTime = '';
            record.endTime = '';
            record.localId = '';
            record.remainTimeTimer = null;
            record.dropFlag = false;
            question.isRecording = false;
            
            question.right = null; // 重置题目对错标记

            //question.homeworkId = params.homeworkId !== "" ? params.homeworkId : 0; // yes, 直接从父vm属性中拿,这个不变的东西，不需要在此处动态获取！
            
            question.currentId = params.questionId;
            // questionId, 去取上级vm的exercises[questionId], 然后赋值给本ctrl的exercise，
            // 然后双向绑定，渲染
            var id = params.questionId - 1 || 0; // for strong, url中的questionId才用的是1开始，为了易读性
            question.exercise = exercises[id]; // yes

            // play record btn
            if (question.localAnswers.length < question.currentId) {
                question.showPlayRecordBtn = false;
            } else {
                question.showPlayRecordBtn = true;
            }

            question.total = avalon.vmodels.detail.exercises.length; // yes, must动态设置
            if (params.questionId < question.total) { // key! to next or submit
                question.hasNext = true;
            } else {
                question.hasNext = false;
            }

            // core! 双向绑定的同时还能恢复状态！ dom操作绝迹！ 20150730
            question.userAnswer = question.localAnswers[question.currentId - 1] || '';

            if (!requestAuth) {
                wx.startRecord();
                setTimeout(function() {
                    wx.stopRecord();
                }, 1000)
                requestAuth = true; // auth done
            }

        } // onEnter end
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            //avalon.log("question.js onBeforeUnload fn");
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });

});

