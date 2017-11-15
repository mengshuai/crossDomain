define(['talent','iTalentSDKServer'], function(Talent){

	var sdk = {

		register: function(value){
			window.iTalentSDK.register(value, "iframe")
		}

		,showPopup: function(value){
			window.iTalentSDK.showPopup("http://"+ "http://localhost:7357" +"/dialog.html#home?dialog=1&widgetId=dialog1",400,200);
		}

		,_addAppNameToEventName: function(value){
			var result = window.iTalentSDK._addAppNameToEventName(value);
      return result;
		}

		,_addEvent: function(value){
			var result = window.iTalentSDK._addEvent(value);
      return result;
		}

		,_addIframeToContailer: function(value){
			window.iTalentSDK._addIframeToContailer(value);
		}

		,_checkBrowserVersion: function(value){
			var result = window.iTalentSDK._checkBrowserVersion();
      return result;
		}

		,_checkNumberIsEven: function(value){
			var result = window.iTalentSDK._checkNumberIsEven(value);
      return result;
		}


		,_convertMessageParams: function(value){
			var result = window.iTalentSDK._convertMessageParams(value);
      return result;
		}

		,_convertMetricToPX: function(value){
			var result = window.iTalentSDK._convertMetricToPX(value);
      return result;
		}


		,_createPopIframe: function(url, width, height, data, _TransferFrameUrl, _childPosition, _isNeedAnimate, _isNeedSetWidthAndHeight, _preload, _hasShowIframe){
			var result = window.iTalentSDK._createPopIframe(url, width, height, data, _TransferFrameUrl, _childPosition, _isNeedAnimate, _isNeedSetWidthAndHeight, _preload, _hasShowIframe)
      return result;
		}

		,_formatRegister: function(value){
      return window.iTalentSDK._formatRegister(value);
		}


		,_hideItalentIframe: function(value){
			window.iTalentSDK._hideItalentIframe()
		}

		,_hidePopup: function(value){
			window.iTalentSDK._hidePopup(value);
      return window.iTalentSDK._popIframe.length;
		}


		,_hidePopupAnimate: function(value){
			window.iTalentSDK._hidePopupAnimate(value);
			return window.iTalentSDK._popIframe.length;
		}
		,_loading: function(value){
			window.iTalentSDK._loading(value);
      return $("#__iTalent_pop_loading").length>1;
		}

		,_onloadPopUpAnimate: function(e, _childPosition, iframeData, url, _isNeedAnimate){
			window.iTalentSDK._onloadPopUpAnimate(e, _childPosition, iframeData, url, _isNeedAnimate);
		}

		,_publishITalentSDKCloseIframeEvent: function(value){
			var result = window.iTalentSDK._publishITalentSDKCloseIframeEvent();
      return result;
		}

		,_removeEvent: function(value){
			var result = window.iTalentSDK._removeEvent(value);
      return result;
		}

		,_sendMessage: function(value){
			window.iTalentSDK._sendMessage(value);
		}

		,_setIframeAminateAttr: function(_childPosition, ifrmEle, _isNeedAnimate, _preload){
			var result =  window.iTalentSDK._setIframeAminateAttr(_childPosition, ifrmEle, _isNeedAnimate, _preload);
      return result;
		}

		,_setPopIframePositon: function(value){
			var result = window.iTalentSDK._setPopIframePositon(value);
      return result;
		}

		,_showPopupAnimate: function(value){
			window.iTalentSDK._showPopupAnimate(value);
		}

		,_updateSize: function(value){
			window.iTalentSDK._updateSize(value)
		}

		,bindChangeIframeHeightEvent: function(value){
			var result =  window.iTalentSDK.bindChangeIframeHeightEvent();
      return result;
		}

		,bindHashChangeEvent: function(value){
			window.iTalentSDK.bindHashChangeEvent();
		}

		,checkHaveScrollBar: function(value){
			var result =  window.iTalentSDK.checkHaveScrollBar();
      return result;
		}

		,getErrorPageUrl: function(value){
			var result =  window.iTalentSDK.getErrorPageUrl(value);
      return result;
		}

		,getIframeAnimateAttr: function(value){
			var result =  window.iTalentSDK.getIframeAnimateAttr(value);
      return result;
		}

		,getItalentHostUrl: function(value){
      return window.iTalentSDK.getItalentHostUrl(value);
		}


		,getPopUpData: function(){
			var result = window.iTalentSDK.getPopUpData();
      return result;
		}
		,hidePopup: function(value){
			window.iTalentSDK.hidePopup();
		}
		,hideShadeUp: function(value){
			window.iTalentSDK.hideShadeUp();
		}
		,recodeIframeUrl: function(iframeId, data){
			window.iTalentSDK.recodeIframeUrl(iframeId, data);
		}
		,recycleIframe: function(value){
			window.iTalentSDK.recycleIframe(value);
		}
		

		,sendMessage: function(value){
			window.iTalentSDK.sendMessage(value);
		}
		
		,showShadeUp: function(value){
			window.iTalentSDK.showShadeUp();
		}
		,unregister: function(value){
			return window.iTalentSDK.unregister();
		}
		,updateSize: function(value){
			window.iTalentSDK.updateSize(value)
		}


	}
	return sdk;
})