var deviceType_info_html = "";
var funName,pageType,addUrl,updateUrl,deleteUrl,globalDid,globalCountPage,globalPageNow;
var typeName_title = "";

//获取设备类型列表
function deviceList() {
	$.ajax({
		type: "post",
		url: "/device/pageNew",
		async: false,
		success: function(msg) {
			if(msg.status == "9999") {
				alert(msg.info);
			}
			if(msg.status == "10000") {
				$(".special-btn").hide();
				$("#dtAdmin-pagesContainer").hide();
				$(".special-btn:eq(1),.special-btn:eq(2),.special-btn:eq(3),.special-btn:eq(4),.special-btn:eq(6)").show();
				funName = "deviceList";
				typeName_title = "类别";
				pageType = "1";
				addUrl = "/device/saveNew";
				updateUrl = "/device/updateNew";
				deviceType_info_html = '<tr><td><input type="checkbox" onclick="checkAll()" id="select-all"><label class="labelFC" for="select-all"></label></td>' +
					'<td><b>序号</b></td>' +
					'<td><b>类别名称</b></td>' +
					'<td><b>状态</b></td>' +
					'<td><b>创建时间</b></td>' +
					'<td><b>操作</b></td></tr>';
				$(".table.table-striped thead").html(deviceType_info_html);
				deviceType_info_html = "";
				for(var i = 0; i < msg.data.data.length; i++) {
					var tdStyle = '';
					var status = '正常';
					if(msg.data.data[i].status != 1) {
						status = "停用";
						tdStyle = ' style="color:red;"';
					}
					deviceType_info_html += '<tr>' +
						'<td><input type="checkbox" value="' + msg.data.data[i].devicename + '_' + msg.data.data[i].did +
						'" class="otherCBox" id="checkbox' + i + '">' +
						'<label class="labelFC" for="checkbox' + i + '"></label></td>' +
						'<td>' + msg.data.data[i].did + '</td>' +
						'<td>' + msg.data.data[i].devicename + '</td>' +
						'<td' + tdStyle + '>' + status + '</td>' +
						'<td>' + msg.data.data[i].ctime + '</td>' +
						'<td>' +
						'<a onclick="brandList(' + msg.data.data[i].did + ')">品牌列表</a> | ' +
						'<a onclick="attributeList(' + msg.data.data[i].did + ')">属性列表</a> | ' +
						'<a onclick="fixType(' + msg.data.data[i].did + ')">报修类型</a>' +
						'</td>' +
						'</tr>';
				}
				$(".table.table-striped tbody").html(deviceType_info_html);
			}
		},
		error: function() {
			alert("未知的错误发生了");
		}
	});
}
deviceList();
//全选或全不选
function checkAll() {
	$(".otherCBox").prop("checked", $("#select-all")[0].checked);
};

var modal_title = $('#modal-title');
var modal_body = $('#modal-body');
var modal_html = "";
//修改
function editItem() {
	if($(".otherCBox:checked").length == 1) {
		var inputSid = "";
		if(pageType == "4") {
			inputSid = '排序序号：<input type="text" id="sid" value="' + $(".otherCBox:checked").val().split('_')[2] + '" /><br /><br />'
		}
		modal_title.text("修改" + typeName_title);
		modal_html = '<div style="text-align: center;">' + typeName_title +
			'名称：<input type="text" id="typeName" value="' + $(".otherCBox:checked").val().split('_')[0] + '" /><br /><br />' + inputSid +
			'<button class="btn btn-primary" onclick="confirmToUpdate()">修改</button>' +
			'<button class="btn btn-default" data-dismiss="modal" style="margin-left:2rem">取消</button>' +
			'</div>';
		modal_body.html(modal_html);
		$('#primaryModal').modal();
	}
}

