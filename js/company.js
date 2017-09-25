//页面类型
var page_type = 0;
//父级公司（如果有）的id
var parent_cid = 0;
//总页数
var total_pages;

//进入页面（或刷新页面时）
$(document).ready(function() {
	index();
});

//获取公司列表并分页（服务公司和子服务公司通用）
function index() {
	$.ajax({
		type: "post",
		url: "/main/webCompany/serviceIndex",
		async: false,
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				//给列表注入数据
				primart_request(msg);
				//给公司列表加分页
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
			alert("初次获取公司列表时未知错误发生了");
		}
	});
}
//搜索公司
$('#search-btn').click(function() {
	var search_input = $('#search-input').val();
	var search_province = $('#search-province').val();
	var search_city = $('#search-city').val();
	var search_count = $('#search-count').val();
	var type;
	if(page_type == 1) {
		type = '';
	} else if(page_type == 2) {
		type = 0;
	} else {
		alert('出错');
	}
	var data = {
		vague_companyname: search_input,
		provinceid: search_province,
		cityid: search_city,
		townid: search_count,
		type: type,
		parent_cid: parent_cid
	}
	$.ajax({
		type: "post",
		url: "/main/webCompany/serviceIndex",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				if(page_type == 1) {
					primart_request(msg);
				} else if(page_type == 2) {
					checkdown_request(msg, parent_cid);
				} else {
					alert('错误');
				}
				//给公司列表加分页
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
			alert("搜索公司列表时未知错误发生了");
		}
	});
});

//页码请求通用函数
function fuck_the_page(data, select_page) {
	$.ajax({
		type: "post",
		url: "/main/webCompany/serviceIndex",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				if(page_type == 1) {
					primart_request(msg);
				} else if(page_type == 2) {
					checkdown_request(msg, parent_cid);
				} else {
					alert('错误');
				}
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
			alert('页码请求公司列表时发生未知错误');
		}
	});
}

//选择页码请求数据
$('#pages2').on('click', '.page-box>a', function() {
	var search_input = $('#search-input').val();
	var search_province = $('#search-province').val();
	var search_city = $('#search-city').val();
	var search_count = $('#search-count').val();
	var select_page = parseInt(this.text);
	var data = {
		vague_companyname: search_input,
		provinceid: search_province,
		cityid: search_city,
		townid: search_count,
		parent_cid: parent_cid,
		curPage: select_page,
		type: 0
	};
	fuck_the_page(data, select_page);
});

//上一页
$('#pages2').on('click', '.page-contain>a:first-child', function() {
	var search_input = $('#search-input').val();
	var search_province = $('#search-province').val();
	var search_city = $('#search-city').val();
	var search_count = $('#search-count').val();
	var select_page = $('.page-box>a.active').text() - 1;
	if(select_page < 1) {
		alert('已经是第一页了');
		return false;
	}
	select_page = parseInt(select_page);
	var data = {
		vague_companyname: search_input,
		provinceid: search_province,
		cityid: search_city,
		townid: search_count,
		parent_cid: parent_cid,
		curPage: select_page,
		type: 0
	};
	fuck_the_page(data, select_page);
});

//下一页
$('#pages2').on('click', '.page-contain>a:last-child', function() {
	var search_input = $('#search-input').val();
	var search_province = $('#search-province').val();
	var search_city = $('#search-city').val();
	var search_count = $('#search-count').val();
	var select_page = $('.page-box>a.active').text();
	select_page = parseInt(select_page);
	select_page = select_page + 1;
	if(select_page > total_pages) {
		alert('已经是最后一页了');
		return false;
	}
	var data = {
		vague_companyname: search_input,
		provinceid: search_province,
		cityid: search_city,
		townid: search_count,
		parent_cid: parent_cid,
		curPage: select_page,
		type: 0
	};
	fuck_the_page(data, select_page);
});

//输入页码搜索
$('#input-button').click(function() {
	var search_input = $('#search-input').val();
	var search_province = $('#search-province').val();
	var search_city = $('#search-city').val();
	var search_count = $('#search-count').val();
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
		vague_companyname: search_input,
		provinceid: search_province,
		cityid: search_city,
		townid: search_count,
		parent_cid: parent_cid,
		curPage: select_page,
		type: 0
	};
	fuck_the_page(data, select_page);
});

