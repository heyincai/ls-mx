$(function() {

	//geojson核心数据
	var data = Highcharts.geojson(mmddtt);
	$.each(data, function(i) {
		this.value = 0;
	});

	//请求地图数据
	$.ajax({
		type: "post",
		url: "/main/webUser/userRegData",
		async: false,
		success: function(msg) {
			if(msg.status == "0") {
				alert(msg.info);
			}
			if(msg.status == "1") {
				//geojson核心数据
				//var data = Highcharts.geojson(mmddtt);
				$.each(data, function() {
					for(var i = 0; i < msg.data.length; i++) {
						if(this.name == msg.data[i].region_name) {
							this.value = msg.data[i].value;
							break;
						}
						this.value = 0;
					}
				});

			}
		},
		error: function() {
			alert("请求用户分布区域数据时，未知的错误发生了");
		}
	});

	//初始化地图
	var myMap = Highcharts.mapChart('user-map', {
		//标题
		title: {
			text: '东莞市用户分布区域'
		},

		subtitle: {
			text: ''
		},

		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'middle'
		},

		credits: {
			enabled: false
		},

		tooltip: {
			//pointFormat: "{point.properties.name}:{point.value}"
			formatter: function() {
				return this.point.name + '：' + this.point.value;
			}
		},

		//省市程度色彩设置
		colorAxis: {
			min: 0,
			minColor: '#ffffff',
			maxColor: '#8693f3'
		},

		mapNavigation: {
			enabled: false
		},

		plotOptions: {
			map: {
				states: {
					hover: {
						color: '#EEDD66'
					}
				}
			}
		},

		//默认状态下，地图图表均不显示数据标签。用户需要在数据列中启用才可以。这时，需要使用配置项enabled为true
		series: [{
			data: data,
			name: '',
			dataLabels: {
				enabled: true,
				format: '{point.properties.name}' //设置显示形式，这里显示的是 各城市名称
			}
		}],
	});
	$('#user-map').click(function() {
		myMap.update({
			mapNavigation: {
				enabled: true
			}
		});
	}).mouseleave(function() {
		myMap.update({
			mapNavigation: {
				enabled: false
			}
		});
	});
});