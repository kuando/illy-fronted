define([],function(){var apiBaseUrl=avalon.illyGlobal.apiBaseUrl,token=avalon.illyGlobal.token,localLimit=6,slidersUrlPrefix="./assets/images",mistakeListSliders=[{image:slidersUrlPrefix+"/slider-mistake.png",title:"mistakeList",href:"#!/mistake/list"},{image:slidersUrlPrefix+"/slider-question.png",title:"ask",href:"#!/mistake/list"}],mistakeList=avalon.define({$id:"mistakeList",isVisited:!1,noMistakeListContent:!1,noContentText:"恭喜你！小学霸。暂时没有错题集，咱们继续努力，再接再厉吧~",lists:[],sliders:mistakeListSliders,renderSlider:function(){setTimeout(function(){$(".illy-container #slider").slider({loop:!0,ready:function(){setTimeout(function(){avalon.$(".illy-container #slider").style.visibility="visible"},16)},"done.dom":function(){}})},332)},isRecover:!1,isLoading:!1,offset:0,noMoreData:!1,btnShowMore:!1,fetchData:function(limit,offset,showMore){mistakeList.isLoading=!0,limit=limit||localLimit,offset=mistakeList.offset,mistakeList.isVisited&&!mistakeList.isRecover&&(offset=localStorage.getItem("illy-homework-mistakeList-offset"),0!==offset&&offset>=mistakeList.offset&&(limit=offset,offset=0,mistakeList.isRecover=!0)),$http.ajax({method:"",url:apiBaseUrl+"homework/mistake?limit="+limit+"&offset="+offset,headers:{Authorization:"Bearer "+token},success:function(res){mistakeList.lists=showMore===!0&&res.length<=localLimit?mistakeList.lists.concat(res):res,localStorage.setItem("illy-homework-mistakeList-offset",mistakeList.lists.length),mistakeList.offset=mistakeList.lists.length,setTimeout(function(){var newLists=mistakeList.lists;newLists&&0===newLists.length&&(mistakeList.noMistakeListContent=!0)},200),0===res.length&&(mistakeList.noMoreData=!0),mistakeList.isLoading=!1},error:function(res){avalon.illyError("mistakeList ajax error",res),0===mistakeList.lists.length&&(mistakeList.noMistakeListContent=!0),mistakeList.isLoading=!1},ajaxFail:function(res){avalon.illyError("mistakeList ajax failed",res),0===mistakeList.lists.length&&(mistakeList.noMistakeListContent=!0),mistakeList.isLoading=!1}})},showMore:function(e){e.preventDefault();var offset=mistakeList.offset;mistakeList.fetchData(localLimit,offset,!0)},fetchDataForExercises:function(homeworkId){$http.ajax({url:apiBaseUrl+"homework/mistake/"+homeworkId,headers:{Authorization:"Bearer "+token},success:function(res){var mistake=avalon.vmodels.mistake;mistake.exercises=res,avalon.router.go("app.mistake.wrong",{homeworkId:homeworkId,questionId:1})},error:function(res){avalon.illyError("mistakeTemp ajax error",res)},ajaxFail:function(res){avalon.illyError("mistakeTemp ajax failed",res)}})},goWrong:function(){var homeworkId=arguments[0].getAttribute("data-homeworkid");mistakeList.fetchDataForExercises(homeworkId)}});return mistakeList.lists.$watch("length",function(newLength){mistakeList.btnShowMore=newLength&&localLimit>newLength?!1:!0}),avalon.controller(function($ctrl){$ctrl.$onBeforeUnload=function(){mistakeList.isRecover=!1},$ctrl.$onEnter=function(){mistakeList.isVisited=avalon.vmodels.root.currentIsVisited,mistakeList.fetchData()},$ctrl.$onRendered=function(){},$ctrl.$vmodels=[]})});
//# sourceMappingURL=mistakeList.js.map