//请求公司列表通用函数（服务和子服务通用）
function primart_request(msg) {
	$('#company-list').html('');

	for(var i = 0; i < msg.data.data.length; i++) {
		$('#company-list').append('<tr>' +
			'<td><input type="checkbox" class="val" value="' + msg.data.data[i].company_id + ',' + msg.data.data[i].parent_company_id + '" id="' + msg.data.data[i].company_id + '">' +
			'<label class="labelFC" for="' + (msg.data.data[i].company_id ? msg.data.data[i].company_id : '') + '"></label></td>' +
			'<td>' + (msg.data.data[i].company_id ? msg.data.data[i].company_id : '') + '</td>' +
			'<td>' + (msg.data.data[i].company_name ? msg.data.data[i].company_name : '') + '</td>' +
			'<td>' + (msg.data.data[i].company_phone ? msg.data.data[i].company_phone : '') + '</td>' +
			'<td>' + (msg.data.data[i].company_province_name +'-'+ msg.data.data[i].company_city_name +'-'+ msg.data.data[i].company_town_name? msg.data.data[i].company_province_name +'-'+ msg.data.data[i].company_city_name +'-'+ msg.data.data[i].company_town_name : '') + '</td>' +
			'<td>' + (msg.data.data[i].company_address ? msg.data.data[i].company_address : '') + '</td>' +
			'<td>' + (msg.data.data[i].companyowner ? msg.data.data[i].companyowner : '') + '</td>' +
			'<td class="' + (msg.data.data[i].is_valid ? 'black' : 'red') + '">' + (msg.data.data[i].is_valid ? '正常' : '停用') + '</td>' +
			'<td>' + (msg.data.data[i].create_time ? msg.data.data[i].create_time : '') + '</td>' +
			'<td>' +
			'<a class="show-or-hide1" hidden="hidden" onclick=checkdown("' + msg.data.data[i].company_id + '")>查看下级</a>' +
			'<a class="show-or-hide2" hidden="hidden" onclick=showEngineer("' + msg.data.data[i].company_id + '")>维修员 </a>' +
			'<a class="show-or-hide2" hidden="hidden" onclick=showEngineer2()> 父级维修员</a>' +
			'</td>' +
			'</tr>');
		parent_cid = msg.data.data[i].parent_cid;
	}
	reflashpage();
}

function checkdown(cid) {

	var data = {
		parent_company_id: cid,
		company_type: 1
	};
	$.ajax({
		type: "post",
		url: "/main/webCompany/serviceIndex",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				checkdown_request(msg, cid);
				page_type = 2;
				//给公司列表加分页
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
			alert("查看下级获取公司列表时未知错误发生了");
		}
	});
}
//查看下级公司函数
function checkdown_request(msg, cid) {
	parent_cid = cid;
	$('#company-list').html('');
	for(var i = 0; i < msg.data.data.length; i++) {
		$('#company-list').append('<tr>' +
				'<td><input type="checkbox" class="val" value="' + msg.data.data[i].company_id + ',' + msg.data.data[i].parent_company_id + '" id="' + msg.data.data[i].company_id + '">' +
			'<label class="labelFC" for="' + (msg.data.data[i].company_id ? msg.data.data[i].company_id : '') + '"></label></td>' +
			'<td>' + (msg.data.data[i].company_id ? msg.data.data[i].company_id : '') + '</td>' +
			'<td>' + (msg.data.data[i].company_name ? msg.data.data[i].company_name : '') + '</td>' +
			'<td>' + (msg.data.data[i].company_phone ? msg.data.data[i].company_phone : '') + '</td>' +
			'<td>' + (msg.data.data[i].company_province_name +'-'+ msg.data.data[i].company_city_name +'-'+ msg.data.data[i].company_town_name? msg.data.data[i].company_province_name +'-'+ msg.data.data[i].company_city_name +'-'+ msg.data.data[i].company_town_name : '') + '</td>' +
			'<td>' + (msg.data.data[i].company_address ? msg.data.data[i].company_address : '') + '</td>' +
			'<td>' + (msg.data.data[i].companyowner ? msg.data.data[i].companyowner : '') + '</td>' +
			'<td class="' + (msg.data.data[i].is_valid ? 'black' : 'red') + '">' + (msg.data.data[i].is_valid ? '正常' : '停用') + '</td>' +
			'<td>' + (msg.data.data[i].create_time ? msg.data.data[i].create_time : '') + '</td>' +
			'<td>' +
			'<a onclick=showEngineer("' + msg.data.data[i].company_id + '")>维修员 </a>' +
			'<a onclick="showEngineer2()"> 父级维修员</a>' +
			'</td>' +
			'</tr>');
	}
}

