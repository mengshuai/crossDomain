define(['talent'
	,'templates/list'
	,'views/list/demo-composite-view'
	,'views/common/page-regions/sidebar-view'
],function(Talent
	,jst
	,DemoCompositeView
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
		template: jst['list/index-page']
		,regions : {
			'list' : 'div[data-name="demo-list"]'
		}
		,initialize: function() {
			// Talent.app.request('')

			
		}
		,ui:{
			
		}
		,onRender : function(){
			var self = this;
			var models = [{id:1,name:"yanna.wei"},{id:2,name:"weiyanna"}];
			this.demoCompositeView = new DemoCompositeView({
				collection : new Talent.Collection(models)
			});
			this.list.show(this.demoCompositeView);

		}
		,onShow : function() {

		}
		
	});

	return Talent.BasePageView.extend({
		mainViewClass : MainView
		 ,layout:'empty-layout'
		,pageTitle: 'list'
	});
});
