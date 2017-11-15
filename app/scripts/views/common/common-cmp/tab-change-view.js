define(['talent'
	,'templates/common'
],function(Talent
	,jst
) {
	return Talent.ItemView.extend({
		template: jst['common/common-cmp/tab-item']
		,initialize:function(options){
			this.model = new Talent.Model(options);
		}
		,ui:{
			'tabChange': '.tab-item'
		}
		,events:function(){
			var events = {};
			events['click ' + this.ui.tabChange] = 'tabChange';
			return events;
		}
		,tabChange:function(e){
			var node = $(e.target);
			var left = node.position().left;
			var width = node.outerWidth();
			var flag = $(node).attr("event-index");
			var preActive = this.$el.find(".current-tab").attr("event-index");;

			
			$(node).parent(".tab").find(".bottom-line").css({"left":left,"width":width});
			$(node).addClass("current-tab").siblings().removeClass("current-tab");
			this.trigger("tabChange",{event:flag,"preActive":preActive});
		}
	});
});
