

define(['talent'
    ,'templates/common'
],function(Talent
    ,jst
) {
    return Talent.ItemView.extend({
        template: jst['common/common-cmp/arrow-drop-down']
        ,className:"arrow-drop-down"
        ,initialize: function(options){
          options.type = "text"
            this.model = new Talent.Model(options);
        }
        ,ui:{
            'dropDownArrow': '.drop-down-btn'
            ,'listItem': '.list-ul-box-front li'
            ,'listUl': '.list-ul-box-front'
            ,'listUlShadow': '.list-ul-box-shadow'
            ,'dropDownList' : '.drop-down-list'
        }
        ,events:function(){
            var events = {};
            events['click ' + this.ui.dropDownArrow] = 'arrowClick';
            events['click ' + this.ui.listItem] = 'itemClick';
            events['mouseover ' + this.ui.listItem] = 'itemHover';
            return events;
        }
        ,itemClick:function(e){
          var self = this;

          self.ui.listUlShadow.removeClass("list-ul-box-shadow-hide");

          var className = "item-" + $(e.target).attr('item-index');
          this.ui.listUlShadow.find("."+className).addClass("li-active");
          
          this.ui.listUl.css({"opacity":0});

          this.ui.dropDownArrow.find("span").html($(e.target).html());
          this.ui.dropDownArrow.removeClass("gray-bg");

          this.trigger("dropListChanged",{title:$(e.target).html()})

          setTimeout(function(){
            self.ui.listUlShadow.addClass("list-ul-box-shadow-hide").find("li").removeClass("li-active");
            self.ui.dropDownList.removeClass('arrow-drop-down-active');
          },800)
        }
        ,itemHover:function(e){
          var className = "item-hl-" + $(e.target).attr('item-index');
          this.ui.listUl.removeClass("item-hl-1 item-hl-2 item-hl-3 item-hl-4 item-hl-5" ).addClass(className);
        }

        ,arrowClick:function(){
          var self = this;
          self.ui.dropDownList.addClass('arrow-drop-down-active');
          self.ui.dropDownArrow.addClass("gray-bg");

          //注册销毁事件
          Talent.$(document).off('mouseup.alertList');

          Talent.$(document).on('mouseup.alertList', function(e) {
            if(!$(e.target).hasClass("list-item")){
              self.ui.listUlShadow.addClass("list-ul-box-shadow-hide");
              self.ui.dropDownList.removeClass('arrow-drop-down-active');
              self.ui.dropDownArrow.removeClass("gray-bg");

              self.ui.listUl.css({"opacity":1});
              Talent.$(document).off('mouseup.alertList');
            }
          });
      }
    });
});
