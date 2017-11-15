define(['talent'
	,'templates/common'
],function(Talent
	,jst
) {
	return Talent.ItemView.extend({
		template: jst['common/common-cmp/record-item']
		,ui:{
			// 'save': '.btn-wrap .save-btn'
			
		}
		,events:function(){
			var events = {};
			// events['click ' + this.ui.save] = 'save';
			return events;
		}
	});
});
