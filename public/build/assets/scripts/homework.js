define(["http://res.wx.qq.com/open/js/jweixin-1.0.0.js",AvalonLibsBaseUrl+"mmState","./lib/http/http"],function(wx){var illy_domain="http://app.hizuoye.com",illy_images_base_src=illy_domain+"/assets/images",api_base_url="http://101.201.176.191/api/v1/",token=localStorage.getItem("illy-token"),global_viewload_animation_name="a-bounceinR",global_always_show_loader=!0,global_always_reset_scrollbar=!0,global_loading_timeout=8e3,global_loading_delay=300,global_loader_className=".loader",global_loader_dom=document.querySelector(".loader");avalon.getVM=function(vm){return avalon.vmodels[vm]},avalon.getPureModel=function(vm){return avalon.vmodels&&avalon.vmodels[vm]&&avalon.vmodels[vm].$model},avalon.$=function(selector){return document.querySelector(selector)};var doIsVisitedCheck=function(cacheContainer,callback){"function"==typeof cacheContainer&&(callback=cacheContainer,cacheContainer=void 0);var pageId=location.href.split("!")[1];cacheContainer=cacheContainer||CACHE_VISITED_PAGEID_CONTAINER,cacheContainer.push(pageId);for(var isVisited=!1,i=0,len=CACHE_VISITED_PAGEID_CONTAINER.length-1;len>i;i++)CACHE_VISITED_PAGEID_CONTAINER[i]===pageId&&(isVisited=!0);return callback&&"function"==typeof callback&&callback(),isVisited},loadingBeginHandler=function(loader,callback){"function"==typeof loader&&(callback=loader,loader=void 0),loader=global_loader_dom||document.querySelector(global_loader_className);var showLoader=function(){loader&&(loader.style.display="")},always_show_loader=global_always_show_loader===!0?!0:!1;loader&&always_show_loader?showLoader():!loader||always_show_loader||root.currentIsVisited||showLoader(),callback&&"function"==typeof callback&&callback()},loadingEndHandler=function(loader,callback){"function"==typeof loader&&(callback=loader,loader=void 0),loader=global_loader_dom||document.querySelector(global_loader_className);var hideLoader=function(){loader&&(loader.style.display="none")};void 0===global_loading_delay&&(global_loading_delay=500,console.log("WARNING: no global_loading_delay set!")),setTimeout(function(){hideLoader(),callback&&"function"==typeof callback&&callback()},global_loading_delay)},resetScrollbarWhenViewLoaded=function(){document.body.scrollTop=0,document.documentElement.scrollTop=0},getCurrentState=function(){var state1=mmState.currentState.stateName.split(".")[1],state2=mmState.currentState.stateName.split(".")[2];return void 0===state2?state1:state2},setPageTitle=function(titleMap){titleMap=titleMap||ACTIONBAR_TITLE_MAP;var currentState=root.currentState;root.title=titleMap[currentState]},bindBadNetworkHandler=function(timeout){timeout=global_loading_timeout||8e3;var loader=global_loader_dom||document.querySelector(global_loader_className);badNetworkTimer&&clearTimeout(badNetworkTimer);var badNetworkTimer=setTimeout(function(){alert("对不起，您的网络状态暂时不佳，请稍后重试！"),history.go(-1),loader&&(loader.style.display="none")},timeout);avalon.badNetworkTimer=badNetworkTimer,root.$watch("currentState",function(changeState){void 0!==changeState&&clearTimeout(badNetworkTimer)})},unbindBadNetworkHandler=function(timer){timer=timer||avalon.badNetworkTimer,timer&&clearTimeout(timer)};avalon.illyGlobal={viewani:global_viewload_animation_name,token:token,apiBaseUrl:api_base_url,illyDomain:illy_domain,imagesBaseSrc:illy_images_base_src,question_view_ani:"a-bounceinL",noTokenHandler:function(){alert("对不起，本系统仅供内部使用！")}};var CACHE_VISITED_PAGEID_CONTAINER=[],ACTIONBAR_TITLE_MAP={list:"作业列表",info:"作业详情",question:"题目详情",result:"作业结果",mistakeList:"错题列表",wrong:"错题详情",evaluation:"课堂表现"};avalon.wx=wx;var uri=location.href.split("#")[0],url=encodeURIComponent(uri);$http.ajax({url:"http://api.hizuoye.com/api/v1/public/sdk/signature",data:{url:url},success:function(jsonobj){var appId=jsonobj.appid,timestamp=jsonobj.timestamp,nonceStr=jsonobj.nonceStr,signature=jsonobj.signature;wx.config({debug:!1,appId:appId,timestamp:timestamp,nonceStr:nonceStr,signature:signature,jsApiList:["checkJsApi","onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","hideMenuItems","showMenuItems","hideAllNonBaseMenuItem","showAllNonBaseMenuItem","translateVoice","startRecord","stopRecord","onRecordEnd","playVoice","pauseVoice","stopVoice","uploadVoice","downloadVoice","chooseImage","previewImage","uploadImage","downloadImage","getNetworkType","openLocation","getLocation","hideOptionMenu","showOptionMenu","closeWindow","scanQRCode","chooseWXPay","openProductSpecificView","addCard","chooseCard","openCard"]})},error:function(res){console.log("wx ajax error"+res)},ajaxFail:function(res){console.log("wx ajaxFail"+res)}}),wx.error(function(res){alert("Woops, error comes..."+res)});var root=avalon.define({$id:"root",namespace:"homework",currentState:"",currentAction:"",currentIsVisited:!1,title:""});return root.$watch("currentAction",function(currentAction){if(void 0!==currentAction)switch(currentAction){case"onError":avalon.log("Error!, Redirect to index!",arguments),avalon.router.go("app.list");break;case"onBegin":break;case"onLoad":break;case"onBeforeUnload":break;case"onUnload":}}),root.$watch("currentAction",function(currentAction){"onBegin"===currentAction&&loadingBeginHandler(),"onLoad"===currentAction&&loadingEndHandler()}),root.$watch("currentAction",function(currentAction){"onBegin"===currentAction&&bindBadNetworkHandler(),"onLoad"===currentAction&&unbindBadNetworkHandler()}),root.$watch("currentAction",function(currentAction){"onLoad"===currentAction&&(root.currentState=getCurrentState())}),root.$watch("currentAction",function(currentAction){"onLoad"===currentAction&&setPageTitle()}),root.$watch("currentAction",function(currentAction){"onBegin"===currentAction&&(root.currentIsVisited=doIsVisitedCheck())}),global_always_reset_scrollbar===!0&&root.$watch("currentAction",function(currentAction){"onLoad"===currentAction&&resetScrollbarWhenViewLoaded()}),avalon.state("app",{url:"/","abstract":!0,views:{"header@":{templateUrl:"assets/templates/homework/header.html",controllerUrl:"scripts/controller/homework/header.js"},"":{templateUrl:"assets/templates/homework/app.html",controllerUrl:"scripts/controller/homework/app.js"}}}).state("app.list",{url:"",views:{"":{templateUrl:"assets/templates/homework/list.html",controllerUrl:"scripts/controller/homework/list.js"}}}).state("app.detail",{"abstract":!0,views:{"":{templateUrl:"assets/templates/homework/detail.html",controllerUrl:"scripts/controller/homework/detail.js"}}}).state("app.detail.info",{url:"detail/{homeworkId}/info",views:{"":{templateUrl:"assets/templates/homework/info.html",controllerUrl:"scripts/controller/homework/info.js"}}}).state("app.detail.question",{url:"detail/{homeworkId}/q/{questionId}",views:{"":{templateUrl:"assets/templates/homework/question.html",controllerUrl:"scripts/controller/homework/question.js",ignoreChange:function(changeType){return!!changeType}}}}).state("app.detail.result",{url:"detail/{homeworkId}/result",views:{"":{templateUrl:"assets/templates/homework/result.html",controllerUrl:"scripts/controller/homework/result.js"}}}).state("app.mistake",{"abstract":!0,views:{"":{templateUrl:"assets/templates/homework/mistake.html",controllerUrl:"scripts/controller/homework/mistake.js"}}}).state("app.mistake.mistakeList",{url:"mistake/list",views:{"":{templateUrl:"assets/templates/homework/mistakeList.html",controllerUrl:"scripts/controller/homework/mistakeList.js",viewCache:!0}}}).state("app.mistake.wrong",{url:"mistake/{homeworkId}/q/{questionId}",views:{"":{templateUrl:"assets/templates/homework/wrong.html",controllerUrl:"scripts/controller/homework/wrong.js",ignoreChange:function(changeType){return!!changeType}}}}).state("app.evaluation",{url:"evaluation",views:{"":{templateUrl:"assets/templates/homework/evaluation.html",controllerUrl:"scripts/controller/homework/evaluation.js"}}}),avalon.state.config({onError:function(){root.currentAction="onError"},onBeforeUnload:function(){root.currentAction="onBeforeUnload"},onUnload:function(){root.currentAction="onUnload"},onBegin:function(){root.currentAction="onBegin"},onLoad:function(){root.currentAction="onLoad"}}),{init:function(){avalon.log("init to bootstrap the app!"),avalon.history.start({fireAnchor:!1}),avalon.scan(),avalon.appInitTime=Date.now()}}});
//# sourceMappingURL=homework.js.map