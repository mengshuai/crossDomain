define(['talent'
	,'templates/common'
	,'views/common/common-view/sub-pop-view'
],function(Talent
	,jst
	,SubPopView
) {
	return Talent.Layout.extend({
		template: jst['common/common-view/pop-content-table']
		,className:""
		,initialize:function(options){
			
		}
		,regions:{
			subPopRegion:".empty-node"
		}
		,ui:{
			inputAni: '.form-input input'
			,subPop:'.go-sub-pop'
		}
		,events:function(){
			var events = {};
			events['focus ' + this.ui.inputAni] = 'inputAni';
			events['blur ' + this.ui.inputAni] = 'inputAni';
			events['click ' + this.ui.subPop] = 'subPopPageShow';
			return events;
		}
		,inputAni:function(e){
			$(e.target).parent('.form-input').toggleClass("form-input-active");
		}
		,subPopPageShow:function(e){
			var subPopView = new SubPopView({target:$(e.target)});
			this.subPopRegion.show(subPopView);
		}

		,onShow:function(){
			
		}
	});
});
