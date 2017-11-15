define(['talent'
	,'templates/common'
],function(Talent
	,jst
) {

	return Talent.ItemView.extend({
		template: jst['common/common-cmp/selected-item']
		,className:"selected-item-wrap clearfix"
		,initialize:function(options){
			this.selectArray = options || [];
	
			this.model  = new Talent.Model({selectArray:[]});

			this.listenTo(this.model,"change",this.render);
		}
		,ui:{
			"delete":".item-del"
			,"clearAll":".clear-search-condition"
		}
		,events:function(){
			var events = {}
			events['click ' + this.ui.delete] = "itemDel";
			events['click ' + this.ui.clearAll] = "clearAll";
			return events;
		}
		,addItem:function(newData){
			this.selectArray.push(newData);
			var newArray = JSON.parse(JSON.stringify(this.selectArray));
			this.model.set("selectArray",newArray);
		}
		,itemDel:function(e){
			var currentModel = this.model.toJSON().selectArray;
			var newArray = JSON.parse(JSON.stringify(currentModel));
			var index = parseInt($(e.target).attr("index"));
			newArray.splice(index,1);
			this.model.set("selectArray",newArray);
		}
		,clearAll:function(){
			this.model.set("selectArray",[]);
			this.selectArray = [];
		}
	});
});
