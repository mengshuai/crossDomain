define(['talent'
	,'templates/common'
	,'views/common/common-cmp/common-btns-view'
],function(Talent
	,jst
	,Btns
) {
	return Talent.Layout.extend({
		template: jst['common/common-cmp/common-pop']
		,className:"pop-page-regin"
		,initialize:function(options){
			this.options = options;
			this.model = new Talent.Model(options.titleInfo);
		}
		,regions:{
			contentRegion:'.window-content'

			,cancleBtn:".super-pop-window .footer-cancle-btn"
			,confirmBtn:".super-pop-window .footer-comfirm-btn"
		}
		,ui:{
			cancleBnt: '.super-pop-window .cancle'
			,closeBtn:".super-pop-window .window-close-btn"
			//暂时使用热点
			// ,'test':".comfirm"
		}
		,events:function(){
			var events = {};
			events['click ' + this.ui.cancleBnt] = 'windowClose';
			events['click ' + this.ui.closeBtn] = 'windowClose';
			// events['click ' + this.ui.test] = 'superWindowGoBack';
			return events;
		}

		,onShow:function(){
			this.setWindowPosition();
		}
		,onRender:function(){
			$('body').append(this.$el);
			this.setBgBlur(true);
			this.contentShow();
			this.footerBtnShow();

			this.dialog = $('.pop-page-regin .pop-window');
		}
		//设置背景滤镜
		,setBgBlur:function(flag){
			var opr = flag?"addClass":'removeClass';
			$("#header-region")[opr]("go-blue");
			$("#content-wrapper")[opr]("go-blue");
		}
		//渲染内容部分
		,contentShow:function(view){
			this.contentRegion.show(this.options.contentView);
		}
		//渲染底部按钮
		,footerBtnShow:function(){
			this.cancleBtn.show(new Btns({btnType:"large-btn",btnArry:[{title:"确定",className:"cancle"}]}));
			this.confirmBtn.show(new Btns({btnType:"large-btn",btnArry:[{title:"取消",className:"cancle"}]}));
		}
		,setWindowPosition:function(){
			var documentH = $(window).innerHeight();
			var dialogH = this.dialog.innerHeight();
			var top = (documentH - dialogH) / 2;
			this.dialog.css({"top":top})
		}
		//关闭按钮
		,windowClose:function(){
			$("body").find(".pop-page-regin").animate({"top":-800,opacity:0},300,function(){$(this).remove();});
			this.setBgBlur(false);
		}
		//当展现二级弹层时调用此动效
		// ,superWindowGoBack:function(){
			// this.dialog.css({"-webkit-transform":"translate3D(-100px,-30px)",top:50});
			
		// }

	});
});
