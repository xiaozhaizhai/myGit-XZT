var table;
var tableData;
var upload;
var paperData = [];
var ordertype =1;
var fid = $("#fid").val();
layui.use([ 'table', 'laytpl', 'upload', 'layer', 'laydate' ], function(){
	var form = layui.form; 
	table = layui.table;
	upload = layui.upload;
	var laydate = layui.laydate;
	var layer = layui.layer;
	  var $ = layui.$;	  
	   status =$("#status").val();
	   purcType = $("#purcType").val();	  
		var fid= $('#contOrdeNumb').val();
		var id= $('#fid').val();
		var orderStatus ='';
		$.ajax({
			  async: false, 
			  type:"post",
			  url:"/getMatesDataOfOrder?fid="+fid,
			  dataType:"JSON",
			  success:function(data){
				  initOrderTable(table, data);
			  }
		  });
	  debugger;
		$.ajax({
		  async: false, 
		  type:"post",
		  url:"/getPaperDataOfOrder?fid="+id,
		  dataType:"JSON",
		  success:function(data){
			  $.each(data,function(index,item){
				  paperData.push(item);
			  })
			  console.info(paperData);
			  initPaperTable(paperData);
		  }
	  });
	  if(status=='已发布'||status=='已回签'){
			debugger;
			  $('.Sub').hide();
			  $('.add').hide();
			  $('#publOrder').hide();
			  $('.layui-btn-danger').hide();
			  $('#goBack').show();
			  $('.redonl').attr('disabled','disabled');			 
			  $('.redonl1').attr('disabled','disabled');			
			  $('.deleta').css('display','none !important');
			  
		  }else{
			  $('.Sub').show();
			  $('.add').show();
			  $('#publOrder').show();
			  $('#fallBack').hide();
			  $('.deleta').show();			 
			  $('.deleta').css('display','none !important')
			  
		  }
	  if(status=='已回签'){
		  $('#fallBack').show();
		  $('#publOrder').hide();
		  $('#goBack').show();
		  $('#confirm').show();
	  }else if(status=='已退回'){
		  debugger;
		  $('#fallBack').hide();
		  $('#publOrder').hide();
		  $('.add').hide();
		  $('.deleta').hide();
		  $('#goBack').show();
		  $('#confirm').hide();
	  }else if(status=='已确认'){
		  $('.deleta').hide();
		  $('#publOrder').hide();
		  $('.add').hide();
		  $('#confirm').hide();
		  $('.redonl1').attr('disabled','disabled');
		  $('.redonl').attr('disabled','disabled');
	  }else{
		  $('#confirm').hide();
	  }
	  //返回
		$("#goBack").click(function() {
			//window.history.back(-1);
			tuoBack('.PurchaseDetail','#serachSupp')
		});
	  //采购员发布
		$("#publOrder").click(function() {
			debugger;
			 var fid = $("#fid").val();
			 var mainId = $('#mainId').val();
			 var remarks = $('.help').val();
			 var limitThan = $('#limitThan').val();
			 if(limitThan == '' || limitThan == undefined || limitThan == null){
				 parent.layer.msg("请填写下单限比！", {
						time : 2000
					});
				 return;
			 }
			 if(isNaN(limitThan)){//不是数字
				 parent.layer.msg("下单限比必须是数字！", {
						time : 2000
					});
				 return;
			 }else{//是数字
				 var float = parseFloat(limitThan);
				 var a = parseFloat(0);
				 var b = parseFloat(100);
				 if(float<a || float>b){
					 parent.layer.msg("请填写下单限比为0-100的数字！", {
							time : 2000
						});
					return; 
				 }
				 limitThan = float.toFixed(2);
			 }
			 //$('.Type').val('已发布');
			 $('.Type').val('未发布');
			var paperTableData = $('#orderEncl').bootstrapTable("getData");
			var enclLength=paperTableData.length;
//			if(paperTableData.length==0){
//				parent.layer.msg("请添加附件！", {
//					time : 2000
//				});
//				return;
//				
//			}
			var papData =[];
			$.each(paperTableData,function(index,item){
				papData.push(item);
			});
		    var paperDataJson =  JSON.stringify(papData);
		    ordertype='2';
		    if(ordertype=='2'){
		    	var suppName = $("#suppAbbre").val();
		    	//var format = new Date().Format("yyyy-MM-dd");
		    	var remark = "采购订单审核: " + suppName ;
		    	orderStatus = '已发布';
				//var flag = taskProcess(fid,"orderAudit", remark,"process");
				//if (flag == "process_success") {
					var Purchase ='Purchase';
					$.ajax({
						type : "POST",
						url : "/updateLatentOrderBySuppId?fid="+fid+"&type="+Purchase+"&remarks="+remarks+"&enclLength="+enclLength+"&limitThan="+limitThan,
						data : {paperJson: paperDataJson},// 你的form的id属性值
						async : false,
						error : function(request) {
							parent.layer.msg("程序出错了！", {
								time : 2000
							});
						}
						
					});
					var flag = taskProcess(fid,"orderAudit", remark,"process");
					/*parent.layer.msg("发布成功", {
						time : 2000
					});*/
					//setTimeout('window.history.back(-1);',1000);
				//}
		    }else{
		    	
		    	parent.layer.msg("请上传附件", {
					time : 2000
				});
		    }
		    ordertype=1;
			 //指定允许上传的文件类型
//			upload.render({
//			   elem: '#addFile'
//			   ,url: '/doc/docUpload?direCode='+'HTGL'+'&linkNo='+mainId+"&attachType="+bam_cont_temp
//			   ,accept: 'file' //普通文件
//			   ,done: function(res){
//			      if(res.code=='0'){
//			    	  $('#orderEncl').bootstrapTable("append",res.data[0]); 
//			      }
//			    }
//			 });

		});
		//在弹窗中选择执行人后，点击确认按钮回调
		   window.returnFunction = function() {
				debugger
				$.ajax({
						type:"post",
						url:"/updateOrderStatusByfid?status="+orderStatus +
								"&fid="+id,
						dataType:"JSON",
						success:function(data2){
							if(data2){
								layer.msg('提交成功', {time:2000 });
								tuoBack('.PurchaseDetail','#serachSupp');
							}else{
								layer.alert('<span style="color:red;">提交失败</sapn>');
							}
						}
				});
			}	
	//采购员回退
	$('#fallBack').click(function(){
		debugger;
		var fid = $("#fid").val();
		$('.Type').val('已退回');
		var result = backProcess(fid);
		if(result=="back_success"){
			$.ajax({
				async: false, 
				type:"post",
				url:"/setPaperDataFallback?fid="+fid,
				dataType:"JSON",
				success:function(msg){
					debugger;
					layer.msg("回退成功！", {
						time : 1000
					});
					setTimeout("tuoBack('.PurchaseDetail','#serachSupp')",1000);
				}
			
			});
		}
	})	
	//采购员确认
	$('#confirm').click(function(){
		var limitThan = $('#limitThan').val();
		 if(limitThan == '' || limitThan == undefined || limitThan == null){
			 parent.layer.msg("请填写下单限比！", {
					time : 2000
				});
			 return;
		 }
		 if(isNaN(limitThan)){//不是数字
			 parent.layer.msg("下单限比必须是数字！", {
					time : 2000
				});
			 return;
		 }else{//是数字
			 var float = parseFloat(limitThan);
			 var a = parseFloat(0);
			 var b = parseFloat(100);
			 if(float<a || float>b){
				 parent.layer.msg("请填写下单限比为0-100的数字！", {
						time : 2000
					});
				return; 
			 }
			 limitThan = float.toFixed(2);
		 }
		var fid = $("#fid").val();
		$('.Type').val('已确认');
		orderStatus="已确认"
		var suppName = $("#suppAbbre").val();
    	//var format = new Date().Format("yyyy-MM-dd");
    	var remark = "采购订单审核: " + suppName;
		var flag = taskProcess(fid,"orderAudit", remark,"process");
		if (flag == "over_success") {
			$.ajax({
				async: false, 
				type:"post",
				url:"/setPaperDataConfirm?fid="+fid+"&limitThan="+limitThan,
				dataType:"JSON",
				success:function(msg){
					debugger;
					setTimeout("")
					layer.msg("确认成功！", {
						time : 1000
					});
					setTimeout("tuoBack('.PurchaseDetail','#serachSupp')",1000);
				}
			
			});
		}  
	})
	//显示附件弹出框
	$('#addEncl').click(function(){
		debugger;	
		$('.btn-primary').show();
	})
	$("#saveLimitThan").click(function(){
		var limitThan = $('#limitThan').val();
		 if(limitThan == '' || limitThan == undefined || limitThan == null){
			 parent.layer.msg("请填写下单限比！", {
					time : 2000
				});
			 return;
		 }
		 if(isNaN(limitThan)){//不是数字
			 parent.layer.msg("下单限比必须是数字！", {
					time : 2000
				});
			 return;
		 }else{//是数字
			 var float = parseFloat(limitThan);
			 var a = parseFloat(0);
			 var b = parseFloat(100);
			 if(float<a || float>b){
				 parent.layer.msg("请填写下单限比为0-100的数字！", {
						time : 2000
					});
				return; 
			 }
			 limitThan = float.toFixed(2);
		 }
		 var fid = $("#fid").val();
		 $.ajax({
				type:"post",
				url:"/updateLimitThanOfOrderByFid?fid="+fid+"&limitThan="+limitThan,
				dataType:"JSON",
				success:function(data){
					if(data){
						layer.msg("修改成功！", {
							time : 1000
						});
					}else{
						layer.msg("修改失败！", {
							time : 1000
						});
					}
				}
			
			});
		 
	}); 
});
function htload(){
	if(status=='已发布'){
		debugger;
		  $('.publOrder').hide();
		  $('.add').hide();
		  $('.layui-btn-danger').hide();
		  $('.redonl').attr('disabled','disabled');		 
		  $('.redonl1').attr('disabled','disabled');		
		  $('.deleta').css('display','none !important')
	 }else{
		  $('.publOrder').show();
		  $('.add').show();
		  $('.deleta').show();		
		  $('.deleta').css('display','none !important')
	  }
}
//订单字表数据
function initOrderTable(table, data){
	var mone=0 ;
	var taxAmou=0;
	for(var i=0;i<data.length;i++){
		mone+=parseFloat(data[i].mone)
		taxAmou+=parseFloat(data[i].taxAmou)
	}
	//小计
	var moneFixed=mone.toFixed(2);
	//合计
	var taxAmouFixed=taxAmou.toFixed(2);
	//税额
	var tax= numSub(taxAmouFixed,moneFixed);
	$('.Mone').val(moneFixed);
	$('.TaxMone').val(taxAmouFixed);
	$('.tax').val(tax);
	table.render({
		  elem:"#orderTable",
		  data:data,
		  page:true,
		  width: '100%',
		  minHeight:'20px',
		  limit:10,
		  id:"orderTableId",
		  cols:[[
		     {type: 'numbers',title:'序号'},
		     {field:'frequency',title:'项次', align:'center',width:60},
		     {field:'mateNumb',title:'料号', align:'center',width:150},
		     {field:'prodName', title:'品名',align:'center',width:150},
		     {field:'suppRange', title:'供应商子范围编码',align:'center',width:113},
		     {field:'suppRangeDesc', title:'供应商子范围描述',align:'center',width:150},
		     {field:'boxEntrNumb',title:'箱入数',align:'center', width:60,},
		     {field:'purcQuan',title:'采购数量', align:'center',width:60},
		     {field:'quanMate', title:'已交数量',align:'center',width:60},
		     {field:'unpaQuan', title:'未交数量',align:'center',width:60},
		     {field:'company',title:'单位', align:'center',width:50},
		     {field: 'mateTex', title:'含税单价',width:100, align:'center'},
		     {field: 'taxAmou', title:'含税金额',width:60, align:'center'},
		     {field: 'mone', title:'不含税金额',width:100, align:'center'},
		  ]]
	  })
}


