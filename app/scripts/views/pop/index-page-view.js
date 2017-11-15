define(['talent'
	,'templates/pop'
],function(Talent
	,jst
	,SideBarView
) {
	
	/**
	 * Inner main view class
	 * @class HomeView~MainView
	 * @extends {Backbone.View}
	 */	
	var MainView = Talent.Layout.extend(
		/** @lends HomeView~MainView.prototype */
	{
		//template: jst['pop/index-page']
		template : _.template('<div class="pop"></div>')
		,className:'_tt_dialog'
		,initialize: function() {
			// Talent.app.request('')

			this._regiseriTalentSDK();
			
		}
		,ui:{
			'sure' : 'a[data-name="sure"]',
			'cancle' : 'a[data-name="cancle"]'
		}
		,events : function(){
			var events = {};
			events['click ' + this.ui.sure] = "_sendMessage";
			return events;
		}
		,onRender : function(){
			var self = this;
			var sm = new SimpleModel({"btn_ok":"Confirm button"});
      		sm.addButton("Action button", "btn primary", function(){
        		alert("Add your code");
        		this.hide();
      		});
      		sm.addButton("Cancel", "btn");
     		sm.show({
        		"model":"modal",
       			"title":"Title",
        		"contents":"Your message..."
      		});
		}
		,_sendMessage : function(){

			window.iTalentSDK.sendMessage({
				publishEvent : "save",
				data : {
					id : 'test',
					name : 'test'
				}
			})
		}
		,_regiseriTalentSDK : function(){
			
		}
		,onShow : function() {

		}
		
	});

	return Talent.BasePageView.extend({
		mainViewClass : MainView
		 ,layout:'empty-layout'
		,pageTitle: 'pop'
	});
});
