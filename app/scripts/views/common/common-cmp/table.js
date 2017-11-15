define(['talent'
  ,'templates/common'
],function(Talent
  ,jst
) {
  return Talent.ItemView.extend({
    template: jst['common/common-cmp/table']
    ,className:""
    ,initialize: function(){
      this.sortArray = ["sort-default","sort-up",'sort-down']
    }
    ,ui:{
      "tableSort":'thead tr th'
    }
    ,events:function(){
      var events = {};
      events['click ' + this.ui.tableSort] = 'tableSort';
      return events;
    }
    ,onShow:function(){

    }
    ,tableSort:function(e){
      var index = (parseInt($(e.target).attr("sortIndex")) + 1 ) % 3;
      $(e.target).removeClass().addClass(this.sortArray[index]).attr("sortIndex",index);
    }
  });
});







