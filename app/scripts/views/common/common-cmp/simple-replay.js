define(['talent'
	,'templates/common'
],function(Talent
	,jst
) {
	return Talent.ItemView.extend({
		template: jst['common/common-cmp/simple-replay']
		,initialize: function(options){
			
		}
	});
});