//查看公司所有维修员
function showEngineer(cid) {
	sessionStorage.setItem("cid", cid);
	sessionStorage.setItem("parent_cid",parent_cid);
	window.location.href = "engineerAdmin.html";
}

function showEngineer2() {
	sessionStorage.setItem("cid", "undefined");
	sessionStorage.setItem("parent_engineer", 'cunzai');
	sessionStorage.setItem("parent_cid",parent_cid);
	window.location.href = "engineerAdmin.html";
}

//新增公司
var provincedata;
var citydata;
var countdata;
//获取省数据
$.ajax({
	type: "get",
	url: "/main/webRegion/list?parent_region_id=1",
	async: false,
	success: function(msg) {
		if(msg.status == "0") {
			alert(msg.info);
		}
		if(msg.status == "1") {
			provincedata = msg.data;
		
		}
	},
	error: function() {
		alert('未知错误');
	}
});
//获取市数据
$.ajax({
	type: "get",
	url: "/main/webRegion/list?parent_region_id=6",
	async: false,
	success: function(msg) {
		if(msg.status == "0") {
			alert(msg.info);
		}
		if(msg.status == "1") {
			citydata = msg.data;
		}
	},
	error: function() {
		alert('未知错误');
	}
});
//获取区数据
$.ajax({
	type: "get",
	url: "/main/webRegion/list?parent_region_id=79",
	async: false,
	success: function(msg) {
		if(msg.status == "0") {
			alert(msg.info);
		}
		if(msg.status == "1") {
			countdata = msg.data;
		}
	},
	error: function() {
		alert('未知错误');
	}
});
var provinceString = '';
var cityString = '';
var countString = '';
for(var i = 0; i < provincedata.length; i++) {
	provinceString += '<option value="' + provincedata[i].region_id + '">' + provincedata[i].region_name + '</option>'; //添加公司省数据
	$('#search-province').append('<option value="' + provincedata[i].region_id + '">' + provincedata[i].region_name + '</option>'); //搜索公司省数据
}
//搜索表单省数据下钻到市
$('#search-province').change(function() {
	if($('#search-province').val() == 6) {
		for(var i = 0; i < citydata.length; i++) {
			$('#search-city').append('<option value="' + citydata[i].region_id + '">' + citydata[i].region_name + '</option>'); //搜索公司市数据
		}
	} else {
		$('#search-city').html('<option value="">选择市</option>');
		$('#search-count').html('<option value="">选择区</option>');
	}
});
//搜索表单市数据下钻到区县
$('#search-city').change(function() {
	if($('#search-city').val() == 79) {
		for(var i = 0; i < countdata.length; i++) {
			$('#search-count').append('<option value="' + countdata[i].region_id + '">' + countdata[i].region_name + '</option>'); //搜索公司区县数据
		}
	} else {
		$('#search-count').html('<option value="">选择区</option>');
	}
});
//添加表单省数据下钻到市
function get_city() {
	if($('#province').val() == 6) {
		for(var i = 0; i < citydata.length; i++) {
			$('#city').append('<option value="' + citydata[i].region_id + '">' + citydata[i].region_name + '</option>'); //添加公司市数据
		}
	} else {
		$('#city').html('<option value="">选择市</option>');
		$('#count').html('<option value="">选择区</option>');
	}
}
//添加表单市数据下钻到区县
function get_count() {
	if($('#city').val() == 79) {
		for(var i = 0; i < countdata.length; i++) {
			$('#count').append('<option value="' + countdata[i].region_id + '">' + countdata[i].name + '</option>'); //添加公司区县数据
		}
	} else {
		$('#count').html('<option value="">选择区</option>');
	}
}
$('#plus').click(function() {
	if(page_type == 1) {
		$('#modal-title').html('新增父级公司');
		$('#modal-body').html('<div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="text" class="form-control my-control" placeholder="用户姓名" id="username"><br></div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="tel" class="form-control my-control" placeholder="用户电话" id="userphone"><br></div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="password" class="form-control my-control" placeholder="用户密码" id="userpassword"><br></div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="text" class="form-control my-control" placeholder="公司名称" id="companyname"><br></div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="tel" class="form-control my-control" placeholder="联系电话" id="companyphone"><br></div>' +
			'<div class="clearfix"></div>' +
			'<div class="col-sm-4"><select onchange="get_city()" class="form-control my-control" id="province"><option value="">选择省</option>' + provinceString + '</select></div>' +
			'<div class="col-sm-4"><select onchange="get_count()" class="form-control my-control" id="city"><option value="">选择市</option>' + '</select></div>' +
			'<div class="col-sm-4"><select class="form-control my-control" id="count"><option value="">选择区</option>' + '</select><br></div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="text" class="form-control my-control" placeholder="公司地址" id="companyaddress"><br></div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="text" class="form-control my-control" placeholder="公司法人" id="companyowner"></div>' +
			'<div class="clearfix"></div>' +
			'</div>');
		$('#modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>' +
			'<button type="button" class="btn btn-primary" id="plus-submit" onclick="submit_parent()">提交</button>');
		$('#primaryModal').modal();
	} else if(page_type == 2) {
		$('#modal-title').html('新增子级公司');
		$('#modal-body').html('<div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="text" class="form-control my-control" placeholder="公司名称" id="companyname"><br></div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="tel" class="form-control my-control" placeholder="联系电话" id="companyphone"><br></div>' +
			'<div class="clearfix"></div>' +
			'<div class="col-sm-4"><select onchange="get_city()" class="form-control my-control" id="province"><option value="">选择省</option>' + provinceString + '</select></div>' +
			'<div class="col-sm-4"><select onchange="get_count()" class="form-control my-control" id="city"><option value="">选择市</option>' + cityString + '</select></div>' +
			'<div class="col-sm-4"><select class="form-control my-control" id="count"><option value="">选择区</option>' + countString + '</select><br></div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="text" class="form-control my-control" placeholder="公司地址" id="companyaddress"><br></div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="text" class="form-control my-control" placeholder="公司法人" id="companyowner"></div>' +
			'<div class="clearfix"></div>' +
			'</div>');
		$('#modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>' +
			'<button type="button" class="btn btn-primary" id="plus-submit" onclick="submit_son(' + parent_cid + ')">提交</button>');
		$('#primaryModal').modal();
	} else {
		alert('出错');
	}
});
//新增父级公司
function submit_parent() {
	var username = $('#username').val();
	var user_phone = $('#userphone').val();
	var pwd = $('#userpassword').val();
	var companyname = $('#companyname').val();
	var phone = $('#companyphone').val();
	var provinceid = $('#province option:selected').val();
	var cityid = $('#city option:selected').val();
	var townid = $('#count option:selected').val();
	var address = $('#companyaddress').val();
	var companyowner = $('#companyowner').val();
	if(username.length == 0) {
		alert('请填写用户姓名');
		return false;
	}
	if(user_phone.length == 0) {
		alert('请填写用户电话');
		return false;
	}
	if(pwd.length == 0) {
		alert('请填写用户密码');
		return false;
	}
	if(companyname.length == 0) {
		alert('请填写公司名');
		return false;
	}
	if(phone.length == 0) {
		alert('请填写公司电话');
		return false;
	}
	if(provinceid.length == 0) {
		alert('请选择省份');
		return false;
	}
	if(cityid.length == 0) {
		alert('请选择市');
		return false;
	}
	if(townid.length == 0) {
		alert('请选择区');
		return false;
	}
	if(address.length == 0) {
		alert('请填写公司地址');
		return false;
	}
	if(companyowner.length == 0) {
		alert('请填写公司法人');
		return false;
	}
	var data = {
		type: 0,
		parent_cid: 0,
		username: username,
		user_phone: user_phone,
		pwd: pwd,
		companyname: companyname,
		phone: phone,
		provinceid: provinceid,
		cityid: cityid,
		townid: townid,
		address: address,
		companyowner: companyowner
	};
	$.ajax({
		type: "post",
		url: "/main/webCompany/save",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == '0') {
				alert(msg.info);
			}
			if(msg.status == '1') {
				alert(msg.info);
				index();
				$('#select-all').prop("checked", false);
				$('#primaryModal').modal("hide");
			}
		},
		error: function() {
			alert("添加父级公司失败");
		}
	});
}
//新增子级公司
function submit_son(parent_cid) {
	var companyname = $('#companyname').val();
	var phone = $('#companyphone').val();
	var provinceid = $('#province option:selected').val();
	var cityid = $('#city option:selected').val();
	var townid = $('#count option:selected').val();
	var address = $('#companyaddress').val();
	var companyowner = $('#companyowner').val();
	if(companyname.length == 0) {
		alert('请填写公司名');
		return false;
	}
	if(phone.length == 0) {
		alert('请填写公司电话');
		return false;
	}
	if(provinceid.length == 0) {
		alert('请选择省份');
		return false;
	}
	if(cityid.length == 0) {
		alert('请选择市');
		return false;
	}
	if(townid.length == 0) {
		alert('请选择区');
		return false;
	}
	if(address.length == 0) {
		alert('请填写公司地址');
		return false;
	}
	if(companyowner.length == 0) {
		alert('请填写公司法人');
		return false;
	}
	var data = {
		type: 0,
		parent_cid: parent_cid,
		companyname: companyname,
		phone: phone,
		provinceid: provinceid,
		cityid: cityid,
		townid: townid,
		address: address,
		companyowner: companyowner
	};
	$.ajax({
		type: "post",
		url: "/main/webCompany/save",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == '0') {
				alert(msg.info);
			}
			if(msg.status == '1') {
				alert(msg.info);
				checkdown(parent_cid);
				$('#select-all').prop("checked", false);
				$('#primaryModal').modal('hide');
			}
		},
		error: function() {
			alert("添加子级公司失败");
		}
	});
}
//选择所有
$('#select-all').change(function() {
	$('input[type=checkbox]').prop("checked", this.checked);
});

