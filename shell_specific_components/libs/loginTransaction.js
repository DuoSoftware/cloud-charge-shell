/*login transaction script*/

var loginTransactionView = angular.module('loginTransaction', ['ngMaterial','ui.router','ngAnimate','ngMessages', 'uiMicrokernel']);

loginTransactionView.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('frameworkEntry', {
			url:'/parentEntry',
			templateUrl:'partials/frameworkTemplates/frameworkEntryParent.html',
			controller:'mambatiFrameworkEntry-ctrl'
		})
		.state('frameworkEntry.Login',{
			url:'/login',
			templateUrl:'partials/frameworkTemplates/login.html',
			controller:'mambatiFrameworkEntry-ctrl'
		})
		.state('frameworkEntry.Register',{
			url:'/register',
			templateUrl:'partials/frameworkTemplates/register.html',
			controller:'mambatiFrameworkEntry-ctrl'
		});

		$urlRouterProvider.otherwise('/parentEntry/login');
});

// begining of mambatiFrameworkLogin-ctrl control
(function(){

	var mambatiFrameworkEntryController = function($scope, $mdDialog, mambatiTennantInfoFactory, $http, $presence, $auth, $apps, $helpers){
		$scope.tennantDetails = {};

		$scope.loginDetails = {};

		$scope.registerDetails = {};

		mambatiTennantInfoFactory.importTennantDetails()
			.success(function(data, status, headers, config){
				console.log('succefull returned client config details.', status, data);
				$scope.tennantDetails = data;
			})
			.error(function(data, status, headers, config){
				console.log('could not return client config details.', status);
			});

	    $scope.submitLoginDetails = function(){

	    	var submitedCredentials = $scope.loginDetails;

	    	$auth.forceLogin(submitedCredentials.username, submitedCredentials.password, "");
			$auth.onLoginResult(function(data){
				location.href = "index.html";
			});

			$auth.onLoginError(function(data){
				console.log('attention username or password is wrong', data);
			});

			if ($auth.checkSession()){
				location.href= "index.html";
			}
	    };

	    $scope.submitRegistrationDetails = function(ev){
	    	var registrationSubmissionDetails = JSON.stringify({"EmailAddress":$scope.registerDetails.email,"Name":$scope.registerDetails.fullName,"Password":$scope.registerDetails.password,"ConfirmPassword":$scope.registerDetails.confirmPassword});
	    	
	    	console.log(registrationSubmissionDetails);

	    	$http({
	    		url: 'http://192.168.1.201:3048/AddUser',
	    		method: 'POST',
	    		data: registrationSubmissionDetails,
	    		headers: {'Content-Type': 'application/x-www-form-urlencoded'}	
	    	})
	    	.success(function (data,status,headers,config){
	    		location.href="frameworkEntry.html";
	    	})
	    	.error(function (data,status,headers,config){
	    		alert("all fail");
	    		console.log(data+" - "+status);
	    	});


	    };
	};

	mambatiFrameworkEntryController.$inject = ['$scope','$mdDialog','mambatiTennantInfoFactory','$http','$presence', '$auth', '$apps', '$helpers'];
	//Here the dependancies are injected into the controller as string values so that javascript utility tools such as minfiers will not effect the dependancies when they minify the source code.

	loginTransactionView.controller('mambatiFrameworkEntry-ctrl', mambatiFrameworkEntryController);
	//Here the said controller is registered with the main ap module.
})();

// end of mambatiFrameworkLogin-ctrl control


// begining of importTennantDetails factory
loginTransactionView.factory('mambatiTennantInfoFactory', function mambatiTennantInfoFactory ($rootScope, $http){
	var tennantDetails = {};

	tennantDetails.importTennantDetails = function(){
		return $http.get('tennantConfig.json')
			.error(function(data){
				alert('there was an error in retreving tennant config information.');
		});
	};

	return tennantDetails;
});
// end of importTennantDetails factory
