define(['talent'
	,'templates/common'
],function(Talent
	,jst
) {
	return Talent.ItemView.extend({
		template: jst['common/common-cmp/share-item-head']
		,initialize: function(options){
			this.model = new Talent.Model(options); 
		}
		,ui:{
			'dropDownBtn': '.item-head .btns'
			,'dropDown': '.item-head .btns .dropdown'
		}
		,events:function(){
			var events = {};
			events['click ' + this.ui.dropDownBtn] = 'dropDownShow';
			return events;
		}
		,dropDownShow:function(){
			this.ui.dropDown.slideDown();
		}
		,onShow:function(){
			var self = this;
			$(window).on("click",function(e){
				if(!$(e.target).hasClass("btns")){
					self.ui.dropDown.slideUp();
				}
			})
		}

	});
});
