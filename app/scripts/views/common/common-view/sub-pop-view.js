define(['talent'
	,'templates/common'

],function(Talent
	,jst
) {
	return Talent.Layout.extend({
		template: jst['common/common-view/sub-pop-page']
		,className:"sub-pop-window"
		,initialize:function(options){
			this.options = options;
		}
		,regions:{
			
		}
		,ui:{
			inputAni: '.form-input input'
			,cancle:".cancle"
			,confirm:".comfirm"
		}
		,events:function(){
			var events = {};
			events['focus ' + this.ui.inputAni] = 'inputAni';
			events['blur ' + this.ui.inputAni] = 'inputAni';

			events['click ' + this.ui.cancle] = 'subWindowClose';
			events['click ' + this.ui.confirm] = 'subWindowClose';
			return events;
		}
		,inputAni:function(e){
			$(e.target).parent('.form-input').toggleClass("form-input-active");
		}

		,onRender:function(){
			$('.pop-page-regin').append(this.$el);

			this.setStartPosition();
		}
		,onShow:function(){

		}
		,setStartPosition:function(){
			var self = this;
			var windowNode = $('.sub-pop-window');

			//一级弹窗后推
			setTimeout(function(){
				$('.super-pop-window').css("-webkit-transform", "translate(-160px,-30px) scale(0.75)");
			},300);


			
			//获得弹窗的最终位置
			var documentH = $(window).innerHeight();
			var documentW = $(window).innerWidth();
			var dialogH = windowNode.innerHeight();
			var dialogW = windowNode.innerWidth();
			
			var top = (documentH - dialogH) / 2;
			var left = (documentW - dialogW) / 2;


			//二级弹窗定位
			setTimeout(function(){
				//获得targetNode 的位置，并将弹窗定位在这里
				var mousePoint = self.options.target;
				var mouseX = mousePoint.offset().left,
					mouseY = mousePoint.offset().top;

				windowNode.css({"left":mouseX,"top":mouseY,"opacity":1});
			},700)
			
			setTimeout(function(){
				windowNode.css({"-webkit-transform":"scale(1)","left":left,"top":top});
			},1000)

		}
		,subWindowClose:function(){
			this.setStartPosition2();
		}
		,setStartPosition2:function(){
			var self = this;
			var windowNode = $('.sub-pop-window');

			//获得targetNode 的位置，并将弹窗定位在这里
			var mousePoint = this.options.target;
			var mouseX = mousePoint.offset().left,
				mouseY = mousePoint.offset().top;

			setTimeout(function(){
				windowNode.css({"-webkit-transform":"scale(0)","left":mouseX,"top":mouseY});
			},300)

			setTimeout(function(){
				$('.super-pop-window').css("-webkit-transform", "translate(0px,0px) scale(1)");
			},900)
		}

	});
});
