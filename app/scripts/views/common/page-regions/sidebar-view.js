define(['talent', 'templates/common'],
	function(Talent, jst) {
	/**
	* Sidebar view class
	* @author nobody
	* @extends {Talent.Layout}
	* @class SidebarView
	*/
	return Talent.Layout.extend(
		/** @lends SidebarView.prototype */
	{
		template: jst['common/page-regions/sidebar']
		,className : 'normal-sidebar'
		,initialize:function(){
			
		}
		,ui: {
			'changeSwitch': "[data-name='changeSwitch']"
			,'menuItemOpr':".nav-li-fir"
			,"bgSlider":".item-bg-slider"
			,'menuWrapper':"#nav-ul-fir-wrapper"
		}
		,events: function () {
			var events = {};
			events['click ' + this.ui.changeSwitch] = 'layoutChanged';
			events['click ' + this.ui.menuItemOpr] = 'menuItemOpr';
			return events;
		}
		,onShow:function(){
			var self = this;
			//记录当前高亮的位置
			this.preItem = $(".nav-li-fir.active a:first-child");
			
			//自动调整菜单状态
			this.menuStateSet();
		}
		//宽窄导航切换
		,layoutChanged: function () {
			var self = this;
			//放置在切换显示状态时，展开菜单出现闪动
			var spreadList = this.ui.menuWrapper.find(".has-sub-list.active").find(".nav-ul-sec")
			spreadList.hide();
			setTimeout(function(){spreadList.show()},400);

			//切换显示状态
			$("#content-wrapper").toggleClass("content-wrapper-narrow").toggleClass("content-wrapper-extend");
		}
		,menuItemOpr:function(e){
			var self = this;
			var targetNode = $(e.target);
			var node = $(e.target).parent("li");
			var isHasChildren = node.attr("haschildren")?true:false;
			
			//如果节点不包含子导航
			if(!isHasChildren){
				// if()
				this.bgSliderGo(targetNode,node);
			}else{
				//如果当前菜单处于展开状态(宽屏)
				if(this.isSpreadPage()){
					if(this.isSpread(node)){
						//收起菜单
						this.menuClose(node);
					}
					//如果点击菜单处在收起状态
					else{
						this.menuSpread(node);
					}
				}
			}
		}
		,menuStateSet:function(){
			var self = this;
			//flag = true 代表宽屏 ,false 代表窄屏
			var flag = true;
			if($(window).width() <= 1000){
				this.layoutChanged();
				flag = !flag;
			}

			$(window).resize(function(){
				//当前处在大屏状态切尺寸小于1000  || 当前处在小瓶状态且尺寸大于1000
				if(($(window).width() <= 1000 && flag) || ($(window).width() > 1000 && !flag) ){
					self.layoutChanged();
					flag = !flag;
				}
			});
		}
		//滑块动效
		,bgSliderGo:function(targetNode,node){
			var self = this;
			//step1:获得滑块的运行端点位置
				var wraperPosition = this.ui.menuWrapper.offset().top;
				var startPostion = this.preItem.offset().top - wraperPosition;
				var endPostion = targetNode.offset().top - wraperPosition;
			//step2:设置滑块的初始位置
				this.resetHighLight();
				this.ui.bgSlider.css({"top":startPostion});
			//step3:显示滑块，重置滑块尺寸，当前高亮消失。
				this.ui.bgSlider.show();
				if(targetNode.attr('level') == 1){
					this.ui.bgSlider.css({"height":50})
				}else if(targetNode.attr('level') == 2){
					this.ui.bgSlider.css({"height":40})
				}
				this.preItem.parent("li").removeClass("active");
			//step4:执行滑块动画
				this.ui.bgSlider.animate({'top':endPostion},300,"swing",function(){
					//step5:滑块消失，新位置高亮出现
					self.ui.bgSlider.hide();
					node.addClass("active");
					if(!self.isSpreadPage()){
						self.ui.menuWrapper.removeClass("fake-active");
						console.log(node.parent())
						node.parent().parent(".has-sub-list").addClass("fake-active");
					}
				})
			//step6:更新item
			this.preItem = targetNode;
		}
		//判断当前屏幕状态
		,isSpreadPage:function(){
			if($("#content-wrapper").hasClass("content-wrapper-extend")){return true};
			return false;
		}
		//判断当前菜单是否处于展开状态
		,isSpread:function(node){
			if(node.hasClass("active")){return true;}
			return false;
		}
		//判断菜单是否具有高亮子菜单
		,hasHighLightChild:function(node){
			if(node.find(".nav-ul-sec .active").length){return true;}
			return false;
		}
		//判断但饭前是否含处于展开状态的菜单
		,hasSpreadMenu:function(){
			var spreadList = this.ui.menuWrapper.find(".has-sub-list.active") || [];
			if(spreadList.length){
				return spreadList;
			}
			return false;
		}
		//展开菜单
		,menuSpread:function(node){
			if(this.hasSpreadMenu()){
				this.menuClose(this.hasSpreadMenu());
			}
			if(this.hasHighLightChild(node)){
				this.convertHightLight(node);
			}
			node.addClass("active");
		}
		//收起菜单
		,menuClose:function(node){
			node.removeClass("active");
			node.removeClass("fake-active");
			if(this.hasHighLightChild(node)){
				this.convertHightLight(node);
			}
		}
		//高亮切换
		,convertHightLight:function(node){
			node.toggleClass("fake-active");
		}
		//是否具有收起的具有高亮二级导航的一级导航
		,resetHighLight:function(){
			this.ui.menuWrapper.find(".fake-active").removeClass("fake-active");
		}

	});
}
);