//删除公司
$('#delete').click(function() {
	var all_checked = $('.val:checked');
	var cids = '';
	if(all_checked.length == 0) {
		alert("没有选中公司");
		return false;
	}
	var yes = confirm('确定要删除吗？');
	if(yes) {
		for(var i = 0; i < all_checked.length; i++) {
			cids += all_checked[i].value.split(',')[0];
			if(i < all_checked.length - 1) {
				cids += ',';
			}
		}
		var data = {
			cids: cids
		};
		$.ajax({
			type: "post",
			url: "/main/webCompany/update",
			async: false,
			data: data,
			success: function(msg) {
				if(msg.status == "0") {
					alert(msg.info);
				}
				if(msg.status == "1") {
					alert(msg.info);
					if(page_type == 1) {
						index();
						$('#select-all').prop("checked", false);
					} else if(page_type == 2) {
						checkdown(parent_cid);
						$('#select-all').prop("checked", false);
					} else {
						alert("出错");
					}
				}
			},
			error: function() {
				alert('删除失败');
			}
		});
	} else {
		return false;
	}
});

//停用/启用
$('#ban').click(function() {
	banornot(0);
});
$('#unban').click(function() {
	banornot(1);
});

function banornot(status) {
	var all_checked = $('.val:checked');
	var cids = '';
	if(all_checked.length == 0) {
		alert("没有选中公司");
		return false;
	}
	var yes = confirm('确定要执行此操作吗？');
	if(yes) {
		for(var i = 0; i < all_checked.length; i++) {
			cids += all_checked[i].value.split(',')[0];
			if(i < all_checked.length - 1) {
				cids += ',';
			}
		}
		var data = {
			cids: cids,
			status: status
		};
		$.ajax({
			type: "post",
			url: "/main/webCompany/update",
			async: false,
			data: data,
			success: function(msg) {
				if(msg.status == "0") {
					alert(msg.info);
				}
				if(msg.status == "1") {
					alert(msg.info);
					if(page_type == 1) {
						index();
						$('#select-all').prop("checked", false);
					} else if(page_type == 2) {
						checkdown(parent_cid);
						$('#select-all').prop("checked", false);
					} else {
						alert("出错");
					}
				}
			},
			error: function() {
				alert('操作发生未知错误');
			}
		});
	} else {
		return false;
	}
}

