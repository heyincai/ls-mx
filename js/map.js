$("#orderCountN").text(sessionStorage.getItem("orderCountN"));
var map = new AMap.Map('map-container', {
	resizeEnable: true,
	zoom: 15
});

//标注维修人员位置
var this_li_index = "-1";
var engineerMarkers = [];
var engineerList_html = '';
$.ajax({
	type: "post",
	url: "/main/webUser/showWxyLocation",
	async: true,
	success: function(msg) {
		if(msg.status == "0") {
			alert(msg.info);
		}
		if(msg.status == "1") {
			for(var i = 0; i < msg.data.length; i++) {
				var p = msg.data[i].picture;
				if(p.substring(p.length - 4, p.length) == 'null') {
					p = "./img/defultPicture.png";
				}
				var content = '<div class="mk-content">' +
					'<img src="./img/wxs_1.png"/>' +
					'<img src="' + p + '">' +
					'</div>';

				var mk = new AMap.Marker({
					content: content,
					offset: new AMap.Pixel(-18, -47.33),
					position: [msg.data[i].maintenance_longitude, msg.data[i].maintenance_latitude],
					title: "我是" + msg.data[i].maintenance_name,
					map: map,
					extData: {
						uid: msg.data[i].maintenance_id,
						photoSRC: p,
						name: msg.data[i].maintenance_name,
						phone: msg.data[i].maintenance_phone,
						company: msg.data[i].company_name ? msg.data[i].company_name : "",
						status: msg.data[i].is_busy == 0 ? "<span style='color:green;'>空闲</span>" : "<span style='color:#999999;'>繁忙</span>"
					}
				});
				engineerMarkers.push(mk);
				AMap.event.addListener(mk, 'click', clickEngineer);
				engineerList_html += '<li class="engineer-li btn-default" onclick="clickEngineer(' + i + ')"><div><img src="' + p + '">' +
					'<span>' + msg.data[i].maintenance_name + '</span><span style=' +
					(msg.data[i].is_busy == 0 ? "'color:green;'>空闲" : "'color:#999999;'>繁忙") + '</span></div></li>';
			}
			if(engineerList_html == '') {
				engineerList_html = "<li>没有在线维修员</li>";
			}
			$(".info-list ul:eq(0)").html(engineerList_html);
		}

	},
	error: function() {
		$(".info-list ul:eq(0)").html('');
		alert("请求维修员位置数据时发生未知错误。");
	}
});

//标注订单位置
var orderMarkers = [];
var orderList_html = '';
$.ajax({
	type: "post",
	url: "/main/webOrders/getWaitAcceptOrder",
	async: true,
	success: function(msg) {
		if(msg.status == "0") {
			alert(msg.info);
		}
		if(msg.status == "1") {
			for(var i = 0; i < msg.data.length; i++) {
				var content = '<div class="mk-content">' +
					'<img src="./img/macon_1.png"">' +
					'</div>';
				var orderAddress = msg.data[i].order_contact_address;
				var mk = new AMap.Marker({
					content: content,
					offset: new AMap.Pixel(-18, -18),
					position: [msg.data[i].order_longitude, msg.data[i].order_latitude],
					title: "订单",
					map: map,
					extData: {
						li_index: i,
						orderId: msg.data[i].order_id,
						userPhone: msg.data[i].order_contact_phone,
						deviceType: msg.data[i].device_type_name,
						deviceFixType: msg.data[i].reqair_name,
						status: msg.data[i].status_name,
						address: orderAddress,
						company: msg.data[i].order_company_name ? msg.data[i].order_company_name : ""
					}
				});
				orderMarkers.push(mk);
				AMap.event.addListener(mk, 'click', clickOrder);
				orderList_html += '<li class="btn-default" onclick="clickOrder(' + i + ')"><div><span>' +
					msg.data[i].order_id + '</span> <span>'/* +
					msg.data[i].createtime.substring(11, 18)*/ + '</span></div></li>';
			}
			if(orderList_html == '') {
				orderList_html = "<li>没有待接单。</li>";
			}
			$(".info-list ul:eq(1)").html(orderList_html);
		}

	},
	error: function() {
		$(".info-list ul:eq(1)").html('');
		alert("请求订单位置数据时发生未知错误。");
	}
});

//点击地图中的维修员时弹出详细信息
var infoWindow = null;

function clickEngineer(e) {
	var event = {};
	if(typeof e == "number") {
		event.target = engineerMarkers[e];
	} else {
		event = e;
	}
	map.setZoom(18);
	setTimeout(function() {
		map.setCenter(event.target.getPosition().offset(0, 40));
	}, 300);
	var eD = event.target.getExtData();
	content = '<div class="info-win">' +
		'<div><img src="' + eD.photoSRC + '" style="width:10rem;height:10rem;"></div><br>' +
		'姓名：' + eD.name + ' <br>' +
		'电话：' + eD.phone + ' <br>' +
		'状态：' + eD.status + '<br>' +
		'公司：' + eD.company +
		'</div>';
	infoWindow = new AMap.InfoWindow({
		offset: new AMap.Pixel(0, -30),
		content: content,
		autoMove: false
	});
	infoWindow.open(map, event.target.getPosition());
}

