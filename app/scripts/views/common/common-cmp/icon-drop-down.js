/*
  组件类别：带有图标按钮的下拉菜单
  应用场景：首页
*/


define(['talent'
  ,'templates/common'
],function(Talent
  ,jst
) {
  return Talent.ItemView.extend({
    template: jst['common/common-cmp/drop-down-list']
    ,className:"icon-drop-down"
    ,initialize:function(options){
      this.model = new Talent.Model(options);
    }
    ,ui:{
      'listItem': '.list-ul-box-front li'
      ,"btnClick":".btn-for-events"
      ,'listUl': '.list-ul-box-front'
      ,'listUlShadow': '.list-ul-box-shadow'
    }
    ,events:function(){
      var events = {};
      events['click ' + this.ui.listItem] = 'itemClick';
      events['mouseover ' + this.ui.listItem] = 'itemHover';
      events['click ' + this.ui.btnClick] = 'listShow';
      return events;
    }
    //下来列表项单击
    ,itemClick:function(e){
      var self = this;

      self.ui.listUlShadow.removeClass("list-ul-box-shadow-hide");

      var className = "item-" + $(e.target).attr('item-index');
      this.ui.listUlShadow.find("."+className).addClass("li-active");
      
      this.ui.listUl.css({"opacity":0});
      
      setTimeout(function(){
        self.ui.listUlShadow.addClass("list-ul-box-shadow-hide").find("li").removeClass("li-active");
        self.$el.removeClass('icon-down-active');
      },800)
    }
    ,itemHover:function(e){
      var className = "item-hl-" + $(e.target).attr('item-index');
      this.ui.listUl.removeClass("item-hl-1 item-hl-2 item-hl-3 item-hl-4 item-hl-5" ).addClass(className);
    }

    //显示下拉菜单
    ,listShow:function(){
      var self = this;
      self.$el.addClass('icon-down-active');

      //注册销毁事件
      Talent.$(document).off('mouseup.alertList');

          Talent.$(document).on('mouseup.alertList', function(e) {
              if(!$(e.target).hasClass("list-item")){
                self.ui.listUlShadow.addClass("list-ul-box-shadow-hide");

                self.$el.removeClass('icon-down-active');
                self.ui.listUl.css({"opacity":1});
                Talent.$(document).off('mouseup.alertList');
              }
            });


    }
  });
});