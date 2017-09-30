//获取公司列表
function getCompany(msg) {
	var selectHtml = '<select class="my-control form-control" id="eAdmin-select-company">' +
		'<option value="">所属公司</option>';
	for(var i = 0; i < msg.data.companies.company.length; i++) {
		selectHtml += '<option value="' + msg.data.companies.company[i].company_id + '">' + msg.data.companies.company[i].company_name + '</option>';
	}
	selectHtml += '</select>';
	$("#eAdmin-select-company-container").html(selectHtml);
}

var deviceType_info_html = '';
var url = "";
var level = 1;
var funName, globalPageNow, globalCountPage, updateUrl, addUrl, globalUid, ePage;
/*funName用于保存加载列表的各方法的方法名，通过方法名调用本方法从而刷新当前查询条件下的列表。
 * globalPageNow用于保存各种列表的当前页码
 * globalCountPage用于保存各种列表的总页数
 * ePage用于保存维修员列表的页码，以便从下一级列表返回时能显示进入下一级时的页面
 */

//加载维修员列表
function getEngineerList(curPage) {
	var data = {
		curPage: curPage,
		clientType: "maintenance",
	};
	url = "/main/webUser/page";
	var cTd = "单位名称";
	if(level==1){
		data.level = 1;
		level = 0;
	}
	if($("#eAdmin-input-key").val() != '') {
		data.user_realname = $("#eAdmin-input-key").val();
	}
	if($("#eAdmin-select-company").val() != '') {
		data.company_id = $("#eAdmin-select-company").val();
	}
	if($("#eAdmin-select-fixLevel").val() != '') {
		data.usertypes = $("#eAdmin-select-fixLevel").val();
	}
	//查看父列表维修员时
	if(sessionStorage.getItem("parent_engineer") == "cunzai") {
		data.parent_company_id = sessionStorage.getItem("parent_cid");
		data.parent_company_name = sessionStorage.getItem("parent_cName");
		data.company_id = "set_null";
		delete data.level;
	}
	//查看子列表维修员时
	if(sessionStorage.getItem("cid") != "undefined") {
		data.company_id = sessionStorage.getItem("cid");
		data.company_name = sessionStorage.getItem("cName");
		delete data.level;
	}
	//指派维修员时
	if(sessionStorage.getItem("oid") != "undefined") {
		data.hasorder = 0;
	}
	$.ajax({
		type: "post",
		url: url,
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				$(".special-btn").hide();
				$(".special-btn:eq(1),.special-btn:eq(2),.special-btn:eq(3),.special-btn:eq(7)").show();
				if(sessionStorage.getItem("cid") != "undefined") {
					$(".special-btn:eq(5)").show();
				}
				if(sessionStorage.getItem("parent_engineer") == "cunzai") {
					$(".special-btn:eq(5)").show();
				}
				if(data.level==1) {
					getCompany(msg);
				}
				funName = "getEngineerList";
				globalPageNow = curPage;
				ePage = globalPageNow;
				globalCountPage = msg.data.pages;
				updateUrl = "/main/webUser/update";
				deviceType_info_html = '<tr><td><input type="checkbox"  onclick="checkAll()" id="select-all"><label class="labelFC" for="select-all"></label></td>' +
					'<td><b>序号</b></td>' +
					'<td><b>用户名</b></td>' +
					'<td><b>电话</b></td>' +
					'<td><b>维修员类型</b></td>' +
					'<td><b>' + cTd + '</b></td>' +
					'<td><b>状态</b></td>' +
					'<td><b>操作</b></td>';
				$(".table.table-striped thead").html(deviceType_info_html);
				deviceType_info_html = "";
				for(var i = 0; i < msg.data.data.length; i++) {
					var uid = msg.data.data[i].maintenance_id;
					var tdStyle = '';
					var status = '正常';
					var eTypeStyle = '';
					var eType = "普通维修员";
					var aText = ' | <a onclick="changeAuthentication(\'' + msg.data.data[i].is_secrecy + '_' + uid + '\')">设为认证维修员</a>';
					if(msg.data.data[i].is_valid != 1) {
						status = "停用";
						tdStyle = ' style="color:red;"';
					}
					if(msg.data.data[i].is_secrecy == 1) {
						eType = "认证维修员";
						eTypeStyle = ' style="color:red;"';
						aText = ' | <a onclick="changeAuthentication(\'' + msg.data.data[i].is_secrecy + '_' + uid + '\')">设为普通维修员</a>';
					}
					if(msg.data.data[i].is_secrecy == 2) {
						eType = "申请认证中";
						eTypeStyle = ' style="color:green;"';
						aText = ' | <a onclick="changeAuthentication(\'' + msg.data.data[i].is_secrecy + '_' + uid + '\')">前去处理</a>';
					}
					if(sessionStorage.getItem("rid") == "2") {
						aText = "";
						if(msg.data.data[i].is_secrecy == 0)
							aText = ' | <a onclick="changeAuthentication(\'' + msg.data.data[i].is_secrecy + '_' + uid + '\')">申请认证</a>';
					}
					var companyname = "";
					if(msg.data.data[i].company_name) {
						companyname = msg.data.data[i].company_name;
					}
					if(msg.data.data[i].company_name_p) {
						companyname = msg.data.data[i].company_name_p;
					}
					if(sessionStorage.getItem("oid") != "undefined") {
						aText += ' | <a onclick="assignEngineer(\'' + uid + '\')">指派该维修员</a>'
					}
					deviceType_info_html += '<tr>' +
						'<td><input type="checkbox" value="0_' + uid +
						'" class="otherCBox" id="checkbox' + i + '">' +
						'<label class="labelFC" for="checkbox' + i + '"></label></td>' +
						'<td>' + uid + '</td>' +
						'<td><a onclick="engineerDetail(\'' + uid + '\')">' + msg.data.data[i].maintenance_name + '</a></td>' +
						'<td>' + msg.data.data[i].maintenance_phone + '</td>' +
						'<td' + eTypeStyle + '>' + eType + '</td>' +
						'<td>' + companyname + '</td>' +
						'<td' + tdStyle + '>' + status + '</td>' +
						'<td>' +
						'<a onclick="fixRange(1,\'' + uid + '\')">维修范围</a> | ' +
						'<a onclick="showLocation(\'' + uid + '\')">位置</a> | ' +
						'<a onclick="watchEvaluate(1,\'' + uid + '\')">查看评价</a>' + aText +
						'<td>';
				}
				$(".table.table-striped tbody").html(deviceType_info_html);

				//给列表加分页
				page({
					box: 'pages2', //存放分页的容器
					href: '#', //跳转连接
					page: curPage, //当前页码 
					count: msg.data.pages, //总页数
					num: 5, //页面展示的页码个数
				});
			}
		},
		error: function() {
			alert("未知的错误发生了。");
		}
	});
}
getEngineerList(1);