//模板表格初始化
function initPaperTable(data) {
	$('#orderEncl') .bootstrapTable( {
		method : 'get',
		editable : true,// 关闭编辑模式
		undefinedText : '',
		pageList : [ 10, 20 ],
		pageSize : 10,
		pageNumber : 1,
		striped : true,
		locale : 'zh-CN',
		columns : [
				{
				   title: '序号',//标题  可不加  
	               formatter: function (value, row, index) {  
	                    return index+1;  
	               }
				},
				{
					field : "appeType",
					title : "附件类型",
					align : "center",
					
				},
				{
					field : "appeName",
					title : "名称",
					align : "center"
				},
				{
					field : "appeFile",
					title : "附件",
					edit : false,
					align : "center"
				},
				{
					field : "newName",
					title : "newName",
					align : "center",
					visible : false,
					edit : false
				},
				{
					field : "fileUrl",
					title : "fileUrl",
					align : "center",
					visible : false,
					edit : false
				},
				{
					field : 'fileId',
					title : "fileId",
					align : 'center',
					visible : false,
					edit : false,
				},
				{
					field : 'status',
					title : '附件 操作',
					align : "center",
					formatter : function(value, row, index) {
						var editStr = '<a class="layui-btn layui-btn-sm " onclick="downLoadFile(\''
								+ row.fileId
								+ '\') " style="margin-left:10px !important;background:none;color:green;">下载</a>'
								+ '<a class="layui-btn layui-btn-sm layui-btn-danger deleta" id="deleta" style="background:none;color:red"onclick="deleteFile(\''
								+ row.fileId + '\') ">删除</a>';
						return editStr;
					}
				} ],
		data : data
	});
}