//确认修改
function confirmToUpdate() {
	var type_name = $("#typeName").val();
	if(type_name.length == 0) {
		alert("请输入" + typeName_title + "名称。");
		return false;
	}
	var data;
	switch(pageType) {
		case "1":
			data = {
				did: $(".otherCBox:checked").val().split('_')[1],
				devicename: type_name
			};
			break;

		case "4":
			if($("#sid").val().length == 0) {
				alert("请输入排序序号。");
				return false;
			}
			data = {
				drid: $(".otherCBox:checked").val().split('_')[1],
				did: globalDid,
				repairname: type_name,
				sid: $("#sid").val()
			};
			break;
	};
	$('#primaryModal').modal("hide");
	$.ajax({
		type: "post",
		url: updateUrl,
		async: false,
		data: data,
		success: function(msg) {
			alert(msg.info);
			reloadList();
		},
		error: function() {
			alert("未知的错误发生了。");
		}
	});
}

//禁用和启用
function banOrStarteItem(sta) {
	var checkedCBox = $(".otherCBox:checked");
	var ds = [];
	if(checkedCBox.length == 0 || !confirm("确认" + (sta == 0 ? "禁用？" : "启用？"))) {
		return false;
	}
	var data = {
		status: sta
	};
	for(var i = 0; i < checkedCBox.length; i++) {
		ds.push(checkedCBox[i].value.split('_')[1]);
	}

	switch(pageType) {
		case "1":
			data.dids = ds.join(",");
			break;

		case "2":
			data.dtids = ds.join(",");
			data.did = globalDid;
			break;

		case "3":
			data.dpids = ds.join(",");
			data.did = globalDid;
			break;

		case "4":
			data.drids = ds.join(",");
			data.did = globalDid;
			break;
	};
	$.ajax({
		type: "post",
		url: updateUrl,
		async: false,
		data: data,
		success: function(msg) {
			alert(msg.info);
			reloadList();
		},
		error: function() {
			alert("未知错误发生了。");
		}
	});
}

//添加
function addItem() {
	modal_title.text("添加" + typeName_title);
	modal_html = '<div style="text-align: center;">' + typeName_title +
		'名称：<input type="text" id="typeName"/><br /><br />' +
		'<button class="btn btn-primary" onclick="confirmToAdd()">添加</button>' +
		'<button class="btn btn-default" data-dismiss="modal" style="margin-left:2rem">取消</button>' +
		'</div>';
	modal_body.html(modal_html);
	$('#primaryModal').modal();
}

//确认添加
function confirmToAdd() {
	var type_name = $("#typeName").val();
	if(type_name.length == 0) {
		alert("请输入" + typeName_title + "名称。");
		return false;
	}
	var data = {};
	switch(pageType) {
		case "1":
			data.Devicename = type_name;
			break;

		case "2":
			data.did = globalDid;
			data.typename = type_name;
			break;

		case "3":
			data.did = globalDid;
			data.name = type_name;
			break;

		case "4":
			data.did = globalDid;
			data.repairname = type_name;
			break;
	}
	$('#primaryModal').modal("hide");
	$.ajax({
		type: "post",
		url: addUrl,
		async: false,
		data: data,
		success: function(msg) {
			alert(msg.info);
			reloadList();
		},
		error: function() {
			alert("未知的错误发生了。");
		}
	});
}

//删除
function deleteItem() {
	var checkedCBox = $(".otherCBox:checked");
	var ds = [];
	if(checkedCBox.length == 0 || !confirm("确认删除？")) {
		return false;
	}
	var data = {
		did: globalDid
	};
	for(var i = 0; i < checkedCBox.length; i++) {
		ds.push(checkedCBox[i].value.split('_')[1]);
	}
	switch(pageType) {
		case "2":
			data.dtids = ds.join(",");
			break;

		case "3":
			data.dpids = ds.join(",");
			break;

		case "4":
			data.drids = ds.join(",");
			break;
	}
	$.ajax({
		type: "post",
		url: deleteUrl,
		async: false,
		data: data,
		success: function(msg) {
			alert(msg.info);
			reloadList();
		},
		error: function() {
			alert("未知的错误发生了。");
		}
	});
}

//刷新缓存
function refreshList() {
	$.ajax({
		type: "post",
		url: "/device/reflashNew",
		async: false,
		success: function() {
			deviceList();
		}
	});
}

