<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html>

	<head>

		<title>密修管理后台</title>

		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">

		<!-- 引入bootstrap基础样式 -->
		<link rel="stylesheet" href="css/bootstrap.min.css" />

		<!-- 引入字体样式 -->
		<link rel="stylesheet" href="css/font-awesome.min.css">

		<!-- 引入adminlte的基础样式 -->
		<link rel="stylesheet" href="css/AdminLTE.css" />

		<!-- 引入adminlte的所有颜色样式 -->
		<link rel="stylesheet" href="css/_all-skins.css" />

		<!-- 引入自定义的样式表 -->
		<link rel="stylesheet" href="css/main.css" />

		<!-- 引入兼容IE8的两个js文件 -->
		<!--[if lt IE 9]>
  		<script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
  		<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  		<![endif]-->

	</head>

	<body class="skin-purple sidebar-mini">
		<div style="padding: 20px; background-color: rgb(236,240,245);">
			<div class="row" ng-app="unaccept-order" ng-controller="unaccept-order-ctrl">
				<div class="col-md-2 col-sm-4 col-xs-6">
					<div class="small-box bg-yellow shadow-yellow">
						<div class="inner">
							<h3 id="total-order" ng-bind="(datas.orderCount + 2000) || error_info || 0"></h3>
							<p>所有订单</p>
						</div>
						<a id="today-order" href="orderAdmin.html" class="small-box-footer" ng-bind="thisMonthOrder || error_info || 0"></a>
					</div>
				</div>
				<div class="col-md-2 col-sm-4 col-xs-6">
					<!-- small box -->
					<div class="small-box bg-blue shadow-blue">
						<div class="inner">
							<h3 id="unaccept-order" ng-bind="datas.num || error_info || 0"></h3>
							<p>待接订单</p>
						</div>
						<a id="unaccept-order-ten" onclick="turn_to_order(1)" class="small-box-footer" ng-bind="unacceptOrder24 || error_info || 0"></a>
					</div>
				</div>
				<div class="col-md-2 col-sm-4 col-xs-6">
					<!-- small box -->
					<div class="small-box bg-green shadow-green">
						<div class="inner">
							<h3 id="undo-order" ng-bind="datas.num2 || error_info || 0"></h3>
							<p>待处理</p>
						</div>
						<a id="undo-order-ten" onclick="turn_to_order(2)" class="small-box-footer" ng-bind="doingOrder24 || error_info || 0"></a>
					</div>
				</div>
				<script>
					function turn_to_order(e){
						if(e == 1){
							sessionStorage.setItem("ordertype",1);
						}
						else if(e == 2){
							sessionStorage.setItem("ordertype",2);
						}
						location.href = "orderAdmin.html";
					}
				</script>
				<div class="col-md-2 col-sm-4 col-xs-6">
					<!-- small box -->
					<div class="small-box bg-purple shadow-purple">
						<div class="inner">
							<h3 id="online-user-number" ng-bind="datas.u || error_info || 0"></h3>
							<p>在线客户</p>
						</div>
						<a id="online-user-number-per" href="userAdmin.html" class="small-box-footer" ng-bind="onlineUserPercent || error_info || 0"></a>
					</div>
				</div>
				<div class="col-md-2 col-sm-4 col-xs-6">
					<!-- small box -->
					<div class="small-box bg-red shadow-red">
						<div class="inner">
							<h3 id="online-engineer-number" ng-bind="datas.tu || error_info || 0"></h3>
							<p>在线工程师</p>
						</div>
						<a id="online-engineer-number-per" href="engineerAdmin.html" class="small-box-footer" ng-bind="onlineEngineerPercent || error_info || 0"></a>
					</div>
				</div>
				<div class="col-md-2 col-sm-4 col-xs-6">
					<!-- small box -->
					<div class="small-box bg-aqua shadow-aqua">
						<div class="inner">
							<h3 id="new-user-number" ng-bind="datas.addu || error_info || 0"></h3>
							<p>新增用户</p>
						</div>
						<a id="new-user-number-per" href="#" class="small-box-footer" ng-bind="addPercent || error_info || 0"></a>
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-md-7 col-xs-12">
					<!-- 订单状态 -->
					<div style="position: relative">
						<input id="checkedDate" type="date" style="position: absolute;top: 1rem;right: 1rem;z-index: 9999;border-radius: 3px;border: 1px solid #9ee0ff;" />
						<div id="orderCharts_container">

						</div>
					</div><br />

					<!-- 订单类型分布 -->
					<div id="container-device-type">

					</div><br />
				</div>
				<div class="col-md-5 col-xs-12">
					<!-- 订单故障类型分布 -->
					<div style="position: relative">
						<select id="broken-device-select" style="position: absolute;top: 1rem;right: 1rem;z-index: 9999;border-radius: 3px;border: 1px solid #9ee0ff;">

						</select>
						<div id="container-broken-type" style="height: 821px;">

						</div>
					</div><br />
				</div>
			</div>

			<div class="row">
				<div class="col-md-12">
					<!-- 用户分布 -->
					<div id="user-map">

					</div><br />
				</div>
			</div>

			<div class="row">
				<div class="col-md-7">
					<!-- 新增用户 -->
					<div id="new-user">

					</div><br />
				</div>
				<div class="col-md-5">
					<!-- 在线用户 -->
					<div id="online-user" style="height: 190px;">

					</div><br />
					<!-- 在线工程师 -->
					<div id="online-engineer" style="height: 190px;">

					</div>
				</div>
			</div>
		</div>

		<!-- 引入jquery函数库 -->
		<script src="js/vendor/jquery.min.js"></script>

		<!-- 引入angular.js框架 -->
		<script src="js/angular/angular.js"></script>

		<!-- 引入adminlte.js -->
		<script src="js/adminlte.min.js"></script>

		<!-- 引入bootstrap基础插件 -->
		<script src="js/bootstrap.min.js"></script>

		<!-- 引入fastclick -->
		<script src="js/fastclick.js"></script>

		<!-- 引入滚动条美化插件 -->
		<script src="js/jquery.slimscroll.min.js"></script>

		<!-- 引入highcharts插件 -->
		<script src="js/highcharts/highcharts.js"></script>
		<script src="js/highcharts/map.js"></script>
		<script src="js/highcharts/exporting.js"></script>
		<script src="https://img.hcharts.cn/highcharts-plugins/highcharts-zh_CN.js"></script>
		<!--<script src="js/highcharts/highcharts-zh_CN.js"></script>-->

		<!-- 引入自定义js -->
		<script src="js/order_and_user.js"></script>
		<!--<script src="js/order_status.js"></script>
		<script src="js/device_type.js"></script>
		<script src="js/broken_type.js"></script>
		<script src="js/new_user.js"></script>
		<script src="js/online_person.js"></script>
		<script src="js/dongguanMap.js"></script>
		<script src="js/user_map.js"></script>-->
	</body>

</html>