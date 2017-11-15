define(['talent'
	,'templates/common'
],function(Talent
	,jst
) {
	return Talent.ItemView.extend({
		template: jst['common/common-cmp/common-btns']
		,initialize:function(options){
			this.model = new Talent.Model(options);
		}
		,ui:{
			bnRipple:".bg-ripple"
		}
		,events:function(){
			var events = {};
			events['click ' + this.ui.bnRipple] = 'bnRipple';
			return events;
		}
		,bnRipple:function(e){
			var node = $(e.target);
			
			node.removeClass("bg-ripple-active");

			var targetNodePosition = node.offset();

			var mouseLeft = e.clientX;
			var mouseTop = e.clientY;
			
			var realLeft = mouseLeft - targetNodePosition.left;
			var realTop = mouseTop - targetNodePosition.top;

			node.find(".ripple").css({"left":realLeft,"top":realTop})

			$(e.target).addClass("bg-ripple-active");			
		}
	});
});
