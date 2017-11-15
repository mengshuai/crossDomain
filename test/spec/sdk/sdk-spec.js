
define(['views/tests/sdk'], function(sdk){

		describe('register', function(){

	    it('初始化sdk,绑定事件回调等,register', function(){
	    	var result;
	    	sdk.register([{
					listenEvent : 'test_register',
					cb : function(data) {
					}
				}]);
		  	expect(window.iTalentSDK._callbackEventList[0].listenEvent).toEqual("test_register");
		  	expect(window.iTalentSDK._callbackEventList.length>0).toBeTruthy();
			});
		});

		describe('showPopup', function(){
	    it('展示弹窗方法，将参数postMessage', function(){
		  	sdk.showPopup();
		  	setTimeout(function() {
		  		expect(window.iTalentSDK._popIframe.length>1).toBeTruthy();
	  		}, 0);
			});
		});

		describe('hidePopup', function(){
	    it('隐藏弹窗方法，将参数postMessage', function(){
	    	setTimeout(function() {
	    		expect(sdk.hidePopup(true)).toBeTruthy();
	    	}, 0);
			});
		});

		describe('_hidePopup', function(){
	    it('隐藏弹窗的方法，用于判断是否为ie或非ie，hidePopup方法中调用', function(){
	    	setTimeout(function() {
	    			sdk.showPopup();
	    		}, 500);
	    	setTimeout(function() {
			  	expect(sdk._hidePopup({"_isNeedAnimate":true})).toBeTruthy();
	  		}, 1200);
			});
		});


		describe('_hidePopupAnimate', function(){
	    it('隐藏弹窗的动画方法，_hidePopup调用此方法', function(){
		  	setTimeout(function() {
	    			sdk.showPopup();
	    		}, 1700);
	    	setTimeout(function() {
			  	expect(sdk._hidePopupAnimate({"_isNeedAnimate":true})).toBeTruthy();
	  		}, 2400);
			});
		});


	  describe('_addAppNameToEventName', function(){
     it('返回要添加的事件名称', function(){
		  	expect(sdk._addAppNameToEventName("click")).toEqual("click");
		  	expect(sdk._addAppNameToEventName("hover")).toEqual("hover");
		  	expect(sdk._addAppNameToEventName("onkeyup")).toEqual("onkeyup");
		  	expect(sdk._addAppNameToEventName(null)).toBeNull();
			});
		});


		describe('_addEvent', function(){
	    it('添加事件和回调', function(){
	    	var temp = function(){document.body.style.backgroundColor = "#f0f0f0"}
	    	sdk._addEvent("click",temp())
		  	expect(document.body.style.backgroundColor).toBe("rgb(240, 240, 240)");
			});
		});

		describe('_removeEvent', function(){

	    it('移除绑定的事件', function(){
		  	var temp = function(){document.body.style.backgroundColor = "#f1f1f1"}
	    	sdk._removeEvent("click",temp())
		  	expect(document.body.style.backgroundColor).toBe("rgb(241, 241, 241)");

			});
		});


		describe('_addIframeToContailer', function(){
	    it('创建iFrame并添加到Container中', function(){
	    	var data= {
	    		_iTalentType:"showPopup"
					,_isNeedAnimate:true
					,_isNeedSetWidthAndHeight:false
					,height:111
					,publishEvent:undefined
					,url:"http%3A%2F%2Fhttp%3A%2F%2Flocalhost%3A7357%2Fdialog.html%23home%3Fdialog%3D1%26widgetId%3Ddialog1"
					,width:111
	    	}
	    	sdk._addIframeToContailer(data);
		  	expect(window.iTalentSDK._popIframe[0].ifrmEle.width).toEqual("112px");
		  	expect(window.iTalentSDK._popIframe[0].ifrmEle.height).toEqual("112px");

			});
		});

		describe('_checkBrowserVersion', function(){
	    it('检测当前浏览器，如果浏览器为ie且版本小于9则返回true，否则返回false', function(){
		  	expect(sdk._checkBrowserVersion()).toBe(navigator.userAgent.toLowerCase().indexOf("msie") > 0 && parseInt((navigator.userAgent.toLowerCase().match(/msie [\d.]+;/gi) + "").replace(/[^0-9.]/ig, "")) <= parseInt("9.0"));
			});
		});


		describe('_checkNumberIsEven', function(){
	    it('检测数值为奇数还是偶数，偶数返回true，奇数返回false', function(){
		  	expect(sdk._checkNumberIsEven(2)).toBeTruthy();
		  	expect(sdk._checkNumberIsEven(1)).toBeFalsy();
		  	expect(sdk._checkNumberIsEven(3)).toBeFalsy();
			});
		});



		describe('_convertMessageParams', function(){
	    it('根据对象类型进行相应处理，parse/stringify，返回值为对象', function(){
		  	expect(sdk._convertMessageParams({})).toBe("{}");	
		  	expect(sdk._convertMessageParams(undefined)).toBeUndefined();
		  	expect(sdk._convertMessageParams(null)).toBe("null");
		  	expect(sdk._convertMessageParams("test")).toEqual("{}");
		  	expect(sdk._convertMessageParams("{A:1}")).toEqual("{}");
		  	expect(JSON.parse(sdk._convertMessageParams({A:1})).A).toEqual(1);

			});
		});


		describe('_convertMetricToPX', function(){

	    it('处理尺寸大小，如果为奇数则+1，如果为偶数则+2，如果参数为百分比则无效', function(){
	    	expect(sdk._convertMetricToPX("4.9112312%")).toBe("4.9112312%");
		  	expect(sdk._convertMetricToPX("129px")).toBe("130px");
		  	expect(sdk._convertMetricToPX(129)).toBe("130px");
		  	expect(sdk._convertMetricToPX(128)).toBe("130px");
		  	expect(sdk._convertMetricToPX(undefined)).toBeUndefined();
		  	expect(sdk._convertMetricToPX(null)).toBeUndefined();

			});
		});



		describe('_createPopIframe', function(){

	    it('创建iframe实现方法', function(){
	    	// url, width, height, data, _TransferFrameUrl, _childPosition, _isNeedAnimate, _isNeedSetWidthAndHeight, _preload, _hasShowIframe
	    	var iframe  = sdk._createPopIframe("#123",0,0,{},"#123",null,false,false,false,false);
		  	expect(iframe.src.indexOf("#123")>0).toBeTruthy();
			});
		});

		describe('_formatRegister', function(){

	    it('format注册事件', function(){
		  	expect(sdk._formatRegister({listenEvent:"widget1_change"}).listenEvent).toEqual("widget1_change");
		  	expect(sdk._formatRegister({listenEvent:"widget1_change"}).context).toBe(window);
			});
		});



		describe('_hideItalentIframe', function(){

	    it('隐藏一级ifarme方法', function(){
	    	setTimeout(function(){
	    		var iframe = window.iTalentSDK._popIframe[1];
		    	sdk._hideItalentIframe(iframe);
			  	expect(iframe == window.iTalentSDK._popIframe[1]).toBeFalsy();
	    	},4000)
	    	
			});
		});


		describe('_loading', function(){

	    it('创建loading界面', function(){
	    	popContainer = document.createElement('div');
	    	var body = document.getElementsByTagName("body")[0];
	    	body.appendChild(popContainer);
	    	setTimeout(function(){
	    		expect(sdk._loading(popContainer)).toBeTruthy();
	    	},0)
		  	
			});
		});


		describe('_publishITalentSDKCloseIframeEvent', function(){
			
	    it('当关闭iframe时执行的方法，发送postMessage', function(){
	    	sdk._publishITalentSDKCloseIframeEvent();
	    	window.addEventListener("message", function(){
	    		expect(true).toBeTruthy();
	    	}, true);
		  	
			});
		});

		describe('_sendMessage', function(){

	    it('iframe之间相互通信方法,sendMessage方法中调用该方法', function(){
	    	setTimeout(function(){
    			sdk._sendMessage({"_iTalentMessageDirection":"up"});
	    	},0)
    		var iframe = $("#aaa")[0];
	    	iframe.contentWindow.addEventListener("message", function(){
	    		expect(true).toBeTruthy();
	    	}, true);
			});
		});


		describe('_setIframeAminateAttr', function(){

	    it('设置iframe的动画属性', function(){
	    	var iframe = sdk._setIframeAminateAttr(null,$("#aaa")[0],null,null);
	    	$("#aaa")[0].style.display = "none";
		  	expect($("#aaa")[0].style.transform).toEqual("translate(-50%, -50%)");
			});
		});


		describe('_setPopIframePositon', function(){

	    it('设置iframe的位置，IE下采用margin偏移的方式居中，返回iframe节点', function(){
	    	var iframe  = sdk._setPopIframePositon($("#test")[0]);
		  	expect($("#test")[0] == iframe).toBeTruthy();
			});
		});


		describe('_showPopupAnimate', function(){

	    it('非IE下展示二级动画', function(){
	    	window.iTalentSDK._popIframe.unshift({"ifrmEle":$("#test")[0]});
	    	setTimeout(function(){
	    		sdk._showPopupAnimate({});
		  		expect($("#test")[0].style.transform).toEqual("translate(-120px, 14px) scale(0.75)");
	    	},2500)
	    	setTimeout(function(){
	    		$("#__iTalent_pop_up")[0].style.display = "none";
	    	},3000)
			});
		});


		describe('_updateSize', function(){

	    it('更新iframe的宽高', function(){
	    	var data = {
	    		_iTalentType:"updateSize"
					,height:1858
					,iframeId:"a123456789"
					,publishEvent:undefined
					,width:"100%"}
		  	expect(sdk._updateSize(data)).toBeFalsy();
		  	expect($("#a123456789")[0].width).toEqual("100%")
		  	expect($("#a123456789")[0].height).toEqual("1860px")
			});
		});


		describe('bindChangeIframeHeightEvent', function(){
	    it('实现iframe宽高是否自动自适应', function(){
		  	expect(sdk.bindChangeIframeHeightEvent()).toBeFalsy();
			});
		});


		describe('bindHashChangeEvent', function(){

	    it('绑定hash值的Change事件', function(){
		  	expect(sdk.bindHashChangeEvent()).toBeFalsy();
			});
		});


		describe('checkHaveScrollBar', function(){

	    it('检测是否有滚动条', function(){
		  	expect(sdk.checkHaveScrollBar()).toBeUndefined();
			});
		});


		describe('getErrorPageUrl', function(){

	    it('获取错误页面的url，当前该方法返回的均为"" ', function(){
		  	expect(sdk.getErrorPageUrl("404")).toEqual("");
		  	expect(sdk.getErrorPageUrl("500")).toEqual("");
		  	expect(sdk.getErrorPageUrl(undefined)).toEqual("");
		  	expect(sdk.getErrorPageUrl(null)).toEqual("");
		  	expect(sdk.getErrorPageUrl(0)).toEqual("");
		  	expect(sdk.getErrorPageUrl("")).toEqual("");
			});
		});


		describe('getIframeAnimateAttr', function(){

	    it('获取iframe动画参数', function(){

	    	expect(sdk.getIframeAnimateAttr(undefined,undefined)).toEqual("position:fixed;left:50%;transform:translate(-50%, -50%);-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);opacity: 1;overflow:hidden;transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-webkit-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-moz-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-o-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-ms-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);top:-800px;");
	    	expect(sdk.getIframeAnimateAttr(null,0)).toEqual("position:fixed;left:50%;transform:translate(-50%, -50%);-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);opacity: 1;overflow:hidden;transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-webkit-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-moz-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-o-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-ms-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);top:-800px;");
	    	expect(sdk.getIframeAnimateAttr()).toEqual("position:fixed;left:50%;transform:translate(-50%, -50%);-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);opacity: 1;overflow:hidden;transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-webkit-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-moz-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-o-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-ms-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);top:-800px;");
		  	expect(sdk.getIframeAnimateAttr(true,false)).toEqual("position:fixed;transform:scale(0.1);-webkit-transform:scale(0.1);-moz-transform:scale(0.1);-ms-transform:scale(0.1);-o-transform:scale(0.1);overflow:hidden;transform-origin:left top;transition:transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-webkit-transition:transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-moz-transition:transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-o-transition:transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-ms-transition:transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);");
		  	expect(sdk.getIframeAnimateAttr(true,true)).toEqual("position:fixed;transform:scale(0.1);-webkit-transform:scale(0.1);-moz-transform:scale(0.1);-ms-transform:scale(0.1);-o-transform:scale(0.1);overflow:hidden;transform-origin:left top;transition:transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-webkit-transition:transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-moz-transition:transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-o-transition:transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-ms-transition:transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);");
		  	expect(sdk.getIframeAnimateAttr(false,true)).toEqual("position:fixed;left:50%;transform:translate(-50%, -50%);-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);opacity: 1;overflow:hidden;transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-webkit-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-moz-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-o-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-ms-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);top:-800px;");
		  	expect(sdk.getIframeAnimateAttr(false,false)).toEqual("position:fixed;left:50%;transform:translate(-50%, -50%);-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);opacity: 1;overflow:hidden;transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-webkit-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-moz-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-o-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-ms-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);top:-800px;");
			});
		});

		describe('getItalentHostUrl', function(){

	    it('获取当前url', function(){
		  	expect(sdk.getItalentHostUrl("http://localhost:7357/dialog.html#home?dialog=1&widgetId=dialog1")).toEqual("http://localhost:7357/dialog.html#home?dialog=1&widgetId=dialog1");
			});
		});



		describe('getPopUpData', function(){
	    it('获取window.name中的数据', function(){
		  	expect(typeof sdk.getPopUpData()).toBe(typeof {});
			});
		});

	

		describe('hideShadeUp', function(){
	    it('隐藏Iframe', function(){
	    	sdk.hideShadeUp()
	    	setTimeout(function(){
		  		expect($("#__iTalent_pop_up")[0].style.display).toEqual("none");
	    	},0)
			});
		});

		describe('recodeIframeUrl', function(){

	    it('重写iFrameUrl', function(){
	    	sdk.recodeIframeUrl("test",{});
	    	window.top.addEventListener("message", function(data){
	    		expect(true).toBeTruthy();
	    	}, true);

			});
		});

		describe('recycleIframe', function(){

	    it('隐藏Iframe时的方法', function(){
	    	sdk.recycleIframe("test");
    		var iframe = $("#test")[0];
	    	iframe.contentWindow.addEventListener("message", function(){
	    		expect(true).toBeTruthy();
	    	}, true);
			});
		});

		describe('sendMessage', function(){
	    it('iframe通信，该方法中执行了_sendMessage', function(){
		  	setTimeout(function(){
    			sdk.sendMessage({"_iTalentMessageDirection":"up"});
	    	},0)
    		var iframe = $("#a123456789")[0];
	    	iframe.contentWindow.addEventListener("message", function(){
	    		expect(true).toBeTruthy();
	    	}, true);
			});
		});

		

		describe('showShadeUp', function(){
	    it('展示只有阴影的iframe', function(){
	    	var iframe = $("#aaa")[0];
	    	sdk.showShadeUp(false,iframe);
		  	expect().toBeFalsy();
			});
		});

		describe('unregister', function(){
	    it('解绑注册过的监听事件', function(){
		  	expect(sdk.unregister("widget1_change")).toBeUndefined();
		  	expect(sdk.unregister("dialog1_closed")).toBeUndefined();
			});
		});

		describe('updateSize', function(){
	    it('更新iframe的宽高', function(){
	    	setTimeout(function(){
	    		sdk.updateSize("a123456789","400px","400px")
			  	expect($("#a123456789")[0].width).toEqual("100%")
			  	expect($("#a123456789")[0].height).toEqual("1860px")
	    	},500)
			});
		});


})