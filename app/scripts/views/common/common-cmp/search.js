define(['talent'
	,'templates/common'
],function(Talent
	,jst
) {
	return Talent.ItemView.extend({
		template: jst['common/common-cmp/search']
		,className:"search-conduct"
		,initialize: function(options){
			
		}
		,ui:{
			inputAni: '.form-input input'
			,placeholder:"span.placeholder"
		}
		,events:function(){
			var events = {};
			events['focus ' + this.ui.inputAni] = 'focusInputAni';
			events['blur ' + this.ui.inputAni] = 'blurInputAni';
			events['keyup ' + this.ui.inputAni] = 'valueCheck';
			return events;
		}
		,onShow:function(){

		}
		,focusInputAni:function(e){
			$(e.target).parent('.form-input').toggleClass("form-input-active");
		}
		,blurInputAni:function(e){
			$(e.target).parent('.form-input').toggleClass("form-input-active");
		}
		,valueCheck:function(e){
			var placeholder = ($(e.target).val() == "")?"搜索":"";
			this.ui.placeholder.html(placeholder);
		}
		,focusValCheck:function(e){

		}
	});
});



/*
	placehoder状态
		1.默认状态： 图标+文字居中
		2.激活状态： 图标+文字居左
		3.输入状态： 
			输入为空--> 图标+文字居左
			输入非空--> 图标 居左
		4.blur状态：
			输入为空--> 图标+文字居中
			输入非空--> 图标 居左
*/






