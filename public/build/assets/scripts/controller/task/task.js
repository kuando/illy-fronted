define([],function(){var apiBaseUrl=avalon.illyGlobal.apiBaseUrl,token=avalon.illyGlobal.token,resourcePrefix="http://resource.hizuoye.com/",defaultAvatarUrl="http://resource.hizuoye.com/images/avatar/children/default1.png?imageView2/1/w/200/h/200",task=avalon.define({$id:"task",illy_images_base:avalon.illyGlobal.imagesBaseSrc,appMessage:"I am message from app ctrl",gMaskShow:!1,gAlertShow:!1,showAlert:function(message,hideDelay){task.appMessage=message,task.gMaskShow=!0,task.gAlertShow=!0,void 0!==hideDelay&&setTimeout(function(){task.hideAlert()},1e3*hideDelay)},hideAlert:function(){task.gMaskShow=!1,task.gAlertShow=!1},iKnowClick:function(){task.hideAlert()},score:88,schoolName:"",studentCount:100,displayName:"",avatar:defaultAvatarUrl,getUserInfo:function(){$http.ajax({url:apiBaseUrl+"profile",headers:{Authorization:"Bearer "+token},dataType:"json",success:function(json){task.avatar=void 0!==json.avatar?resourcePrefix+json.avatar+"?imageView2/2/w/200/h/200":defaultAvatarUrl,task.displayName=json.displayName,task.score=json.score}})},getSchoolInfo:function(){$http.ajax({url:apiBaseUrl+"school",headers:{Authorization:"Bearer "+token},dataType:"json",success:function(json){task.schoolName=json.school,avalon.vmodels.root.footerInfo=json.school+" © "+(new Date).getFullYear(),task.studentCount=json.studentCount||100}})}});return avalon.controller(function($ctrl){$ctrl.$onRendered=function(){},$ctrl.$onEnter=function(){avalon.clearLocalCache("illy-task"),task.getUserInfo(),task.getSchoolInfo()},$ctrl.$onBeforeUnload=function(){},$ctrl.$vmodels=[]})});
//# sourceMappingURL=task.js.map