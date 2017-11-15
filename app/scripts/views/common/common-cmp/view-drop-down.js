/*
   用于页面头部视图切换的下拉菜单
*/

define(['talent'
    ,'templates/common'
],function(Talent
    ,jst
) {
    return Talent.ItemView.extend({
        template: jst['common/common-cmp/view-drop-down']
        ,className:"view-drop-down"
        ,initialize: function(options){
            this.model = new Talent.Model(options);
        }
        ,ui:{
          'dropDownBtn': '.drop-down-btn'
          ,'dropDownListItem': '.drop-list-real ul li'
          ,'dropDownListBgSlide': '.drop-list-real ul .bgslide'
          ,"dropDownList":".drop-list-real"
          ,"dropDownListSd":".drop-list-shadow"
        }
        ,events:function(){
            var events = {};
              events['click ' + this.ui.dropDownBtn] = 'slideDown';
              events['mouseover ' + this.ui.dropDownListItem] = 'bgSlideGo';
              events['click ' + this.ui.dropDownListItem] = 'itemSelect';
            return events;
        }
        ,slideDown:function(e){
            var self = this;
            this.ui.dropDownList.addClass("list-real-spread");
            this.ui.dropDownListSd.addClass("list-shadow-spread");

            Talent.$(document).off('mouseup.event-layer');

            Talent.$(document).on('mouseup.event-layer', function(e) {
              //如果当前点击下拉菜单项，则不移除shadow层的样式
              if(!$(e.target).attr("isListItem")){
                self.ui.dropDownListSd.removeClass("list-shadow-spread");
              }
              self.ui.dropDownList.removeClass("list-real-spread");
              Talent.$(document).off('mouseup.event-layer');
            });
        }
        ,bgSlideGo:function(e){
          this.ui.dropDownListBgSlide.css({top:parseInt($(e.target).attr("index")*40)});
        }
        ,itemSelect:function(e){         
          var self  = this;
          var itemIndex = $(e.target).attr("index");
          self.ui.dropDownBtn.html($(e.target).html());

          $(this.ui.dropDownListSd.find("ul li")[itemIndex]).css({opacity:1,"transform":"scale(1.5)"}).animate({opacity:0},300,function(){
            $(this).css({"transform":"scale(1)"});
          });
        }
    });
});