//按条件查询
function eAdmin_search() {
	getEngineerList(1);
}

//全选或全不选
function checkAll() {
	$(".otherCBox").prop("checked", $("#select-all")[0].checked);
};

//刷新当前列表
function reloadList() {
	var fun = eval(funName);
	new fun(globalPageNow, globalUid);
}

//刷新和后退
function refreshList() {
	$(".headBar").show();
	$("#eAdmin-pagesContainer").show();
	getEngineerList(ePage);
}

//后退
function back() {

}

//禁用和启用
function banOrStarteItem(sta) {
	var checkedCBox = $(".otherCBox:checked");
	var ds = [];
	if(checkedCBox.length == 0 || !confirm("确认" + (sta == 0 ? "禁用？" : "启用？"))) {
		return false;
	}
	var data = {
		clientType: "maintenance",
		is_valid: sta,
	};
	for(var i = 0; i < checkedCBox.length; i++) {
		ds.push(checkedCBox[i].value.split('_')[1]);
	}
	data.user_ids = ds.join(',');
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

//修改按钮
function editItem() {
	var checkedBoxs = $(".otherCBox:checked");
	var modal_title = $('#modal-title');
	var modal_body = $('#modal-body');
	var modal_html = "";
	var selectCompany = "";
	if(checkedBoxs.length != 1) {
		alert("请选择一名维修员进行修改。");
		return false;
	}
	$.ajax({
		type: "post",
		url: "/main/webUser/findT",
		async: false,
		data: {
			user_id: checkedBoxs.val().split("_")[1],
			clientType: "maintenance",
			type: "back"
		},
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				for(var i = 0; i < msg.data.companys.length; i++) {
					selectCompany += '<option value="' + msg.data.companys[i].company_id + '">' + msg.data.companys[i].company_name + '</option>';
				}
				modal_html = '<div style="text-align: center;">' +
					'用户名：&nbsp&nbsp&nbsp&nbsp<input type="text" id="engineer-username" value="' + msg.data.maintenance_name + '"/><br /><br />' +
					'选择公司：<select style="width: 174px;" id="selectCompany">' +
					'<option value="">所属公司</option>' +
					selectCompany +
					'</select><br/><br/>' +
					'用户密码：<input type="password" id="engineer-pwd"/><br /><br />' +
					'确认密码：<input type="password" id="engineer-pwd2"/><br /><br />' +
					'<button class="btn btn-primary" onclick="confirmToEditEng()">修改</button>' +
					'<button class="btn btn-default" data-dismiss="modal" style="margin-left:2rem">取消</button>' +
					'</div>';
				modal_title.text("修改维修员信息");
				modal_body.html(modal_html);
				$('#primaryModal').modal();
			}
		},
		error: function() {
			alert("未知的错误发生了。");
		}
	});

}

