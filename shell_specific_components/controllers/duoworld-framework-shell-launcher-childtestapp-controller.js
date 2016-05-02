//duoworld-framework-shell-launcher-childtestapp-controller.js

(function(){

	var duoworldFrameworkShellLauncherChildtestappCtrl = function($scope, $timeout, $state, $stateParams, $rootScope, $presence, $auth, $apps, $helpers){

		/*controler default initiation variables*/

		$scope.headerBarClassStatus = "headerBarHidden";

		$scope.appDetails = {'appIconImage':'images/appIcons/expenses.png', 'appName':'Expenses Application'};

		$scope.ignoreScript = function(){
			// $scope.routedAppId = $stateParams.childAppID;
			// $scope.routedAppName = $stateParams.childAppName;

			// console.log($scope.routedAppId, $scope.routedAppName);

			// var renderElement = "idRenderDiv";

			// $("#" + renderElement).empty();

			// $scope.childApplicationClose = function(){
			// 	$scope.runningApp.instance.close();

			// };

			// $scope.toggleAppDimension = function(){
			// 	$scope.appDimension = !$scope.appDimension;
			// };

			// $apps.onAppOpened(function(e,data){
			// 	$scope.runningApp = data;
			// });

			// $apps.onAppClosed(function(e,data){
			// 	if (!data.instance.isChild()){
			// 		$window.history.back();
			// 	}

			// });

			// $apps.execute($scope, renderElement, $scope.routedAppId, function (message){
			// 	alert (message);
			// });
		};

		$scope.defaultClassView = true;

		var init = function(){
			var dwChildAppSplashCover = angular.element('.dw-childapp-backgroundcover');
			var dwChildAppSplashLogo = angular.element('.dw-childapp-splash-logo');
			var dwChildAppSplashText = angular.element('.dw-childapp-splash-title');
			var dwChildAppSplashLoadingSpinner = angular.element('.dw-childapp-splash-loadingspinner');
			var dwChildAppSplashLoadingTextIndicator = angular.element('.dw-childapp-splash-loadingtextindicator');
			var dwChildAppHeaderInfomationTitle = angular.element('.dw-child-application-header-control-bar-left-section span');
			var dwChildAppHeaderInfomationIcon = angular.element('.dw-child-application-header-control-bar-left-section img');

			$timeout(function(){
				$scope.headerBarClassStatus = "headerBarRevealed";
			},1000);

			$timeout(function(){
				dwChildAppSplashLogo.css('bottom','0px');
			},1300);

			$timeout(function(){
				dwChildAppSplashText.css('top','0px');
			},1500);

			$timeout(function(){
				dwChildAppSplashLoadingSpinner.css('top','0px');
			},1700);

			$timeout(function(){
				dwChildAppSplashLoadingTextIndicator.css('top','0px');
			},1800);


			$timeout(function(){
				dwChildAppSplashLoadingSpinner.css('top','-400px');
				dwChildAppSplashLoadingTextIndicator.css('top','-400px');
			},4500);

			$timeout(function(){
				dwChildAppSplashText.css('top','-400px');
			},4800);

			$timeout(function(){
				dwChildAppSplashLogo.css('bottom','-150px');
			},5000);

			$timeout(function(){
				dwChildAppSplashCover.css('height','200px');
			},5200);

			$timeout(function(){
				dwChildAppHeaderInfomationTitle.css('top','0px');
				dwChildAppHeaderInfomationIcon.css('top','0px');
			},5200);

		};

		init();
	};

	duoworldFrameworkShellLauncherChildtestappCtrl.$inject = ['$scope','$timeout','$state','$stateParams','$rootScope','$presence','$auth','$apps','$helpers'];

	mambatiFrameworkShell.controller('duoworld-framework-shell-launcher-childtestapp-ctrl', duoworldFrameworkShellLauncherChildtestappCtrl);
})();
