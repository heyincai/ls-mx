var app = angular.module('unaccept-order', []);

app.controller('unaccept-order-ctrl', function($scope, $http) {
	$http({
		method: 'post',
		url: '/main/webOrders/webCountDate',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		transformRequest: function(obj) {
			var str = [];
			for(var p in obj) {
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			}
			return str.join("&");
		}
	}).then(function successCallback(response) {
			if(response.data.status == '0') {
				$scope.error_info = 'XX';
			}
			if(response.data.status == '1') {
				$scope.datas = response.data.data;
				sessionStorage.setItem("orderCountN",response.data.data.orderCountN);
				$scope.thisMonthOrder = '今日订单数: ' + response.data.data.orderCountN;
				$scope.unacceptOrder24 = response.data.data.ten + '单超过24小时';
				$scope.doingOrder24 = response.data.data.ten2 + '单超过24小时';
				$scope.onlineUserPercent = '在线率' + response.data.data.uPercen;
				$scope.onlineEngineerPercent = '出勤率' + response.data.data.tuPercen;
				$scope.addPercent = '增长幅度变化:' + response.data.data.adduPercen;
			}
		},
		function errorCallback(response) {
			$scope.error_info = 'XXX';
		});
});