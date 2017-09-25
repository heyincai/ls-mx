//初始化管理员信息
function initAdmin() {
	var rid = sessionStorage.getItem("rid");
	var info_p = $(".pull-left.info p");
	var imgSrc = "#";
	if(rid == 1) {
		imgSrc = "img/superadmin.png";
		info_p.text("超级管理员");
		$("title").text("密修管理总后台");
	}
	if(rid == 2) {
		imgSrc = "img/admin.png";
		info_p.text("管理员");
		$("title").text("密修管理分后台");
	}
	$(".img-circle").attr("src", imgSrc);
}
initAdmin();

//设置iframe的高度
var iframes = document.getElementById('iframepage');
var content_wrapper = document.getElementsByClassName('content-wrapper')[0];
iframes.style.height = content_wrapper.offsetHeight * 0.88 + "px";

//根据点击的菜单加载iframe里面的页面
function changePage(pages,event) {
	sessionStorage.setItem("cid","undefined");
	sessionStorage.setItem("parent_cid","undefined");
	sessionStorage.setItem("engineerRealname","undefined");
	sessionStorage.setItem("parent_engineer","undefined");
	sessionStorage.setItem("ordertype","undefined");
	sessionStorage.setItem("uid","undefined");
	sessionStorage.setItem("oid","undefined");
	var ifm = document.getElementById("iframepage");
	ifm.src = pages;
	if(event){
		$('.ctrl').attr("class","ctrl");
		event.target.setAttribute("class","ctrl white");
	}
}
