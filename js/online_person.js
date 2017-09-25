//当前在线用户
var online_user_chart = Highcharts.chart('online-user', {
	chart: {
		type: 'spline',
		animation: Highcharts.svg,
		marginRight: 10
	},
	title: {
		text: '当前在线用户'
	},
	xAxis: {
		type: 'datetime',
		dateTimeLabelFormats:{
        	millisecond: '%H:%M:%S'
        }
	},
	yAxis: {
		title: {
			text: '人数'
		},
		plotLines: [{
			value: 0,
			width: 1,
			color: '#808080'
		}]
	},
	tooltip: {
		formatter: function() {
			return '<b>当前在线用户</b><br/>' +
				Highcharts.dateFormat('%H:%M:%S', this.x) + '<br/>' +
				Highcharts.numberFormat(this.y, 0);
		}
	},
	legend: {
		enabled: false
	},
	exporting: {
		enabled: false
	},
	credits: {
		enabled: false
	},
	series: [{
		name: '当前在线用户',
		data: []
	}]
});

//当前在线维修师
var online_engineer_chart = Highcharts.chart('online-engineer', {
	chart: {
		type: 'spline',
		animation: Highcharts.svg,
		marginRight: 10
	},
	title: {
		text: '当前在线维修师'
	},
	xAxis: {
		type: 'datetime',
		tdateTimeLabelFormats:{
        	millisecond: '%H:%M:%S'
        }
	},
	yAxis: {
		title: {
			text: '人数'
		},
		plotLines: [{
			value: 0,
			width: 1,
			color: '#808080'
		}]
	},
	tooltip: {
		formatter: function() {
			return '<b>当前在线维修师</b><br/>' +
				Highcharts.dateFormat('%H:%M:%S', this.x) + '<br/>' +
				Highcharts.numberFormat(this.y, 0);
		}
	},
	legend: {
		enabled: false
	},
	exporting: {
		enabled: false
	},
	credits: {
		enabled: false
	},
	series: [{
		name: '当前在线维修师',
		data: []
	}]
});

function getData() {
	var user_series = online_user_chart.series[0],
	engineer_series = online_engineer_chart.series[0];
	var user_y=50,engineer_y;
	var total_order = $("#total-order");
	var today_order = $("#today-order");
	var unaccept_order = $("#unaccept-order");
	var unaccept_order_ten = $("#unaccept-order-ten");
	var undo_order = $("#undo-order");
	var undo_order_ten = $("#undo-order-ten");
	var online_user_number = $("#online-user-number");
	var online_user_number_per = $("#online-user-number-per");
	var online_engineer_number = $("#online-engineer-number");
	var online_engineer_number_per = $("#online-engineer-number-per");
	var new_user_number = $("#new-user-number");
	var new_user_number_per = $("#new-user-number-per");
	setInterval(function() {
		var d = new Date();
		x = (d.getHours()*3600+d.getMinutes()*60+d.getSeconds())*1000;
		$.ajax({
			type: "post",
			url: "/main/webOrders/webCountDate",
			async: false,
			success: function(msg) {
				if(msg.status == "0") {
				}
				if(msg.status == "1") {
					user_y = msg.data.u;
					engineer_y = msg.data.tu;
					var isd = false;
					if(user_series.data.length == 10) {
						isd = true;
					}
					sessionStorage.setItem("orderCountN",msg.data.orderCountN);
					user_series.addPoint([x, user_y], true, isd);
					engineer_series.addPoint([x, engineer_y], true, isd);
					var user_points = user_series.points,
					engineer_points = engineer_series.points;
				    online_user_chart.tooltip.refresh(user_points[user_points.length-1]);
					online_engineer_chart.tooltip.refresh(engineer_points[engineer_points.length-1]);
					total_order.text(msg.data.orderCount + 2000);
					today_order.text('今日订单数: ' + msg.data.orderCountN);
					unaccept_order.text(msg.data.num);
					unaccept_order_ten.text(msg.data.ten + '单超过24小时');
					undo_order.text(msg.data.num2);
					undo_order_ten.text(msg.data.ten2 + '单超过24小时');
					online_user_number.text(msg.data.u);
					online_user_number_per.text('在线率' + msg.data.uPercen);
					online_engineer_number.text(msg.data.tu);
					online_engineer_number_per.text('出勤率' + msg.data.tuPercen);
					new_user_number.text(msg.data.addu);
					new_user_number_per.text('增长幅度变化:' + msg.data.adduPercen);
				}
			}
		});
	}, 5000);
}
getData();
