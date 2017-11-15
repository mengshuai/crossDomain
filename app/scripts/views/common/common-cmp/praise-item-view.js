define(['talent'
	,'templates/common'
],function(Talent
	,jst
) {
	return Talent.ItemView.extend({
		template: jst['common/common-cmp/praise-item']
		,ui:{
			'praise': '.praise .img'
		}
		,events:function(){
			var events = {};
			events['click ' + this.ui.praise] = 'praise';
			return events;
		}
		,praise:function(){
			this.ui.praise.toggleClass("img-praised");
		}
	});
});
