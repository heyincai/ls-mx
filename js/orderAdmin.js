var date = new Date();
var current_year = date.getFullYear();
var current_month = date.getMonth() + 1;
if(current_month < 10) {
	current_month = '0' + current_month;
}
var current_day = date.getDate();
if(current_day.length < 10) {
	current_day = '0' + current_day;
}
var current_date = current_year + '-' + current_month + '-' + current_day;
var data_for_current_date = {
	data: 0,
	day: current_date
};
var current_date_data = [];
var total_pages;

//请求当前日期的数据
$.ajax({
	type: "post",
	url: "/main/webOrders/orderTypeCount",
	data: data_for_current_date,
	async: false,
	success: function(msg) {
		if(msg.status == "0") {
			alert(msg.info);
		}
		if(msg.status == "1") {
			for(var i = 0; i < msg.data.length; i++) {
				if(msg.data[i].status_name == '已接单') {
					current_date_data[0] = msg.data[i].num;
				} else if(msg.data[i].status_name == '待接单') {
					current_date_data[1] = msg.data[i].num;
				} else if(msg.data[i].status_name == '处理中') {
					current_date_data[2] = msg.data[i].num;
				} else if(msg.data[i].status_name == '已挂起') {
					current_date_data[3] = msg.data[i].num;
				} else if(msg.data[i].status_name == '待返修') {
					current_date_data[4] = msg.data[i].num;
				} else if(msg.data[i].status_name == '拒绝返修') {
					current_date_data[5] = msg.data[i].num;
				} else if(msg.data[i].status_name == '已完成') {
					current_date_data[6] = msg.data[i].num;
				} else if(msg.data[i].status_name == '已评价') {
					current_date_data[7] = msg.data[i].num;
				} else if(msg.data[i].status_name == '已取消') {
					current_date_data[8] = msg.data[i].num;
				} else if(msg.data[i].status_name == '售后') {
					current_date_data[9] = msg.data[i].num;
				} else {
					continue;
				}
			}
		}
	},
	error: function() {
		alert("请求当前日期订单状态时未知的错误发生了");
	}
});

//订单设备类型分布条形图
var order_chart = Highcharts.chart('order-admin', {
	chart: {
		type: 'column'
	},
	title: {
		text: '',
	},
	exporting: {
		enabled: false
	},
	xAxis: {
		categories: [
			'已接单',
			'待接单',
			'处理中',
			'已挂起',
			'待返修',
			'拒绝返修',
			'已完成',
			'已评价',
			'已取消',
			'售后'
		],
		crosshair: true
	},
	yAxis: {
		title: {
			text: ''
		}
	},
	credits: {
		enabled: false
	},
	legend: {
		enabled: false
	},
	colors: ['#9ee0ff', '#b9c1ff'],
	plotOptions: {
		series: {
			pointPadding: 0.4,
			borderRadius: 5,
			dataLabels: {
				enabled: true,
				color: '#666666',
				fontWeight: '400',
				fontSize: '0.6rem'
			}
		}
	},
	tooltip: {
		enabled: false
	},
	series: [{
		name: '订单数',
		colorByPoint: true,
		data: current_date_data
	}]
});

//请求列表并分页
$(document).ready(function() {
	var order_number = $('#order-number').val();
	var order_company = $('#order-company').val();
	var order_type = $('#order-type').val();
	var start_time = $('#start-time').val();
	var end_time = $('#end-time').val();
	if(sessionStorage.getItem('ordertype') != "undefined"){
		order_type = sessionStorage.getItem('ordertype');
	}
	var data = {
		order_id: order_number,
		status_id: order_type,
		beginTime: start_time,
		endTime: end_time,
		order_company_id: order_company
	};
	$.ajax({
		type: "post",
		url: "/main/webOrders/page",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				requestList(msg);
				page({
					box: 'pages', //存放分页的容器
					href: '#',
					page: 1, //当前页码 
					count: msg.data.page.pages, //总页数
					num: 5, //页面展示的页码个数
				});
				total_pages = msg.data.page.pages;
			}
		},
		error: function() {
			alert('请求订单列表时发生未知错误');
		}
	});
});

