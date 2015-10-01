define([], function() {

    // get config
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl;
    var token = avalon.illyGlobal.token;
    
    // prefix of localStorage
    var cachedPrefix = 'illy-microsite-list-';
    // cache the view data
    
    // list cache flag
    var needCache = true;

    //var localLimit = 6; // 一次抓取多少数据
    var list = avalon.define({

        $id: "list",
        visited: false, // first in, no data
        lists: [], 

        //offset: 0, // inner var, to fetch data with offset and limit
        noContent: false,
        //isLoading: false,
        //noMoreData: false,
        //btnShowMore: false,
        fetchRemoteData: function(apiArgs, data, target, concat) { // only ctrl function to fetch data with api
            if (arguments.length !== 4) {
                avalon.illyError('ERROR: must give 4 args!' + arguments);
            }
            list.noMoreData = false;
            if (list.visited && needCache && !concat) {
                var articles = list.lists;
                list.lists = avalon.getLocalCache(cachedPrefix + list.categoryId + '-' + target);
                avalon.vmodels.root.currentRendered = true;
                list.offset = list.lists.length;
                if (articles.length > localLimit && articles.length % localLimit < localLimit) {
                    list.noMoreData = true; // not full support, but ok
                }
                return;
            }
            list.isLoading = true;
            $http.ajax({
                url: apiBaseUrl + apiArgs,
                headers: {
                    Authorization: 'Bearer ' + token
                },
                data: data,
                success: function(res) { 
                    if (concat === true) {
                        list.lists = list.lists.concat(res);
                    } else {
                        list.lists = res;
                    }
                    if (res.length === 0) {
                        list.noMoreData = true;
                    }
                    list.offset = list.lists.length;
                    if (list.lists.length === 0) {
                        list.noContent = true;
                        list.noMoreData = true;
                    }
                    var result = list.lists.$model;
                    avalon.setLocalCache(cachedPrefix + list.categoryId + '-' + target, result); // illy-microsite-11111-lists
                    list.isLoading = false;
                    avalon.vmodels.root.currentRendered = true;
                },
                error: function(res) {
                    avalon.illyError('microsite list.js ajax error', res);
                    if (list.lists.length === 0) {
                        list.noContent = true;
                    }
                    list.isLoading = false;
                },
                ajaxFail: function(res) { 
                    avalon.illyError('microsite list.js ajax failed', res);
                    if (list.lists.length === 0) {
                        list.noContent = true;
                    }
                    list.isLoading = false;
                }
            });
        }
        //showMore: function(e) {
        //    e.preventDefault();
        //    list.fetchRemoteData('categories/' + list.categoryId + '/posts', {limit: localLimit, offset: list.offset}, 'lists', true); // isShowMore
        //}

    }); // end of define

    //list.lists.$watch('length', function(newLists) {
    //    if (newLists !== void 0) {
    //        if (newLists < localLimit) {
    //            list.btnShowMore = false;
    //        } else {
    //            if (list.categoryId !== 'hots') {
    //                list.btnShowMore = true;
    //            }
    //        }
    //    }
    //});

    return avalon.controller(function($ctrl) {
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        };
        // 进入视图
        $ctrl.$onEnter = function(params) {

            avalon.vmodels.result.current = 'list';
            list.visited = avalon.vmodels.root.currentIsVisited;

        };
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});