//刷新列表
function reloadList() {
	var fun = eval(funName);
	new fun(globalDid,globalPageNow);
}

//加载品牌列表
function brandList(did) {
	$.ajax({
		type: "post",
		url: "/dt/pageNew",
		async: false,
		data: {
			did: did
		},
		success: function(msg) {
			if(msg.status == "9999") {
				alert(msg.info);
			}
			if(msg.status == "10000") {
				$(".special-btn").hide();
				$("#dtAdmin-pagesContainer").hide();
				$(".special-btn:eq(0),.special-btn:eq(2),.special-btn:eq(3),.special-btn:eq(4),.special-btn:eq(5)").show();
				funName = "brandList";
				typeName_title = "品牌";
				pageType = "2";
				globalDid = did;
				addUrl = "/dt/saveNew";
				updateUrl = "/dt/updateNew";
				deleteUrl = "/dt/deleteNew";
				deviceType_info_html = '<tr><td><input type="checkbox"  onclick="checkAll()" id="select-all"><label class="labelFC" for="select-all"></label></td>' +
					'<td><b>序号</b></td>' +
					'<td><b>品牌名称</b></td>' +
					'<td><b>状态</b></td>' +
					'<td><b>创建时间</b></td>';
				$(".table.table-striped thead").html(deviceType_info_html);
				deviceType_info_html = "";
				for(var i = 0; i < msg.data.data.length; i++) {
					var tdStyle = '';
					var status = '正常';
					if(msg.data.data[i].status != 1) {
						status = "停用";
						tdStyle = ' style="color:red;"';
					}
					deviceType_info_html += '<tr>' +
						'<td><input type="checkbox" value="' + msg.data.data[i].typename + '_' + msg.data.data[i].dtid +
						'" class="otherCBox" id="checkbox' + i + '">' +
						'<label class="labelFC" for="checkbox' + i + '"></label></td>' +
						'<td>' + msg.data.data[i].dtid + '</td>' +
						'<td>' + msg.data.data[i].typename + '</td>' +
						'<td' + tdStyle + '>' + status + '</td>' +
						'<td>' + msg.data.data[i].ctime + '</td>' +
						'</tr>';
				}
				$(".table.table-striped tbody").html(deviceType_info_html);
			}
		},
		error: function() {
			alert("未知的错误发生了。");
		}
	});
}

//加载属性列表
function attributeList(did) {
	$.ajax({
		type: "post",
		url: "/dp/pageNew",
		async: false,
		data: {
			did: did
		},
		success: function(msg) {
			if(msg.status == "9999") {
				alert(msg.info);
			}
			if(msg.status == "10000") {
				$(".special-btn").hide();
				$("#dtAdmin-pagesContainer").hide();
				$(".special-btn:eq(0),.special-btn:eq(2),.special-btn:eq(3),.special-btn:eq(4),.special-btn:eq(5)").show();
				funName = "attributeList";
				typeName_title = "属性";
				pageType = "3";
				globalDid = did;
				addUrl = "/dp/saveNew";
				updateUrl = "/dp/updateNew";
				deleteUrl = "/dp/deleteNew";
				deviceType_info_html = '<tr><td><input type="checkbox"  onclick="checkAll()" id="select-all"><label class="labelFC" for="select-all"></label></td>' +
					'<td><b>序号</b></td>' +
					'<td><b>属性名称</b></td>' +
					'<td><b>状态</b></td>' +
					'<td><b>创建时间</b></td>';
				$(".table.table-striped thead").html(deviceType_info_html);
				deviceType_info_html = "";
				for(var i = 0; i < msg.data.data.length; i++) {
					var tdStyle = '';
					var status = '正常';
					if(msg.data.data[i].status != "1") {
						status = "停用";
						tdStyle = ' style="color:red;"';
					}
					deviceType_info_html += '<tr>' +
						'<td><input type="checkbox" value="' + did + '_' + msg.data.data[i].dpid +
						'" class="otherCBox" id="checkbox' + i + '">' +
						'<label class="labelFC" for="checkbox' + i + '"></label></td>' +
						'<td>' + msg.data.data[i].dpid + '</td>' +
						'<td>' + msg.data.data[i].name + '</td>' +
						'<td' + tdStyle + '>' + status + '</td>' +
						'<td>' + msg.data.data[i].ctime + '</td>' +
						'</tr>';
				}
				$(".table.table-striped tbody").html(deviceType_info_html);
			}
		},
		error: function() {
			alert("未知的错误发生了。");
		}
	});
}

