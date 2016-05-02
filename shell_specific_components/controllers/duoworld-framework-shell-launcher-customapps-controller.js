//duoworld-framework-shell-launcher-customapps-controller.js

(function () {

    var duoworldFrameworkShellLauncherCustomappsCtrl = function ($scope, $state, $stateParams, $rootScope, $presence, $auth, $apps, $helpers, $timeout, $mdDialog) {

        $scope.defaultClassView = true;
        $scope.routedAppId = $stateParams.childAppID;
        $scope.routedAppName = $stateParams.childAppName;
        $scope.routedAppIconUri = $rootScope.opendAppIconUrl;
        $scope.routedAppPosition = $rootScope.openedAppPosition;

        var renderElement = "idRenderDiv";
        //$("#" + renderElement).empty();

        $apps.onAppOpened(function (e, data) {
            $scope.runningApp = data;
        });

        $apps.onAppClosed(function (e, data) {
            if (!data.instance.isChild()) {
                $window.history.back();
            }

        });

        $apps.execute($scope, renderElement, $scope.routedAppId, function (message) {
            alert(message);
        });

        var dwChildAppContainer = angular.element('.customeAppContainer');

        $scope.childApplicationClose = function () {
            var mainAppContainer = angular.element('.md-child-application-container');
            $rootScope.removeFromRunningApp(window.location.hash);
            mainAppContainer.css({
                'transform': 'scale(0)',
                'opacity': '0',
                'transform-origin': $rootScope.openedAppPosition.clientX + 'px ' + $rootScope.openedAppPosition.clientY + 'px',
            });

            $timeout(function () {
                $state.go('dock');
            }, 50);
        };
        $scope.childApplicationMinimise = function () {
            $rootScope.addToRunningApp($scope.routedAppName, $scope.routedAppIconUri);
            $state.go('dock');
        };

        $scope.keepTitleBar = true;
        $scope.childApplicationTitleBarpin = function () {
            $scope.keepTitleBar = !$scope.keepTitleBar;
        };
    };

    duoworldFrameworkShellLauncherCustomappsCtrl.$inject = ['$scope', '$state', '$stateParams', '$rootScope', '$presence', '$auth', '$apps', '$helpers', '$timeout', '$mdDialog'];

    mambatiFrameworkShell.controller('duoworld-framework-shell-launcher-customapps-ctrl', duoworldFrameworkShellLauncherCustomappsCtrl);
})();