//选择页码请求数据
$('#pages').on('click', '.page-box>a', function() {
	var select_page = parseInt(this.text);
	var order_number = $('#order-number').val();
	var order_company = $('#order-company').val();
	var order_type = $('#order-type').val();
	var start_time = $('#start-time').val();
	var end_time = $('#end-time').val();
	if(sessionStorage.getItem('ordertype') != "undefined"){
		order_type = sessionStorage.getItem('ordertype');
	}
	var data = {
		order_id: order_number,
		status_id: order_type,
		beginTime: start_time,
		endTime: end_time,
		order_company_id: order_company,
		curPage: select_page
	};
	$.ajax({
		type: "post",
		url: "/main/webOrders/page",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				requestList(msg);
				page({
					box: 'pages', //存放分页的容器
					href: '#',
					page: select_page, //当前页码 
					count: msg.data.page.pages, //总页数
					num: 5, //页面展示的页码个数
				});
				total_pages = msg.data.page.pages;
			}
		},
		error: function() {
			alert('请求订单列表时发生未知错误');
		}
	});
});

//上一页
$('#pages').on('click', '.page-contain>a:first-child', function() {
	var select_page = $('.page-box>a.active').text() - 1;
	if(select_page < 1) {
		alert('已经是第一页了');
		return false;
	}
	select_page = parseInt(select_page);
	var order_number = $('#order-number').val();
	var order_company = $('#order-company').val();
	var order_type = $('#order-type').val();
	var start_time = $('#start-time').val();
	var end_time = $('#end-time').val();
	if(sessionStorage.getItem('ordertype') != "undefined"){
		order_type = sessionStorage.getItem('ordertype');
	}
	var data = {
		order_id: order_number,
		status_id: order_type,
		beginTime: start_time,
		endTime: end_time,
		order_company_id : order_company,
		curPage: select_page
	};
	$.ajax({
		type: "post",
		url: "/main/webOrders/page",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				requestList(msg);
				page({
					box: 'pages', //存放分页的容器
					href: '#',
					page: select_page, //当前页码 
					count: msg.data.page.pages, //总页数
					num: 5, //页面展示的页码个数
				});
				total_pages = msg.data.page.pages;
			}
		},
		error: function() {
			alert('请求订单列表时发生未知错误');
		}
	});
});

//下一页
$('#pages').on('click', '.page-contain>a:last-child', function() {
	var select_page = $('.page-box>a.active').text();
	select_page = parseInt(select_page);
	select_page = select_page + 1;
	if(select_page > total_pages){
		alert('已经是最后一页了');
		return false;
	}
	var order_number = $('#order-number').val();
	var order_company = $('#order-company').val();
	var order_type = $('#order-type').val();
	var start_time = $('#start-time').val();
	var end_time = $('#end-time').val();
	if(sessionStorage.getItem('ordertype') != "undefined"){
		order_type = sessionStorage.getItem('ordertype');
	}
	var data = {
		order_id: order_number,
		status_id: order_type,
		beginTime: start_time,
		endTime: end_time,
		order_company_id: order_company,
		curPage: select_page
	};
	$.ajax({
		type: "post",
		url: "/main/webOrders/page",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				requestList(msg);
				page({
					box: 'pages', //存放分页的容器
					href: '#',
					page: select_page, //当前页码 
					count: msg.data.page.pages, //总页数
					num: 5, //页面展示的页码个数
				});
				total_pages = msg.data.page.pages;
			}
		},
		error: function() {
			alert('请求订单列表时发生未知错误');
		}
	});
});

//输入页码
$('#input-button').click(function() {
	var select_page = $('#input-page').val();
	select_page = parseInt(select_page);
	if(!select_page) {
		alert('请输入正确的页码');
		return false;
	}
	if(select_page > total_pages){
		alert("不存在这一页");
		return false;
	}
	var order_number = $('#order-number').val();
	var order_company = $('#order-company').val();
	var order_type = $('#order-type').val();
	var start_time = $('#start-time').val();
	var end_time = $('#end-time').val();
	if(sessionStorage.getItem('ordertype') != "undefined"){
		order_type = sessionStorage.getItem('ordertype');
	}
	var data = {
		order_id: order_number,
		status_id: order_type,
		beginTime: start_time,
		endTime: end_time,
		order_company_id: order_company,
		curPage: select_page
	};
	$.ajax({
		type: "post",
		url: "/main/webOrders/page",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				requestList(msg);
				page({
					box: 'pages', //存放分页的容器
					href: '#',
					page: select_page, //当前页码 
					count: msg.data.page.pages, //总页数
					num: 5, //页面展示的页码个数
				});
				total_pages = msg.data.page.pages;
			}
		},
		error: function() {
			alert('请求订单列表时发生未知错误');
		}
	});
});

