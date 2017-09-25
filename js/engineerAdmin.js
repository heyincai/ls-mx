//获取公司列表
function getCompany() {
	var data = {
		rid: "4",
		pageNow: "1",
		level: "1"
	};
	$.ajax({
		type: "post",
		url: "/user/pageFix",
		async: false,
		data: data,
		success: function(msg) {
			var selectHtml = '<select class="my-control form-control" id="eAdmin-select-company">' +
				'<option value="">所属公司</option>';
			for(var i = 0; i < msg.data.companies.length; i++) {
				selectHtml += '<option value="' + msg.data.companies[i].cid + '">' + msg.data.companies[i].companyname + '</option>';
			}
			selectHtml += '</select>';
			$("#eAdmin-select-company-container").html(selectHtml);
		}
	});
}
getCompany();

var deviceType_info_html = '';
var url = "";
var el = null;
var funName,globalPageNow,globalCountPage,updateUrl,addUrl,globalUid,ePage;
//加载维修员列表
function getEngineerList(curPage) {
	var data = {
		rid: "4",
		pageNow: curPage
	};
	url = "/user/pageFix";
	var cTd = "单位名称";
	if(sessionStorage.getItem("parent_engineer") == "cunzai") {
		cTd = "";
		url = "/back/company/fixUserNew";
		data = {
			curPage: curPage,
			parent_cid: sessionStorage.getItem("parent_cid")
		};
	}
	if(sessionStorage.getItem("rid") == "1") {
		data.level = "1";
	}
	if(sessionStorage.getItem("cid") != "undefined" && sessionStorage.getItem("parent_cid") != "undefined") {
		$("#eAdmin-select-company").val(sessionStorage.getItem("parent_cid"));
		data.cid = sessionStorage.getItem("cid");
	}
	if($("#eAdmin-input-key").val() != '') {
		data.realname = $("#eAdmin-input-key").val();
	}
	if($("#eAdmin-select-company").val() != '') {
		data.parent_cid = $("#eAdmin-select-company").val();
	}
	if($("#eAdmin-select-fixLevel").val() != '') {
		data.usertypes = $("#eAdmin-select-fixLevel").val();
	}
	if(sessionStorage.getItem("oid") != "undefined"){
		data.hasorder = 0;
	}
	$.ajax({
		type: "post",
		url: url,
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "9999") {
				alert(msg.info);
			}
			if(msg.status == "10000") {
				if(sessionStorage.getItem("parent_engineer") == "cunzai") {
					msg.data.page = msg.data;
					msg.data.page.data = msg.data.list;
					msg.data.page.countPage = msg.data.pages;
					msg.data.page.pageNow = msg.data.curPage;
				}
				el = msg.data.page.data;
				$(".special-btn").hide();
				$(".special-btn:eq(1),.special-btn:eq(2),.special-btn:eq(3),.special-btn:eq(7)").show();
				if(sessionStorage.getItem("cid") != "undefined" && sessionStorage.getItem("parent_cid") != "undefined") {
					$(".special-btn:eq(5)").show();
				}
				if(sessionStorage.getItem("parent_engineer") == "cunzai") {
					$(".special-btn:eq(5)").show();
				}
				funName = "getEngineerList";
				globalPageNow = msg.data.page.pageNow;
				ePage = globalPageNow;
				globalCountPage = msg.data.page.countPage;
				updateUrl = "/user/updateNew";
				deviceType_info_html = '<tr><td><input type="checkbox"  onclick="checkAll()" id="select-all"><label class="labelFC" for="select-all"></label></td>' +
					'<td><b>序号</b></td>' +
					'<td><b>用户名</b></td>' +
					'<td><b>电话</b></td>' +
					'<td><b>身份证</b></td>' +
					'<td><b>维修员类型</b></td>' +
					'<td><b>' + cTd + '</b></td>' +
					'<td><b>状态</b></td>' +
					'<td><b>操作</b></td>';
				$(".table.table-striped thead").html(deviceType_info_html);
				deviceType_info_html = "";
				for(var i = 0; i < msg.data.page.data.length; i++) {
					var uid = msg.data.page.data[i].uid;
					var tdStyle = '';
					var status = '正常';
					var eTypeStyle = '';
					var eType = "普通维修员";
					var aText = ' | <a onclick="changeAuthentication(\'' + msg.data.page.data[i].is_secrecy + '_' + uid + '\')">设为认证维修员</a>';
					if(msg.data.page.data[i].status != 1) {
						status = "停用";
						tdStyle = ' style="color:red;"';
					}
					if(msg.data.page.data[i].is_secrecy == 1) {
						eType = "认证维修员";
						eTypeStyle = ' style="color:red;"';
						aText = ' | <a onclick="changeAuthentication(\'' + msg.data.page.data[i].is_secrecy + '_' + uid + '\')">设为普通维修员</a>';
					}
					if(msg.data.page.data[i].is_secrecy == 2) {
						eType = "申请认证中";
						eTypeStyle = ' style="color:green;"';
						aText = ' | <a onclick="changeAuthentication(\'' + msg.data.page.data[i].is_secrecy + '_' + uid + '\')">前去处理</a>';
					}
					if(sessionStorage.getItem("rid") == "2") {
						aText = "";
						if(msg.data.page.data[i].is_secrecy == 0)
						aText = ' | <a onclick="changeAuthentication(\'' + msg.data.page.data[i].is_secrecy + '_' + uid + '\')">申请认证</a>';
					}
					var companyname = "";
					if(msg.data.page.data[i].companyname) {
						companyname = msg.data.page.data[i].companyname;
					}
					if(msg.data.page.data[i].companyname_p) {
						companyname = msg.data.page.data[i].companyname_p;
					}
					if(sessionStorage.getItem("oid") != "undefined"){
						aText += ' | <a onclick="assignEngineer(\'' + uid + '\')">指派该维修员</a>'
					}
					deviceType_info_html += '<tr>' +
						'<td><input type="checkbox" value="' + msg.data.page.data[i].username + '_' + uid +
						'" class="otherCBox" id="checkbox' + i + '">' +
						'<label class="labelFC" for="checkbox' + i + '"></label></td>' +
						'<td>' + uid + '</td>' +
						'<td><a onclick="engineerDetail(' + uid + ')">' + msg.data.page.data[i].realname + '</a></td>' +
						'<td>' + msg.data.page.data[i].phone + '</td>' +
						'<td>' + (msg.data.page.data[i].idCard ? msg.data.page.data[i].idCard : "") + '</td>' +
						'<td' + eTypeStyle + '>' + eType + '</td>' +
						'<td>' + companyname + '</td>' +
						'<td' + tdStyle + '>' + status + '</td>' +
						'<td>' +
						'<a onclick="fixRange(1,' + uid + ')">维修范围</a> | ' +
						'<a onclick="showLocation(' + uid + ')">位置</a> | ' +
						'<a onclick="watchEvaluate(1,' + uid + ')">查看评价</a>' + aText +
						'<td>';
				}
				$(".table.table-striped tbody").html(deviceType_info_html);

				//给列表加分页
				page({
					box: 'pages2', //存放分页的容器
					href: '#', //跳转连接
					page: msg.data.page.pageNow, //当前页码 
					count: msg.data.page.countPage, //总页数
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
	data.uids = ds.join(',');
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
		url: "/user/findT.json",
		async: false,
		data: {
			uid: checkedBoxs.val().split("_")[1],
			type: "back"
		},
		success: function(msg) {
			if(msg.status == "9999") {
				alert(msg.info);
			}
			if(msg.status == "10000") {
				for(var i = 0; i < msg.data.companys.length; i++) {
					selectCompany += '<option value="' + msg.data.companys[i].cid + '">' + msg.data.companys[i].companyname + '</option>';
				}
				modal_html = '<div style="text-align: center;">' +
					'用户名：&nbsp&nbsp&nbsp&nbsp<input type="text" id="engineer-username" value="' + msg.data.realname + '"/><br /><br />' +
					'身份证：&nbsp&nbsp&nbsp&nbsp<input type="text" id="engineer-idCard" value="' + msg.data.idCard + '"/><br /><br />' +
					'选择公司：<select style="width: 174px;">' +
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
		uid: $(".otherCBox:checked").val().split("_")[1],
		realname: $("#engineer-username").val(),
		idCard: $("#engineer-idCard").val(),
	};
	if($("#engineer-pwd").val().length != 0) {
		data.pwd = $("#engineer-pwd").val()
	}
	if(sessionStorage.getItem("cid") != "undefined" && sessionStorage.getItem("parent_cid") != "undefined") {
		data.cid = sessionStorage.getItem("cid");
	}
	if(sessionStorage.getItem("parent_engineer") == "cunzai") {
		data.cid = "set_null";
	}
	$('#primaryModal').modal("hide");
	$.ajax({
		type: "post",
		url: "/user/updateNew",
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
	var data;
	var addUrl;
	if(sessionStorage.getItem("cid") != "undefined" && sessionStorage.getItem("parent_cid") != "undefined") {
		addUrl = "/user/saveNew";
		data = {
			rid: "4",
			parent_cid: sessionStorage.getItem("parent_cid"),
			cid: sessionStorage.getItem("cid"),
			username: $("#engineer-username").val(),
			pwd: $("#engineer-pwd").val(),
			realname: $("#engineer-realname").val(),
			idCard: $("#engineer-idCard").val(),
		};
	}
	if(sessionStorage.getItem("parent_engineer") == "cunzai") {
		addUrl = "/back/company/saveFoxUserNew";
		data = {
			parent_cid: sessionStorage.getItem("parent_cid"),
			username: $("#engineer-username").val(),
			pwd: $("#engineer-pwd").val(),
			realname: $("#engineer-realname").val(),
			idCard: $("#engineer-idCard").val(),
		};
	}
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
			alert("未知的错误发生。");
		}
	});
}

//改变认证类型
function changeAuthentication(changeData) {
	var isS = changeData.split('_')[0];
	var uid = changeData.split('_')[1];
	if(sessionStorage.getItem("rid")=='2'){
		
	}
	if(isS == 2) {
		engineerDetail(uid);
		refreshList();
		return false;
	}
	var data = {
		uids: uid,
		is_secrecy: isS == 0 ? 1 : 0
	};
	if(sessionStorage.getItem("rid")=='2'){
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
	$.ajax({
		type: "post",
		url: "/user/findT.json",
		async: false,
		data: {
			uid: uid,
			type: "back"
		},
		success: function(msg) {
			if(msg.status == "9999") {
				alert(msg.info);
			}
			if(msg.status == "10000") {
				var realname_html = msg.data.realname;
				globalUid = uid;
				$("#eAdmin-btnRow").hide();
				if(msg.data.is_secrecy == 2 && sessionStorage.getItem("rid") == 1) {
					$("#eAdmin-btnRow").show();
				}
				if(msg.data.picture.length != 0) {
					$("#eAdmin-info-picture").attr("src", msg.data.picture);
				} else {
					$("#eAdmin-info-picture").attr("src", "./img/defultPicture.png");
				}

				if(msg.data.sex != "") {
					realname_html += '<li class="' + (msg.data.sex == 0 ? "fa fa-venus" : "fa fa-mars") +
						'" style="margin-left: 1rem;color: ' + (msg.data.sex == 0 ? "rgb(242,156,177)" : "rgb(111,200,240)") + ';"></li>';
				}
				$("#eAdmin-info-realname").html(realname_html);
				$("#eAdmin-info-phone").text(msg.data.phone);
				$("#eAdmin-info-idCard").text(msg.data.idCard);
				$("#eAdmin-info-isLive").text(msg.data.isLive == 1 ? "是" : "否");
				$("#eAdmin-info-lastlogintime").text(msg.data.lastlogintime);

				$("#eAdmin-info-companyname").text(msg.data.companyname);
				$("#eAdmin-info-is_secrecy").text(msg.data.is_secrecy == 1 ? "是" : "否");
				$("#eAdmin-info-createtime").text(msg.data.createtime);
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
		url: "/back/company/saveFoxUserNew",
		async: false,
		data: {
			uid: globalUid,
			is_secrecy: is_secrecy
		},
		success: function(msg) {
			alert(msg.info);
			$("#eAdmin-Modal").modal("hide");
			refreshList();
		},
		error: function() {
			alert("未知的错误发生了。")
		}
	});
}

//维修范围
function fixRange(pageNow, uid) {
	$.ajax({
		type: "post",
		url: "/us/listNew",
		async: false,
		data: {
			uid: uid
		},
		success: function(msg) {
			if(msg.status == "9999") {
				alert(msg.info);
			}
			if(msg.status == "10000") {
				$(".headBar").hide();
				$("#eAdmin-pagesContainer").hide();
				$(".special-btn").hide();
				$(".special-btn:eq(0),.special-btn:eq(4),.special-btn:eq(6)").show();
				funName = "fixRange";
				globalUid = uid;
				addUrl = "/us/addNew";
				deleteUrl = "/us/deleteNew";
				deviceType_info_html = '<tr><td><input type="checkbox"  onclick="checkAll()" id="select-all"><label class="labelFC" for="select-all"></label></td>' +
					'<td><b>序号</b></td>' +
					'<td><b>设备类型</b></td>' +
					'<td><b>维修类型</b></td>' +
					'<td><b>状态</b></td>' +
					'<td><b>创建时间</b></td><tr>';
				$(".table.table-striped thead").html(deviceType_info_html);
				deviceType_info_html = "";
				for(var i = 0; i < msg.data.length; i++) {
					var tdStyle = '';
					var status = '正常';
					if(msg.data[i].status != 1) {
						status = "停用";
						tdStyle = ' style="color:red;"';
					}
					deviceType_info_html += '<tr>' +
						'<td><input type="checkbox" value="' + msg.data[i].id + '" class="otherCBox" id="checkbox' + i + '">' +
						'<label class="labelFC" for="checkbox' + i + '"></label></td>' +
						'<td>' + msg.data[i].id + '</td>' +
						'<td>' + msg.data[i].devicename + '</td>' +
						'<td>' + (msg.data[i].repairname == undefined ? "" : msg.data[i].repairname) + '</td>' +
						'<td' + tdStyle + '>' + status + '</td>' +
						'<td>' + msg.data[i].createtime + '</td><tr>';
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

//添加按钮
function addItem() {
	$.ajax({
		type: "post",
		url: "/device/all.json",
		async: false,
		success: function(msg) {
			if(msg.status == "9999") {
				alert(msg.info);
			}
			if(msg.status == "10000") {
				if(msg.data.length == 0) {
					alert("暂无数据。");
					return false;
				}
				var optionsHtml = "";
				mydata = msg.data;
				for(var i = 0; i < msg.data.length; i++) {
					optionsHtml += '<option value="' + msg.data[i].id + '">' + msg.data[i].devicename + '</option>';
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

//选择维修类型
function changeFixType() {
	var fix_Type = $("#fixType");
	var skillsHtml = '';
	if(fix_Type.val() != 0 && mydata != null) {
		for(var i = 0; i < mydata.length; i++) {
			if(mydata[i].id == fix_Type.val()) {
				skillsHtml = '<label><input type="checkbox" onclick="checkAllSkills(this)" style="visibility:visible;margin-right:1rem" />全选/不选</label><br/>'
				for(var j = 0; j < mydata[i].repairs.length; j++) {
					skillsHtml += '<label><input type="checkbox" value="' + mydata[i].repairs[j].id + '" class="skillsCBox" style="visibility:visible;margin-right:1rem" />' +
						mydata[i].repairs[j].repairname + '</label><br/>';
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
		uid: globalUid,
		did: fix_Type.val()
	};
	if(fix_Type.val() != 0) {
		var skills_CBox = $(".skillsCBox:checked");
		if(skills_CBox.length == 0) {
			return false;
		} else {
			var ds = [];
			for(var i = 0; i < skills_CBox.length; i++) {
				ds.push(skills_CBox[i].value);
			}
			data.drid = ds.join(',');
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
	var data = {
		uid: globalUid
	};
	for(var i = 0; i < checkedCBox.length; i++) {
		ds.push(checkedCBox[i].value);
	}
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
		url: "/oa/pagebycompanyNew",
		async: false,
		data: {
			uid: uid,
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
					page: msg.data.page.pageNow, //当前页码 
					count: msg.data.page.countPage, //总页数
					num: 5, //页面展示的页码个数
				});
				$(".headBar").hide();
				$(".special-btn").hide();
				//$("#eAdmin-pagesContainer").hide();
				$(".special-btn:eq(0)").show();
				funName = "watchEvaluate";
				globalUid = uid;
				globalPageNow = msg.data.page.pageNow;
				globalCountPage = msg.data.page.countPage;
				deviceType_info_html = '<tr><td><input type="checkbox"  onclick="checkAll()" id="select-all"><label class="labelFC" for="select-all"></label></td>' +
					'<td><b>订单编号</b></td>' +
					'<td><b>专业水平</b></td>' +
					'<td><b>上门速度</b></td>' +
					'<td><b>服务态度</b></td>' +
					'<td><b>来自用户</b></td>' +
					'<td><b>状态</b></td>' +
					'<td><b>创建时间</b></td>';
				$(".table.table-striped thead").html(deviceType_info_html);
				deviceType_info_html = "";
				for(var i = 0; i < msg.data.page.data.length; i++) {
					var tdStyle = '';
					var status = '正常';
					if(msg.data.page.data[i].status != 1) {
						status = "停用";
						tdStyle = ' style="color:red;"';
					}
					deviceType_info_html += '<tr>' +
						'<td><input type="checkbox" class="otherCBox" id="checkbox' + i + '">' +
						'<label class="labelFC" for="checkbox' + i + '"></label></td>' +
						'<td>' + msg.data.page.data[i].oid + '</td>' +
						'<td>' + msg.data.page.data[i].specialty + '</td>' +
						'<td>' + msg.data.page.data[i].reply + '</td>' +
						'<td>' + msg.data.page.data[i].service + '</td>' +
						'<td>' + msg.data.page.data[i].fromuid + '</td>' +
						'<td' + tdStyle + '>' + status + '</td>' +
						'<td>' + msg.data.page.data[i].ctime + '<td>';
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
function assignEngineer(uid){
	$.ajax({
		type:"post",
		url:"/order/updatetype.phone",
		async:false,
		data:{
			oid: sessionStorage.getItem("oid"),
			uid: uid,
			ordertype: "2"
		},
		success: function(msg){
			alert(msg.info);
		},
		error:function(){
			alert("未知的错误发生了。");
		}
	});
}

//展示维修员位置
function showLocation(uid) {
	$.ajax({
		type: "post",
		url: "/map/oneNew",
		async: false,
		data: {
			uid: uid
		},
		success: function(msg) {
			if(msg.status == "10000") {
				if(msg.data.isLive == 0) {
					alert("该维修员不在线。");
					return false;
				}
				sessionStorage.setItem("engineerRealname", msg.data.realname);
				location.href = "map.html";
			}
		},
		error: function() {
			alert("未知的错误发生了。");
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