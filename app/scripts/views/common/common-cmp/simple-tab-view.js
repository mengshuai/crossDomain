define(['talent'
    ,'templates/common'
],function(Talent
    ,jst
) {
    return Talent.ItemView.extend({
        template: jst['common/common-cmp/simple-tab']
        ,initialize: function(options){
            this.model = new Talent.Model(options);
        }  
        ,ui:{
            'simpleTabChange': '.stab-item'
        }
        ,events:function(){
            var events = {};
            events['click ' + this.ui.simpleTabChange] = 'simpleTabChange';
            return events;
        }
        ,simpleTabChange:function(e){
            var self = this;
            if ($(e.target).hasClass("stab-active")) {
                return;
            }
            $(e.target).parent().children(".stab-active").removeClass("stab-active").addClass("stab-normal");
            $(e.target).removeClass("stab-normal");
            $(e.target).addClass("stab-active");
        }
    });
});
