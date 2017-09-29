var total_pages;
$(document).ready(function() {
	var data = {
		clientType:"user",
	};
	select_the_page(data, 1);
})
//获取列表
function index() {

	$.ajax({
		type: "post",
		url: "/main/webUser/page",
		async: false,
		success: function(msg) {
			if(msg.status == '0') {
				alert('msg.info');
			}
			if(msg.status == '1') {
				user_list(msg);
				page({
					box: 'pages2', //存放分页的容器
					href: '#', //跳转连接
					page: msg.data.curPage, //当前页码 
					count: msg.data.pages, //总页数
					num: 5, //页面展示的页码个数
				});
				total_pages = msg.data.pages;
			}
		},
		error: function() {
			alert('发生未知错误');
		}
	});
}
//填充列表
function user_list(msg) {
	$('#user-list').html('');
	for(var i = 0; i < msg.data.data.length; i++) {
		$('#user-list').append('<tr>' +
			'<td><input type="checkbox" class="val" id="' + msg.data.data[i].user_id + '" value="' + msg.data.data[i].user_id + '">' +
			'<label class="labelFC" for="' + msg.data.data[i].user_id + '"></label></td>' +
			'<td>' + msg.data.data[i].user_id + '</td>' +
			'<td>' + (msg.data.data[i].user_realname ? msg.data.data[i].user_realname : '') + '</td>' +
			'<td>' + (msg.data.data[i].user_phone ? msg.data.data[i].user_phone : '') + '</td>' +
			'<td>' + (msg.data.data[i].user_sex ? '男' : (msg.data.data[i].user_sex == '0' ? '女' : '')) + '</td>' +
			'<td>' + (msg.data.data[i].company_name_p ? msg.data.data[i].company_name_p : '') + '</td>' +
			'<td class="' + (msg.data.data[i].is_valid ? 'black' : 'red') + '">' + (msg.data.data[i].is_valid ? '正常' : '停用') + '</td>' +
			'<td class= "show-or-hide2" hidden="hidden" ><a onclick=setup_to_private("'+ msg.data.data[i].user_id + '")>设为私有用户</a><td>' +
			'</tr>');
	}
	reflashpage();
}
//设为私有用户
function setup_to_private(uid) {
	sessionStorage.setItem("uid",uid);
	location.href = "becompany.html";
}
//搜索
$('#search-btn').click(function() {
	sessionStorage.setItem("cid", "undefined");
	sessionStorage.setItem("parent_cid", "undefined");
	var search_input = $('#search-input').val();
	var data = {
		username: search_input,
		curPage: 1
	};
	select_the_page(data, 1);
});

//页码请求通用函数
function select_the_page(data, select_page) {
	if(sessionStorage.getItem('cid') != 'undefined' && sessionStorage.getItem('parent_cid') != 'undefined') {
		data.clientType="user",
		data.user_company_id = sessionStorage.getItem('cid');
		$(".special-btn:nth-child(3)").show();
		/*data.parent_company_id = sessionStorage.getItem('parent_cid');*/
	}

	$.ajax({
		type: "post",
		url: "/main/webUser/page",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				user_list(msg);
				page({
					box: 'pages2', //存放分页的容器
					href: '#',
					page: select_page, //当前页码 
					count: msg.data.pages, //总页数
					num: 5, //页面展示的页码个数
				});
				total_pages = msg.data.pages;
			}
		},
		error: function() {
			alert('页码请求用户列表时发生未知错误');
		}
	});
}

//添加用户
function plus_user() {
	$('#modal-title').html('新增用户');
	$('#modal-body').html('<div>' +
		'<div class="col-sm-6 col-sm-offset-3"><input type="tel" class="form-control my-control" placeholder="手机号" id="username"><br></div>' +
		'<div class="col-sm-6 col-sm-offset-3"><input type="text" class="form-control my-control" placeholder="真实姓名" id="realname"><br></div>' +
		'<div class="col-sm-6 col-sm-offset-3"><input type="password" class="form-control my-control" placeholder="密码" id="pwd"><br></div>' +
		'<div class="clearfix"></div>' +
		'</div>');
	$('#modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>' +
		'<button type="button" class="btn btn-primary" id="plus-submit" onclick="submit_add_user()">提交</button>');
	$('#primaryModal').modal();
}