//请求列表通用函数
function requestList(msg) {
	$('#response-data').html('');
	for(var i = 0; i < msg.data.page.data.length; i++) {
		var atag = '';
		if(msg.data.page.data[i].status_id == 1) {
			atag = '';
			atag = '<a class="show-or-hide2" hidden="hidden" onclick="construct(\'' + msg.data.page.data[i].order_id + '\')"> | 指派维修员</a>';
		}
		$('#response-data').append('<tr>' +
			'<td><a onclick="order_detail(\'' + (msg.data.page.data[i].order_id ? msg.data.page.data[i].order_id : '') + '\')">' + (msg.data.page.data[i].order_id ? msg.data.page.data[i].order_id : '') + '</a></td>' +
			'<td>' + (msg.data.page.data[i].status_name ? msg.data.page.data[i].status_name : '') + '</td>' +
			'<td>' + (msg.data.page.data[i].user_company_name ? msg.data.page.data[i].user_company_name : '') + '</td>' +
			'<td>' + (msg.data.page.data[i].realname ? msg.data.page.data[i].realname : '') + '</td>' +
			'<td>' + (msg.data.page.data[i].maintenance_company_name ? msg.data.page.data[i].maintenance_company_name : (msg.data.page.data[i].parentCname ? msg.data.page.data[i].parentCname : '')) + '</td>' +
			'<td>' + (msg.data.page.data[i].torealname ? msg.data.page.data[i].torealname : '') + '</td>' +
			'<td>' + (msg.data.page.data[i].is_valid ? '正常' : '异常') + '</td>' +
			'<td>' + (msg.data.page.data[i].create_time ? msg.data.page.data[i].create_time : '') + '</td>' +
			'<td class="' + (msg.data.page.data[i].is_secrecy ? 'red' : 'black') + '">' + (msg.data.page.data[i].is_secrecy ? '是' : '否') + '</td>' +
			'<td>' +
			'<a onclick="show_status(\'' + msg.data.page.data[i].order_id + '\')">订单状态</a> | ' +
			'<a onclick="change_status(\'' + msg.data.page.data[i].order_id + '\')">改变状态</a> | ' +
			'<a onclick="reset(\'' + msg.data.page.data[i].order_id + '\')">重置待接</a>' +
			atag +
			'</td>' +
			'</tr>');
		reflashpage();
	}
}

//订单详情展示
var modal_title = $('#modal-title');
var modal_body = $('#modal-body');
var modal_footer = $('#modal-footer');

function order_detail(order_id) {
	var data = {
		order_id: order_id
	};
	$.ajax({
		type: "post",
		url: "/main/webOrders/orderDetails",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				var specialtystar = '';
				var expertise_level = '';
				var servicestar = '';
				for(var i = 0; i < msg.data.specialty; i++){
					specialtystar += '<img src="./img/star.png" style="padding-bottom:0.4rem">';
				}
				for(var i = 0; i < msg.data.expertise_level; i++){
					expertise_level += '<img src="./img/star.png" style="padding-bottom:0.4rem">';
				}
				for(var i = 0; i < msg.data.service_attitude; i++){
					servicestar += '<img src="./img/star.png" style="padding-bottom:0.4rem">';
				}
				modal_title.html('订单详情');
				modal_body.html('<p>订单号：' + (msg.data.order_id ? msg.data.order_id : '') + '</p>' +
					'<p>订单状态：' + (msg.data.status_name ? msg.data.status_name : '') + '</p>' +
					'<p>下单人：' + (msg.data.user_realname ? msg.data.user_realname : '') + '</p>' +
					'<p>设备类型：' + (msg.data.device_type_name ? msg.data.device_type_name : '') + '</p>' +
					'<p>维修类型：' + (msg.data.reqair_name ? msg.data.reqair_name : '') + '</p>' +
					'<p>下单时间：' + (msg.data.create_time ? msg.data.create_time : '') + '</p>' +
					'<p>联系方式：' + (msg.data.user_phone ? msg.data.user_phone : '') + '</p>' +
					'<p>所属公司：' + (msg.data.user_company_name ? msg.data.user_company_name : '') + '</p>' +
					'<p>详细说明：' + (msg.data.order_description ? msg.data.order_description : '') + '</p>' +
					'<p>详细地址：' + (msg.data.order_contact_address ? msg.data.order_contact_address : '') + '</p>' +
					'<p>完成时间：' + (msg.data.formatfinishtime ? msg.data.formatfinishtime : '') + '</p>' +
					'<p>结单时间：' + (msg.data.formatendtime ? msg.data.formatendtime : '') + '</p>' +
					'<p>取消时间：' + (msg.data.formatcanceltime ? msg.data.formatcanceltime : '') + '</p>' +
					'<p>取消说明：' + (msg.data.cancelmsg ? msg.data.cancelmsg : '') + '</p>' +
					'<hr/>' +
					'<p>接单人：' + (msg.data.maintenance_name ? msg.data.maintenance_name : '') + '</p>' +
					'<p>联系方式：' + (msg.data.maintenance_phone ? msg.data.maintenance_phone : '') + '</p>' +
					'<p>所属公司：' + (msg.data.maintenance_company_name ? msg.data.maintenance_company_name : '') + '</p>' +
					'<p>电脑图片：</p>' +
					'<img style="width:48%;" src="' + (msg.data.order_image ? msg.data.order_image.split(",")[0] : '') + '" />' +
					'<img style="width:48%; float:right;" src="' + (msg.data.order_image ? msg.data.order_image.split(",")[1] : '') + '" />' +
					'<p>接单时间：' + (msg.data.formatctime ? msg.data.formatctime : '') + '</p>' +
					'<p>开始时间：' + (msg.data.formatstarttime ? msg.data.formatstarttime : '') + '</p>' +
					'<p>处理措施：' + (msg.data.csmsg ? msg.data.csmsg : '') + '</p>' +
					'<p>报价金额：￥' + (msg.data.bjje ? msg.data.bjje : '') + '</p>' +
					'<p>报价内容：' + (msg.data.bjms ? msg.data.bjms : '') + '</p>' +
					'<p>上门速度：' + specialtystar + '</p>' +
					'<p>专业水平：' + expertise_level + '</p>' +
					'<p>服务态度：' + servicestar + '</p>' +
					'<p>评价内容：' + (msg.data.comment_content ? msg.data.comment_content : '') + '</p>');
			}
		},
		error: function() {
			alert("获取订单详情时未知错误发生了");
		}
	});
	$('#primaryModal').modal();
}

