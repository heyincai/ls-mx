var xLabel = [];
var newUData = [];
var newFData = [];
//请求数据
$.ajax({
	type: "post",
	url: "/main/webUser/addUserCount",
	async: false,
	success: function(msg) {
		if(msg.status == "0") {
			alert(msg.info);
		}
		if(msg.status == "1") {
			newUData.push(msg.data.user.c7);
			newUData.push(msg.data.user.c6);
			newUData.push(msg.data.user.c5);
			newUData.push(msg.data.user.c4);
			newUData.push(msg.data.user.c3);
			newUData.push(msg.data.user.c2);
			newUData.push(msg.data.user.c1);
			
			newFData.push(msg.data.fix.c7);
			newFData.push(msg.data.fix.c6);
			newFData.push(msg.data.fix.c5);
			newFData.push(msg.data.fix.c4);
			newFData.push(msg.data.fix.c3);
			newFData.push(msg.data.fix.c2);
			newFData.push(msg.data.fix.c1);
			
			xLabel.push(msg.data.date.d7);
			xLabel.push(msg.data.date.d6);
			xLabel.push(msg.data.date.d5);
			xLabel.push(msg.data.date.d4);
			xLabel.push(msg.data.date.d3);
			xLabel.push(msg.data.date.d2);
			xLabel.push(msg.data.date.d1);
		}
	},
	error: function() {
		alert("请求新增用户、维修员时，未知的错误发生了");
	}
});
//新增用户面积图
$('#new-user').highcharts({
	chart: {
		type: 'areaspline'
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
		allowDecimals: false,
		labels: {
			formatter: function(){
				return xLabel[this.value].substring(6,10);
			}
		}
	},
	yAxis: {
		title: {
			text: '人数'
		},
		labels: {
			formatter: function() {
				return this.value;
			}
		}
	},
	legend: {
		verticalAlign: 'top',
		x: 0
	},
	credits: {
		enabled: false
	},
	tooltip: {
		enabled: true,
	},
	colors: [
		'#78dff0', '#bdbdfd'
	],
	series: [{
		name: '新增用户',
		data: newUData
	}, {
		name: '新增维修员',
		data: newFData
	}]
});