//确认修改
function confirmToEditEng() {
	if($("#engineer-username").val().length == 0) {
		alert("请输入联系电话。");
		return false;
	}
	if($("#engineer-idCard").val().length == 0) {
		alert("请输入身份证号。");
		return false;
	}
	if($("#engineer-pwd").val() != $("#engineer-pwd2").val()) {
		alert("两次输入的密码不一致。");
		return false;
	}
	var data = {
		user_id: $(".otherCBox:checked").val().split("_")[1],
		user_realname: $("#engineer-username").val(),
		company_name: $("#selectCompany option:['checked']").text()
	};
	if($("#engineer-pwd").val().length != 0) {
		data.user_password = $.md5($("#engineer-pwd").val());
	}
	if(sessionStorage.getItem("cid") != "undefined") {
		data.company_id = sessionStorage.getItem("cid");
	}
	if(sessionStorage.getItem("parent_engineer") == "cunzai") {
		data.company_id = "set_null";
	}
	$('#primaryModal').modal("hide");
	$.ajax({
		type: "post",
		url: "/main/webUser/update",
		async: false,
		data: data,
		success: function(msg) {
			alert(msg.info);
			reloadList();
		},
		error: function() {
			alert("未知的错误发生。");
		}
	});
}

//添加维修员按钮
function addEngineer() {
	var modal_title = $('#modal-title');
	var modal_body = $('#modal-body');
	var modal_html = "";
	modal_title.text("添加维修员");
	modal_html = '<div style="text-align: center;">' +
		'真实姓名：<input type="text" id="engineer-realname"/><br /><br />' +
		'联系电话：<input type="text" id="engineer-username"/><br /><br />' +
		'身份证号：<input type="text" id="engineer-idCard"/><br /><br />' +
		'用户密码：<input type="password" id="engineer-pwd"/><br /><br />' +
		'确认密码：<input type="password" id="engineer-pwd2"/><br /><br />' +
		'<button class="btn btn-primary" onclick="confirmToAddEng()">添加</button>' +
		'<button class="btn btn-default" data-dismiss="modal" style="margin-left:2rem">取消</button>' +
		'</div>';
	modal_body.html(modal_html);
	$('#primaryModal').modal();
}

