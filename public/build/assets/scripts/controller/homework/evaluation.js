define([],function(){var apiBaseUrl=avalon.illyGlobal&&avalon.illyGlobal.apiBaseUrl,resourcePrefix="http://resource.hizuoye.com/",defaultAvatarUrl="http://resource.hizuoye.com/images/avatar/children/default1.png?image",token=avalon.illyGlobal.token;null===token&&avalon.vmodels.root.noTokenHandler(),avalon.filters.year=function(str){return str.substring(0,4)},avalon.filters.time=function(str){return str.substring(5)};var limit=6,evaluation=avalon.define({$id:"evaluation",noContent:!1,noContentText:"还没有做过作业哦，<br/>快去完成作业，得到老师评价吧~",lists:[],visited:!1,offset:0,btnShowMore:!0,fetchData:function(data,concat){$http.ajax({method:"",url:apiBaseUrl+"homework/comments",data:data,headers:{Authorization:"Bearer "+token},dataType:"json",success:function(lists){concat?evaluation.lists.concat(lists):evaluation.lists=lists,setTimeout(function(){0===lists.length&&(evaluation.noContent=!0)},200)},error:function(res){console.log("evaluation list ajax error"+res),evaluation.noContent=!0},ajaxFail:function(res){console.log("evaluation list ajax failed"+res),evaluation.noContent=!0}})},showMore:function(e){e.preventDefault();var page=2;return evaluation.offset<limit?void(evaluation.btnShowMore=!1):(evaluation.offset=evaluation.offset+limit*(page-1),void evaluation.fetchRemoteData({offset:evaluation.offset},"concat"))}});return avalon.controller(function($ctrl){$ctrl.$onBeforeUnload=function(){},$ctrl.$onEnter=function(){setTimeout(function(){evaluation.avatar=resourcePrefix+avalon.vmodels.app.avatar+"?imageView2/1/w/200/h/200"||defaultAvatarUrl,evaluation.displayName=avalon.vmodels.app.displayName},300),evaluation.visited=avalon.vmodels.root.currentIsVisited,evaluation.btnShowMore=evaluation.offset<=limit?!1:!0,evaluation.fetchData()},$ctrl.$onRendered=function(){},$ctrl.$vmodels=[]})});
//# sourceMappingURL=evaluation.js.map