//弹出层的确认按钮,添加附件
function affirm() {
	var enclType= $('.enclType').val();
	var enclName= $('.enclName').val();
	var enclOn= $('.enclOn').val();
	debugger;
	if(enclType==undefined||enclType==''||enclName==undefined||enclName==''||enclOn==undefined||enclOn==''){
		$('.btn-primary').removeAttr('data-dismiss');
		parent.layer.msg("请填写附件相关信息", {
			time : 2000
		});
	}else{
		$('.btn-primary').hide();
		var appeType = $("#appeType").val();
		var appeName = $("#appeName").val();
		var orderNumb= $("#contOrdeNumb").val();
		var saveFormData = new FormData($('#paperForm')[0]);// 序列化表单，
		// $("form").serialize()只能序列化数据，不能序列化文件
		debugger;
		$.ajax({
			type : "POST",
			url : '/doc/docUpload?direCode=DDGL&linkNo='+orderNumb,
			data : saveFormData,// 你的form的id属性值
			processData : false,
			contentType : false,
			async : false,
			error : function(request) {
				parent.layer.msg("程序出错了！", {
					time : 2000
				});
			},
			success : function(res) {
				debugger;
				if(res.msg=='上传失败'){
					parent.layer.msg("上传失败", {
						time : 2000
					});
				}
				if (res.code == '0') {
					// 文件上传成功
					console.info(res.data)
					var index = $('#papertable').bootstrapTable('getData').length;
					var object = new Object();
					object.appeType = appeType;
					object.appeName = appeName;
					object.appeFile = res.data[0].realName;
					object.newName = res.data[0].fileName;
					object.fileUrl = res.data[0].fileUrl;
					object.fileId = res.data[0].id;
					paperData.push(object);
					$('#orderEncl').bootstrapTable("load", paperData);
					parent.layer.msg("添加附件成功", {
						time : 2000
					});
				}

			}
		});
		$('.btn-primary').attr('data-dismiss','modal');	
		ordertype=2;
	}
	
}

