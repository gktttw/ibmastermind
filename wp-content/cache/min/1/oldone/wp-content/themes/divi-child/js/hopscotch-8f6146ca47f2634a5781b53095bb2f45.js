(function(global,factory){typeof exports==='object'&&typeof module!=='undefined'?module.exports=factory():typeof define==='function'&&define.amd?define(factory):(global.hopscotch=factory())}(this,(function(){'use strict';var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj};var Hopscotch;var HopscotchBubble;var HopscotchCalloutManager;var HopscotchI18N;var customI18N;var customRenderer;var customEscape;var templateToUse='bubble_default';var Sizzle=window.Sizzle||null;var utils;var callbacks;var helpers;var winLoadHandler;var defaultOpts;var winHopscotch;var undefinedStr='undefined';var waitingToStart=!1;var hasJquery=(typeof jQuery==='undefined'?'undefined':_typeof(jQuery))!==undefinedStr;var hasSessionStorage=!1;var isStorageWritable=!1;var validIdRegEx=/^[a-zA-Z]+[a-zA-Z0-9_-]*$/;var rtlMatches={left:'right',right:'left'};try{if(_typeof(window.sessionStorage)!==undefinedStr){hasSessionStorage=!0;sessionStorage.setItem('hopscotch.test.storage','ok');sessionStorage.removeItem('hopscotch.test.storage');isStorageWritable=!0}}catch(err){}
defaultOpts={smoothScroll:!0,scrollDuration:1000,scrollTopMargin:200,showCloseButton:!0,showPrevButton:!1,showNextButton:!0,bubbleWidth:280,bubblePadding:15,arrowWidth:20,skipIfNoElement:!0,isRtl:!1,cookieName:'hopscotch.tour.state'};if(!Array.isArray){Array.isArray=function(obj){return Object.prototype.toString.call(obj)==='[object Array]'}}
winLoadHandler=function winLoadHandler(){if(waitingToStart){winHopscotch.startTour()}};utils={addClass:function addClass(domEl,classToAdd){var domClasses,classToAddArr,setClass,i,len;if(!domEl.className){domEl.className=classToAdd}else{classToAddArr=classToAdd.split(/\s+/);domClasses=' '+domEl.className+' ';for(i=0,len=classToAddArr.length;i<len;++i){if(domClasses.indexOf(' '+classToAddArr[i]+' ')<0){domClasses+=classToAddArr[i]+' '}}
domEl.className=domClasses.replace(/^\s+|\s+$/g,'')}},removeClass:function removeClass(domEl,classToRemove){var domClasses,classToRemoveArr,currClass,i,len;classToRemoveArr=classToRemove.split(/\s+/);domClasses=' '+domEl.className+' ';for(i=0,len=classToRemoveArr.length;i<len;++i){domClasses=domClasses.replace(' '+classToRemoveArr[i]+' ',' ')}
domEl.className=domClasses.replace(/^\s+|\s+$/g,'')},hasClass:function hasClass(domEl,classToCheck){var classes;if(!domEl.className){return!1}
classes=' '+domEl.className+' ';return classes.indexOf(' '+classToCheck+' ')!==-1},getPixelValue:function getPixelValue(val){var valType=typeof val==='undefined'?'undefined':_typeof(val);if(valType==='number'){return val}
if(valType==='string'){return parseInt(val,10)}
return 0},valOrDefault:function valOrDefault(val,valDefault){return(typeof val==='undefined'?'undefined':_typeof(val))!==undefinedStr?val:valDefault},invokeCallbackArrayHelper:function invokeCallbackArrayHelper(arr){var fn;if(Array.isArray(arr)){fn=helpers[arr[0]];if(typeof fn==='function'){return fn.apply(this,arr.slice(1))}}},invokeCallbackArray:function invokeCallbackArray(arr){var i,len;if(Array.isArray(arr)){if(typeof arr[0]==='string'){return utils.invokeCallbackArrayHelper(arr)}else{for(i=0,len=arr.length;i<len;++i){utils.invokeCallback(arr[i])}}}},invokeCallback:function invokeCallback(cb){if(typeof cb==='function'){return cb()}
if(typeof cb==='string'&&helpers[cb]){return helpers[cb]()}else{return utils.invokeCallbackArray(cb)}},invokeEventCallbacks:function invokeEventCallbacks(evtType,stepCb){var cbArr=callbacks[evtType],callback,fn,i,len;if(stepCb){return this.invokeCallback(stepCb)}
for(i=0,len=cbArr.length;i<len;++i){this.invokeCallback(cbArr[i].cb)}},getScrollTop:function getScrollTop(){var scrollTop;if(_typeof(window.pageYOffset)!==undefinedStr){scrollTop=window.pageYOffset}else{scrollTop=document.documentElement.scrollTop}
return scrollTop},getScrollLeft:function getScrollLeft(){var scrollLeft;if(_typeof(window.pageXOffset)!==undefinedStr){scrollLeft=window.pageXOffset}else{scrollLeft=document.documentElement.scrollLeft}
return scrollLeft},getWindowHeight:function getWindowHeight(){return window.innerHeight||document.documentElement.clientHeight},addEvtListener:function addEvtListener(el,evtName,fn){if(el){return el.addEventListener?el.addEventListener(evtName,fn,!1):el.attachEvent('on'+evtName,fn)}},removeEvtListener:function removeEvtListener(el,evtName,fn){if(el){return el.removeEventListener?el.removeEventListener(evtName,fn,!1):el.detachEvent('on'+evtName,fn)}},documentIsReady:function documentIsReady(){return document.readyState==='complete'},evtPreventDefault:function evtPreventDefault(evt){if(evt.preventDefault){evt.preventDefault()}else if(event){event.returnValue=!1}},extend:function extend(obj1,obj2){var prop;for(prop in obj2){if(obj2.hasOwnProperty(prop)){obj1[prop]=obj2[prop]}}},getStepTargetHelper:function getStepTargetHelper(target){var result=document.getElementById(target);if(result){return result}
if(hasJquery){result=jQuery(target);return result.length?result[0]:null}
if(Sizzle){result=new Sizzle(target);return result.length?result[0]:null}
if(document.querySelector){try{return document.querySelector(target)}catch(err){}}
if(/^#[a-zA-Z][\w-_:.]*$/.test(target)){return document.getElementById(target.substring(1))}
return null},getStepTarget:function getStepTarget(step){var queriedTarget;if(!step||!step.target){return null}
if(typeof step.target==='string'){return utils.getStepTargetHelper(step.target)}else if(Array.isArray(step.target)){var i,len;for(i=0,len=step.target.length;i<len;i++){if(typeof step.target[i]==='string'){queriedTarget=utils.getStepTargetHelper(step.target[i]);if(queriedTarget){return queriedTarget}}}
return null}
return step.target},getI18NString:function getI18NString(key){return customI18N[key]||HopscotchI18N[key]},setState:function setState(name,value,days){var expires='',date;if(hasSessionStorage&&isStorageWritable){try{sessionStorage.setItem(name,value)}catch(err){isStorageWritable=!1;this.setState(name,value,days)}}else{if(hasSessionStorage){sessionStorage.removeItem(name)}
if(days){date=new Date();date.setTime(date.getTime()+days*24*60*60*1000);expires='; expires='+date.toGMTString()}
document.cookie=name+'='+value+expires+'; path=/'}},getState:function getState(name){var nameEQ=name+'=',ca=document.cookie.split(';'),i,c,state;if(hasSessionStorage){state=sessionStorage.getItem(name);if(state){return state}}
for(i=0;i<ca.length;i++){c=ca[i];while(c.charAt(0)===' '){c=c.substring(1,c.length)}
if(c.indexOf(nameEQ)===0){state=c.substring(nameEQ.length,c.length);break}}
return state},clearState:function clearState(name){if(hasSessionStorage){sessionStorage.removeItem(name)}else{this.setState(name,'',-1)}},normalizePlacement:function normalizePlacement(step){if(!step.placement&&step.orientation){step.placement=step.orientation}},flipPlacement:function flipPlacement(step){if(step.isRtl&&!step._isFlipped){var props=['orientation','placement'],prop,i;if(step.xOffset){step.xOffset=-1*this.getPixelValue(step.xOffset)}
for(i in props){prop=props[i];if(step.hasOwnProperty(prop)&&rtlMatches.hasOwnProperty(step[prop])){step[prop]=rtlMatches[step[prop]]}}
step._isFlipped=!0}}};utils.addEvtListener(window,'load',winLoadHandler);callbacks={next:[],prev:[],start:[],end:[],show:[],error:[],close:[]};helpers={};HopscotchI18N={stepNums:null,nextBtn:'Next',prevBtn:'Back',doneBtn:'Done',skipBtn:'Skip',closeTooltip:'Close'};customI18N={};HopscotchBubble=function HopscotchBubble(opt){this.init(opt)};HopscotchBubble.prototype={isShowing:!1,currStep:undefined,setPosition:function setPosition(step){var bubbleBoundingHeight,bubbleBoundingWidth,boundingRect,top,left,arrowOffset,verticalLeftPosition,targetEl=utils.getStepTarget(step),el=this.element,arrowEl=this.arrowEl,arrowPos=step.isRtl?'right':'left';utils.flipPlacement(step);utils.normalizePlacement(step);bubbleBoundingWidth=el.offsetWidth;bubbleBoundingHeight=el.offsetHeight;utils.removeClass(el,'fade-in-down fade-in-up fade-in-left fade-in-right');boundingRect=targetEl.getBoundingClientRect();verticalLeftPosition=step.isRtl?boundingRect.right-bubbleBoundingWidth:boundingRect.left;if(step.placement==='top'){top=boundingRect.top-bubbleBoundingHeight-this.opt.arrowWidth;left=verticalLeftPosition}else if(step.placement==='bottom'){top=boundingRect.bottom+this.opt.arrowWidth;left=verticalLeftPosition}else if(step.placement==='left'){top=boundingRect.top;left=boundingRect.left-bubbleBoundingWidth-this.opt.arrowWidth}else if(step.placement==='right'){top=boundingRect.top;left=boundingRect.right+this.opt.arrowWidth}else{throw new Error('Bubble placement failed because step.placement is invalid or undefined!')}
if(step.arrowOffset!=='center'){arrowOffset=utils.getPixelValue(step.arrowOffset)}else{arrowOffset=step.arrowOffset}
if(!arrowOffset){arrowEl.style.top='';arrowEl.style[arrowPos]=''}else if(step.placement==='top'||step.placement==='bottom'){arrowEl.style.top='';if(arrowOffset==='center'){arrowEl.style[arrowPos]=Math.floor(bubbleBoundingWidth/2-arrowEl.offsetWidth/2)+'px'}else{arrowEl.style[arrowPos]=arrowOffset+'px'}}else if(step.placement==='left'||step.placement==='right'){arrowEl.style[arrowPos]='';if(arrowOffset==='center'){arrowEl.style.top=Math.floor(bubbleBoundingHeight/2-arrowEl.offsetHeight/2)+'px'}else{arrowEl.style.top=arrowOffset+'px'}}
if(step.xOffset==='center'){left=boundingRect.left+targetEl.offsetWidth/2-bubbleBoundingWidth/2}else{left+=utils.getPixelValue(step.xOffset)}
if(step.yOffset==='center'){top=boundingRect.top+targetEl.offsetHeight/2-bubbleBoundingHeight/2}else{top+=utils.getPixelValue(step.yOffset)}
if(!step.fixedElement){top+=utils.getScrollTop();left+=utils.getScrollLeft()}
el.style.position=step.fixedElement?'fixed':'absolute';el.style.top=top+'px';el.style.left=left+'px'},render:function render(step,idx,callback){var el=this.element,tourSpecificRenderer,customTourData,unsafe,currTour,totalSteps,totalStepsI18n,nextBtnText,isLast,i,opts;if(step){this.currStep=step}else if(this.currStep){step=this.currStep}
if(this.opt.isTourBubble){currTour=winHopscotch.getCurrTour();if(currTour){customTourData=currTour.customData;tourSpecificRenderer=currTour.customRenderer;step.isRtl=step.hasOwnProperty('isRtl')?step.isRtl:currTour.hasOwnProperty('isRtl')?currTour.isRtl:this.opt.isRtl;unsafe=currTour.unsafe;if(Array.isArray(currTour.steps)){totalSteps=currTour.steps.length;totalStepsI18n=this._getStepI18nNum(this._getStepNum(totalSteps-1));isLast=this._getStepNum(idx)===this._getStepNum(totalSteps-1)}}}else{customTourData=step.customData;tourSpecificRenderer=step.customRenderer;unsafe=step.unsafe;step.isRtl=step.hasOwnProperty('isRtl')?step.isRtl:this.opt.isRtl}
if(isLast){nextBtnText=utils.getI18NString('doneBtn')}else if(step.showSkip){nextBtnText=utils.getI18NString('skipBtn')}else{nextBtnText=utils.getI18NString('nextBtn')}
utils.flipPlacement(step);utils.normalizePlacement(step);this.placement=step.placement;opts={i18n:{prevBtn:utils.getI18NString('prevBtn'),nextBtn:nextBtnText,closeTooltip:utils.getI18NString('closeTooltip'),stepNum:this._getStepI18nNum(this._getStepNum(idx)),numSteps:totalStepsI18n},buttons:{showPrev:utils.valOrDefault(step.showPrevButton,this.opt.showPrevButton)&&this._getStepNum(idx)>0,showNext:utils.valOrDefault(step.showNextButton,this.opt.showNextButton),showCTA:utils.valOrDefault(step.showCTAButton&&step.ctaLabel,!1),ctaLabel:step.ctaLabel,showClose:utils.valOrDefault(this.opt.showCloseButton,!0)},step:{num:idx,isLast:utils.valOrDefault(isLast,!1),title:step.title||'',content:step.content||'',isRtl:step.isRtl,placement:step.placement,padding:utils.valOrDefault(step.padding,this.opt.bubblePadding),width:utils.getPixelValue(step.width)||this.opt.bubbleWidth,customData:step.customData||{}},tour:{isTour:this.opt.isTourBubble,numSteps:totalSteps,unsafe:utils.valOrDefault(unsafe,!1),customData:customTourData||{}}};if(typeof tourSpecificRenderer==='function'){el.innerHTML=tourSpecificRenderer(opts)}else if(typeof tourSpecificRenderer==='string'){if(!winHopscotch.templates||typeof winHopscotch.templates[tourSpecificRenderer]!=='function'){throw new Error('Bubble rendering failed - template "'+tourSpecificRenderer+'" is not a function.')}
el.innerHTML=winHopscotch.templates[tourSpecificRenderer](opts)}else if(customRenderer){el.innerHTML=customRenderer(opts)}else{if(!winHopscotch.templates||typeof winHopscotch.templates[templateToUse]!=='function'){throw new Error('Bubble rendering failed - template "'+templateToUse+'" is not a function.')}
el.innerHTML=winHopscotch.templates[templateToUse](opts)}
var children=el.children;var numChildren=children.length;var node;for(i=0;i<numChildren;i++){node=children[i];if(utils.hasClass(node,'hopscotch-arrow')){this.arrowEl=node}}
el.style.zIndex=typeof step.zindex==='number'?step.zindex:'';this._setArrow(step.placement);this.hide(!1);this.setPosition(step);if(callback){callback(!step.fixedElement)}
return this},_getStepNum:function _getStepNum(idx){var skippedStepsCount=0,stepIdx,skippedSteps=winHopscotch.getSkippedStepsIndexes(),i,len=skippedSteps.length;for(i=0;i<len;i++){stepIdx=skippedSteps[i];if(stepIdx<idx){skippedStepsCount++}}
return idx-skippedStepsCount},_getStepI18nNum:function _getStepI18nNum(idx){var stepNumI18N=utils.getI18NString('stepNums');if(stepNumI18N&&idx<stepNumI18N.length){idx=stepNumI18N[idx]}else{idx=idx+1}
return idx},_setArrow:function _setArrow(placement){utils.removeClass(this.arrowEl,'down up right left');if(placement==='top'){utils.addClass(this.arrowEl,'down')}else if(placement==='bottom'){utils.addClass(this.arrowEl,'up')}else if(placement==='left'){utils.addClass(this.arrowEl,'right')}else if(placement==='right'){utils.addClass(this.arrowEl,'left')}},_getArrowDirection:function _getArrowDirection(){if(this.placement==='top'){return'down'}
if(this.placement==='bottom'){return'up'}
if(this.placement==='left'){return'right'}
if(this.placement==='right'){return'left'}},show:function show(){var self=this,fadeClass='fade-in-'+this._getArrowDirection(),fadeDur=1000;utils.removeClass(this.element,'hide');utils.addClass(this.element,fadeClass);setTimeout(function(){utils.removeClass(self.element,'invisible')},50);setTimeout(function(){utils.removeClass(self.element,fadeClass)},fadeDur);this.isShowing=!0;return this},hide:function hide(remove){var el=this.element;remove=utils.valOrDefault(remove,!0);el.style.top='';el.style.left='';if(remove){utils.addClass(el,'hide');utils.removeClass(el,'invisible')}else{utils.removeClass(el,'hide');utils.addClass(el,'invisible')}
utils.removeClass(el,'animate fade-in-up fade-in-down fade-in-right fade-in-left');this.isShowing=!1;return this},destroy:function destroy(){var el=this.element;if(el){el.parentNode.removeChild(el)}
utils.removeEvtListener(el,'click',this.clickCb)},_handleBubbleClick:function _handleBubbleClick(evt){var action;evt=evt||window.event;var targetElement=evt.target||evt.srcElement;function findMatchRecur(el){if(el===evt.currentTarget){return null}
if(utils.hasClass(el,'hopscotch-cta')){return'cta'}
if(utils.hasClass(el,'hopscotch-next')){return'next'}
if(utils.hasClass(el,'hopscotch-prev')){return'prev'}
if(utils.hasClass(el,'hopscotch-close')){return'close'}
return findMatchRecur(el.parentElement)}
action=findMatchRecur(targetElement);if(action==='cta'){if(!this.opt.isTourBubble){winHopscotch.getCalloutManager().removeCallout(this.currStep.id)}
if(this.currStep.onCTA){utils.invokeCallback(this.currStep.onCTA)}}else if(action==='next'){winHopscotch.nextStep(!0)}else if(action==='prev'){winHopscotch.prevStep(!0)}else if(action==='close'){if(this.opt.isTourBubble){var currStepNum=winHopscotch.getCurrStepNum(),currTour=winHopscotch.getCurrTour(),doEndCallback=currStepNum===currTour.steps.length-1;utils.invokeEventCallbacks('close');winHopscotch.endTour(!0,doEndCallback)}else{if(this.opt.onClose){utils.invokeCallback(this.opt.onClose)}
if(this.opt.id&&!this.opt.isTourBubble){winHopscotch.getCalloutManager().removeCallout(this.opt.id)}else{this.destroy()}}
utils.evtPreventDefault(evt)}},init:function init(initOpt){var el=document.createElement('div'),self=this,resizeCooldown=!1,onWinResize,_appendToBody2,children,numChildren,node,i,currTour,opt;this.element=el;opt={showPrevButton:defaultOpts.showPrevButton,showNextButton:defaultOpts.showNextButton,bubbleWidth:defaultOpts.bubbleWidth,bubblePadding:defaultOpts.bubblePadding,arrowWidth:defaultOpts.arrowWidth,isRtl:defaultOpts.isRtl,showNumber:!0,isTourBubble:!0};initOpt=(typeof initOpt==='undefined'?'undefined':_typeof(initOpt))===undefinedStr?{}:initOpt;utils.extend(opt,initOpt);this.opt=opt;el.className='hopscotch-bubble animated';if(!opt.isTourBubble){utils.addClass(el,'hopscotch-callout no-number')}else{currTour=winHopscotch.getCurrTour();if(currTour){utils.addClass(el,'tour-'+currTour.id)}}
onWinResize=function onWinResize(){if(resizeCooldown||!self.isShowing){return}
resizeCooldown=!0;setTimeout(function(){self.setPosition(self.currStep);resizeCooldown=!1},100)};utils.addEvtListener(window,'resize',onWinResize);this.clickCb=function(evt){self._handleBubbleClick(evt)};utils.addEvtListener(el,'click',this.clickCb);this.hide();if(utils.documentIsReady()){document.body.appendChild(el)}else{if(document.addEventListener){_appendToBody2=function appendToBody(){document.removeEventListener('DOMContentLoaded',_appendToBody2);window.removeEventListener('load',_appendToBody2);document.body.appendChild(el)};document.addEventListener('DOMContentLoaded',_appendToBody2,!1)}else{_appendToBody2=function _appendToBody(){if(document.readyState==='complete'){document.detachEvent('onreadystatechange',_appendToBody2);window.detachEvent('onload',_appendToBody2);document.body.appendChild(el)}};document.attachEvent('onreadystatechange',_appendToBody2)}
utils.addEvtListener(window,'load',_appendToBody2)}}};HopscotchCalloutManager=function HopscotchCalloutManager(){var callouts={},calloutOpts={};this.createCallout=function(opt){var callout;if(opt.id){if(!validIdRegEx.test(opt.id)){throw new Error('Callout ID is using an invalid format. Use alphanumeric, underscores, and/or hyphens only. First character must be a letter.')}
if(callouts[opt.id]){throw new Error('Callout by that id already exists. Please choose a unique id.')}
if(!utils.getStepTarget(opt)){throw new Error('Must specify existing target element via \'target\' option.')}
opt.showNextButton=opt.showPrevButton=!1;opt.isTourBubble=!1;callout=new HopscotchBubble(opt);callouts[opt.id]=callout;calloutOpts[opt.id]=opt;callout.render(opt,null,function(){callout.show();if(opt.onShow){utils.invokeCallback(opt.onShow)}})}else{throw new Error('Must specify a callout id.')}
return callout};this.getCallout=function(id){return callouts[id]};this.removeAllCallouts=function(){var calloutId;for(calloutId in callouts){if(callouts.hasOwnProperty(calloutId)){this.removeCallout(calloutId)}}};this.removeCallout=function(id){var callout=callouts[id];callouts[id]=null;calloutOpts[id]=null;if(!callout){return}
callout.destroy()};this.refreshCalloutPositions=function(){var calloutId,callout,opts;for(calloutId in callouts){if(callouts.hasOwnProperty(calloutId)&&calloutOpts.hasOwnProperty(calloutId)){callout=callouts[calloutId];opts=calloutOpts[calloutId];if(callout&&opts){callout.setPosition(opts)}}}}};Hopscotch=function Hopscotch(initOptions){var self=this,bubble,calloutMgr,opt,currTour,currStepNum,skippedSteps={},cookieTourId,cookieTourStep,cookieSkippedSteps=[],_configure,getBubble=function getBubble(setOptions){if(!bubble||!bubble.element||!bubble.element.parentNode){bubble=new HopscotchBubble(opt)}
if(setOptions){utils.extend(bubble.opt,{bubblePadding:getOption('bubblePadding'),bubbleWidth:getOption('bubbleWidth'),showNextButton:getOption('showNextButton'),showPrevButton:getOption('showPrevButton'),showCloseButton:getOption('showCloseButton'),arrowWidth:getOption('arrowWidth'),isRtl:getOption('isRtl')})}
return bubble},destroyBubble=function destroyBubble(){if(bubble){bubble.destroy();bubble=null}},getOption=function getOption(name){if(typeof opt==='undefined'){return defaultOpts[name]}
return utils.valOrDefault(opt[name],defaultOpts[name])},getCurrStep=function getCurrStep(){var step;if(!currTour||currStepNum<0||currStepNum>=currTour.steps.length){step=null}else{step=currTour.steps[currStepNum]}
return step},targetClickNextFn=function targetClickNextFn(){self.nextStep()},adjustWindowScroll=function adjustWindowScroll(cb){var bubble=getBubble(),bubbleEl=bubble.element,bubbleTop=utils.getPixelValue(bubbleEl.style.top),bubbleBottom=bubbleTop+utils.getPixelValue(bubbleEl.offsetHeight),targetEl=utils.getStepTarget(getCurrStep()),targetBounds=targetEl.getBoundingClientRect(),targetElTop=targetBounds.top+utils.getScrollTop(),targetElBottom=targetBounds.bottom+utils.getScrollTop(),targetTop=bubbleTop<targetElTop?bubbleTop:targetElTop,targetBottom=bubbleBottom>targetElBottom?bubbleBottom:targetElBottom,windowTop=utils.getScrollTop(),windowBottom=windowTop+utils.getWindowHeight(),scrollToVal=targetTop-getOption('scrollTopMargin'),scrollEl,yuiAnim,yuiEase,direction,scrollIncr,scrollTimeout,_scrollTimeoutFn;if(targetTop>=windowTop&&(targetTop<=windowTop+getOption('scrollTopMargin')||targetBottom<=windowBottom)){if(cb){cb()}}else if(!getOption('smoothScroll')){window.scrollTo(0,scrollToVal);if(cb){cb()}}else{if((typeof YAHOO==='undefined'?'undefined':_typeof(YAHOO))!==undefinedStr&&_typeof(YAHOO.env)!==undefinedStr&&_typeof(YAHOO.env.ua)!==undefinedStr&&_typeof(YAHOO.util)!==undefinedStr&&_typeof(YAHOO.util.Scroll)!==undefinedStr){scrollEl=YAHOO.env.ua.webkit?document.body:document.documentElement;yuiEase=YAHOO.util.Easing?YAHOO.util.Easing.easeOut:undefined;yuiAnim=new YAHOO.util.Scroll(scrollEl,{scroll:{to:[0,scrollToVal]}},getOption('scrollDuration')/1000,yuiEase);yuiAnim.onComplete.subscribe(cb);yuiAnim.animate()}else if(hasJquery){jQuery('body, html').animate({scrollTop:scrollToVal},getOption('scrollDuration'),cb)}else{if(scrollToVal<0){scrollToVal=0}
direction=windowTop>targetTop?-1:1;scrollIncr=Math.abs(windowTop-scrollToVal)/(getOption('scrollDuration')/10);_scrollTimeoutFn=function scrollTimeoutFn(){var scrollTop=utils.getScrollTop(),scrollTarget=scrollTop+direction*scrollIncr;if(direction>0&&scrollTarget>=scrollToVal||direction<0&&scrollTarget<=scrollToVal){scrollTarget=scrollToVal;if(cb){cb()}
window.scrollTo(0,scrollTarget);return}
window.scrollTo(0,scrollTarget);if(utils.getScrollTop()===scrollTop){if(cb){cb()}
return}
setTimeout(_scrollTimeoutFn,10)};_scrollTimeoutFn()}}},goToStepWithTarget=function goToStepWithTarget(direction,cb){var target,step,goToStepFn;if(currStepNum+direction>=0&&currStepNum+direction<currTour.steps.length){currStepNum+=direction;step=getCurrStep();goToStepFn=function goToStepFn(){target=utils.getStepTarget(step);if(target){if(skippedSteps[currStepNum]){delete skippedSteps[currStepNum]}
cb(currStepNum)}else{skippedSteps[currStepNum]=!0;utils.invokeEventCallbacks('error');goToStepWithTarget(direction,cb)}};if(step.delay){setTimeout(goToStepFn,step.delay)}else{goToStepFn()}}else{cb(-1)}},changeStep=function changeStep(doCallbacks,direction){var bubble=getBubble(),self=this,step,origStep,wasMultiPage,changeStepCb;bubble.hide();doCallbacks=utils.valOrDefault(doCallbacks,!0);step=getCurrStep();if(step.nextOnTargetClick){utils.removeEvtListener(utils.getStepTarget(step),'click',targetClickNextFn)}
origStep=step;if(direction>0){wasMultiPage=origStep.multipage}else{wasMultiPage=currStepNum>0&&currTour.steps[currStepNum-1].multipage}
changeStepCb=function changeStepCb(stepNum){var doShowFollowingStep;if(stepNum===-1){return this.endTour(!0)}
if(doCallbacks){if(direction>0){doShowFollowingStep=utils.invokeEventCallbacks('next',origStep.onNext)}else{doShowFollowingStep=utils.invokeEventCallbacks('prev',origStep.onPrev)}}
if(stepNum!==currStepNum){return}
if(wasMultiPage){setStateHelper();return}
doShowFollowingStep=utils.valOrDefault(doShowFollowingStep,!0);if(doShowFollowingStep){this.showStep(stepNum)}else{this.endTour(!1)}};if(!wasMultiPage&&getOption('skipIfNoElement')){goToStepWithTarget(direction,function(stepNum){changeStepCb.call(self,stepNum)})}else if(currStepNum+direction>=0&&currStepNum+direction<currTour.steps.length){currStepNum+=direction;step=getCurrStep();if(!utils.getStepTarget(step)&&!wasMultiPage){utils.invokeEventCallbacks('error');return this.endTour(!0,!1)}
changeStepCb.call(this,currStepNum)}else if(currStepNum+direction===currTour.steps.length){return this.endTour()}
return this},loadTour=function loadTour(tour){var tmpOpt={},prop,tourState,tourStateValues;for(prop in tour){if(tour.hasOwnProperty(prop)&&prop!=='id'&&prop!=='steps'){tmpOpt[prop]=tour[prop]}}
_configure.call(this,tmpOpt,!0);tourState=utils.getState(getOption('cookieName'));if(tourState){tourStateValues=tourState.split(':');cookieTourId=tourStateValues[0];cookieTourStep=tourStateValues[1];if(tourStateValues.length>2){cookieSkippedSteps=tourStateValues[2].split(',')}
cookieTourStep=parseInt(cookieTourStep,10)}
return this},findStartingStep=function findStartingStep(startStepNum,savedSkippedSteps,cb){var step,target;currStepNum=startStepNum||0;skippedSteps=savedSkippedSteps||{};step=getCurrStep();target=utils.getStepTarget(step);if(target){cb(currStepNum);return}
if(!target){utils.invokeEventCallbacks('error');skippedSteps[currStepNum]=!0;if(getOption('skipIfNoElement')){goToStepWithTarget(1,cb);return}else{currStepNum=-1;cb(currStepNum)}}},showStepHelper=function showStepHelper(stepNum){var step=currTour.steps[stepNum],bubble=getBubble(),targetEl=utils.getStepTarget(step);function showBubble(){bubble.show();utils.invokeEventCallbacks('show',step.onShow)}
if(currStepNum!==stepNum&&getCurrStep().nextOnTargetClick){utils.removeEvtListener(utils.getStepTarget(getCurrStep()),'click',targetClickNextFn)}
currStepNum=stepNum;bubble.hide(!1);bubble.render(step,stepNum,function(adjustScroll){if(adjustScroll){adjustWindowScroll(showBubble)}else{showBubble()}
if(step.nextOnTargetClick){utils.addEvtListener(targetEl,'click',targetClickNextFn)}});setStateHelper()},setStateHelper=function setStateHelper(){var cookieVal=currTour.id+':'+currStepNum,skipedStepIndexes=winHopscotch.getSkippedStepsIndexes();if(skipedStepIndexes&&skipedStepIndexes.length>0){cookieVal+=':'+skipedStepIndexes.join(',')}
utils.setState(getOption('cookieName'),cookieVal,1)},init=function init(initOptions){if(initOptions){this.configure(initOptions)}};this.getCalloutManager=function(){if((typeof calloutMgr==='undefined'?'undefined':_typeof(calloutMgr))===undefinedStr){calloutMgr=new HopscotchCalloutManager()}
return calloutMgr};this.startTour=function(tour,stepNum){var bubble,currStepNum,skippedSteps={},self=this;if(!currTour){if(!tour){throw new Error('Tour data is required for startTour.')}
if(!tour.id||!validIdRegEx.test(tour.id)){throw new Error('Tour ID is using an invalid format. Use alphanumeric, underscores, and/or hyphens only. First character must be a letter.')}
currTour=tour;loadTour.call(this,tour)}
if((typeof stepNum==='undefined'?'undefined':_typeof(stepNum))!==undefinedStr){if(stepNum>=currTour.steps.length){throw new Error('Specified step number out of bounds.')}
currStepNum=stepNum}
if(!utils.documentIsReady()){waitingToStart=!0;return this}
if(typeof currStepNum==="undefined"&&currTour.id===cookieTourId&&(typeof cookieTourStep==='undefined'?'undefined':_typeof(cookieTourStep))!==undefinedStr){currStepNum=cookieTourStep;if(cookieSkippedSteps.length>0){for(var i=0,len=cookieSkippedSteps.length;i<len;i++){skippedSteps[cookieSkippedSteps[i]]=!0}}}else if(!currStepNum){currStepNum=0}
findStartingStep(currStepNum,skippedSteps,function(stepNum){var target=stepNum!==-1&&utils.getStepTarget(currTour.steps[stepNum]);if(!target){self.endTour(!1,!1);return}
utils.invokeEventCallbacks('start');bubble=getBubble();bubble.hide(!1);self.isActive=!0;if(!utils.getStepTarget(getCurrStep())){utils.invokeEventCallbacks('error');if(getOption('skipIfNoElement')){self.nextStep(!1)}}else{self.showStep(stepNum)}});return this};this.showStep=function(stepNum){var step=currTour.steps[stepNum],prevStepNum=currStepNum;if(!utils.getStepTarget(step)){currStepNum=stepNum;utils.invokeEventCallbacks('error');currStepNum=prevStepNum;return}
if(step.delay){setTimeout(function(){showStepHelper(stepNum)},step.delay)}else{showStepHelper(stepNum)}
return this};this.prevStep=function(doCallbacks){changeStep.call(this,doCallbacks,-1);return this};this.nextStep=function(doCallbacks){changeStep.call(this,doCallbacks,1);return this};this.endTour=function(clearState,doCallbacks){var bubble=getBubble(),currentStep;clearState=utils.valOrDefault(clearState,!0);doCallbacks=utils.valOrDefault(doCallbacks,!0);if(currTour){currentStep=getCurrStep();if(currentStep&&currentStep.nextOnTargetClick){utils.removeEvtListener(utils.getStepTarget(currentStep),'click',targetClickNextFn)}}
currStepNum=0;cookieTourStep=undefined;bubble.hide();if(clearState){utils.clearState(getOption('cookieName'))}
if(this.isActive){this.isActive=!1;if(currTour&&doCallbacks){utils.invokeEventCallbacks('end')}}
this.removeCallbacks(null,!0);this.resetDefaultOptions();destroyBubble();currTour=null;return this};this.getCurrTour=function(){return currTour};this.getCurrTarget=function(){return utils.getStepTarget(getCurrStep())};this.getCurrStepNum=function(){return currStepNum};this.getSkippedStepsIndexes=function(){var skippedStepsIdxArray=[],stepIds;for(stepIds in skippedSteps){skippedStepsIdxArray.push(stepIds)}
return skippedStepsIdxArray};this.refreshBubblePosition=function(){var currStep=getCurrStep();if(currStep){getBubble().setPosition(currStep)}
this.getCalloutManager().refreshCalloutPositions();return this};this.listen=function(evtType,cb,isTourCb){if(evtType){callbacks[evtType].push({cb:cb,fromTour:isTourCb})}
return this};this.unlisten=function(evtType,cb){var evtCallbacks=callbacks[evtType],i,len;for(i=0,len=evtCallbacks.length;i<len;++i){if(evtCallbacks[i].cb===cb){evtCallbacks.splice(i,1)}}
return this};this.removeCallbacks=function(evtName,tourOnly){var cbArr,i,len,evt;for(evt in callbacks){if(!evtName||evtName===evt){if(tourOnly){cbArr=callbacks[evt];for(i=0,len=cbArr.length;i<len;++i){if(cbArr[i].fromTour){cbArr.splice(i--,1);--len}}}else{callbacks[evt]=[]}}}
return this};this.registerHelper=function(id,fn){if(typeof id==='string'&&typeof fn==='function'){helpers[id]=fn}};this.unregisterHelper=function(id){helpers[id]=null};this.invokeHelper=function(id){var args=[],i,len;for(i=1,len=arguments.length;i<len;++i){args.push(arguments[i])}
if(helpers[id]){helpers[id].call(null,args)}};this.setCookieName=function(name){opt.cookieName=name;return this};this.resetDefaultOptions=function(){opt={};return this};this.resetDefaultI18N=function(){customI18N={};return this};this.getState=function(){return utils.getState(getOption('cookieName'))};_configure=function _configure(options,isTourOptions){var bubble,events=['next','prev','start','end','show','error','close'],eventPropName,callbackProp,i,len;if(!opt){this.resetDefaultOptions()}
utils.extend(opt,options);if(options){utils.extend(customI18N,options.i18n)}
for(i=0,len=events.length;i<len;++i){eventPropName='on'+events[i].charAt(0).toUpperCase()+events[i].substring(1);if(options[eventPropName]){this.listen(events[i],options[eventPropName],isTourOptions)}}
bubble=getBubble(!0);return this};this.configure=function(options){return _configure.call(this,options,!1)};this.setRenderer=function(render){var typeOfRender=typeof render==='undefined'?'undefined':_typeof(render);if(typeOfRender==='string'){templateToUse=render;customRenderer=undefined}else if(typeOfRender==='function'){customRenderer=render}
return this};this.setEscaper=function(esc){if(typeof esc==='function'){customEscape=esc}
return this};init.call(this,initOptions)};winHopscotch=new Hopscotch();(function(){var _={};_.escape=function(str){if(customEscape){return customEscape(str)}
if(str==null)return'';return(''+str).replace(new RegExp('[&<>"\']','g'),function(match){if(match=='&'){return'&amp;'}
if(match=='<'){return'&lt;'}
if(match=='>'){return'&gt;'}
if(match=='"'){return'&quot;'}
if(match=="'"){return'&#x27;'}})}
this["templates"]=this["templates"]||{};this["templates"].bubble_default=function(data){var __t,__p='',__e=_.escape,__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}
function optEscape(str,unsafe){if(unsafe){return _.escape(str)}
return str};__p+='\n';var i18n=data.i18n;var buttons=data.buttons;var step=data.step;var tour=data.tour;__p+='\n<div class="hopscotch-bubble-container" style="width: '+((__t=(step.width))==null?'':__t)+'px; padding: '+((__t=(step.padding))==null?'':__t)+'px;">\n  ';if(tour.isTour){;__p+='<span class="hopscotch-bubble-number">'+((__t=(i18n.stepNum))==null?'':__t)+'</span>'};__p+='\n  <div class="hopscotch-bubble-content">\n    ';if(step.title!==''){;__p+='<h3 class="hopscotch-title">'+((__t=(optEscape(step.title,tour.unsafe)))==null?'':__t)+'</h3>'};__p+='\n    ';if(step.content!==''){;__p+='<div class="hopscotch-content">'+((__t=(optEscape(step.content,tour.unsafe)))==null?'':__t)+'</div>'};__p+='\n  </div>\n  <div class="hopscotch-actions">\n    ';if(buttons.showPrev){;__p+='<button class="hopscotch-nav-button prev hopscotch-prev">'+((__t=(i18n.prevBtn))==null?'':__t)+'</button>'};__p+='\n    ';if(buttons.showCTA){;__p+='<button class="hopscotch-nav-button next hopscotch-cta">'+((__t=(buttons.ctaLabel))==null?'':__t)+'</button>'};__p+='\n    ';if(buttons.showNext){;__p+='<button class="hopscotch-nav-button next hopscotch-next">'+((__t=(i18n.nextBtn))==null?'':__t)+'</button>'};__p+='\n  </div>\n  ';if(buttons.showClose){;__p+='<button class="hopscotch-bubble-close hopscotch-close">'+((__t=(i18n.closeTooltip))==null?'':__t)+'</button>'};__p+='\n</div>\n<div class="hopscotch-bubble-arrow-container hopscotch-arrow">\n  <div class="hopscotch-bubble-arrow-border"></div>\n  <div class="hopscotch-bubble-arrow"></div>\n</div>\n';return __p}}).call(winHopscotch);var winHopscotch$1=winHopscotch;return winHopscotch$1})))