define([],function(){var apiBaseUrl=avalon.illyGlobal.apiBaseUrl,token=avalon.illyGlobal.token,cachedPrefix="illy-microsite-list-",needCache=!0,list=avalon.define({$id:"list",visited:!1,lists:[],noContent:!1,fetchRemoteData:function(apiArgs,data,target,concat){if(4!==arguments.length&&avalon.illyError("ERROR: must give 4 args!"+arguments),list.noMoreData=!1,list.visited&&needCache&&!concat){var articles=list.lists;return list.lists=avalon.getLocalCache(cachedPrefix+list.categoryId+"-"+target),avalon.vmodels.root.currentRendered=!0,list.offset=list.lists.length,void(articles.length>localLimit&&articles.length%localLimit<localLimit&&(list.noMoreData=!0))}list.isLoading=!0,$http.ajax({url:apiBaseUrl+apiArgs,headers:{Authorization:"Bearer "+token},data:data,success:function(res){list.lists=concat===!0?list.lists.concat(res):res,0===res.length&&(list.noMoreData=!0),list.offset=list.lists.length,0===list.lists.length&&(list.noContent=!0,list.noMoreData=!0);var result=list.lists.$model;avalon.setLocalCache(cachedPrefix+list.categoryId+"-"+target,result),list.isLoading=!1,avalon.vmodels.root.currentRendered=!0},error:function(res){avalon.illyError("microsite list.js ajax error",res),0===list.lists.length&&(list.noContent=!0),list.isLoading=!1},ajaxFail:function(res){avalon.illyError("microsite list.js ajax failed",res),0===list.lists.length&&(list.noContent=!0),list.isLoading=!1}})}});return avalon.controller(function($ctrl){$ctrl.$onBeforeUnload=function(){},$ctrl.$onEnter=function(){avalon.vmodels.result.current="list",list.visited=avalon.vmodels.root.currentIsVisited},$ctrl.$onRendered=function(){},$ctrl.$vmodels=[]})});
//# sourceMappingURL=list.js.map