function submit_add_user() {
	var parent_cid = sessionStorage.getItem('parent_cid');
	var cid = sessionStorage.getItem('cid');
	var username = $('#username').val();
	var realname = $('#realname').val();
	var pwd = $('#pwd').val();
	if(username.length == 0 || realname.length == 0 || pwd.length == 0) {
		alert('请将信息补充完整');
		return false;
	}
	var data = {
		clientType:"user",
		parent_company_id:parent_cid,
		user_company_id:cid,
		user_name:username,
		user_realname:realname,
		user_password:$.md5(pwd)
		
	};
	$.ajax({
		type: "post",
		url: "/main/webUser/save",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				alert(msg.info);
				history.go(0);
			}
		},
		error: function() {
			alert("添加用户失败");
		}
	});
}

//选择页码请求数据
$('#pages2').on('click', '.page-box>a', function() {
	var search_input = $('#search-input').val();
	var select_page = parseInt(this.text);
	var data = {
		username: search_input,
		curPage: select_page
	};
	select_the_page(data, select_page);
});

//上一页
$('#pages2').on('click', '.page-contain>a:first-child', function() {
	var search_input = $('#search-input').val();
	var select_page = $('.page-box>a.active').text() - 1;
	if(select_page < 1) {
		alert('已经是第一页了');
		return false;
	}
	select_page = parseInt(select_page);
	var data = {
		username: search_input,
		curPage: select_page
	};
	select_the_page(data, select_page);
});

//下一页
$('#pages2').on('click', '.page-contain>a:last-child', function() {
	var search_input = $('#search-input').val();
	var select_page = $('.page-box>a.active').text();
	select_page = parseInt(select_page);
	select_page = select_page + 1;
	if(select_page > total_pages) {
		alert('已经是最后一页了');
		return false;
	}
	var data = {
		user_realname: search_input,
		curPage: select_page
	};
	select_the_page(data, select_page);
});

//输入页码搜索
$('#input-button').click(function() {
	var search_input = $('#search-input').val();
	var select_page = $('#input-page').val();
	select_page = parseInt(select_page);
	if(!select_page) {
		alert('请输入正确的页码');
		return false;
	}
	if(select_page > total_pages) {
		alert("不存在这一页");
		return false;
	}
	var data = {
		user_realname: search_input,
		curPage: select_page
	};
	select_the_page(data, select_page);
});

//选择所有
$('#select-all').change(function() {
	$('input[type=checkbox]').prop("checked", this.checked);
});

//禁用和启用
$('#ban').click(function() {
	banornot(0);
});
$('#unban').click(function() {
	banornot(1);
})

function banornot(status) {
	var all_checked = $('.val:checked');
	var uids = '';
	if(all_checked.length == 0) {
		alert("没有选中用户");
		return false;
	}
	var yes = confirm('确定要执行此操作吗？');
	if(yes) {
		for(var i = 0; i < all_checked.length; i++) {
			uids += all_checked[i].value;
			if(i < all_checked.length - 1) {
				uids += ',';
			}
		}
		var data = {
			uids: uids,
			status: status
		};
		$.ajax({
			type: "post",
			url: "/user/updateNew",
			async: false,
			data: data,
			success: function(msg) {
				if(msg.status == "0") {
					alert(msg.info);
				}
				if(msg.status == "1") {
					alert(msg.info);
					index();
					$('#select-all').prop("checked", false);
				}
			},
			error: function() {
				alert("系统错误");
			}
		});
	}
}

function id_check(){
	if(sessionStorage.getItem('cid') != 'undefined' && sessionStorage.getItem('parent_cid') != 'undefined') {
		$('#checkedLabel').attr('class','show-or-hide2');
	}
}
id_check();

//新世纪最牛逼的MVC做法
function reflashpage() {
	//超级管理员
	if(sessionStorage.getItem('rid') == 1) {
		$('.show-or-hide1').removeAttr('hidden');
		page_type = 1;
	}
	//管理员
	if(sessionStorage.getItem('rid') == 2) {
		$('.show-or-hide2').removeAttr('hidden');
		page_type = 2;
	}
}
reflashpage();