//加载报修类别列表
function fixType(did,pageNow) {
	$.ajax({
		type: "post",
		url: "/dr/pageNew",
		async: false,
		data: {
			did: did,
			pageNow: pageNow
		},
		success: function(msg) {
			if(msg.status == "9999") {
				alert(msg.info);
			}
			if(msg.status == "10000") {
				//给列表加分页
				page({
					box: 'pages2', //存放分页的容器
					href: '#', //跳转连接
					page: msg.data.pageNow, //当前页码 
					count: msg.data.countPage, //总页数
					num: 5, //页面展示的页码个数
				});
				$(".special-btn").hide();
				$("#dtAdmin-pagesContainer").show();
				$(".special-btn:eq(0),.special-btn:eq(1),.special-btn:eq(2),.special-btn:eq(3),.special-btn:eq(4),.special-btn:eq(5)").show();
				funName = "fixType";
				typeName_title = "报修类别";
				pageType = "4";
				globalCountPage = msg.data.countPage;
				globalPageNow = msg.data.pageNow;
				globalDid = did;
				addUrl = "/dr/saveNew";
				updateUrl = "/dr/updateNew";
				deleteUrl = "/dr/deleteNew";
				deviceType_info_html = '<tr><td><input type="checkbox"  onclick="checkAll()" id="select-all"><label class="labelFC" for="select-all"></label></td>' +
					'<td><b>序号</b></td>' +
					'<td><b>报修类别名称</b></td>' +
					'<td><b>状态</b></td>' +
					'<td><b>创建时间</b></td>';
				$(".table.table-striped thead").html(deviceType_info_html);
				deviceType_info_html = "";
				for(var i = 0; i < msg.data.data.length; i++) {
					var tdStyle = '';
					var status = '正常';
					if(msg.data.data[i].status != "1") {
						status = "停用";
						tdStyle = ' style="color:red;"';
					}
					deviceType_info_html += '<tr>' +
						'<td><input type="checkbox" value="' + msg.data.data[i].repairname + '_' + msg.data.data[i].drid + '_' + msg.data.data[i].sid +
						'" class="otherCBox" id="checkbox' + i + '">' +
						'<label class="labelFC" for="checkbox' + i + '"></label></td>' +
						'<td>' + msg.data.data[i].sid + '</td>' +
						'<td>' + msg.data.data[i].repairname + '</td>' +
						'<td' + tdStyle + '>' + status + '</td>' +
						'<td>' + msg.data.data[i].ctime + '</td>' +
						'</tr>';
				}
				$(".table.table-striped tbody").html(deviceType_info_html);
			}
		},
		error: function() {
			alert("未知的错误发生了。");
		}
	});
}


//上一页
$("#pages2").on('click','.page-contain>a:first-child',function(){
	if(globalPageNow > 1){
		globalPageNow--;
		reloadList();
	}
});

//下一页
$("#pages2").on('click','.page-contain>a:last-child',function(){
	if(globalPageNow < globalCountPage){
		globalPageNow++;
		reloadList();
	}
});

//点击页码
$('#pages2').on('click', '.page-box>a', function(event) {
	var clickPage = event.target.href.split('#')[1];
	if(clickPage!=globalPageNow){
		globalPageNow = clickPage;
		reloadList();
	}
});

//输入页码
function jumpTo(){
	var inPage = $("#dtAdmin-input-page").val();
	if(inPage.length!=0){
		if(parseInt(inPage) > parseInt(globalCountPage)||inPage < 1){
			alert("不存在这一页");
			return false;
		}
		globalPageNow = inPage;
		reloadList();
	}
}