//点击地图中的订单时弹出详细信息
function clickOrder(e) {
	var event = {};
	if(typeof e == "number") {
		event.target = orderMarkers[e];
	} else {
		event = e;
	}
	var content = '<div class="mk-content">' +
		'<img src="./img/macon_active.png">' +
		'</div>';
	event.target.setOffset(new AMap.Pixel(-18, -18));
	event.target.setContent(content);
	map.setZoom(18);
	setTimeout(function() {
		map.setCenter(event.target.getPosition().offset(0, -20));
	}, 300);
	var eD = event.target.getExtData();
	if(this_li_index != "-1" && this_li_index != eD.li_index) {
		var content = '<div class="mk-content">' +
			'<img src="./img/macon_1.png">' +
			'</div>';
		orderMarkers[this_li_index].setContent(content);
	}
	this_li_index = eD.li_index;
	content = '<div class="info-win">' +
		'订单编号：' + eD.orderId + ' <br>' +
		'用户电话：' + eD.userPhone + ' <br>' +
		'设备类型：' + eD.deviceType + ' <br>' +
		'设备维修类型：' + eD.deviceFixType + ' <br>' +
		'状态：' + eD.status + ' <br>' +
		'地址： ' + eD.address + ' <br>' +
		'公司：' + eD.company +
		'</div>';
	infoWindow = new AMap.InfoWindow({
		content: content,
	});
	infoWindow.open(map, event.target.getPosition());
}

//function resetWindow(){
//	var content = '<div class="mk-content">' +
//			'<img src="./img/macon_1.png">' +
//			'</div>';
//		orderMarkers[this_li_index].setContent(content);
//}

$('body').click(function(event) {
	if(event.target.className != 'info-win' && event.target.className != '' && infoWindow != null) {
		var content = '<div class="mk-content">' +
			'<img src="./img/macon_1.png">' +
			'</div>';
		orderMarkers[this_li_index].setContent(content);
		infoWindow.close();
		infoWindow = null;
	}
});

//setInterval(function(){
////	$.ajax({
////		type: "post",
////		url: "/user/showWxyLocation",
////		async: true,
////		success: function(msg) {
////			if(msg.status == "0") {
////				alert(msg.info);
////			}
////			if(msg.status == "1") {
////				for(var i = 0; i < msg.data.length; i++) {
////					
////				}
////			}
////		},
////		error:function(){
////			
////		}
////	});
//	
//	
//	if(engineerMarkers.length>0){
//		var mk0 = engineerMarkers[0];
//		mk0.setPosition(mk0.getPosition().offset(0, -2));
//
//	}
//},3000);

if(sessionStorage.getItem("engineerRealname") != "undefined") {
	$("#key-input").val(sessionStorage.getItem("engineerRealname"));
	$("#key-select").val("维修员");
	setTimeout(search, 500);
}

//按关键字查找
function search() {
	var k_in = $("#key-input");
	var k_se = $("#key-select");
	var data;
	if(k_in.val().length == 0) {
		alert("请输入关键词");
		return false;
	}
	if(k_se.val() == "维修员") {
		ajaxUrl = "/main/webUser/showWxyLocation";
		data = {
			realname: k_in.val()
		};
	} else {
		ajaxUrl = "/main/webOrders/getWaitAcceptOrder";
		data = {
			order_id: k_in.val()
		};
	}
	$.ajax({
		type: "post",
		url: ajaxUrl,
		async: true,
		data: data,
		success: function(msg) {
			if(msg.status == "0") {
				alert(mgs.info);
			}
			if(msg.status == "1") {
				if(msg.data.length == 0) {
					alert("所查询的" + k_se.val() + "不存在");
				} else {
					if(k_se.val() == "维修员") {
						$(".engineer-li").hide();
						for(var i = 0; i < msg.data.length; i++) {
							for(var j = 0; j < engineerMarkers.length; j++) {
								var eD = engineerMarkers[j].getExtData();
								if(eD.uid == msg.data[i].maintenance_id) {
									$(".engineer-li:eq(" + j + ")").show();
									if(i == 0) {
										clickEngineer(j);
									}
									break;
								}
							}
						}
					} else {
						for(var i = 0; i < orderMarkers.length; i++) {
							var eD = orderMarkers[i].getExtData();
							if(eD.orderId == msg.data[0].order_id) {
								clickOrder(i);
								break;
							}
						}
					}
				}
			}
		},
		error: function() {
			alert("搜索时发生未知错误");
		}
	});
	return false;
}