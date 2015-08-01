define([], function() {

    var apiBaseUrl = avalon.illyGlobal && avalon.illyGlobal.apiBaseUrl;
    var token = localStorage.getItem('illy-token');
    
    var cachedPrefix = 'illy-task-mall-';

    function setCachedData(itemName, data) {
        var strData = JSON.stringify(data);
        localStorage.setItem(cachedPrefix + itemName, strData);
    }
    
    function getCachedData(itemName) {
        var data = localStorage.getItem(cachedPrefix + itemName);
        return JSON.parse(data + '');
    }

    function clearCachedData(targetNameArr) {
        for (var i = 0, len = targetNameArr.length; i < len; i++) {
            localStorage.removeItem(cachedPrefix + targetNameArr[i]);
        }
    }

    var limit = 6; // 一次抓取多少数据
    var list = avalon.define({
        $id: "mall",
        visited: false, // first in, no data
        lists: [], 
        offset: 0, // inner var, to fetch data with offset and limit
        btnShowMore: true,
        /**
         * fetchRemoteData
         * only ctrl function to fetch data with api
         *
         * @param apiArgs api里需要的参数
         * @param data ajax请求查询参数
         * @param target success得到的数据赋值目标变量名
         * @param type 数据赋值是直接赋值还是追加方式
         * @return {undefined}
         */
        fetchRemoteData: function(apiArgs, data, target, type) {
            if (list.visited) {
                list.lists = getCachedData(target);
                return;
            }
            $http.ajax({
                url: apiBaseUrl + apiArgs,
                headers: {
                    Authorization: 'Bearer ' + token
                },
                data: data,
                success: function(res) {
                    type == 'concat' ? list[target] = list[target].concat(res) : list[target] = res;
                    setCachedData(target, res); // illy-task-mall-lists
                },
                error: function(res) {
                    avalon.log('mall ajax error when fetch data');
                },
                ajaxFail: function(res) {
                    avalon.log('mall ajax failed when fetch data');
                }
            })
        },
        showMore: function(e) {
            e.preventDefault();
            var page = 2;
            if (list.offset < limit) {
                list.btnShowMore = false;
                return;
            } else {
                list.offset = list.offset + limit * (page - 1);
            }

            list.fetchRemoteData('/api/v1/score/mall', {offset: list.offset}, 'lists', 'concat');
        }
    });

    return avalon.controller(function($ctrl) {
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        }
        // 进入视图
        $ctrl.$onEnter = function(params) {
            list.visited = avalon.vmodels.root.currentIsVisited;
            list.offset <= limit ? list.btnShowMore = false : list.btnShowMore = true; // otherwise, show it
            list.fetchRemoteData('/api/v1/score/mall', {}, 'lists');
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            //avalon.log('list.js onRendered in Time: ' + Date.now());
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });
});
