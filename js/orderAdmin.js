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
	url: "/order/orderTypeCount.phone",
	data: data_for_current_date,
	async: false,
	success: function(msg) {
		if(msg.status == "9999") {
			alert(msg.info);
		}
		if(msg.status == "10000") {
			for(var i = 0; i < msg.data.length; i++) {
				if(msg.data[i].ordertypename == '已接单') {
					current_date_data[0] = msg.data[i].num;
				} else if(msg.data[i].ordertypename == '待接单') {
					current_date_data[1] = msg.data[i].num;
				} else if(msg.data[i].ordertypename == '处理中') {
					current_date_data[2] = msg.data[i].num;
				} else if(msg.data[i].ordertypename == '已挂起') {
					current_date_data[3] = msg.data[i].num;
				} else if(msg.data[i].ordertypename == '待返修') {
					current_date_data[4] = msg.data[i].num;
				} else if(msg.data[i].ordertypename == '拒绝返修') {
					current_date_data[5] = msg.data[i].num;
				} else if(msg.data[i].ordertypename == '待评价') {
					current_date_data[6] = msg.data[i].num;
				} else if(msg.data[i].ordertypename == '已评价') {
					current_date_data[7] = msg.data[i].num;
				} else if(msg.data[i].ordertypename == '已取消') {
					current_date_data[8] = msg.data[i].num;
				} else if(msg.data[i].ordertypename == '售后') {
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
			'待评价',
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
		oid: order_number,
		ordertype: order_type,
		beginTime: start_time,
		endTime: end_time,
		parent_cid: order_company
	};
	$.ajax({
		type: "post",
		url: "/order/pageNew",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "9999") {
				alert(msg.info);
			}
			if(msg.status == "10000") {
				requestList(msg);
				page({
					box: 'pages', //存放分页的容器
					href: '#',
					page: 1, //当前页码 
					count: msg.data.page.countPage, //总页数
					num: 5, //页面展示的页码个数
				});
				total_pages = msg.data.page.countPage;
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
		oid: order_number,
		ordertype: order_type,
		beginTime: start_time,
		endTime: end_time,
		parent_cid: order_company,
		pageNow: select_page
	};
	$.ajax({
		type: "post",
		url: "/order/pageNew",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "9999") {
				alert(msg.info);
			}
			if(msg.status == "10000") {
				requestList(msg);
				page({
					box: 'pages', //存放分页的容器
					href: '#',
					page: select_page, //当前页码 
					count: msg.data.page.countPage, //总页数
					num: 5, //页面展示的页码个数
				});
				total_pages = msg.data.page.countPage;
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
		oid: order_number,
		ordertype: order_type,
		beginTime: start_time,
		endTime: end_time,
		parent_cid: order_company,
		pageNow: select_page
	};
	$.ajax({
		type: "post",
		url: "/order/pageNew",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "9999") {
				alert(msg.info);
			}
			if(msg.status == "10000") {
				requestList(msg);
				page({
					box: 'pages', //存放分页的容器
					href: '#',
					page: select_page, //当前页码 
					count: msg.data.page.countPage, //总页数
					num: 5, //页面展示的页码个数
				});
				total_pages = msg.data.page.countPage;
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
		oid: order_number,
		ordertype: order_type,
		beginTime: start_time,
		endTime: end_time,
		parent_cid: order_company,
		pageNow: select_page
	};
	$.ajax({
		type: "post",
		url: "/order/pageNew",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "9999") {
				alert(msg.info);
			}
			if(msg.status == "10000") {
				requestList(msg);
				page({
					box: 'pages', //存放分页的容器
					href: '#',
					page: select_page, //当前页码 
					count: msg.data.page.countPage, //总页数
					num: 5, //页面展示的页码个数
				});
				total_pages = msg.data.page.countPage;
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
		oid: order_number,
		ordertype: order_type,
		beginTime: start_time,
		endTime: end_time,
		parent_cid: order_company,
		pageNow: select_page
	};
	$.ajax({
		type: "post",
		url: "/order/pageNew",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "9999") {
				alert(msg.info);
			}
			if(msg.status == "10000") {
				requestList(msg);
				page({
					box: 'pages', //存放分页的容器
					href: '#',
					page: select_page, //当前页码 
					count: msg.data.page.countPage, //总页数
					num: 5, //页面展示的页码个数
				});
				total_pages = msg.data.page.countPage;
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
		if(msg.data.page.data[i].ordertype == 1) {
			atag = '';
			atag = '<a class="show-or-hide2" hidden="hidden" onclick="construct(' + msg.data.page.data[i].oid + ')"> | 指派维修员</a>';
		}
		$('#response-data').append('<tr>' +
			'<td><a onclick="order_detail(' + (msg.data.page.data[i].oid ? msg.data.page.data[i].oid : '') + ')">' + (msg.data.page.data[i].oid ? msg.data.page.data[i].oid : '') + '</a></td>' +
			'<td>' + (msg.data.page.data[i].ordertypename ? msg.data.page.data[i].ordertypename : '') + '</td>' +
			'<td>' + (msg.data.page.data[i].companyname ? msg.data.page.data[i].companyname : '') + '</td>' +
			'<td>' + (msg.data.page.data[i].realname ? msg.data.page.data[i].realname : '') + '</td>' +
			'<td>' + (msg.data.page.data[i].tocompanyname ? msg.data.page.data[i].tocompanyname : (msg.data.page.data[i].parentCname ? msg.data.page.data[i].parentCname : '')) + '</td>' +
			'<td>' + (msg.data.page.data[i].torealname ? msg.data.page.data[i].torealname : '') + '</td>' +
			'<td>' + (msg.data.page.data[i].status ? '正常' : '异常') + '</td>' +
			'<td>' + (msg.data.page.data[i].formatctime ? msg.data.page.data[i].formatctime : '') + '</td>' +
			'<td class="' + (msg.data.page.data[i].is_secrecy ? 'red' : 'black') + '">' + (msg.data.page.data[i].is_secrecy ? '是' : '否') + '</td>' +
			'<td>' +
			'<a onclick="show_status(' + msg.data.page.data[i].oid + ')">订单状态</a> | ' +
			'<a onclick="change_status(' + msg.data.page.data[i].oid + ')">改变状态</a> | ' +
			'<a onclick="reset(' + msg.data.page.data[i].oid + ')">重置待接</a>' +
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

function order_detail(oid) {
	var data = {
		oid: oid
	};
	$.ajax({
		type: "post",
		url: "/order/info",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "9999") {
				alert(msg.info);
			}
			if(msg.status == "10000") {
				var specialtystar = '';
				var replystar = '';
				var servicestar = '';
				for(var i = 0; i < msg.data.specialty; i++){
					specialtystar += '<img src="./img/star.png" style="padding-bottom:0.4rem">';
				}
				for(var i = 0; i < msg.data.reply; i++){
					replystar += '<img src="./img/star.png" style="padding-bottom:0.4rem">';
				}
				for(var i = 0; i < msg.data.service; i++){
					servicestar += '<img src="./img/star.png" style="padding-bottom:0.4rem">';
				}
				modal_title.html('订单详情');
				modal_body.html('<p>订单号：' + (msg.data.oid ? msg.data.oid : '') + '</p>' +
					'<p>订单状态：' + (msg.data.ordertypename ? msg.data.ordertypename : '') + '</p>' +
					'<p>下单人：' + (msg.data.realname ? msg.data.realname : '') + '</p>' +
					'<p>设备类型：' + (msg.data.devicename ? msg.data.devicename : '') + '</p>' +
					'<p>维修类型：' + (msg.data.repairname ? msg.data.repairname : '') + '</p>' +
					'<p>下单时间：' + (msg.data.formatctime ? msg.data.formatctime : '') + '</p>' +
					'<p>联系方式：' + (msg.data.contactphone ? msg.data.contactphone : '') + '</p>' +
					'<p>所属公司：' + (msg.data.companyname ? msg.data.companyname : '') + '</p>' +
					'<p>详细说明：' + (msg.data.remark ? msg.data.remark : '') + '</p>' +
					'<p>详细地址：' + (msg.data.address ? msg.data.address : '') + '</p>' +
					'<p>完成时间：' + (msg.data.formatfinishtime ? msg.data.formatfinishtime : '') + '</p>' +
					'<p>结单时间：' + (msg.data.formatendtime ? msg.data.formatendtime : '') + '</p>' +
					'<p>取消时间：' + (msg.data.formatcanceltime ? msg.data.formatcanceltime : '') + '</p>' +
					'<p>取消说明：' + (msg.data.cancelmsg ? msg.data.cancelmsg : '') + '</p>' +
					'<hr/>' +
					'<p>接单人：' + (msg.data.torealname ? msg.data.torealname : '') + '</p>' +
					'<p>联系方式：' + (msg.data.tophone ? msg.data.tophone : '') + '</p>' +
					'<p>所属公司：' + (msg.data.tocompanyname ? msg.data.tocompanyname : '') + '</p>' +
					'<p>电脑图片：</p>' +
					'<img style="width:48%;" src="' + (msg.data.images ? msg.data.images.split(",")[0] : '') + '" />' +
					'<img style="width:48%; float:right;" src="' + (msg.data.images ? msg.data.images.split(",")[1] : '') + '" />' +
					'<p>接单时间：' + (msg.data.formataccepttime ? msg.data.formataccepttime : '') + '</p>' +
					'<p>开始时间：' + (msg.data.formatstarttime ? msg.data.formatstarttime : '') + '</p>' +
					'<p>处理措施：' + (msg.data.csmsg ? msg.data.csmsg : '') + '</p>' +
					'<p>报价金额：￥' + (msg.data.price ? msg.data.price : '') + '</p>' +
					'<p>报价内容：' + (msg.data.bjmsg ? msg.data.bjmsg : '') + '</p>' +
					'<p>专业水平：' + specialtystar + '</p>' +
					'<p>上门速度：' + replystar + '</p>' +
					'<p>服务态度：' + servicestar + '</p>' +
					'<p>评价内容：' + (msg.data.pjmsg ? msg.data.pjmsg : '') + '</p>');
			}
		},
		error: function() {
			alert("获取订单详情时未知错误发生了");
		}
	});
	$('#primaryModal').modal();
}

//订单状态展示
function show_status(oid) {
	var data = {
		oid: oid
	};
	$.ajax({
		type: "post",
		url: "/order/state.phone",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "9999") {
				alert(msg.info);
			}
			if(msg.status == "10000") {
				modal_title.html('订单状态');
				modal_body.html('');
				for(var i = 0; i < msg.data.length; i++) {
					modal_body.append('<h6>' + (msg.data[i].formattime ? msg.data[i].formattime : '') + ' : ' + (msg.data[i].title ? msg.data[i].title : '') + '</h6>' +
						'<p>' + (msg.data[i].msg ? msg.data[i].msg : '') + '</p>' +
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
function change_status(oid) {
	modal_title.html('订单编号：' + oid + ' 改变状态');
	modal_body.html('<select id="modal-select" class="form-control my-control">' +
		'<option value="2">已接单</option>' +
		'<option value="3">处理中</option>' +
		'<option value="4">分级待用户确认</option>' +
		'<option value="5">分级待对方确认</option>' +
		'<option value="6">已报价待确认</option>' +
		'<option value="7">已挂起</option>' +
		'<option value="8">已完成待确认</option>' +
		'<option value="9">拒绝并返修</option>' +
		'<option value="10">拒绝返修</option>' +
		'<option value="11">已完成</option>' +
		'<option value="12">已评价</option>' +
		'<option value="20">已取消</option>' +
		'</select>');
	modal_footer.html('<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>' +
		'<button type="button" class="btn btn-primary" onclick="submit_change_status(' + oid + ')">提交更改</button>');
	$('#primaryModal').modal();
}

function submit_change_status(oid) {
	var data = {
		oid: oid,
		ordertype: $('#modal-select option:selected').val()
	};
	if($('#modal-select option:selected').val() == 20){
		data.perpetual = true;
	}
	$.ajax({
		type: "post",
		url: "/order/update",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "9999") {
				alert(msg.info);
			}
			if(msg.status == "10000") {
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
function reset(oid) {
	var yes = confirm('确定要重置待接吗');
	if(yes == true) {
		var data = {
			oid: oid,
			ordertype: 20,
			perpetual: false
		};
		$.ajax({
			type: "post",
			url: "/order/update",
			async: false,
			data: data,
			success: function(msg) {
				if(msg.status == "9999") {
					alert(msg.info);
				}
				if(msg.status == "10000") {
					alert('操作成功');
					history.go(0);
				}
			},
			error: function() {}
		});
	} else {
		return false;
	}
}

//指派维修员
function construct(oid) {
	sessionStorage.setItem("oid",oid);
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
		oid: order_number,
		ordertype: order_type,
		beginTime: start_time,
		endTime: end_time,
		parent_cid: order_company
	};
	$.ajax({
		type: "post",
		url: "/order/pageNew",
		async: false,
		data: data,
		success: function(msg) {
			if(msg.status == "9999") {
				alert(msg.info);
			}
			if(msg.status == "10000") {
				requestList(msg);
				page({
					box: 'pages', //存放分页的容器
					href: '#',
					page: 1, //当前页码 
					count: msg.data.page.countPage, //总页数
					num: 5, //页面展示的页码个数
				});
				total_pages = msg.data.page.countPage;
			}
		},
		error: function() {
			alert('请求订单列表时发生未知错误');
		}
	});
});

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
		url: "/order/orderTypeCount.phone",
		data: data_for_select_data,
		async: false,
		success: function(msg) {
			if(msg.status == "9999") {
				alert(msg.info);
			}
			if(msg.status == "10000") {
				for(var i = 0; i < msg.data.length; i++) {
					if(msg.data[i].ordertypename == '已接单') {
						select_data[0] = msg.data[i].num;
					} else if(msg.data[i].ordertypename == '待接单') {
						select_data[1] = msg.data[i].num;
					} else if(msg.data[i].ordertypename == '处理中') {
						select_data[2] = msg.data[i].num;
					} else if(msg.data[i].ordertypename == '已挂起') {
						select_data[3] = msg.data[i].num;
					} else if(msg.data[i].ordertypename == '待返修') {
						select_data[4] = msg.data[i].num;
					} else if(msg.data[i].ordertypename == '拒绝返修') {
						select_data[5] = msg.data[i].num;
					} else if(msg.data[i].ordertypename == '待评价') {
						select_data[6] = msg.data[i].num;
					} else if(msg.data[i].ordertypename == '已评价') {
						select_data[7] = msg.data[i].num;
					} else if(msg.data[i].ordertypename == '已取消') {
						select_data[8] = msg.data[i].num;
					} else if(msg.data[i].ordertypename == '售后') {
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