//确认添加维修员
function confirmToAddEng() {
	if($("#engineer-realname").val().length == 0) {
		alert("请输入真实姓名。");
		return false;
	}
	if($("#engineer-username").val().length == 0) {
		alert("请输入联系电话。");
		return false;
	}
	if($("#engineer-idCard").val().length == 0) {
		alert("请输入身份证号。");
		return false;
	}
	if($("#engineer-pwd").val().length == 0) {
		alert("请输入用户密码。");
		return false;
	}
	if($("#engineer-pwd").val() != $("#engineer-pwd2").val()) {
		alert("两次输入的密码不一致。");
		return false;
	}
	$('#primaryModal').modal("hide");
	var data = {
		clientType: "maintenance",
		user_realname: $("#engineer-realname").val(),
		user_name: $("#engineer-username").val(),
		user_idcard: $("#engineer-idCard").val(),
		user_password: $.md5($("#engineer-pwd").val()),
		parent_company_id: sessionStorage.getItem("parent_cid"),
		parent_company_name: sessionStorage.getItem("parent_cName")
	};
	if(sessionStorage.getItem("cid") != "undefined") {
		data.company_id = sessionStorage.getItem("cid");
		data.company_name = sessionStorage.getItem("cName");
	}
	$.ajax({
		type: "post",
		url: "/main/webUser/save",
		async: false,
		data: data,
		success: function(msg) {
			alert(msg.info);
			reloadList();
		},
		error: function() {
			alert("未知的错误发生。");
		}
	});
}

//改变认证类型
function changeAuthentication(changeData) {
	var isS = changeData.split('_')[0];
	var uid = changeData.split('_')[1];
	if(isS == 2) {
		engineerDetail(uid);
		refreshList();
		return false;
	}
	var data = {
		clientType: "maintenance",
		user_ids: uid,
		is_secrecy: isS == 0 ? 1 : 0
	};
	if(sessionStorage.getItem("rid") == '2') {
		data.is_secrecy = 2;
	}
	$.ajax({
		type: "post",
		url: updateUrl,
		async: false,
		data: data,
		success: function(msg) {
			alert(msg.info);
			refreshList();
		},
		error: function() {
			alert("未知错误发生了。");
		}
	});
}

//查看维修员信息
function engineerDetail(uid) {
	var data = {
		clientType: "maintenance",
		user_id: uid,
	};
//	//查看父列表维修员时
//	if(sessionStorage.getItem("parent_engineer") == "cunzai") {
//		data.company_name = sessionStorage.getItem("parent_cName");
//	}
//	//查看子列表维修员时
//	if(sessionStorage.getItem("cid") != "undefined") {
//		data.company_name = sessionStorage.getItem("cName");
//	}
	$.ajax({
		type: "post",
		url: "/main/webUser/findT",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				var realname_html = msg.data.maintenance_name;
				var cName = msg.data.parent_company_name?msg.data.parent_company_name:'';
				globalUid = uid;
				$("#eAdmin-btnRow").hide();
				if(msg.data.is_secrecy == 2 && sessionStorage.getItem("rid") == 1) {
					$("#eAdmin-btnRow").show();
				}
				if(msg.data.maintenance_head_image && msg.data.maintenance_head_image.length != 0) {
					$("#eAdmin-info-picture").attr("src", msg.data.maintenance_head_image);
				} else {
					$("#eAdmin-info-picture").attr("src", "./img/defultPicture.png");
				}
				if(msg.data.maintenance_sex != "") {
					realname_html += '<li class="' + (msg.data.maintenance_sex == 0 ? "fa fa-venus" : "fa fa-mars") +
						'" style="margin-left: 1rem;color: ' + (msg.data.maintenance_sex == 0 ? "rgb(242,156,177)" : "rgb(111,200,240)") + ';"></li>';
				}
				if(sessionStorage.getItem("rid")=="2" && msg.data.company_name){
					cName = msg.data.company_name;
				}
				$("#eAdmin-info-realname").html(realname_html);
				$("#eAdmin-info-phone").text(msg.data.maintenance_phone);
				$("#eAdmin-info-isLive").text(msg.data.is_live == 1 ? "是" : "否");
				$("#eAdmin-info-lastlogintime").text(msg.data.last_login_time);
				$("#eAdmin-info-companyname").text(cName);
				$("#eAdmin-info-is_secrecy").text(msg.data.is_secrecy == 1 ? "是" : "否");
				$("#eAdmin-info-createtime").text(msg.data.create_time);
				$("#eAdmin-Modal").modal();
			}
		},
		error: function() {
			alert("未知的错误发生了。")
		}
	});
}