//文件下载
function downLoadFile(docId) {
	window.location.href = "/doc/downLoadDoc?docId=" + docId
}

//删除附件(包括文件服务上的文件)
function deleteFile(docId) {
	var docIds = [];
	docIds.push(docId);
	$.ajax({
		type : 'post',
		url : "/deletePaperFileOfOrder",
		data : {
			jsonStr : JSON.stringify(docIds)
		},
		success : function(msg) {
			if (msg.code == '0') {
				$('#orderEncl').bootstrapTable('remove', {
					field : 'fileId',
					values : docIds
				});
				layer.msg("删除成功！", {
					time : 1000
				});
				 $.ajax({
					  type:"post",
					  url:"/setDeleteEncl?docId="+docId,
					  dataType:"JSON",
					  success:function(data){
						 
						  
					  }
				  });
			} else {
				layer.msg("删除失败！", {
					time : 1000
				});
			}
		},
		error : function() {
			layer.msg("程序出错了！", {
				time : 1000
			});
		}
	});
}
//计算减法
function numSub(num1, num2) {
	var baseNum, baseNum1, baseNum2;
	var precision;// 精度
	try {
	    baseNum1 = num1.toString().split(".")[1].length;
	} catch (e) {
	    baseNum1 = 0;
	}
	try {
	    baseNum2 = num2.toString().split(".")[1].length;
	} catch (e) {
	    baseNum2 = 0;
	}
	baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
	precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
	return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
};



