var device_type_data = [];
//请求数据
$.ajax({
	type: "post",
	url: "/main/webOrders/orderD",
	async: false,
	success: function(msg) {
		if(msg.status == "0") {
			alert(msg.info);
		}
		if(msg.status == "1") {
			for(var i = 0; i < msg.data.length; i++) {
				if(!msg.data[i].name) {
					continue;
				} else {
					device_type_data.push({
						name: msg.data[i].name,
						y: msg.data[i].value
					});
				}
			}
		}
	},
	error: function() {
		alert("请求设备类型分布数据时，未知的错误发生了");
	}
});

//订单设备类型分布条形图
Highcharts.chart('container-device-type', {
	chart: {
		type: 'column'
	},
	title: {
		text: '订单设备类型分布',
		align: 'left',
		y: 20,
		style: {
			color: '#666666'
		}
	},
	xAxis: {
		type: 'category'
	},
	yAxis: {
		title: {
			text: '订单数'
		}
	},
	credits: {
		enabled: false
	},
	legend: {
		enabled: false
	},
	colors: ['#c4a3f4', '#af83f2', '#a5a0fc', '#80a3fd', '#b4c5fd'],
	plotOptions: {
		series: {
			pointPadding: 0.3,
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
		data: device_type_data
	}]
});