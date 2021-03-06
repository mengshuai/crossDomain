(function() {
    /*
        version : 0.1.9-28,
        owner : beisen-ux
        author : beisen-ux
    */
    var root = this;
    if (window.__isLoadServer) {
        throw new Error("only one instance of iTalentSDKServer is allowed!")
    }
    
    window.__isLoadServer = true;
    window.clickFlag = true;
    window.BSGlobal['__dialogPreLoad'] = true;
    var iTalentSDK = {
        register: function(registers) {
            var self = this;
            if (!this._registed) {
                this._addEvent("message", onMessage);
                this._registed = true;
                this.bindHashChangeEvent();
                this.bindChangeIframeHeightEvent();
                this._preloadData = {};
                this._addEvent("keydown", onKeyDown);
                setTimeout(function() {
                    self.checkHaveScrollBar()
                }, 1000);
                this._addEvent("click", onClose);
            }
            if (registers && registers instanceof Array) {
                for (var i = 0; i < registers.length; i++) {
                    registers[i] = this._formatRegister(registers[i])
                }
                this._callbackEventList = this._callbackEventList.concat(registers)
            } else {
                if (registers && registers instanceof Object) {
                    registers = this._formatRegister(registers);
                    this._callbackEventList.push(registers)
                }
            }

            function onClose(e) {
                var message = {};
                message._titaPopClose = true;
                var data = self._convertMessageParams(message);
                if (window.top != window) {
                    window.top.postMessage(data, "*")
                }
            }

            function onMessage(e) {
                var data = e.data;
                data = self._convertMessageParams(data);

                var message = data["data"] || {};
                var endMessage = false;
                for (var i = 0; i < self._callbackEventList.length; i++) {
                    data.publishEvent = self._addAppNameToEventName(data.publishEvent);
                    if (self._callbackEventList[i] && self._callbackEventList[i].listenEvent == data.publishEvent) {
                        self._callbackEventList[i].cb && self._callbackEventList[i].cb.apply(self._callbackEventList[i].context, [message]);
                        endMessage = true
                    }
                }
                if (data && data._iTalentType && endMessage == false) {
                    var type = data._iTalentType.indexOf("_") != 0 ? "_" + data._iTalentType : data._iTalentType;
                    self[type] && self[type](data)
                }
                if (data._titaPopClose) {
                    if (document.createEvent) {
                        var event = document.createEvent("HTMLEvents");
                        event.initEvent("mouseup", true, false);
                        document.dispatchEvent(event);
                        var event = document.createEvent("HTMLEvents");
                        event.initEvent("mousedown", true, false);
                        document.dispatchEvent(event);
                        var event = document.createEvent("HTMLEvents");
                        event.initEvent("click", true, false);
                        var tempDiv = document.createElement("div");
                        //由于vds.js报错，vds中获取的t对象为document，无法获取attribute，顾创建div,ie8、火狐、chrome下点击cloud收起tita弹层无报错
                        // document.dispatchEvent(event);
                        tempDiv.dispatchEvent(event);
                    } else {
                        if (document.createEventObject) {
                            var event = document.createEventObject();
                            event.eventType = "message";
                            document.fireEvent("onmouseup", event);
                            var event = document.createEventObject();
                            event.eventType = "message";
                            document.fireEvent("onmousedown", event);
                            var event = document.createEventObject();
                            event.eventType = "message";
                            document.fireEvent("onclick", event)
                        }
                    }
                }
            }

            function onKeyDown(e) {
                var e = e ? e : window.event;
                var kc = e.keyCode ? e.keyCode : e.which;
                if (kc == 27) {
                    var message = {};
                    message._iTalentMessageDirection = "down";
                    message._iTalentType = "sendMessage";
                    message._iTalentKeyCode = 27;
                    var iframeList = document.getElementsByTagName("iframe");
                    for (var i = 0; i < iframeList.length; i++) {
                        iframeList[i].contentWindow.postMessage(message, "*")
                    }
                }
            }
        },
        _throttle: function(fn, delay, immediate, debounce) {
            var curr = +new Date(),//当前事件
               last_call = 0,
               last_exec = 0,
               timer = null,
               diff, //时间差
               context,//上下文
               args,
               exec = function () {
                   last_exec = curr;
                   fn.apply(context, args);
               };
           return function () {
               curr= +new Date();
               context = this,
               args = arguments,
               diff = curr - (debounce ? last_call : last_exec) - delay;
               clearTimeout(timer);
               if (debounce) {
                   if (immediate) {
                       timer = setTimeout(exec, delay);
                   } else if (diff >= 0) {
                       exec();
                   }
               } else {
                   if (diff >= 0) {
                       exec();
                   } else if (immediate) {
                       timer = setTimeout(exec, -diff);
                   }
               }
               last_call = curr;
           }
        },
        _debounce: function (fn, delay, immediate) {
           return this._throttle(fn, delay, immediate, true);
        },
        checkHaveScrollBar: function() {
            var data = this.getPopUpData();
            if (data && data.__iTalentFrameType == "pop") {
                var sl = document.body.scrollLeft;
                var st = document.body.scrollTop;
                document.body.scrollLeft += (sl > 0) ? -1 : 1;
                document.body.scrollTop += (st > 0) ? -1 : 1;
                var scrollX = document.body.scrollLeft != sl ? true : false;
                var scrollY = document.body.scrollTop != st ? true : false;
                if (scrollY || scrollX) {
                    if (window.ET && BSGlobal.env == "Production") {
                        window.ET.getExtendEtParams = function() {
                            return {
                                "userId": BSGlobal.loginUserInfo.Id,
                                "tenantId": BSGlobal.tenantInfo.Id,
                                "applicationName": BSGlobal.appName || "sdk",
                            }
                        };
                        window.ET.record(function(a, b) {
                            b["exceptionType"] = "sdk pop up has scroll";
                            return b
                        })
                    }
                }
            }
        },
        recycleIframe: function(iframeId) {
            var ifOldIE = this._checkBrowserVersion();
            if (!ifOldIE) {
                this._publishITalentSDKCloseIframeEvent();
                return
            }
            var iframeId = iframeId || this._convertMessageParams(window.name || "{}")["__iTalentFrameId"];
            var message = this._convertMessageParams({
                "_iTalentType": "recycleIframe",
                iframeId: iframeId
            });
            if (!iframeId) {
                return
            }
            var iframe = document.getElementById(iframeId);
            if (iframe) {
                iframe.contentWindow.postMessage(message, "*")
            } else {
                this._publishITalentSDKCloseIframeEvent()
            }
        },
        _publishITalentSDKCloseIframeEvent: function(data) {
            var message = this._convertMessageParams({
                "publishEvent": "__iTalentSDK_Close_Iframe",
                "data": {
                    "iframeId": data && data.iframeId || ""
                }
            });
            window.top.postMessage(message, "*")
        },
        _recycleIframe: function(data) {
            this._publishITalentSDKCloseIframeEvent(data);
            setTimeout(function() {
                window.document.write("");
                window.document.close()
            }, 0)
        },
        getErrorPageUrl: function(code) {
            code ? code : code = "404";
            return this._errorList[code] ? this._errorList[code] : ""
        },
        _errorList: {
            "404": "",
            "500": ""
        },
        bindChangeIframeHeightEvent: function() {
            var self = this;
            var data = this.getPopUpData();
            if (data.__iTalentWidgetUpdateSize == "true") {
                data.__iTalentWidgetUpdateSize = true
            }
            if (data && data.__iTalentWidgetUpdateSize == true && data.__iTalentFrameId) {
                this.updateSize();
                setInterval(function() {
                    self.updateSize()
                }, 2000)
            }
        },
        getItalentHostUrl: function(url) {
            var data = this.getPopUpData();
            if (!data || !data.__iTalentLocationHref || !data.__iTalentFrameType) {
                return url
            }
            if (location.href.indexOf("?") > -1) {
                var domain = location.href.slice(0, location.href.indexOf("?"))
            } else {
                var domain = location.href.slice(0, location.href.indexOf("#"))
            }
            var iTalentData = data.__iTalentLocationHref.split("#");
            if (iTalentData.length != 2) {
                return url
            }
            data.__iTalentNavCode ? data.__iTalentNavCode : data.__iTalentNavCode = "";
            data.__iTalentNavId ? data.__iTalentNavId : data.__iTalentNavId = "";
            var newUrl = iTalentData[0] + "#" + encodeURIComponent(iTalentData[1] + "?iTalentFrameType=" + data.__iTalentFrameType + "&iTalentNavCode=" + data.__iTalentNavCode + "&iTalentNavId=" + data.__iTalentNavId + "&iTalentFrame=" + encodeURIComponent(domain + url));
            return newUrl
        },
        _formatRegister: function(register) {
            register["listenEvent"] = this._addAppNameToEventName(register["listenEvent"]);
            this.unregister(register.listenEvent);
            register["context"] = register["context"] ? register["context"] : window;
            return register
        },
        _addAppNameToEventName: function(event_name) {
            return event_name
        },
        _preloadEventLoaded: function(data) {
            //修改状态
            var self = this;
            this._preloadDilog = true;
            var _applicationName = data.applicationName || '';
            var _popArr;
            if (_applicationName) {
                _popArr = this._preloadIframe[_applicationName];
            } else {
                _popArr = this._popIframe;
            }
            
            var _popId = _popArr[_popArr.length - 1]['ifrmEle']['id'];
            this.sendMessage({
                popId: _popId,
                applicationName: _applicationName
            });
            //如果有数据，发过去
            if(this._preloadData[_applicationName]) {
                //  //让它显示iframe 
                this.sendMessage(this._preloadData[_applicationName]);
                this._preloadData[_applicationName] = null;
            }
        },
        removeItalnetPopEle: function(data) {
            if (window.top != window) {
                window.top.postMessage(this._convertMessageParams({
                    _iTalentType: "removeItalnetPopEle"
                }), "*")
            } else {
                this._removeItalnetPopEle();
            }
        },
        _removeItalnetPopEle: function(data) {
            if (data && !this._isEmptyObject(this._preloadIframe)) {
                return false;
            }
            var _containEle = document.getElementById('__iTalent_pop_up');
            if (_containEle) {
                // _containEle.style.display = 'none';
                var _par = _containEle.parentNode;
                _par.removeChild(_containEle);
                this._popIframe = [];
                this._preloadIframe = {};
                this._preloadDilog = false;
                return true;
            }
        },
        _isEmptyObject: function(obj) {
            var params;  
            for (params in obj) { 
                return !1;
            }  
            return !0  
        },
        unregister: function(listenEventName) {
            var callbackEventList = this._callbackEventList;
            for (var i = 0; i < callbackEventList.length; i++) {
                if (callbackEventList[i].listenEvent == listenEventName) {
                    callbackEventList = callbackEventList.slice(0, i).concat(callbackEventList.slice(i + 1))
                }
            }
            this._callbackEventList = callbackEventList
        },
        getPopUpData: function() {
            var data = {};
            if (window.name) {
                try {
                    data = JSON.parse(window.name)
                } catch (e) {
                    data = {}
                }
            }
            return data
        },
        sendMessage: function(data, target) {
            data = data || {};
            data._iTalentType = "sendMessage";
            data._iTalentMessageDirection = "up";
            target = target || "*";
            this._sendMessage(data, target)
        },
        _sendMessage: function(data, target) {
            target = target || "*";
            if (window.top != window && data._iTalentMessageDirection == "up") {
                data = this._convertMessageParams(data);
                window.top.postMessage(data, target)
            } else {
                data._iTalentMessageDirection = "down";
                data = this._convertMessageParams(data);
                var iframeList = document.getElementsByTagName("iframe");
                for (var i = 0; i < iframeList.length; i++) {
                    iframeList[i].contentWindow.postMessage(data, target)
                }
            }
        },
        _callbackEventList: [],
        setTitle: function(data) {
            if (typeof data != 'string') {
                return;
            }
            var self = this;
            var message = this._convertMessageParams({
                _iTalentType: "setTitle",
                title: data
            });
            window.top.postMessage(message, "*");
        },
        _setTitle: function(data) {
            document.title = data.title;
        },
        updateSize: function(iframeId, width, height) {
            var self = this;
            var message = this._convertMessageParams({
                _iTalentType: "updateSize",
                iframeId: iframeId || self._convertMessageParams(window.name || "{}")["__iTalentFrameId"],
                width: width || "100%",
                height: height || Math.max(document.body.scrollHeight,document.documentElement.scrollHeight,document.body.offsetHeight,document.documentElement.offsetHeight,document.body.clientHeight,document.documentElement.clientHeight)
            });
            window.parent.postMessage(message, "*");
        },
        _updateSize: function(data) {
            // 解决模糊问题 当为100%时
            var iframeItem = document.getElementById(data["iframeId"]);
            if (!iframeItem) {
                return false
            }
            var type = iframeItem.getAttribute("data-type");
            if (data.width == '100%' && data.height == '100%' && type == "popup") {
                var _windowSize = this.getWindowSize();
                data.width = _windowSize.width;
                data.height = _windowSize.height;
            }
            if ((data["height"] + "px" != iframeItem.height) && (data["height"] != iframeItem.height)) {
                var height = data["height"] && this._convertMetricToPX(data["height"]);
                height && iframeItem.setAttribute("height", height)
            }
            if (data["width"] != iframeItem.width) {
                var width = data["width"] && this._convertMetricToPX(data["width"]);
                width && iframeItem.setAttribute("width", width)
            }
            var type = iframeItem.getAttribute("data-type");
            if (type == "popup") {
                this._setPopIframePositon(iframeItem, width, height)
            }
        },
        //整个页面刷新
        reloadPage: function() {
            if (window.top != window) {
                window.top.postMessage(this._convertMessageParams({
                    _iTalentType: "reloadPage"
                }), "*")
            } else {
                this._reloadPage();
            }
        },
        _reloadPage: function() {
            window.location.reload();
        },
        getTopSize: function() {
            if (window.top != window) {
                window.top.postMessage(this._convertMessageParams({
                    _iTalentType: "getTopSize"
                }), "*")
            } else {
                this._getTopSize();
            }
        },
        _getTopSize: function() {
            var _size = this.getWindowSize();
            this.sendMessage({
                "publishEvent": "__iTalent_Resize_Size",
                "_iTalentMessageDirection": "down",
                "data": {
                    height: _size.height,
                    width: _size.width
                }
            })
        },
        getWindowSize: function() {
            var myWidth,
                myHeight;
            if (typeof (window.innerWidth) == 'number') {
                myWidth = window.innerWidth;
                myHeight = window.innerHeight;
            } else {
                if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
                    myWidth = document.documentElement.clientWidth;
                    myHeight = document.documentElement.clientHeight;
                } else {
                    if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
                        myWidth = document.body.clientWidth;
                        myHeight = document.body.clientHeight;
                    }
                }
            }
            return {
              width: myWidth,
              height: myHeight
            }
        },
        bindHashChangeEvent: function() {
            var self = this;
            if (window.name == "") {
                return false
            }
            var iframeId = this._convertMessageParams(window.name || "{}")["__iTalentFrameId"];
            this.recodeIframeUrl(iframeId, {
                "_italentHashNotChange": true
            });
            this._addEvent("hashchange", update);

            function update(e, data) {
                self.recodeIframeUrl(iframeId, data)
            }
        },
        recodeIframeUrl: function(iframeId, data) {
            var self = this;
            var data = data || {};
            var message = self._convertMessageParams({
                _iTalentType: "changeUrl",
                iframeId: iframeId || self._convertMessageParams(window.name || "")["__iTalentFrameId"],
                iframeHref: encodeURIComponent(window.location.href),
                _italentHashNotChange: data._italentHashNotChange
            });
            window.top.postMessage(message, "*")
        },
        _changeUrl: function(data) {
            var iframeId = data["iframeId"];
            var iframeHref = decodeURIComponent(data["iframeHref"]);
            var hash = decodeURIComponent(window.location.hash || "");
            hash = hash.slice(hash.indexOf("#") + 1);
            if (hash.indexOf(iframeId) != -1) {
                var regex = new RegExp(iframeId + "=([^&]*)(&)?", "i");
                hash = hash.replace(regex, iframeId + "=" + encodeURIComponent(iframeHref) + "&");
                hash = encodeURIComponent(hash);
                if (window.location.hash != hash) {
                    if (data._italentHashNotChange) {
                        if (window.history.pushState) {
                            window.history.pushState(null, null, "#" + hash)
                        } else {
                            if (window.Talent) {
                                window.Talent.app.execute("history:navigate", "#" + decodeURIComponent(hash), false)
                            } else {
                                if (window.Backbone) {
                                    window.Backbone.history.navigate("#" + decodeURIComponent(hash), false)
                                } else {
                                    window.location.hash = "#" + hash
                                }
                            }
                        }
                    } else {
                        if (window.Talent) {
                            window.Talent.app.execute("history:navigate", "#" + decodeURIComponent(hash), false)
                        } else {
                            if (window.Backbone) {
                                window.Backbone.history.navigate("#" + decodeURIComponent(hash), false)
                            }
                        }
                    }
                }
            }
        },
        _showMask: function (data) {
            var _popArr;
            if (data.applicationName) {
                _popArr = this._preloadIframe[data.applicationName];
            } else {
                _popArr = this._popIframe;
            }
            var __iTalent_pop_up = document.getElementById('__iTalent_pop_up');
            if (__iTalent_pop_up) {
                __iTalent_pop_up.style.display = 'block';
            }
            if (_popArr.length) {
                for (var i = 0; i < _popArr.length; i++) {
                    var _iframe = _popArr[i];
                    if (_iframe.ifrmEle.style.zIndex == '-10000') {
                        _iframe.ifrmEle.style.zIndex = '10000';
                    }
                }
            }
        },
        hideMaskPop: function(data) {
            if (window.top != window) {
                window.top.postMessage(this._convertMessageParams({
                    _iTalentType: "hideMaskPop",
                    applicationName: data
                }), "*")
            } else {
                this._hideMaskPop({
                    applicationName: data
                });
            }
        },
        _hideMaskPop: function(_data) {
            var _popArr;
            if (_data.applicationName) {
                _popArr = this._preloadIframe[_data.applicationName];
            } else {
                _popArr = this._popIframe;
            }
            if (_popArr.length) {
                for (var i = 0; i < _popArr.length; i++) {
                    var _iframe = _popArr[i];
                    if (_iframe.ifrmEle.style.zIndex == '10000') {
                        _iframe.ifrmEle.style.zIndex = '-10000';
                        this._currentPopUpAppName = '';
                        var data = {};
                        data._iTalentType = "sendMessage";
                        data._iTalentMessageDirection = "down";
                        data.changeHash = true;
                        data.applicationName = _data.applicationName;
                        var target = "*";
                        this._sendMessage(data, target)
                    }
                }
            }
            var __iTalent_pop_up = document.getElementById('__iTalent_pop_up');
            if (__iTalent_pop_up) {
                __iTalent_pop_up.style.display = 'none';
            }
        },
        showShadeUp: function(appendIframe, ifrmEle, data) {
            var popContainer = document.getElementById('__iTalent_pop_up');
            if (!popContainer) {
                popContainer = document.createElement('div');
                popContainer.setAttribute('id', '__iTalent_pop_up');
                // popContainer.style.display = 'none';
                var shade = document.createElement('div');
                shade.setAttribute('id', '__iTalent_pop_mask');
                shade.setAttribute('style', 'position:fixed; width: 100%; height: 100%; background-color: #03101A; top: 0; left : 0; z-index: 10000; opacity: 0.5;filter:alpha(opacity=50)')
                if (appendIframe) this._loading(popContainer);
                popContainer.appendChild(shade); 
                if (appendIframe) popContainer.appendChild(ifrmEle);
                var __bs_layout_container = document.getElementById('bs_layout_container');
                if (__bs_layout_container) {
                    __bs_layout_container.appendChild(popContainer);
                } else {
                    var __bs_layout_container = document.createElement('div');
                    __bs_layout_container.setAttribute('id', 'bs_layout_container');
                    document.body.appendChild(__bs_layout_container);
                    __bs_layout_container.appendChild(popContainer);
                }
            }
            popContainer.style.display = 'block';
            if (window.BSGlobal['__dialogPreLoad'] && data.preload && data.preload.level == 1) {
                popContainer.style.display = 'none';
            }
        },
        hideShadeUp: function() {
            if (window.top != window) {
                window.top.postMessage(this._convertMessageParams({
                    _iTalentType: "hideShadeUp"
                }), "*")
            } else {
                this._hideShadeUp();
            }
        },
        _hideShadeUp: function() {
            var __iTalent_pop_up = document.getElementById('__iTalent_pop_up');
            if (__iTalent_pop_up && this._isEmptyObject(this._preloadIframe)) {
                __iTalent_pop_up.style.display = 'none';
            }
        },
        changeLeftMenuShade: function(data) {
            if (window.top != window) {
                window.top.postMessage(this._convertMessageParams({
                    _iTalentType: "changeLeftMenuShade",
                    data: data
                }), "*")
            } else {
                this._changeLeftMenuShade(data)
            }
        },
        _changeLeftMenuShade: function(data) {
            var width = this.getLeftMenuWidth(data);
            var data = data && data.data || {}
            var popContainer = document.getElementById('__iTalent_pop_up');
            var shadeMenu = document.getElementById('__iTalent_pop_mask_menu');
            var shadeHead = document.getElementById('__iTalent_pop_mask_head');
            var header = document.getElementsByClassName('tu-page-header')

            if(!shadeMenu) {
                shadeMenu = document.createElement('div');
                shadeMenu.setAttribute('id', '__iTalent_pop_mask_menu');
                shadeMenu.setAttribute('style', 'position:fixed; top: 41px; width:'+ width +'px; height: 100%; background-color: #03101A;left : 0; z-index: 10000; opacity: 0.5;filter:alpha(opacity=50)')
                shadeHead = document.createElement('div');
                if(header && header.length>0){
                    shadeHead.setAttribute('id', '__iTalent_pop_mask_head');
                    shadeHead.setAttribute('style', 'position:fixed; width:100%; height:'+ 41 +'px; background-color: #03101A; top: 0; left : 0; z-index: 10000; opacity: 0.5;filter:alpha(opacity=50)')
                }
                if (!popContainer) {
                    popContainer = document.createElement('div');
                    popContainer.setAttribute('id', '__iTalent_pop_up');
                    var __bs_layout_container = document.getElementById('bs_layout_container');
                    if (__bs_layout_container) {
                        __bs_layout_container.appendChild(popContainer);
                    } else {
                        var __bs_layout_container = document.createElement('div');
                        __bs_layout_container.setAttribute('id', 'bs_layout_container');
                        document.body.appendChild(__bs_layout_container);
                        __bs_layout_container.appendChild(popContainer);
                    }
                } else {
                    popContainer.style.display = 'block' 
                    var shadeMask = document.getElementById('__iTalent_pop_mask');
                    if(shadeMask) shadeMask.style.display = 'none';
                }
                popContainer.appendChild(shadeMenu); 
                popContainer.appendChild(shadeHead); 
            } else if(shadeHead && shadeHead.style.display == 'none' || data.showShadow) {
                shadeMenu && (shadeMenu.style.width = width)
                shadeHead && (shadeHead.style.display = 'block')
                shadeMenu && (shadeMenu.style.display = 'block')
                popContainer && (popContainer.style.display = 'block')
            } else {
                shadeHead && (shadeHead.style.display = 'none')
                shadeMenu && (shadeMenu.style.display = 'none')
                popContainer && (popContainer.style.display = 'none');
                if(shadeMenu) popContainer.removeChild(shadeMenu);
                if(shadeHead) popContainer.removeChild(shadeHead);
                var shadeMask = document.getElementById('__iTalent_pop_mask');
                if(shadeMask) shadeMask.style.display = 'block';
            }
        },
        getLeftMenuWidth: function(data) {
            var data = data && data.data
            var sidebar = document.getElementsByClassName('page-sidebar-wrapper')
            var level2Sidebar = document.getElementsByClassName('tu-page-colum-nav')
            var menuWidth = 0, level2MenuWidth = 0
           
            if(sidebar && sidebar.length > 0) {
                 menuWidth = sidebar[0].clientWidth
            }
            if(level2Sidebar && level2Sidebar.length > 0) {
                level2MenuWidth = level2Sidebar[0].clientWidth + 1 // 有2px的边框
            }
            var width = menuWidth + level2MenuWidth 
            if(data && data.needSendWidth) {
                this.sendMessage({
                    publishEvent: 'getLeftMenuWidth',
                    data: {
                        'leftWidth': width,
                        'topHeight': 40 
                    }
                }, '*')
            }
            return width 
        },
        showPopup: function(url, width, height, data, transferFrameUrl, childPosition, isNeedAnimate, isNeedSetWidthAndHeight, preload, applicationName) {
            var self = this;
            window.top.postMessage(this._convertMessageParams({
                url: encodeURIComponent(url),
                width: width,
                height: height,
                _transferframeUrl: transferFrameUrl,
                _childPosition: self._convertMessageParams(childPosition),
                _isNeedAnimate: isNeedAnimate == false ? false : true,
                _isNeedSetWidthAndHeight: isNeedSetWidthAndHeight == true ? true : false,
                _iTalentType: "showPopup",
                publishData: self._convertMessageParams(data),
                preload: preload,
                _applicationName: applicationName
            }), "*")
        },
        _showPopup: function(data) {
            if(window.BSGlobal['__dialogPreLoad'] && data.preload && data.preload.open == false && data.preload.hasShowIframe == true && data.preload.level != 0){
                //this._preloadDilog dilaog is loaded
                this._showMask({applicationName: data._applicationName});
                if(this._preloadDilog){
                    //continue;
                    //send data
                    this.sendMessage(JSON.stringify(data.publishData));
                    // this._preloadData = null;
                    this._preloadData[data._applicationName] = null;
                } else {
                    // this._preloadData = JSON.stringify(data.publishData);
                    this._preloadData[data._applicationName] = JSON.stringify(data.publishData);
                }
                if (data.preload.level == 1) {
                    this._currentPopUpAppName = data._applicationName;
                }
                return;
            }
            var self = this;
            data._isNeedAnimate = data._isNeedAnimate == false ? false : true;
            data._isNeedSetWidthAndHeight = data._isNeedSetWidthAndHeight == true ? true : false;
            if (window.top != window) {
                window.top.postMessage(data)
            } else {
                ///修改@@@@
                var open = data.preload ? data.preload.open : false;
                if (data._childPosition || open && window.BSGlobal['__dialogPreLoad']) {
                    var ifOldIE = this._checkBrowserVersion();
                    if (!ifOldIE) {
                        this._showPopupAnimate(data)
                    } else {
                        this._addIframeToContailer(data)
                    }
                } else {
                    this._addIframeToContailer(data)
                }
            }
        },
        _showPopupAnimate: function(data) {
            var self = this;
            var level = data.preload ? data.preload.level : 0;
            var open = data.preload ? data.preload.open : false;

            var parent = this._popIframe.length ? this._popIframe[0].ifrmEle : null;
            if(level != 1 && !open && window.BSGlobal['__dialogPreLoad'] && data._applicationName) {
                // parent = this._popIframe[0].ifrmEle;
                var _popArr = this._preloadIframe[data._applicationName];
                parent = _popArr[0].ifrmEle;
            }
            // var parent = this._popIframe[this._popIframe.length - 1].ifrmEle;
            // var parent = this._popIframe[0].ifrmEle;
            ///修改@@@@

            // setTimeout(function() {
            // var open = data.preload ? data.preload.open : false;
            var hasShowIframe = data.preload ? data.preload.hasShowIframe : false;

            if (!open) {
                var length = data._applicationName ? self._preloadIframe[data._applicationName].length : self._popIframe.length;
                if (length >= 2 && !hasShowIframe) {
                    parent.style.transform = "translate(-120px,14px) scale(0.75)";
                    parent.style.WebkitTransform = "translate(-120px,14px) scale(0.75)";
                    parent.style.pointerEvents = "none"
                } else {
                    if (data._isNeedSetWidthAndHeight) {
                        parent.style.transform = "translate(-60%,-55%) scale(0.75)";
                        parent.style.WebkitTransform = "translate(-60%,-55%) scale(0.75)"
                    } else {
                        parent.style.transform = "translate(-85%,-59%) scale(0.75)";
                        parent.style.WebkitTransform = "translate(-85%,-59%) scale(0.75)"
                    }
                    parent.style.pointerEvents = "none"
                }
            }
            ///修改@@@@
            // self._popIframe[self._popIframe.length - 1].ifrmEle = parent

            setTimeout(function() {
                self._addIframeToContailer(data)
            }, 300);
            // }, 300);


            // setTimeout(function() {
            //  self._addIframeToContailer(data)
            // }, 700)
        },
        // 解决两个业务ifraem时，操作时序问题
        _getIsHavePopShow: function() {
            if (this._isEmptyObject(this._preloadIframe)) {
                return true;
            }
            if (this._currentPopUpAppName) return false;
           return true;
        },
        _addIframeToContailer: function(data) {
            var self = this;
            var url = data["url"] && decodeURIComponent(data["url"]);
            var popContainer = document.getElementById("__iTalent_pop_up");
            var open = data.preload ? data.preload.open : false;
            var hasShowIframe = data.preload ? data.preload.hasShowIframe : false;
            var level = data.preload ? data.preload.level : 0;
            var applicationName = data._applicationName ? data._applicationName : '';
            // clear element  when start prelaod
            if (popContainer && level == 0) {
                // popContainer.style.display = 'none';
                var _childPosition = this._convertMessageParams(data._childPosition);
                if ((_childPosition == undefined || _childPosition && _childPosition.left == undefined) && data._applicationName) {
                    this._removeItalnetPopEle();
                    popContainer = null || false;
                }
            }
            if (window.BSGlobal['__dialogPreLoad'] && open == true && hasShowIframe == false && level == 1) {
                window.top.postMessage(this._convertMessageParams({
                        _iTalentType: "removeItalnetPopEle",
                        applicationName: applicationName
                    }), "*");
                // if (window.top != window) {
                //     window.top.postMessage(this._convertMessageParams({
                //         _iTalentType: "removeItalnetPopEle",
                //         applicationName: applicationName
                //     }), "*");
                // } else {
                //     var _value = this._removeItalnetPopEle(applicationName);
                //     if (_value) popContainer = null || false;
                // }
            }
            var ifrmEle = this._createPopIframe(url, data["width"], data["height"], data.publishData, data["_transferframeUrl"], this._convertMessageParams(data._childPosition), data["_isNeedAnimate"], data["_isNeedSetWidthAndHeight"], open, hasShowIframe, level, applicationName);
            if (popContainer) {
                //修改
                if (!open) this._loading(popContainer);
                popContainer.appendChild(ifrmEle)
                popContainer.style.display = "block"
                if (window.BSGlobal['__dialogPreLoad'] && level == 1 && this._getIsHavePopShow()) {
                    popContainer.style.display = 'none';
                }
            } else {
                setTimeout(function() {
                    self.showShadeUp(true, ifrmEle, data);
                }, 100);
            }
        },
        _loading: function(popContainer) {
            var index = this._popIframe.length + 10000;
            var loading = document.getElementById("__iTalent_pop_loading");
            if (!loading) {
                var loading = document.createElement("div");
                loading.setAttribute("id", "__iTalent_pop_loading");
                loading.setAttribute("style", "position:fixed;top:50%;left:50%;font-size:14px;line-height:16px;z-index:" + index + ";");
                loading.innerHTML = '<img src="//st-web.tita.com/ux/tita-web-v4/release/app/images/load_m.gif" style="vertical-align: middle;"/><span style="vertical-align: middle;color:#555555">加载中...</span> ';
                popContainer.appendChild(loading)
            } else {
                loading.setAttribute("style", "position:fixed;top:50%;left:50%;display:block;z-index:" + index + ";")
            }
        },
        hidePopup: function(isNeedAnimate, applicationName) {
            if (window.top != window) {
                window.top.postMessage(this._convertMessageParams({
                    _iTalentType: "hidePopup",
                    _isNeedAnimate: isNeedAnimate == false ? false : true,
                    _applicationName: applicationName
                }), "*")
            } else {
                this._hidePopup(this._convertMessageParams({
                    _isNeedAnimate: isNeedAnimate == false ? false : true,
                    _applicationName: applicationName
                }))
            }
        },
        _hidePopup: function(data) {
            if (typeof(data) == "string" && data == "undefined") {
                data = "";
            }
            if (typeof(data) == "string") {
                try {
                    data = JSON.parse(data)
                } catch (e) {
                    data = "{}"
                }
            }
            data._isNeedAnimate == data._isNeedAnimate == false ? false : true;
            var self = this;
            if (window.top != window) {
                window.top.postMessage(data)
            } else {
                var ifOldIE = this._checkBrowserVersion();
                if (!ifOldIE) {
                    this._hidePopupAnimate(data)
                } else {
                    // var iframePreload = this._popIframe.pop();
                    var _popArr;
                    if (window.BSGlobal['__dialogPreLoad'] && data._applicationName) {
                        _popArr = this._preloadIframe[data._applicationName];
                    } else {
                        _popArr = this._popIframe;
                    }
                    var iframe = _popArr.pop();
                    var __iTalent_pop_up = document.getElementById("__iTalent_pop_up");
                    if (iframe && __iTalent_pop_up) {
                        this.recycleIframe(iframe.ifrmEle.id)
                    }
                }
            }
        },
        _hidePopupAnimate: function(data) {
            var self = this;
            if (window.clickFlag) {
                window.clickFlag = false;
                var _popArr;
                if (window.BSGlobal['__dialogPreLoad'] && data._applicationName) {
                    _popArr = this._preloadIframe[data._applicationName];
                } else {
                    _popArr = this._popIframe;
                }
                var iframe = _popArr[_popArr.length - 1];
                var length = _popArr.length;
                if (length >= 2 && !_popArr[_popArr.length - 1].emptyData) {
                    setTimeout(function() {
                        //#修改
                        var iframe = _popArr[_popArr.length - 1];
                        iframe.ifrmEle.style.top = iframe.top + "px";
                        iframe.ifrmEle.style.left = iframe.left + "px";
                        iframe.ifrmEle.style.transform = "scale(0)";
                        iframe.ifrmEle.style.WebkitTransform = "scale(0)"
                    }, 300);
                    setTimeout(function() {
                        var iframe = _popArr[_popArr.length - 2].ifrmEle;
                        if (_popArr.length >= 3) {
                            iframe.style.transform = "scale(1)";
                            iframe.style.WebkitTransform = "scale(1)"
                        } else {
                            iframe.style.transform = "translate(-50%, -50%)";
                            iframe.style.WebkitTransform = "translate(-50%, -50%)"
                        }
                        iframe.style.pointerEvents = "all";

                        setTimeout(function() {
                            //解决二级弹窗关闭后，一级弹窗出现模糊的问题（高版本浏览器不会出现该问题，仅发现在window电脑上的 chrome 50 51版本）
                            if(iframe){
                                if (iframe.width == '100%') return;
                                var temp = Math.random()*10>5 ? 2 : -2 ;
                                iframe.width = (parseInt(iframe.width.split("p")[0]) + temp ).toString() + "px";
                            }
                        },350)

                        //#修改
                        // var child = self._popIframe.pop();
                        var child = _popArr[_popArr.length - 1];
                        var __iTalent_pop_up = document.getElementById("__iTalent_pop_up");
                        if (child && __iTalent_pop_up) {
                            //#修改debugg
                            var body = document.createElement("body")
                            child.body = body;
                            _popArr[_popArr.length - 1].emptyData = true;
                            var preloadIframe = _popArr[_popArr.length - 1];
                            if (!preloadIframe.preload) {
                                __iTalent_pop_up.removeChild(child.ifrmEle);
                                _popArr.pop();
                            }
                        }
                        window.clickFlag = true;
                    }, 900)
                } else {
                    //#修改
                    var iframePreload
                    if (_popArr.length >= 2) iframePreload = _popArr.pop();
                    var iframe = _popArr.pop();
                    if (data && data._isNeedAnimate) {
                        if (iframe) {
                            iframe.ifrmEle.style.top = "-800px"
                        }
                        setTimeout(function() {
                            //#修改
                            self._hideItalentIframe(iframe, iframePreload, data._applicationName)
                        }, 200)
                    } else {
                        //#修改
                        this._hideItalentIframe(iframe, iframePreload, data._applicationName)
                    }
                }
            }

        },
        //#修改
        _hideItalentIframe: function(iframe, iframePreload, applicationName) {
            var __iTalent_pop_up = document.getElementById("__iTalent_pop_up");
            var _popArr;
            if (window.BSGlobal['__dialogPreLoad'] && applicationName) {
                _popArr = this._preloadIframe[applicationName];
            } else {
                _popArr = this._popIframe;
            }
            if (iframe && __iTalent_pop_up) {
                __iTalent_pop_up.removeChild(iframe.ifrmEle)
                    //#修改
                if (iframePreload) __iTalent_pop_up.removeChild(iframePreload.ifrmEle)
            }
            if (_popArr.length == 0 && __iTalent_pop_up) {
                __iTalent_pop_up.style.display = "none"
            }
            window.clickFlag = true;
        },
        _checkBrowserVersion: function() {
            var userAgent = navigator.userAgent.toLowerCase();
            var regStr_ie = /msie [\d.]+;/gi;
            if (userAgent.indexOf("msie") > 0) {
                var browser = userAgent.match(regStr_ie);
                var verinfo = (browser + "").replace(/[^0-9.]/ig, "");
                if (parseInt(verinfo) <= parseInt("9.0")) {
                    return true
                }
            }
            return false
        },
        _popIframe: [],
        _preloadIframe: {},
        _currentPopUpAppName: '',
        _createPopIframe: function(url, width, height, data, _TransferFrameUrl, _childPosition, _isNeedAnimate, _isNeedSetWidthAndHeight, _preload, _hasShowIframe, _level, _applicationName) { ///修改@@@@
            var self = this;
            ///修改@@@@ 处理判断逻辑
            // var ifrmEle = _hasShowIframe ? self._popIframe[self._popIframe.length - 1].ifrmEle : document.createElement("iframe");
            // var ifrmEle = document.createElement("iframe");
            // clear element italpop

            if(_level == 1 && window.BSGlobal['__dialogPreLoad']){
                if (!_applicationName) {
                    var ifrmEle = _hasShowIframe ? self._popIframe[0].ifrmEle : self._popIframe.length >= 1 ? self._popIframe[0].ifrmEle : document.createElement("iframe");
                } else {                
                    var _popArr = this._preloadIframe[_applicationName];
                    var ifrmEle = _popArr ? _popArr[_popArr.length - 1].ifrmEle : document.createElement('iframe');
                }
            }else{
                var ifrmEle = _hasShowIframe && window.BSGlobal['__dialogPreLoad'] ? self._popIframe[self._popIframe.length - 1].ifrmEle : document.createElement("iframe");
            }

            var location = window.location;
            var iframeData = {
                __iTalentFrameId: "popup_" + (new Date()).getTime() + parseInt(Math.random(1, 10) * 3000),
                data: data,
                __iTalentFrameType: "pop"
            };
            var src = _TransferFrameUrl ? _TransferFrameUrl : location.protocol + "//" + location.host + "/italent-transfer-data.html";
            if (_preload && window.BSGlobal['__dialogPreLoad'] && _level != 0) src = url;
            ifrmEle.setAttribute("frameborder", 0);
            ifrmEle.setAttribute("scrolling", "auto");
            var ifOldIE = this._checkBrowserVersion();
            if (!ifOldIE) {
                var ifrmEle = this._setIframeAminateAttr(_childPosition, ifrmEle, _isNeedAnimate, _preload, _applicationName);
            } else {
                ///修改@@@@ index
                var index = _preload ? -10000 : this._popIframe.length + 10000;
                //去掉background-color:#000;
                var iframeStyle = "-ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=50)'; filter: alpha(opacity=0); opacity: 0; position:absolute; top:50%; left:50%; z-index:" + index + ";";
                ifrmEle.setAttribute("style", iframeStyle);
                ifrmEle = this._setPopIframePositon(ifrmEle, width, height)
            }
            ifrmEle.setAttribute("src", src);
            ifrmEle.setAttribute("id", iframeData.__iTalentFrameId);
            ifrmEle.setAttribute("data-type", "popup");
            if (_preload) ifrmEle.setAttribute("show-type", "preload");
            if (!_isNeedSetWidthAndHeight) {
                if (width) {
                    ifrmEle.setAttribute("width", this._convertMetricToPX(width))
                }
                if (height) {
                    ifrmEle.setAttribute("height", this._convertMetricToPX(height))
                }
            } else {
                ifrmEle.setAttribute("width", this._convertMetricToPX(window.innerWidth));
                ifrmEle.setAttribute("height", this._convertMetricToPX(window.innerHeight))
            }
            ///修改@@@@ 增加字段
            if (!_childPosition || _preload) {
                if (!_hasShowIframe && _hasShowIframe != undefined) {
                    if (window.BSGlobal['__dialogPreLoad'] && _applicationName && _applicationName != undefined) {
                        this._preloadIframe[_applicationName] = [];
                        var _tempArr = this._preloadIframe[_applicationName];
                        _tempArr.push({
                            ifrmEle: ifrmEle,
                            top: 0,
                            left: 0,
                            preload: _preload ? _preload : false,
                            emptyData: _preload ? true : false
                        })
                    } else {
                        this._popIframe.push({
                            ifrmEle: ifrmEle,
                            top: 0,
                            left: 0,
                            preload: _preload ? _preload : false,
                            emptyData: _preload ? true : false
                        })
                    }
                }
            } else {
                ///修改@@@@ 
                var _popArr;
                if (window.BSGlobal['__dialogPreLoad'] && _applicationName && _applicationName != undefined) {
                    _popArr = this._preloadIframe[_applicationName];
                } else {
                    _popArr = this._popIframe;
                }
                var parent = _hasShowIframe ? _popArr[0].ifrmEle : _popArr[_popArr.length - 1].ifrmEle;
                // var parent = this._popIframe[this._popIframe.length - 1].ifrmEle;
                var top = parent.getBoundingClientRect().top + _childPosition.top * 0.75;
                var left = parent.getBoundingClientRect().left + _childPosition.left * 0.75;
                ///修改@@@@ //添加预加载
                if (!_hasShowIframe && _hasShowIframe != undefined) {
                    _popArr.push({
                        ifrmEle: ifrmEle,
                        top: top,
                        left: left,
                        emptyData: false
                    })
                } else {
                    ///修改@@@@ 改变预加载iframe的属性
                    _popArr[_popArr.length - 1].top = top;
                    _popArr[_popArr.length - 1].left = left;
                    _popArr[_popArr.length - 1].emptyData = false;
                }
            }
            this.register({
                "listenEvent": "__iTalentSDK_Close_Iframe",
                cb: function(data) {
                    var __iTalent_pop_up = document.getElementById("__iTalent_pop_up");
                    if (self._popIframe.length == 0 && __iTalent_pop_up) {
                        __iTalent_pop_up.style.display = "none"
                    }
                    var iframe = document.getElementById(data.iframeId);
                    if (iframe && __iTalent_pop_up) {
                        __iTalent_pop_up.removeChild(iframe)
                    }
                }
            });

            var state = 0;
            if (!ifOldIE) {
                ifrmEle.onload = function(e) {
                    if (state == 0) {
                        self._onloadPopUpAnimate(e, _childPosition, iframeData, url, _isNeedAnimate, _level);
                    }
                    state = 1
                }
            } else {
                ifrmEle.attachEvent("onload", function(e) {
                    if (state == 0) {
                        if (_level == 0) {
                            ifrmEle.contentWindow.name = self._convertMessageParams(iframeData);
                            ifrmEle.contentWindow.location.href = url;
                        }
                        var e = e || window.event;
                        var iframe = e.target || e.srcElement;
                        iframe.style['-ms-filter'] = "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
                        iframe.style['filter'] = 'alpha(opacity=100)';
                        iframe.style['opacity'] = 1;
                        document.getElementById("__iTalent_pop_loading").style.display = "none"
                    }
                    state = 1
                })
            }
            return ifrmEle
        },
        _onloadPopUpAnimate: function(e, _childPosition, iframeData, url, _isNeedAnimate, _level) {
            var self = this;
            var iframe = e.target;
            if (_childPosition) {
                var parent = self._popIframe[self._popIframe.length - 1];
                var documentH = window.innerHeight;
                var documentW = window.innerWidth;
                var top = (documentH - iframe.clientHeight) / 2;
                var left = (documentW - iframe.clientWidth) / 2;
                //修改，去掉延时
                if (BSGlobal && BSGlobal.appName && BSGlobal.appName.indexOf("cloud") >= 0) {
                    iframe.style.top = top + "px";
                    iframe.style.left = left + "px"
                    iframe.style.transform = "scale(1)";
                    iframe.style.WebkitTransform = "scale(1)";
                } else {
                    setTimeout(function() {
                            iframe.style.top = top + "px";
                            iframe.style.left = left + "px"
                            iframe.style.transform = "scale(1)";
                            iframe.style.WebkitTransform = "scale(1)";
                        }, 600) //600
                }
            } else {
                if (_isNeedAnimate) {
                    setTimeout(function() {
                        var iframeStyle = self.getIframeAnimateAttr(false, true);
                        iframe.setAttribute("style", iframeStyle + "z-index:" + iframe.style.zIndex)
                    }, 200)
                }
            }
            if (_level == 0) {
                iframe.contentWindow.name = this._convertMessageParams(iframeData);
                iframe.contentWindow.location.href = url;
            }
            document.getElementById("__iTalent_pop_loading").style.display = "none"
        },
        _setIframeAminateAttr: function(_childPosition, ifrmEle, _isNeedAnimate, _preload, _applicationName) { ///修改@@@@
            ///修改@@@@ index
            var _popArr = _applicationName ? this._preloadIframe[_applicationName] : this._popIframe;
            var index = _preload ? -10000 : _popArr.length + 10000;
            if (_childPosition && _childPosition.top != "undefined" && _childPosition.left != "undefined") {
                var parent = _popArr[_popArr.length - 1].ifrmEle;
                var top = parent.getBoundingClientRect().top + _childPosition.top * 0.75;
                var left = parent.getBoundingClientRect().left + _childPosition.left * 0.75;
                var iframeAnimateAttr = this.getIframeAnimateAttr(true, false);
                var iframeStyle = iframeAnimateAttr + "z-index: " + index + ";top:" + top + "px;left:" + left + "px;";
                ifrmEle.setAttribute("style", iframeStyle)
            } else {
                if (_isNeedAnimate) {
                    var iframeAnimateAttr = this.getIframeAnimateAttr(false, false);
                    var iframeStyle = iframeAnimateAttr + "z-index:" + index + ";"
                } else {
                    //修改 动画时间改为 .3s
                    var iframeStyle = "position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);opacity: 1;overflow:hidden;transition:transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-webkit-transition:transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-moz-transition:transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-o-transition:transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-ms-transition:transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);z-index:" + index
                }
                ifrmEle.setAttribute("style", iframeStyle)
            }
            return ifrmEle
        },
        getIframeBorderAndShadowAttr: function() {
            return "border-radius:2px !important;box-shadow:0 5px 20px 0 rgba(0, 0, 0, 0.3);"
        },
        getIframeAnimateAttr: function(isHaveChild, isAnimate) {
            var haveChildIframeStyle = "position:fixed;transform:scale(0.1);-webkit-transform:scale(0.1);-moz-transform:scale(0.1);-ms-transform:scale(0.1);-o-transform:scale(0.1);overflow:hidden;transform-origin:left top;transition:transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-webkit-transition:transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-moz-transition:transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-o-transition:transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-ms-transition:transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);";
            var noChildIframeInitStyle = "position:fixed;left:50%;transform:translate(-50%, -50%);-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);opacity: 1;overflow:hidden;transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-webkit-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-moz-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-o-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-ms-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);top:-800px;";
            var noChildIframeAnimateStyle = "position:fixed;left:50%;transform:translate(-50%, -50%);-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);opacity: 1;overflow:hidden;transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-webkit-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-moz-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-o-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);-ms-transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);top:50%;";
            if (!isHaveChild && !isAnimate) {
                return noChildIframeInitStyle
            } else {
                if (!isHaveChild && isAnimate) {
                    return noChildIframeAnimateStyle
                } else {
                    return haveChildIframeStyle
                }
            }
        },
        _addEvent: function(event_name, callback) {
            this._removeEvent(event_name, callback);
            if (window.addEventListener) {
                window.addEventListener("on" + event_name, callback, false);
                window.addEventListener(event_name, callback, false)
            } else {
                if (window.attachEvent) {
                    window.attachEvent("on" + event_name, callback);
                    window.attachEvent(event_name, callback);
                    document.body && document.body.attachEvent("on" + event_name, callback);
                    document.body && document.body.attachEvent(event_name, callback)
                }
            }
        },
        _removeEvent: function(event_name, callback) {
            if (window.removeEventListener) {
                window.removeEventListener("on" + event_name, callback, false);
                window.removeEventListener(event_name, callback, false)
            } else {
                if (window.detachEvent) {
                    window.detachEvent("on" + event_name, callback);
                    window.detachEvent(event_name, callback);
                    document.body && document.body.detachEvent("on" + event_name, callback);
                    document.body && document.body.detachEvent(event_name, callback)
                }
            }
        },
        _convertMessageParams: function(params) {
            var data;
            if (typeof(params) == "string" && params == "undefined") {
                return ""
            }
            if (typeof(params) == "string") {
                try {
                    data = JSON.parse(params)
                } catch (e) {
                    data = "{}"
                }
            } else {
                data = JSON.stringify(params)
            }
            return data
        },
        _setPopIframePositon: function(node, width, height) {
            width = width && this._convertMetricToPX(width, true);
            height = height && this._convertMetricToPX(height, true);
            var ifOldIE = this._checkBrowserVersion();
            if (ifOldIE) {
                width && (node.style.marginLeft = "-" + width + "px");
                height && (node.style.marginTop = "-" + height + "px")
            }
            return node
        },
        _convertMetricToPX: function(metric, half) {
            if (typeof metric == "string") {
                metric = (metric == "undefined" || metric == "null" || metric == "NaN" || !metric) ? "0" : metric;
                metric = metric.replace(/(px)?/, "") == "" ? 0 : metric;
                if (metric.indexOf("%") == -1) {
                    if (half) {
                        var isEven = this._checkNumberIsEven(metric);
                        return isEven ? parseInt(metric) / 2 + 2 : parseInt(metric) / 2 + 1
                    } else {
                        var isEven = this._checkNumberIsEven(metric);
                        return isEven ? parseInt(metric) + 2 + "px" : parseInt(metric) + 1 + "px"
                    }
                } else {
                    return metric
                }
            } else {
                if (typeof metric == "number") {
                    if (half) {
                        var isEven = this._checkNumberIsEven(parseInt(metric));
                        return isEven ? parseInt(metric) / 2 + 2 : parseInt(metric) / 2 + 1
                    } else {
                        var isEven = this._checkNumberIsEven(parseInt(metric));
                        return isEven ? parseInt(metric) + 2 + "px" : parseInt(metric) + 1 + "px"
                    }
                }
            }
        },
        _checkNumberIsEven: function(metric) {
            return parseInt(metric) % 2 == 0 ? true : false
        },
        _sameAppInsideJump: function (data) {
            data = data || {};
            var hash = data.hash || '';
            if (hash) {
                var iframeList = document.getElementsByTagName("iframe");
                for (var i = 0; i < iframeList.length; i++) {
                    var iframeWindow = iframeList[i].contentWindow;
                    if (iframeWindow.Talent) {
                        iframeWindow.Talent.app.execute("history:navigate", decodeURIComponent(hash), true)
                    } else {
                        if (iframeWindow.Backbone) {
                            iframeWindow.Backbone.history.navigate(decodeURIComponent(hash), true)
                        }
                        if (iframeWindow.React) {
                            var location = iframeWindow.location;
                            location.href = location.origin + location.pathname + location.search + hash;
                        }
                    }
                }
            }
        }
    };
    root.iTalentSDK = iTalentSDK
}).call(this);
