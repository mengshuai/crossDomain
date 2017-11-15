define(['talent'
	,'templates/iTalents'
],function(Talent
	,jst
) {
	
	/**
	 * Inner main view class
	 * @class HomeView~MainView
	 * @extends {Backbone.View}
	 */	
	var MainView = Talent.Layout.extend(
		/** @lends HomeView~MainView.prototype */
	{
		template: jst['iTalents/index-page']
		,id: 'iframe_container'
		,initialize: function() {
			// Talent.app.request('')

			window.location.hash = "#iTalents%3Fiframe%3Dhttp%3A%2F%2F" + iframeHost +"%2Fiframe.html%253FwidgetId%253Diframe";

			var queryObject = this._getQueryObjectByHash();
			// console.log(queryObject)
			for(var key in queryObject) {
				if(queryObject[key].indexOf("//")!= -1) {
					var url = queryObject[key];
					this.model.set({
						iframeId : key,
						iframeUrl : "http://" + window.location.host + '/italent-transfer-data.html',
						widgetUrl : "http://" + window.location.host + '/italent-transfer-data.html',
						listUrl : "http://" + window.location.host + '/italent-transfer-data.html',
						realIframeUrl : decodeURIComponent(queryObject[key]),
						realWidgetUrl : "http://"+ iframeHost +"/widget.html?widgetId=widget1",
						realListUrl : "http://"+ iframeHost +"/#list"
					})
					break;
				}
			}
			$(window).off('hashchange')
			$(window).on('hashchange',function(){
				//console.log(2222222)
			})	
		
		}
		,ui:{
			
		}
		,onRender : function(){
			var height = $(window).height() - 55;
			this.$el.height(height);
			

		}
		,onShow : function() {
			var iframeId = this.model.get('iframeId');
			var state1 = true;
			var state2 = true;
			var state3 = true;
			var self = this;
			
			var realIframeUrl = self.model.get('realIframeUrl');
			var realWidgetUrl = self.model.get('realWidgetUrl');
			var realListUrl = self.model.get('realListUrl');

			this.$el.find('#' + iframeId)[0].onload = function(e){
				if(state1) {
					var iframe = e.target;
					iframe.contentWindow.name = JSON.stringify({
						'__iTalentFrameId' : self.model.get('frameId'),
						'__iTalentFrameType' : 'iframe'
					})
					iframe.contentWindow.location.href = realIframeUrl;
					state1 = false;
				}
			}

			this.$el.find('#testWidget')[0].onload = function(e){
				if(state2) {
					var iframe = e.target;
					iframe.contentWindow.name = JSON.stringify({
						'__iTalentFrameId' : 'testWidget',
						'__iTalentFrameType' : 'iframe'
					})
					iframe.contentWindow.location.href = realWidgetUrl
					state2 = false;
				}
			}
			this.$el.find('#testList')[0].onload = function(e){
				if(state3) {
					var iframe = e.target;
					iframe.contentWindow.name = JSON.stringify({
						'__iTalentFrameId' : 'testList',
						'__iTalentFrameType' : 'iframe'
					})
					iframe.contentWindow.location.href = realListUrl
					state3 = false;
				}
			}
			var url = window.iTalentSDK.getErrorPageUrl();
			console.log('++++'+url);
	    	window.iTalentSDK.register();

		}
		,_getQueryObjectByHash : function(url) {
			var fragmentStr;
			if (url) {
				fragmentStr = url.indexOf("#") != -1 ? url.slice(url.indexOf("#")+1) : url;
			} else {
				fragmentStr = location.hash || '';
			}
			fragmentStr = decodeURIComponent(fragmentStr);
			var queryObject = {};
			var markIndex = fragmentStr.indexOf("?");
			if(markIndex > -1){
				var queryString = fragmentStr.slice(markIndex+1);
				var queryArray = queryString.split('&');
				for (var i = 0; i < queryArray.length; i++) {
					var queryPair = queryArray[i].split('=');
					queryObject[queryPair[0]] = queryPair[1];
				}
			}
			return queryObject;
		}
		
	});

	return Talent.BasePageView.extend({
		mainViewClass : MainView
		// ,layout:'empty-layout'
		,pageTitle: 'iTalents'
	});
});