//认证审核
function Auditing(is_secrecy) {
	$.ajax({
		type: "post",
		url: "/main/webUser/update",
		async: false,
		data: {
			user_id: globalUid,
			is_secrecy: is_secrecy
		},
		success: function(msg) {
			alert(msg.info);
			$("#eAdmin-Modal").modal("hide");
			refreshList();
		},
		error: function() {
			alert("未知的错误发生了。");
		}
	});
}

//维修范围
function fixRange(pageNow, uid) {
	$.ajax({
		type: "post",
		url: "/main/webUser/userRepair",
		async: false,
		data: {
			maintenance_id: uid,
			curPage: pageNow
		},
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				//给列表加分页
				page({
					box: 'pages2', //存放分页的容器
					href: '#', //跳转连接
					page: pageNow, //当前页码 
					count: msg.data.pages, //总页数
					num: 5, //页面展示的页码个数
				});

				//隐藏掉不需要的组件
				$(".headBar").hide();
				$(".special-btn").hide();
				//显示需要的功能按钮
				$(".special-btn:eq(0),.special-btn:eq(4),.special-btn:eq(6)").show();
				//保存方法名，通过方法名调用本方法从而刷新当前查询条件下的列表
				funName = "fixRange";
				globalUid = uid;
				globalPageNow = pageNow;
				globalCountPage = msg.data.pages;
				addUrl = "/main/webUser/addUserRepair";
				deleteUrl = "/main/webUser/deleteRepair";
				//注入表头
				deviceType_info_html = '<tr><td><input type="checkbox"  onclick="checkAll()" id="select-all"><label class="labelFC" for="select-all"></label></td>' +
					'<td><b>序号</b></td>' +
					'<td><b>设备类型</b></td>' +
					'<td><b>维修类型</b></td>' +
					'<td><b>状态</b></td>' +
					'<td><b>创建时间</b></td><tr>';
				$(".table.table-striped thead").html(deviceType_info_html);
				deviceType_info_html = "";
				//注入数据列表
				for(var i = 0; i < msg.data.data.length; i++) {
					deviceType_info_html += '<tr>' +
						'<td><input type="checkbox" value="' + msg.data.data[i].maintenance_repair_id + '" class="otherCBox" id="checkbox' + i + '">' +
						'<label class="labelFC" for="checkbox' + i + '"></label></td>' +
						'<td>' + msg.data.data[i].maintenance_repair_id + '</td>' +
						'<td>' + msg.data.data[i].device_type_name + '</td>' +
						'<td>' + (msg.data.data[i].reqair_name == undefined ? "" : msg.data.data[i].reqair_name) + '</td>' +
						'<td>' + msg.data.data[i].create_time + '</td><tr>';
				}
				$(".table.table-striped tbody").html(deviceType_info_html);
			}
		},
		error: function() {
			alert("未知的错误发生了。")
		}
	});
}

var modal_title = $('#modal-title');
var modal_body = $('#modal-body');
var modal_html = "";
var mydata = null;

