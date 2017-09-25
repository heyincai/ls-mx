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
$("#checkedDate").val(current_date);
var data_for_current_date = {
	data: 0,
	day: current_date
};
var data_for_current_month = {
	data: 4
};
var current_date_data = [0,0,0,0,0,0];
var current_month_data = [0,0,0,0,0,0];

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
				} else if(msg.data[i].status_name == '已完成') {
					current_date_data[3] = msg.data[i].num;
				} else if(msg.data[i].status_name == '已评价') {
					current_date_data[4] = msg.data[i].num;
				} else if(msg.data[i].status_name == '已取消') {
					current_date_data[5] = msg.data[i].num;
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

//请求当前月份的数据
$.ajax({
	type: "post",
	url: "/main/webOrders/orderTypeCount",
	data: data_for_current_month,
	async: false,
	success: function(msg) {
		if(msg.status == "0") {
			alert(msg.info);
		}
		if(msg.status == "1") {
			for(var i = 0; i < msg.data.length; i++) {
				if(msg.data[i].status_name == '已接单') {
					current_month_data[0] = msg.data[i].num;
				} else if(msg.data[i].status_name == '待接单') {
					current_month_data[1] = msg.data[i].num;
				} else if(msg.data[i].status_name == '处理中') {
					current_month_data[2] = msg.data[i].num;
				} else if(msg.data[i].status_name == '已完成') {
					current_month_data[3] = msg.data[i].num;
				} else if(msg.data[i].status_name == '已评价') {
					current_month_data[4] = msg.data[i].num;
				} else if(msg.data[i].status_name == '已取消') {
					current_month_data[5] = msg.data[i].num;
				} else {
					continue;
				}
			}
		}
	},
	error: function() {
		alert("请求当前月份订单状态时未知的错误发生了");
	}
});

//绘制图表
var mychart = Highcharts.chart('orderCharts_container', {
	chart: {
		type: 'column'
	},
	colors: ['#9ee0ff', '#b9c1ff'],
	credits: {
		enabled: false
	},
	exporting: {
		enabled: false
	},
	legend: {
		verticalAlign: 'top',
		x: 0
	},
	plotOptions: {
		series: {
			borderRadius: 5,
			pointPadding: 0.35,
			dataLabels: {
				enabled: true,
				color: '#666666',
				fontWeight: '400',
				fontSize: '0.6rem'
			}
		}
	},
	series: [{
		name: '当前日期',
		data: current_date_data
	}, {
		name: '当前月份',
		data: current_month_data
	}],
	title: {
		text: '订单状态分布',
		align: 'left',
		y: 20,
		style: {
			color: '#666666'
		}
	},
	tooltip: {
		enabled: false
	},
	xAxis: {
		categories: [
			'已接单',
			'待接单',
			'处理中',
			'已完成',
			'已评价',
			'已取消'
		],
		crosshair: true
	},
	yAxis: {
		gridLineColor: '#d2d2d2',
		title: {
			text: '订单数'
		}
	}
});

//请求选择日期的数据
$("#checkedDate").change(
	function() {
		var select_data = [];
		var check_Date = $("#checkedDate").val();
		var data = {
			data: 0,
			day: check_Date
		};
		$.ajax({
			type: "post",
			url: "/main/webOrders/orderTypeCount",
			data: data,
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
						} else if(msg.data[i].status_name == '已完成') {
							select_data[3] = msg.data[i].num;
						} else if(msg.data[i].status_name == '已评价') {
							select_data[4] = msg.data[i].num;
						} else if(msg.data[i].status_name == '已取消') {
							select_data[5] = msg.data[i].num;
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
		mychart.series[0].setData(select_data);
	}
);