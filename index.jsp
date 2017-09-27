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

		<style>
			/*html,body,.wrapper{
				height: 100% !important;
			}*/
		</style>

		<!-- 引入兼容IE8的两个js文件 -->
		<!--[if lt IE 9]>
  		<script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
  		<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  		<![endif]-->

	</head>

	<body class="skin-purple sidebar-mini">

		<!-- 整个页面的容器 -->
		<div class="wrapper">

			<!-- 顶部导航栏 -->
			<header class="main-header">

				<!-- 顶部左边logo -->
				<a href="#" class="logo">
					<!-- 菜单收回顶部左边logo样式 -->
					<span class="logo-mini"><b>Mi</b>Xiu</span>
					<!-- 菜单展开顶部左边logo样式 -->
					<span class="logo-lg"><b>MiXiu</b>管理后台</span>
				</a>

				<nav class="navbar navbar-static-top">
					<!-- 菜单展开和收回切换按钮 -->
					<a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
						<span class="sr-only">Toggle navigation</span>
					</a>
					<!-- 顶部右边 -->
					<div class="navbar-custom-menu">
						<ul class="nav navbar-nav">
							<li>
								<a href="#" data-toggle="control-sidebar">
									<i class="fa fa-gear"></i> 设置
								</a>
							</li>
						</ul>
					</div>
				</nav>

			</header>

			<!-- 左侧菜单栏 -->
			<aside class="main-sidebar">
				<section class="sidebar">
					<br />
					<!-- 登录用户展示 -->
					<div class="user-panel">
						<div class="pull-left image">
							<img src="#" class="img-circle" alt="用户头像">
						</div>
						<div class="pull-left info">
							<p></p>
							<a href="#"><i class="fa fa-circle text-success"></i> 正在线上</a>
						</div>
					</div>
					<!-- 搜索框 -->
					<!--<form action="#" method="get" class="sidebar-form">
						<div class="input-group">
							<input type="text" name="q" class="form-control" placeholder="查找...">
							<span class="input-group-btn">
                				<button type="submit" name="search" id="search-btn" class="btn btn-flat"><i class="fa fa-search"></i>
                				</button>
              				</span>
						</div>
					</form>-->
					<!-- 左侧菜单 -->
					<ul class="sidebar-menu tree" data-widget="tree">
						<li class="header"><i class="fa fa-bars"></i> 基本操作</li>
						<li>
							<a onclick="changePage('main-iframe.html')"><i class="fa fa-home"></i> <span>后台首页</span></a>
						</li>
						<li class="treeview">
							<a href="#">
								<i class="fa fa-sitemap"></i> <span>系统管理</span>
								<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>
							</a>
							<ul class="treeview-menu">
								<li class="superAd">
									<a class="ctrl" onclick="changePage('deviceType_admin.html',event)"><i class="fa fa-circle-o"></i> 设备类型</a>
								</li>
								<li>
									<a class="ctrl" onclick="changePage('company.html',event)"><i class="fa fa-circle-o"></i> 服务单位类型管理</a>
								</li>
								<li>
									<a class="ctrl" onclick="changePage('becompany.html',event)"><i class="fa fa-circle-o"></i> 被服务单位管理</a>
								</li>
								<li>
									<a class="ctrl" onclick="changePage('userAdmin.html',event)"><i class="fa fa-circle-o"></i> 用户管理</a>
								</li>
								<li>
									<a class="ctrl" onclick="changePage('engineerAdmin.html',event)"><i class="fa fa-circle-o"></i> 维修员管理</a>
								</li>
								<!--<li>
									<a href="#" onclick="changePage('/user/page?rid=4${sessionScope.user.rid eq '1'?'':'&parent_cid='}${sessionScope.user.rid eq '1'?'':sessionScope.user.cid}&level=1')"><i class="fa fa-circle-o"></i> 维修员管理</a>
								</li>-->
								<li>
									<a class="ctrl" onclick="changePage('orderAdmin.html',event)"><i class="fa fa-circle-o"></i> 订单管理</a>
								</li>
								<li>
									<a class="ctrl" onclick="changePage('map.html',event)"><i class="fa fa-circle-o"></i> 地图展示</a>
								</li>
								<li class="superAd">
									<a class="ctrl" onclick="changePage('/region/list?parentId=1',event)"><i class="fa fa-circle-o"></i> 区域管理</a>
								</li>
								<li>
									<a class="ctrl" onclick="changePage('/admin/message.jsp',event)"><i class="fa fa-circle-o"></i> 系统通知</a>
								</li>
								<li>
									<a class="ctrl" onclick="changePage('/fb/page',event)"><i class="fa fa-circle-o"></i> 意见反馈</a>
								</li>
							</ul>
						</li>

						<li class="treeview">
							<a href="#">
								<i class="fa fa-line-chart"></i> <span>统计报表</span>
								<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>
							</a>
							<ul class="treeview-menu">
								<li>
									<a class="ctrl" onclick="changePage('/back/statement/index',event)"><i class="fa fa-circle-o"></i> 订单详情报表</a>
								</li>
								<li>
									<a class="ctrl" onclick="changePage('/user/secretWxy',event)"><i class="fa fa-circle-o"></i> 认证维修员订单报表</a>
								</li>
								<li>
									<a class="ctrl" onclick="changePage('/user/notSecretWxy',event)"><i class="fa fa-circle-o"></i> 非涉密维修员订单报表</a>
								</li>
							</ul>
						</li>
							<li class="treeview ordinaryAD">
								<a>
									<i class="fa fa-envelope"></i> <span>审核通知</span>
									<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>
								</a>
								<ul class="treeview-menu">
									<li>
										<a class="ctrl" onclick="changePage('/back/company/inform?parent_cid=${sessionScope.user.rid eq '1'?'':sessionScope.user.cid}',event)"><i class="fa fa-circle-o"></i> 审核通知</a>
									</li>
								</ul>
							</li>
						<li class="header"><i class="fa fa-user"></i> 个人管理</li>
						<!--<li>
							<a href="#"  onclick="editSys();" class="bg-purple"><i class="fa fa-lock"></i> <span>修改密码</span></a>
						</li>-->
						<li>
							<a class="bg-blue" href="login.html" onclick="return confirm('确认退出？');"><i class="fa fa-power-off"></i> <span>退出</span></a>
						</li>
					</ul>
				</section>
			</aside>

			<!-- 中间内容 -->
			<div class="content-wrapper">
				<!-- 中间内容物 -->
				<iframe src="main-iframe.html" id="iframepage" width="100%" style="margin-top: 0.5rem;" frameborder="0"></iframe>
				<!--<iframe src="http://120.77.242.131/back/company/beServiceIndex"></iframe>-->
			</div>
			<!-- 底部标注 -->
			<footer class="main-footer">
				<div class="pull-right hidden-xs">
					<b>版本号</b> 2.0
				</div>
				<strong>Copyright 2015 广东立升科技有限公司版权所有 <a target="_blank" href="http://www.miitbeian.gov.cn/">备案号：粤ICP备16004815号-2</a></strong>
			</footer>

			<!-- 右侧菜单栏 -->
			<aside class="control-sidebar control-sidebar-dark">
			</aside>
			<!-- 右侧菜单栏的样式，底部距离为0等 -->
			<div class="control-sidebar-bg"></div>

		</div>

		<!-- 引入jquery函数库 -->
		<script src="js/vendor/jquery.min.js"></script>

		<!-- 引入adminlte.js -->
		<script src="js/adminlte.min.js"></script>

		<!-- 引入bootstrap基础插件 -->
		<script src="js/bootstrap.min.js"></script>

		<!-- 引入fastclick -->
		<script src="js/fastclick.js"></script>

		<!-- 引入滚动条美化插件 -->
		<script src="js/jquery.slimscroll.min.js"></script>

		<!-- 引入自定义的js文件 -->
		<script src="js/index.js"></script>
	</body>

</html>