//编辑公司信息
$('#edit').click(function() {
	var companyinfo;
	var userinfo;
	var all_checked = $('.val:checked');
	if(all_checked.length != 1) {
		alert("请选择且只选择一个公司");
		return false;
	}
	var cid = all_checked[0].value.split(',')[0];
	var parent_cid = all_checked[0].value.split(',')[1];
	var data = {
		cid: cid,
		parent_cid: parent_cid,
		type: 0
	};
	$.ajax({
		type: "post",
		url: "/main/webCompany/jumpUpdate",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				companyinfo = msg.data.company;
				userinfo = msg.data.user;
			}
		},
		error: function() {
			alert('详情获取失败');
		}
	});
	if(page_type == 1) {
		$('#modal-title').html('修改父级公司信息');
		$('#modal-body').html('<div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="text" class="form-control my-control" value="' + userinfo.username + '" placeholder="用户姓名" id="username"><br></div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="tel" class="form-control my-control" value="' + userinfo.phone + '" placeholder="用户电话" id="userphone"><br></div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="password" class="form-control my-control" value="' + userinfo.pwd + '" placeholder="用户密码" id="userpassword"><br></div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="text" class="form-control my-control" value="' + companyinfo.companyname + '" placeholder="公司名称" id="companyname"><br></div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="tel" class="form-control my-control" value="' + companyinfo.phone + '" placeholder="联系电话" id="companyphone"><br></div>' +
			'<div class="clearfix"></div>' +
			'<div class="col-sm-4"><select class="form-control my-control" onchange="get_city()" id="province"><option value="">选择省</option>' + provinceString + '</select></div>' +
			'<div class="col-sm-4"><select class="form-control my-control" onchange="get_count()" id="city"><option value="">选择市</option>' + '</select></div>' +
			'<div class="col-sm-4"><select class="form-control my-control" id="count"><option value="">选择区</option>' + '</select><br></div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="text" class="form-control my-control" value="' + companyinfo.address + '" placeholder="公司地址" id="companyaddress"><br></div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="text" class="form-control my-control" value="' + companyinfo.companyowner + '" placeholder="公司法人" id="companyowner"></div>' +
			'<div class="clearfix"></div>' +
			'</div>');
		$('#modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>' +
			'<button type="button" class="btn btn-primary" id="plus-submit" onclick="edit_submit_parent(' + cid + ',' + userinfo.uid + ')">提交</button>');
		$('#primaryModal').modal();
	} else if(page_type == 2) {
		$('#modal-title').html('修改子级公司信息');
		$('#modal-body').html('<div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="text" class="form-control my-control" value="' + companyinfo.companyname + '" placeholder="公司名称" id="companyname"><br></div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="tel" class="form-control my-control" value="' + companyinfo.phone + '" placeholder="联系电话" id="companyphone"><br></div>' +
			'<div class="clearfix"></div>' +
			'<div class="col-sm-4"><select class="form-control my-control" onchange="get_city()" id="province"><option value="">选择省</option>' + provinceString + '</select></div>' +
			'<div class="col-sm-4"><select class="form-control my-control" onchange="get_count()" id="city"><option value="">选择市</option>' + '</select></div>' +
			'<div class="col-sm-4"><select class="form-control my-control" id="count"><option value="">选择区</option>' + '</select><br></div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="text" class="form-control my-control" value="' + companyinfo.address + '" placeholder="公司地址" id="companyaddress"><br></div>' +
			'<div class="col-sm-6 col-sm-offset-3"><input type="text" class="form-control my-control" value="' + companyinfo.companyowner + '" placeholder="公司法人" id="companyowner"></div>' +
			'<div class="clearfix"></div>' +
			'</div>');
		$('#modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>' +
			'<button type="button" class="btn btn-primary" id="plus-submit" onclick="edit_submit_son(' + cid + ',' + companyinfo.parent_cid + ')">提交</button>');
		$('#primaryModal').modal();
	} else {
		alert('发生错误');
	}
});

