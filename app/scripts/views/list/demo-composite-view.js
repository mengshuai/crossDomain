define([
	'talent'
	, 'templates/list'
], 
function (
	talent
	,jst
) {
var ItemView = talent.ItemView.extend({
		tagName : 'li'
		,template : jst['list/demo-item']
		,ui : {
			'save' : 'a[data-name="save"]'
		}
		,initialize : function(){
			this._registerItalentSDK();
		}
		,events : function(){
			var events = {};
			events['click ' + this.ui.save] = "_showPop";
			return events;
		}
		,onRender : function() {

		}
		,_registerItalentSDK : function(){
			var self = this;
			window.iTalentSDK.register([{
				listenEvent : 'save',
				context : this,
				cb : function(data){
					this._hidePop();
				}
			}]);
		}
		,_showPop : function(){
			var data = {
				id : '1',
				name : 'testpop'
			}
			window.iTalentSDK.showPopup('http://localhost:8000/#pop',600, 476,data);
		},
		_hidePop : function(){
			window.iTalentSDK.hidePopup();
		}
		
	});
	
	return talent.CompositeView.extend({
		itemView : ItemView,
		itemViewContainer : 'ul[data-name="list"]',
		template :  _.template('<ul data-name="list"></ul>'),
		initialize : function(){

		},
		onRender : function(){

		}
	});
});