//订单状态展示
function show_status(order_id) {
	var data = {
		order_id: order_id
	};
	$.ajax({
		type: "post",
		url: "/main/webOrders/orderProcess",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				modal_title.html('订单状态');
				modal_body.html('');
				for(var i = 0; i < msg.data.length; i++) {
					modal_body.append('<h6>' + (msg.data[i].create_time ? msg.data[i].create_time : '') + ' : ' + (msg.data[i].process_title ? msg.data[i].process_title : '') + '</h6>' +
						'<p>' + (msg.data[i].process_content ? msg.data[i].process_content : '') + '</p>' +
						'<br />');
				}
			}
		},
		error: function() {
			alert("获取订单状态时未知错误发生了");
		}
	});
	$('#primaryModal').modal();
}

//改变状态
function change_status(order_id) {
	modal_title.html('订单编号：' + order_id + ' 改变状态');
	modal_body.html('<select id="modal-select" class="form-control my-control">' +
		'<option value="dispose">处理中</option>' +
		'<option value="finish">已完成待确认</option>' +
		'<option value="confirmFinish">已完成</option>' +
		'<option value="confirmReplacement">挂起</option>' +
		'<option value="cancel">已取消</option>' +
		'</select>');
	modal_footer.html('<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>' +
		'<button type="button" class="btn btn-primary" onclick="submit_change_status(\'' + order_id + '\')">提交更改</button>');
	$('#primaryModal').modal();
}

function submit_change_status(order_id) {
	var data = {
		order_id: order_id,
	};
	$.ajax({
		type: "post",
		url: "/main/webOrders/" + $('#modal-select option:selected').val(),
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				alert('操作成功');
				history.go(0);
			}
		},
		error: function() {
			alert("获取订单状态时未知错误发生了");
		}
	});
}

//重置待接
function reset(order_id) {
	var yes = confirm('确定要重置待接吗');
	if(yes == true) {
		var data = {
			order_id: order_id
		};
		$.ajax({
			type: "post",
			url: "/main/webOrders/reduction",
			async: false,
			data: data,
			success: function(msg) {
				if(msg.status == "0") {
					alert(msg.info);
				}
				if(msg.status == "1") {
					alert('操作成功');
					history.go(0);
				}
			},
			error: function() {
				alert("重置待接单时发生未知错误。");
			}
		});
	} else {
		return false;
	}
}

//指派维修员
function construct(order_id) {
	sessionStorage.setItem("oid",order_id);
	location.href = "engineerAdmin.html";
}