function edit_submit_parent(cid, uid) {
	var username = $('#username').val();
	var user_phone = $('#userphone').val();
	var pwd = $('#userpassword').val();
	var companyname = $('#companyname').val();
	var phone = $('#companyphone').val();
	var provinceid = $('#province option:selected').val();
	var cityid = $('#city option:selected').val();
	var townid = $('#count option:selected').val();
	var address = $('#companyaddress').val();
	var companyowner = $('#companyowner').val();
	if(username.length == 0) {
		alert('请填写用户姓名');
		return false;
	}
	if(user_phone.length == 0) {
		alert('请填写用户电话');
		return false;
	}
	if(pwd.length == 0) {
		alert('请填写用户密码');
		return false;
	}
	if(companyname.length == 0) {
		alert('请填写公司名');
		return false;
	}
	if(phone.length == 0) {
		alert('请填写公司电话');
		return false;
	}
	if(provinceid.length == 0) {
		alert('请选择省份');
		return false;
	}
	if(cityid.length == 0) {
		alert('请选择市');
		return false;
	}
	if(townid.length == 0) {
		alert('请选择区');
		return false;
	}
	if(address.length == 0) {
		alert('请填写公司地址');
		return false;
	}
	if(companyowner.length == 0) {
		alert('请填写公司法人');
		return false;
	}
	var data = {
		cid: cid,
		uid: uid,
		type: 0,
		parent_cid: 0,
		username: username,
		user_phone: user_phone,
		pwd: pwd,
		companyname: companyname,
		phone: phone,
		provinceid: provinceid,
		cityid: cityid,
		townid: townid,
		address: address,
		companyowner: companyowner
	};
	$.ajax({
		type: "post",
		url: "/main/webCompany/update",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == '0') {
				alert(msg.info);
			}
			if(msg.status == '1') {
				alert(msg.info);
				index();
				$('#select-all').prop("checked", false);
				$('#primaryModal').modal('hide');
			}
		},
		error: function() {
			alert("修改失败");
		}
	});
}