//点击添加维修技能按钮时，请求获取下拉列表中的维修范围
function addItem() {
	$.ajax({
		type: "post",
		url: "/main/webUser/allType",
		async: false,
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				if(msg.data.length == 0) {
					alert("暂无数据。");
					return false;
				}
				var optionsHtml = "";
				//保存数据段，以便在选择维修范围后列出具体的维修技能
				mydata = msg.data;
				for(var i = 0; i < msg.data.length; i++) {
					optionsHtml += '<option value="' + msg.data[i].device_type_id + '">' + msg.data[i].device_type_name + '</option>';
				}
				modal_title.text("添加维修范围");
				modal_html = '<div style="text-align: center;">' +
					'<label>维修类型</label><select id="fixType" class="form-control" onchange="changeFixType()">' +
					'<option value="0">全部</option>' +
					optionsHtml +
					'</select><br /><br /><label>具体维修技能</label><br /><div id="skills" style="text-align: left;padding-left:6rem;"></div>' +
					//'具体维修技能：<input type="text" id="repairname"/><br /><br />' +
					'<button class="btn btn-primary" onclick="confirmToAdd()">添加</button>' +
					'<button class="btn btn-default" data-dismiss="modal" style="margin-left:2rem">取消</button>' +
					'</div>';
				modal_body.html(modal_html);
				$('#primaryModal').modal();
			}
		},
		error: function() {
			alert("未知的错误发生了。");
		}
	});

}

//选择维修范围后，列出具体维修技能，选择具体维修技能
function changeFixType() {
	var fix_Type = $("#fixType");
	var skillsHtml = '';
	if(fix_Type.val() != 0 && mydata != null) {
		for(var i = 0; i < mydata.length; i++) {
			if(mydata[i].device_type_id == fix_Type.val()) {
				skillsHtml = '<label><input type="checkbox" onclick="checkAllSkills(this)" style="visibility:visible;margin-right:1rem" />全选/不选</label><br/>'
				for(var j = 0; j < mydata[i].repairs.length; j++) {
					skillsHtml += '<label><input type="checkbox" value="' + mydata[i].repairs[j].reqair_id + '" class="skillsCBox" style="visibility:visible;margin-right:1rem" />' +
						mydata[i].repairs[j].reqair_name + '</label><br/>';
				}
				break;
			}
		}
	}
	$("#skills").html(skillsHtml);
}

//全选或不选维修技能
function checkAllSkills(t) {
	$(".skillsCBox").prop("checked", t.checked);
}

