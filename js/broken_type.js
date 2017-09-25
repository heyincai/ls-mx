var broken_type_object = [];
var broken_type_name = [];
var broken_type_num = [];
var broken_device_select = $('#broken-device-select');
//请求数据
$.ajax({
	type: "post",
	url: "/main/webOrders/orderDr",
	async: false,
	success: function(msg) {
		if(msg.status == "0") {
			alert(msg.info);
		}
		if(msg.status == "1") {
			for(var i = 0; i < msg.data.length; i++) {
				broken_type_object.push(msg.data[i]);
				broken_device_select.append('<option value=' + msg.data[i].name + '>' + msg.data[i].name + '</option>');
			}
		}
	},
	error: function() {
		alert("请求故障类型分布数据时，未知的错误发生了");
	}
});

for(var i = 0; i < broken_type_object[0].repires.length; i++) {
	broken_type_name.push(broken_type_object[0].repires[i].name);
	broken_type_num.push(broken_type_object[0].repires[i].value)
}

//订单故障类型分布条形图
var charts = Highcharts.chart('container-broken-type', {
	chart: {
		type: 'bar'
	},
	title: {
		text: '订单故障类型分布',
		align: 'left',
		y: 20,
		style: {
			color: '#666666'
		}
	},
	xAxis: {
		categories: broken_type_name,
		title: {
			text: '故障类型'
		}
	},
	yAxis: {
		min: 0,
		title: {
			text: '订单数 (单)',
			align: 'high'
		},
		labels: {
			overflow: 'justify'
		}
	},
	plotOptions: {
		series: {
			borderRadius: 5,
			pointPadding: 0.35,
			dataLabels: {
				enabled: true,
				color: '#666666',
				fontWeight: '400',
				fontSize: '0.6rem',
			}
		}
	},
	exporting: {
		enabled: false
	},
	tooltip: {
		enabled: false
	},
	legend: {
		enabled: false
	},
	credits: {
		enabled: false
	},
	series: [{
		name: '订单数',
		colorByPoint: true,
		data: broken_type_num
	}]
});

broken_device_select.change(
	function() {
		var current_select = broken_device_select.val();
		for(var i=0;i<broken_type_object.length;i++){
			if(current_select == broken_type_object[i].name){
				for(var j = 0; j < broken_type_object[i].repires.length; j++) {
					broken_type_name.push(broken_type_object[i].repires[j].name);
					broken_type_num.push(broken_type_object[i].repires[j].value)
				}
			}
		}
		charts.xAxis[0].setCategories(broken_type_name);
		charts.series[0].setData(broken_type_num);
	}
);