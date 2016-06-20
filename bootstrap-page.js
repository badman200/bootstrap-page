(function($){
	var table_count="1";
	$.page=function(option){
		this.table_index=table_count;
		table_count++;
		this.table_id=option.table;
		this.url=option.url;
		this.start=0;
		this.pagesize=10;
		this.totle=0;
		//列回调
		if(null!=option.column){
			this.column=option.column;
		}else{this.column={}};
		if(null!=option.param){
			this.param=option.param;
		}else{this.param={}};
		this.head=option.head;
		this.addHeadFoot();
		this.getData();
	};
	$.extend($.page.prototype,{
		searchData:function(){
			this.start=0;
			this.getData();
		},
		getData:function (){
			var head=this.head;
			var table_id=this.table_id;
			var data=this.clone(this.param);
			var column=this.column;
			var table_index=this.table_index;
			for(var key in data){
				data[key]=$("#"+data[key]).val();
			}
			data['start']=this.start;
	    	data['pagesize']=this.pagesize;
	    	var j_count=0;
			for(var key in head){
				j_count++;
			}
	    	$.ajax({
		        type: "POST",
		        url: this.url,
		        data:data,
		        dataType: "json",
		        beforeSend: function() {
		        	//console.log("开始发送");
		        	$("#table_load_"+table_index).show();
		        },
		        success: function(result) {
		        	$("#table_load_"+table_index).fadeOut(500);
		        	if(result.data){
		        		var str="";
		        		for(var i=0;i<result.data.length;i++){
		        			str+="<tr>";
		        			var count=0;
		        			for(var key in head){
		        				if(key!="null"){
		        					if(column[count]){
		        						var method=column[count];
		        						str+="<td>"+method(result.data[i])+"</td>";
		        					}else{
		        						str+="<td>"+result.data[i][key]+"</td>";
		        					}
		        				}else{
		        					str+="<td>";
		        					if(column[count]){
		        						var method=column[count];
		        						str+=method(result.data[i]);
		        					}
		        					str+="</td>";
		        				}
		        				count++;
		        			}
		        			str+="</tr>";
		        		}
		        		if(result.data.length==0){
		        			str+="<tr><td colspan='"+j_count+"' style='text-align:center'>无数据</td></tr>";
		        		}
			        	$("#"+table_id).find("tbody").empty().append(str);
			        	eval(table_id+".changeData("+result.totle+")");
		        	} 
		        },
		        error: function() {
		        	alert("连接异常")
		        }
		    });
		},
		addHeadFoot:function(){
			var head=this.head;
			var str="<thead><tr>";
			for(var key in head){
				str+="<td>"+head[key]+"</td>";
			}
			str+="</tr></thead>";
			str+="<tbody></tbody>";
			str+="<tfoot><tr><td colspan='8'>"+
			"<div class='col-md-6 col-sm-3' style='text-align: left;'>"+
			"<div class='btn-group dropup'>"+
			 " <button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>"+
			  "  每页<span id='table_pagesize_"+this.table_index+"'>10</span>行 <span class='caret'></span></button>"+
			 " <ul class='dropdown-menu'>"+
			   " <li class='active'><a onclick='"+this.table_id+".changePageSize(10,this)'>每页10行</a></li>"+
			   " <li><a onclick='"+this.table_id+".changePageSize(20,this)'>每页20行</a></li>"+
			   " <li><a onclick='"+this.table_id+".changePageSize(50,this)'>每页50行</a></li>"+
			    "<li><a onclick='"+this.table_id+".changePageSize(100,this)'>每页100行</a></li>"+
			    "<li><a onclick='"+this.table_id+".changePageSize(200,this)'>每页200行</a></li>"+
			  "</ul></div></div>"+
		"<div class='col-md-6 col-sm-9' style='text-align: right;'><nav>"+
			"<span class='text-muted' style='height:34px;line-height: 34px;float: left;'>共<span id='table_totle_"+this.table_index+"'>0</span>条  <span id='table_currpage_"+this.table_index+"'>1</span>/<span id='table_totlepage_"+this.table_index+"'>1</span>页 <span style='width:16px;display:inline-block'><img id='table_load_"+this.table_index+"' src=\"\"/></span></span>"+
			"  <ul class='pagination' style='margin: 0px;'>"+
			  " <li><a href='javascript:"+this.table_id+".firstPage()' aria-label='Previous'>首页</a></li>"+
			   " <li><a href='javascript:"+this.table_id+".previouPage()'>上一页</a></li>"+
			   " <li><a href='javascript:"+this.table_id+".nextPage()'>下一页</a></li>"+
			    "<li><a href='javascript:"+this.table_id+".lastPage()' aria-label='Next'>末页</a></li></ul>"+
			"</nav></div></td></tr></tfoot>";
			$("#"+this.table_id).append(str);
			$("#table_load_"+this.table_index).attr("src","data:image/gif;base64,R0lGODlhEAAQALMPAHp6evf394qKiry8vJOTk83NzYKCgubm5t7e3qysrMXFxe7u7pubm7S0tKOjo////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCAAPACwAAAAAEAAQAAAETPDJSau9NRDAgWxDYGmdZADCkQnlU7CCOA3oNgXsQG2FRhUAAoWDIU6MGeSDR0m4ghRa7JjIUXCogqQzpRxYhi2HILsOGuJxGcNuTyIAIfkECQgADwAsAAAAABAAEAAABGLwSXmMmjhLAQjSWDAYQHmAz8GVQPIESxZwggIYS0AIATYAvAdh8OIQJwRAQbJkdjAlUCA6KfU0VEmyGWgWnpNfcEAoAo6SmWtBUtCuk9gjwQKeQAeWYQAHIZICKBoKBncTEQAh+QQJCAAPACwAAAAAEAAQAAAEWvDJORejGCtQsgwDAQAGGWSHMK7jgAWq0CGj0VEDIJxPnvAU0a13eAQKrsnI81gqAZ6AUzIonA7JRwFAyAQSgCQsjCmUAIhjDEhlrQTFV+lMGLApWwUzw1jsIwAh+QQJCAAPACwAAAAAEAAQAAAETvDJSau9L4QaBgEAMWgEQh0CqALCZ0pBKhRSkYLvM7Ab/OGThoE2+QExyAdiuexhVglKwdCgqKKTGGBgBc00Np7VcVsJDpVo5ydyJt/wCAAh+QQJCAAPACwAAAAAEAAQAAAEWvDJSau9OAwCABnBtQhdCQjHlQhFWJBCOKWPLAXk8KQIkCwWBcAgMDw4Q5CkgOwohCVCYTIwdAgPolVhWSQAiN1jcLLVQrQbrBV4EcySA8l0Alo0yA8cw+9TIgAh+QQFCAAPACwAAAAAEAAQAAAEWvDJSau9WA4AyAhWMChPwXHCQRUGYARgKQBCzJxAQgXzIC2KFkc1MREoHMTAhwQ0Y5oBgkMhAAqUw8mgWGho0EcCx5DwaAUQrGXATg6zE7bwCQ2sAGZmz7dEAAA7");
		},
	   changePageSize:function(size,obj){
		   $("#table_pagesize_"+this.table_index).text(size);
			$(obj).parent().parent().find("li").removeClass("active");
			$(obj).parent().addClass("active");
	   		this.pagesize=size;
	   		this.start=0;
	   		this.getData();
	   },
	   nextPage:function(){
		   var curr=Math.floor(this.start/this.pagesize)+1;
		   var totlepage=Math.floor((this.totle + this.pagesize -1) / this.pagesize);
		   if(curr!=totlepage){
			   this.start+=this.pagesize;
			   this.getData();
		   }
	   },
	   firstPage:function(){
	   		if(this.start!=0){
		   		this.start=0;
		   		this.getData();
	   		}
	   },
	   lastPage:function(){
	   		if(this.start+this.pagesize<this.totle){
		   		this.start=Math.floor(this.totle/this.pagesize)*this.pagesize;
		   		this.getData();
	   		}
	   },
	   previouPage:function(){  
	   		if(this.start!=0){
	   			this.start-=this.pagesize;
	   			this.getData();
	   		}
	   },
	   changeData:function(totle){
		   	this.totle=totle;
		    $("#table_totle_"+this.table_index).text(totle);
       		$("#table_currpage_"+this.table_index).text(Math.floor(this.start/this.pagesize)+1);
       		$("#table_totlepage_"+this.table_index).text(Math.floor((this.totle + this.pagesize -1) / this.pagesize));  
	   },
	   clone:function(obj){
			function Clone(){}
			Clone.prototype = obj;
			var o = new Clone();
			for(var a in o){
				if(typeof o[a] == "object") {
					o[a] = clone3(o[a]);
				}
			}
			return o;
		}
    });
})(jQuery);