//确认添加
function confirmToAdd() {
	var fix_Type = $("#fixType");
	var data = {
		maintenance_id: globalUid,
		device_type_id: fix_Type.val()
	};
	//选了维修范围后，读取被选中的具体维修技能id
	if(fix_Type.val() != 0) {
		var skills_CBox = $(".skillsCBox:checked");
		if(skills_CBox.length == 0) {
			return false;
		} else {
			var ds = [];
			//循环读取被选中的checkbox的value值
			for(var i = 0; i < skills_CBox.length; i++) {
				ds.push(skills_CBox[i].value);
			}
			//id使用逗号隔开作为请求参数
			data.reqair_ids = ds.join(',');
		}
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

//删除维修技能
function deleteItem() {
	var checkedCBox = $(".otherCBox:checked");
	var ds = [];
	if(checkedCBox.length == 0 || !confirm("确认删除？")) {
		return false;
	}
	var data = {};
	for(var i = 0; i < checkedCBox.length; i++) {
		ds.push(checkedCBox[i].value);
	}
	//id使用逗号隔开作为请求参数
	data.ids = ds.join(",");
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

//查看评价
function watchEvaluate(pageNow, uid) {
	$.ajax({
		type: "post",
		url: "/main/webOrderComment/page",
		async: false,
		data: {
			maintenance_id: uid,
			curPage: pageNow
		},
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				//给列表加分页
				page({
					box: 'pages2', //存放分页的容器
					href: '#', //跳转连接
					page: pageNow, //当前页码 
					count: msg.data.pages, //总页数
					num: 5, //页面展示的页码个数
				});
				//隐藏不需要的组件
				$(".headBar").hide();
				$(".special-btn").hide();
				//显示需要的功能按钮
				$(".special-btn:eq(0)").show();
				//保存方法名，通过方法名调用本方法从而刷新当前查询条件下的列表
				funName = "watchEvaluate";
				globalUid = uid;
				globalPageNow = pageNow;
				globalCountPage = msg.data.pages;
				deviceType_info_html = '<tr><td><input type="checkbox"  onclick="checkAll()" id="select-all"><label class="labelFC" for="select-all"></label></td>' +
					'<td><b>订单编号</b></td>' +
					'<td><b>描述内容</b></td>' +
					'<td><b>专业水平</b></td>' +
					'<td><b>上门速度</b></td>' +
					'<td><b>服务态度</b></td>' +
					'<td><b>来自用户</b></td>' +
					'<td><b>创建时间</b></td>';
				$(".table.table-striped thead").html(deviceType_info_html);
				deviceType_info_html = "";
				for(var i = 0; i < msg.data.list.length; i++) {
					var tdStyle = '';
					deviceType_info_html += '<tr><td><input type="checkbox" class="otherCBox" id="checkbox' + i + '">' +
						'<label class="labelFC" for="checkbox' + i + '"></label></td>' +
						'<td>' + msg.data.list[i].order_id + '</td>' +
						'<td>' + msg.data.list[i].comment_content + '</td>' +
						'<td>' + msg.data.list[i].specialty + '</td>' +
						'<td>' + msg.data.list[i].expertise_level + '</td>' +
						'<td>' + msg.data.list[i].service_attitude + '</td>' +
						'<td>' + msg.data.list[i].comment_id + '</td>' +
						'<td>' + msg.data.list[i].create_time + '<td></tr>';
				}
				$(".table.table-striped tbody").html(deviceType_info_html);
			}
		},
		error: function() {
			alert("未知的错误发生了。")
		}
	});
}

//指派维修员
function assignEngineer(uid) {
	$.ajax({
		type: "post",
		url: "/main/webOrders/accept",
		async: false,
		data: {
			order_id: sessionStorage.getItem("oid"),
			user_id: uid,
		},
		success: function(msg) {
			alert(msg.info);
		},
		error: function() {
			alert("指派维修员时，未知的错误发生了。");
		}
	});
}

//展示维修员位置
function showLocation(uid) {
	$.ajax({
		type: "post",
		url: "/main/webUser/findT",
		async: false,
		data: {
			user_id: uid,
			clientType: "maintenance"
		},
		success: function(msg) {
			if(msg.status == "1") {
				if(msg.data.is_live == 0) {
					alert("该维修员不在线。");
					return false;
				}
				sessionStorage.setItem("engineerRealname", msg.data.maintenance_name);
				location.href = "map.html";
			}
		},
		error: function() {
			alert("展示维修员位置时，未知的错误发生了。");
		}
	});
}

//上一页
$("#pages2").on('click', '.page-contain>a:first-child', function() {
	if(globalPageNow > 1) {
		--globalPageNow;
		reloadList();
	}
});

//下一页
$("#pages2").on('click', '.page-contain>a:last-child', function() {
	if(parseInt(globalPageNow) < parseInt(globalCountPage)) {
		++globalPageNow;
		reloadList();
	}
});

//点击页码
$('#pages2').on('click', '.page-box>a', function(event) {
	var clickPage = event.target.href.split('#')[1];
	if(clickPage != globalPageNow) {
		globalPageNow = clickPage;
		reloadList();
	}
});

//输入页码
function jumpTo() {
	var inPage = $("#eAdmin-input-page").val();
	if(inPage.length != 0) {
		if(parseInt(inPage) > parseInt(globalCountPage) || inPage < 1) {
			alert("不存在这一页");
			return false;
		}
		globalPageNow = inPage;
		reloadList();
	}
}