//搜索
$('#search-btn').click(function() {
	sessionStorage.setItem("ordertype","undefined");
	var order_number = $('#order-number').val();
	var order_company = $('#order-company').val();
	var order_type = $('#order-type').val();
	var start_time = $('#start-time').val();
	var end_time = $('#end-time').val();
	var data = {
		order_id: order_number,
		status_id: order_type,
		beginTime: start_time,
		endTime: end_time,
		order_company_id: order_company
	};
	$.ajax({
		type: "post",
		url: "/main/webOrders/page",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				requestList(msg);
				page({
					box: 'pages', //存放分页的容器
					href: '#',
					page: 1, //当前页码 
					count: msg.data.page.pages, //总页数
					num: 5, //页面展示的页码个数
				});
				total_pages = msg.data.page.pages;
			}
		},
		error: function() {
			alert('请求订单列表时发生未知错误');
		}
	});
});

//获取公司列表
function getCompanyList(){
	$.ajax({
		type:"post",
		url:"/main/webCompany/getCompanyList",
		async:true,
		data:{
			parent_company_id:0
		},
		success:function(msg){
			if(msg.status=="0"){
				alert(msg.info);
			}
			if(msg.status=="1"){
				var companyHtml = '<option value="">所属公司</option>';
				for(var i=0; i < msg.data.company.length; i++){
					companyHtml += '<option value="' + msg.data.company[i].company_id + '">'+ msg.data.company[i].company_name +'</option>';
				}
				$("#order-company").html(companyHtml);
			}
		},
		error: function(){
			alert("获取公司列表时发生未知错误。");
		}
	});
}
getCompanyList();

//日期选择器配置
var options = {
	width: '100%',
	height: '100%',
	language: 'CH', //语言
	showLunarCalendar: false, //阴历
	showHoliday: false, //休假
	showFestival: false, //节日
	showLunarFestival: false, //农历节日
	showSolarTerm: false, //节气
	showMark: false, //标记
	timeRange: {
		startYear: 2000,
		endYear: 2049
	},
	theme: {
		changeAble: true,
		weeks: {
			backgroundColor: '#FFF',
			fontColor: '#999999',
			fontSize: '20px',
		},
		days: {
			backgroundColor: '#FFF',
			fontColor: '#666666',
			fontSize: '24px'
		},
		todaycolor: '#C0C1FA',
		activeSelectColor: '#C0C1FA',
	}
};
var myCalendar = new SimpleCalendar('#calendar', options);

//选择日期数据请求
$('#calendar').on('click', '.sc-days div:not(.sc-othermenth) .day', function() {
	var year = $('.sc-select-year').val();
	var month = $('.sc-select-month').val();
	var select_date = year + '-' + month + '-' + this.innerHTML;
	var select_data = [];
	var data_for_select_data = {
		data: 0,
		day: select_date
	}
	$.ajax({
		type: "post",
		url: "/main/webOrders/orderTypeCount",
		data: data_for_select_data,
		async: false,
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				for(var i = 0; i < msg.data.length; i++) {
					if(msg.data[i].status_name == '已接单') {
						select_data[0] = msg.data[i].num;
					} else if(msg.data[i].status_name == '待接单') {
						select_data[1] = msg.data[i].num;
					} else if(msg.data[i].status_name == '处理中') {
						select_data[2] = msg.data[i].num;
					} else if(msg.data[i].status_name == '已挂起') {
						select_data[3] = msg.data[i].num;
					} else if(msg.data[i].status_name == '待返修') {
						select_data[4] = msg.data[i].num;
					} else if(msg.data[i].status_name == '拒绝返修') {
						select_data[5] = msg.data[i].num;
					} else if(msg.data[i].status_name == '已完成') {
						select_data[6] = msg.data[i].num;
					} else if(msg.data[i].status_name == '已评价') {
						select_data[7] = msg.data[i].num;
					} else if(msg.data[i].status_name == '已取消') {
						select_data[8] = msg.data[i].num;
					} else if(msg.data[i].status_name == '售后') {
						select_data[9] = msg.data[i].num;
					} else {
						continue;
					}
				}
			}
		},
		error: function() {
			alert("请求选择日期订单状态时未知的错误发生了");
		}
	});
	order_chart.series[0].setData(select_data);
});

//新世纪最牛逼的MVC做法
function reflashpage() {
	if(sessionStorage.getItem('rid') == 1) {
		$('.show-or-hide1').removeAttr('hidden');
	}
	if(sessionStorage.getItem('rid') == 2) {
		$('.show-or-hide2').removeAttr('hidden');
	}
}
reflashpage();