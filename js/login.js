var wait = 60;

function time(o) {
	if(wait == 0) {
		o.removeAttribute("disabled");
		o.value = "获取验证码";
		wait = 60;
	} else {
		o.setAttribute("disabled", true);
		o.value = "(" + wait + ")";
		wait--;
		setTimeout(function() {
				time(o)
			},
			1000);
	}
}

function send(o) {
	var phone = $("#phone").val();
	if(!(/^1[34578]\d{9}$/.test(phone))) {
		showTip("手机号码有误，请重填");
		return false;
	}
	$.ajax({
		type: "post",
		url: "/main/sms/send",
		async: false,
		data: {
			phone:phone
		},
		success: function(msg) {
			if(msg.status == "0") {
				showTip(msg.info);
			}
			if(msg.status == "1") {
				time(o);
			}
		},
		error: function() {
			showTip("获取验证码时发生了未知错误。");
		}
	});
	return false;
}

function submitCode() {
	var code = $(".code:eq(0)").val();
	var phone = $("#phone").val();
	if(!(/^1[34578]\d{9}$/.test(phone))) {
		showTip("手机号码有误，请重填");
		return false;
	}
	if(!(/^\d{6}$/.test(code))) {
		showTip("验证码只能为6位数字。");
		return false;
	}
	$.ajax({
		type: "post",
		url: "/main/webUser/login",
		async: true,
		data: {
			phone: phone,
			code: code
		},
		success: function(msg) {
			if(msg.status == "0") {
				showTip(msg.info);
			}
			if(msg.status == "1") {
				sessionStorage.setItem("rid", msg.data.role_id);
				sessionStorage.setItem("uid", msg.data.user_id);
				window.location.href = "index.jsp";
			}

		},
		error: function() {
			showTip("未知的错误发生了！");
		}
	});
	return false;
}

function showTip(tip_text) {
	var tip_div = $(".alert.alert-danger");
	tip_div.html("<strong>提示：</strong>" + tip_text);
	tip_div.attr("class", "alert alert-danger show");
	setTimeout(function() {
		tip_div.attr("class", "alert alert-danger hidden");
	}, 1500);
}