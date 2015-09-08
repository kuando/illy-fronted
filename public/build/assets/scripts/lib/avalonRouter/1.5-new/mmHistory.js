define(["avalon"],function(avalon){function targetIsThisWindow(targetWindow){return!targetWindow||targetWindow===window.name||"_self"===targetWindow||"top"===targetWindow&&window==window.top?!0:!1}function getFirstAnchor(list){for(var el,i=0;el=list[i++];)if("A"===el.nodeName)return el}function scrollToAnchorId(hash,el){(el=document.getElementById(hash))?el.scrollIntoView():(el=getFirstAnchor(document.getElementsByName(hash)))?el.scrollIntoView():window.scrollTo(0,0)}var anchorElement=document.createElement("a"),History=avalon.History=function(){this.location=location};History.started=!1,History.IEVersion=function(){var mode=document.documentMode;return mode?mode:window.XMLHttpRequest?7:6}(),History.defaults={basepath:"/",html5Mode:!1,hashPrefix:"!",iframeID:null,interval:50,fireAnchor:!0,routeElementJudger:avalon.noop};var oldIE=window.VBArray&&History.IEVersion<=7,supportPushState=!!window.history.pushState,supportHashChange=!(!("onhashchange"in window)||window.VBArray&&oldIE);return History.prototype={constructor:History,getFragment:function(fragment){return null==fragment&&(fragment="popstate"===this.monitorMode?this.getPath():this.getHash()),fragment.replace(/^[#\/]|\s+$/g,"")},getHash:function(window){var path=(window||this).location.href;return this._getHash(path.slice(path.indexOf("#")))},_getHash:function(path){return 0===path.indexOf("#/")?decodeURIComponent(path.slice(2)):0===path.indexOf("#!/")?decodeURIComponent(path.slice(3)):""},getPath:function(){var path=decodeURIComponent(this.location.pathname+this.location.search),root=this.basepath.slice(0,-1);return path.indexOf(root)||(path=path.slice(root.length)),path.slice(1)},_getAbsolutePath:function(a){return a.hasAttribute?a.href:a.getAttribute("href",4)},start:function(options){function checkUrl(){var iframe=that.iframe;if("iframepoll"===that.monitorMode&&!iframe)return!1;var hash,pageHash=that.getFragment(),lastHash=avalon.router.getLastPath();if(iframe){var iframeHash=that.getHash(iframe);pageHash!==lastHash?(that._setIframeHistory(that.prefix+pageHash),hash=pageHash):iframeHash!==lastHash&&(that.location.hash=that.prefix+iframeHash,hash=iframeHash)}else pageHash!==lastHash&&(hash=pageHash);void 0!==hash&&(that.fragment=hash,that.fireRouteChange(hash,{fromHistory:!0}))}if(History.started)throw new Error("avalon.history has already been started");History.started=!0,this.options=avalon.mix({},History.defaults,options),this.html5Mode=!!this.options.html5Mode,this.monitorMode=this.html5Mode?"popstate":"hashchange",supportPushState||(this.html5Mode&&(avalon.log("如果浏览器不支持HTML5 pushState，强制使用hash hack!"),this.html5Mode=!1),this.monitorMode="hashchange"),supportHashChange||(this.monitorMode="iframepoll"),this.prefix="#"+this.options.hashPrefix+"/",this.basepath=("/"+this.options.basepath+"/").replace(/^\/+|\/+$/g,"/"),this.fragment=this.getFragment(),anchorElement.href=this.basepath,this.rootpath=this._getAbsolutePath(anchorElement);var that=this,html="<!doctype html><html><body>@</body></html>";switch(this.options.domain&&(html=html.replace("<body>","<script>document.domain ="+this.options.domain+"</script><body>")),this.iframeHTML=html,"iframepoll"===this.monitorMode&&avalon.ready(function(){if(!that.iframe){var iframe=that.iframe||document.getElementById(that.iframeID)||document.createElement("iframe");iframe.src="javascript:0",iframe.style.display="none",iframe.tabIndex=-1,document.body.appendChild(iframe),that.iframe=iframe.contentWindow,that._setIframeHistory(that.prefix+that.fragment)}}),this.monitorMode){case"popstate":this.checkUrl=avalon.bind(window,"popstate",checkUrl),this._fireLocationChange=checkUrl;break;case"hashchange":this.checkUrl=avalon.bind(window,"hashchange",checkUrl);break;case"iframepoll":this.checkUrl=setInterval(checkUrl,this.options.interval)}avalon.ready(function(){that.fireRouteChange(that.fragment||"/",{replace:!0})})},fireRouteChange:function(hash,options){var router=avalon.router;router&&router.navigate&&(router.setLastPath(hash),router.navigate("/"===hash?hash:"/"+hash,options)),this.options.fireAnchor&&scrollToAnchorId(hash.replace(/\?.*/g,""))},stop:function(){avalon.unbind(window,"popstate",this.checkUrl),avalon.unbind(window,"hashchange",this.checkUrl),clearInterval(this.checkUrl),History.started=!1},updateLocation:function(hash,options,urlHash){var options=options||{},rp=options.replace,st=options.silent;if("popstate"===this.monitorMode){var path=this.rootpath+hash+(urlHash||"");path!=this.location.href.split("#")[0]&&history[rp?"replaceState":"pushState"]({path:path},document.title,path),st||this._fireLocationChange()}else{var newHash=this.prefix+hash;st&&hash!=this.getHash()&&(this._setIframeHistory(newHash,rp),this.fragment&&avalon.router.setLastPath(this.fragment),this.fragment=this._getHash(newHash)),this._setHash(this.location,newHash,rp)}},_setHash:function(location,hash,replace){var href=location.href.replace(/(javascript:|#).*$/,"");replace?location.replace(href+hash):location.hash=hash},_setIframeHistory:function(hash,replace){if(this.iframe){var idoc=this.iframe.document;idoc.open(),idoc.write(this.iframeHTML),idoc.close(),this._setHash(idoc.location,hash,replace)}}},avalon.history=new History,avalon.bind(document,"click",function(event){var defaultPrevented="defaultPrevented"in event?event.defaultPrevented:event.returnValue===!1,routeElementJudger=avalon.history.options.routeElementJudger;if(!(defaultPrevented||event.ctrlKey||event.metaKey||2===event.which)){for(var target=event.target;"A"!==target.nodeName;)if(target=target.parentNode,!target||"BODY"===target.tagName)return;if(targetIsThisWindow(target.target)){var href=oldIE?target.getAttribute("href",2):target.getAttribute("href")||target.getAttribute("xlink:href"),prefix=avalon.history.prefix;if(null===href)return;var hash=href.replace(prefix,"").trim();(0!==href.indexOf(prefix)||""===hash)&&(hash=routeElementJudger(target,href),hash===!0&&(hash=href)),hash&&(event.preventDefault(),avalon.router&&avalon.router.navigate(hash))}}}),avalon});
//# sourceMappingURL=mmHistory.js.map