function edit_submit_son(cid, parent_cid) {
	var companyname = $('#companyname').val();
	var phone = $('#companyphone').val();
	var provinceid = $('#province option:selected').val();
	var cityid = $('#city option:selected').val();
	var townid = $('#count option:selected').val();
	var address = $('#companyaddress').val();
	var companyowner = $('#companyowner').val();
	if(companyname.length == 0) {
		alert('请填写公司名');
		return false;
	}
	if(phone.length == 0) {
		alert('请填写公司电话');
		return false;
	}
	if(provinceid.length == 0) {
		alert('请选择省份');
		return false;
	}
	if(cityid.length == 0) {
		alert('请选择市');
		return false;
	}
	if(townid.length == 0) {
		alert('请选择区');
		return false;
	}
	if(address.length == 0) {
		alert('请填写公司地址');
		return false;
	}
	if(companyowner.length == 0) {
		alert('请填写公司法人');
		return false;
	}
	var data = {
		cid: cid,
		type: 0,
		parent_cid: parent_cid,
		companyname: companyname,
		phone: phone,
		provinceid: provinceid,
		cityid: cityid,
		townid: townid,
		address: address,
		companyowner: companyowner
	};
	$.ajax({
		type: "post",
		url: "/main/webCompany/update",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == '0') {
				alert(msg.info);
			}
			if(msg.status == '1') {
				alert(msg.info);
				checkdown(parent_cid);
				$('#select-all').prop("checked", false);
				$('#primaryModal').modal('hide');
			}
		},
		error: function() {
			alert("修改失败");
		}
	});
}

//返回
$('#back').click(function() {
	index();
	$('#select-all').prop("checked", false);
});

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