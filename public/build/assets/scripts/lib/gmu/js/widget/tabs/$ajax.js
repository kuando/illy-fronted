!function($){var idRE=/^#.+$/,loaded={},tpl={loading:'<div class="ui-loading">Loading</div>',error:'<p class="ui-load-error">内容加载失败!</p>'};gmu.Tabs.register("ajax",{_init:function(){var items,i,length,_opts=this._options;this.on("ready",function(){for(items=_opts.items,i=0,length=items.length;length>i;i++)items[i].href&&!idRE.test(items[i].href)&&(items[i].isAjax=!0);this.on("activate",this._onActivate),items[_opts.active].isAjax&&this.load(_opts.active)})},destroy:function(){return this.off("activate",this._onActivate),this.xhr&&this.xhr.abort(),this.origin()},_fitToContent:function(div){var _opts=this._options;return _opts._fitLock?void 0:this.origin(div)},_onActivate:function(e,to){to.isAjax&&this.load(to.index)},load:function(index,force){var item,$panel,prevXHR,me=this,_opts=me._options,items=_opts.items;return 0>index||index>items.length-1||!(item=items[index])||!item.isAjax||($panel=me._getPanel(index)).text()&&!force&&loaded[index]?this:((prevXHR=me.xhr)&&setTimeout(function(){prevXHR.abort()},400),_opts._loadingTimer=setTimeout(function(){$panel.html(tpl.loading)},50),_opts._fitLock=!0,void(me.xhr=$.ajax($.extend(_opts.ajax||{},{url:item.href,context:me.$el.get(0),beforeSend:function(xhr,settings){var eventData=gmu.Event("beforeLoad");return me.trigger(eventData,xhr,settings),eventData.isDefaultPrevented()?!1:void 0},success:function(response,xhr){var eventData=gmu.Event("beforeRender");clearTimeout(_opts._loadingTimer),me.trigger(eventData,response,$panel,index,xhr),eventData.isDefaultPrevented()||$panel.html(response),_opts._fitLock=!1,loaded[index]=!0,me.trigger("load",$panel),delete me.xhr,me._fitToContent($panel)},error:function(){var eventData=gmu.Event("loadError");clearTimeout(_opts._loadingTimer),loaded[index]=!1,me.trigger(eventData,$panel),eventData.isDefaultPrevented()||$panel.html(tpl.error),delete me.xhr}}))))}})}(Zepto);
//# sourceMappingURL=%24ajax.js.map