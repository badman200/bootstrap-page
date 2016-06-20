# bootstrap-page

基于jquery的bootstrap分页插件

用法

#html代码

```
'<table class="table table-bordered table-hover table-striped" id="table1"></table>'
```

#js代码

    var option={
	table:"table1",
	head:{id:"ID",meetingName:"年会名称",meetingTag:"标签",createTime:"创建时间",convertFile:"转换进度",fileCount:"预览地址","null":"操作"},
	url:app.base+'/listmeeting',
	column:{
		3:function(data){
			return new Date(data.createTime).format("yyyy-MM-dd hh:mm:ss");
		},
		4:function(data){
			return data.convertFile+"/"+data.fileCount;
		},
		5:function(data){
			if(data.convertFile==data.fileCount){
				var str="";
				for(var i=1;i<=data.fileCount;i++){
					var url=app.full_base+"/view?tag="+data.meetingTag+"&uid=comm&index="+i;
					str+="<a href="+url+" target=\"_blank\">"+url+"</a><br/>";
					
				}
				return str;
			}else{
				return "转换中...";
			}
		},
		6:function(data){
				var url="/updfileview?tag="+data.meetingTag;
				return "<a href=\"javascript:app.loadpage('"+url+"')\">更新文件</a>";
		}
	},
	param:{key:"keyword",group_id:"group_id"}
	};
	var table1=new $.page(option);
		function search(){
		table1.searchData();
	}
	function refresh(){
		table1.getData();
	}


