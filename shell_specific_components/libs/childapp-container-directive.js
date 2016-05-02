(function (shellDirectives) {
    shellDirectives.directive('customappContainer', ['$compile', '$state', '$timeout', function ($compile, $state, $timeout) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                routedAppName: "=routedappname",
                accentpalette: "=accentpalette",
                routedAppIconUri: "=routedappiconuri",
                position: "=position"
            },
            template: '<div id="dw-child-test-app-1" class="md-child-application-container" layout="column" layout-align="start center">\
<div style="height:1px;bckground-color:rgba(0, 0, 0, 0.15);width:100%;z-index:3;" ng-mouseenter="hideHeaderControlBar = false" ></div>\
	<div class="dw-child-application-header-control-bar" layout="row" layout-align="space-between center" style="background-color:{{accentpalette}} !important;top:0px !important;" ng-if="!hideHeaderControlBar || keepTitleBar" >\
		<div class="dw-child-application-header-control-bar-left-section" layout="row" layout-align="center center">\
			<img class="dw-child-application-header-icon" ng-src="data:image/png;base64,{{routedAppIconUri}}" err-src="images/appIcons/untitledapplication.png" width="24" height="24" style="    border-radius: 100%;">\
			<span class="dw-child-application-header-title">{{routedAppName}}</span>\
		</div>\
		<div class="dw-child-application-header-control-bar-right-section" layout="row" layout-align="end center">\
 <md-button class="md-icon-button animatedHeaderControl" aria-label="Minimise Application" ng-click="childApplicationTitleBarpin()">\
		        <md-icon md-svg-icon="icons/pin.svg" alt="pinit" class="cad24" ng-show="!keepTitleBar"></md-icon>\
<md-icon md-svg-icon="icons/pin-off.svg" alt="pinit" class="cad24" ng-show="keepTitleBar"></md-icon>\
		        <md-tooltip>pin It</md-tooltip>\
		    </md-button>\
			<md-button class="md-icon-button animatedHeaderControl" aria-label="Minimise Application" ng-click="childApplicationMinimise()">\
		        <md-icon md-svg-icon="icons/ic_fullscreen_exit_24px.svg" alt="minimise" class="cad24"></md-icon>\
		        <md-tooltip>Minimise</md-tooltip>\
		    </md-button>\
		    <md-button class="md-icon-button animatedHeaderControl" aria-label="Close Application" ng-click="childApplicationClose()">\
		    	<md-icon md-svg-icon="icons/ic_close_24px.svg" alt="close" class="cad24"></md-icon>\
		    	<md-tooltip>Close</md-tooltip>\
		    </md-button>\
		</div>\
	</div>\
	<div class="dw-childapp-backgroundcover defaultView" layout="column" layout-align="center center" >\
		<div class="dw-childapp-splash-container" layout="column" layout-align="end center">\
			<div class="dw-childapp-splash-logo-container" layout="column" layout-align="center center">\
				<img ng-src="{{routedAppIconUri}}" err-src="images/appIcons/untitledapplication.png" class="dw-childapp-splash-logo top-splash-elements-entry" width="100" height="100"/>\
			</div>\
			<div class="dw-childapp-splash-text-container" layout="column" layout-align="space-around center">\
				<span class="dw-childapp-splash-title bottom-splash-elements-entry">{{routedAppName}}</span>\
				<md-progress-circular  class="dw-childapp-splash-loadingspinner bottom-splash-elements-entry" md-mode="indeterminate"></md-progress-circular>\
				<span class="dw-childapp-splash-loadingtextindicator bottom-splash-elements-entry">loading</span>\
			</div>\
		</div>\
	</div>\
	<div ng-mouseenter="hideHeaderControlBar = true" class="customeAppContainer" ng-class="{adjustHeight : keepTitleBar}" >\
 <div id="idRenderDiv"></div>\
	</div>\
</div>',
            link: function (scope, element) {
                var renderElement = "idRenderDiv";


                $("#" + renderElement).empty();

                var dwChildAppHeaderController = angular.element('#dw-child-application-header-control-bar');
                var dwChildAppSplashCover = angular.element('.dw-childapp-backgroundcover');
                var dwChildAppContainer = angular.element('.customeAppContainer');
                var dwChildAppSplashLogo = angular.element('.dw-childapp-splash-logo');
                var dwChildAppSplashText = angular.element('.dw-childapp-splash-title');
                var dwChildAppSplashLoadingSpinner = angular.element('.dw-childapp-splash-loadingspinner');
                var dwChildAppSplashLoadingTextIndicator = angular.element('.dw-childapp-splash-loadingtextindicator');
                var dwChildAppHeaderInfomationTitle = angular.element('.dw-child-application-header-control-bar-left-section span');
                var dwChildAppHeaderInfomationIcon = angular.element('.dw-child-application-header-control-bar-left-section img');
                var dwChildAppSaveButton = angular.element('.dw-child-app-saveButton');
                var mainAppContainer = angular.element('.md-child-application-container');

                mainAppContainer.css({
                    'transform': 'scale(0)',
                    'transform-origin': scope.position.clientX + 'px ' + scope.position.clientY + 'px',
                });

                $timeout(function () {
                    mainAppContainer.css({
                        'transform': 'scale(1)',
                        'transform-origin': scope.position.clientX + 'px ' + scope.position.clientY + 'px',
                    });
                }, 300);

                $timeout(function () {
                    dwChildAppHeaderController.css({
                        'top': '0px',
                        'background': scope.accentpalette
                    })
                }, 1000);

                $timeout(function () {
                    dwChildAppSplashLogo.css('bottom', '0px');
                }, 1300);

                $timeout(function () {
                    dwChildAppSplashText.css('top', '0px');
                }, 1500);

                $timeout(function () {
                    dwChildAppSplashLoadingSpinner.css('top', '0px');
                }, 1700);

                $timeout(function () {
                    dwChildAppSplashLoadingTextIndicator.css('top', '0px');
                }, 1800);


                $timeout(function () {
                    dwChildAppSplashLoadingSpinner.css('top', '-400px');
                    dwChildAppSplashLoadingTextIndicator.css('top', '-400px');
                }, 4500);

                $timeout(function () {
                    dwChildAppSplashText.css('top', '-400px');
                }, 4800);

                $timeout(function () {
                    dwChildAppSplashLogo.css('bottom', '-150px');
                }, 5000);

                $timeout(function () {
                    dwChildAppSplashCover.css('height', '300px');
                }, 5200);

                $timeout(function () {
                    dwChildAppHeaderInfomationTitle.css('top', '0px');
                    dwChildAppHeaderInfomationIcon.css('top', '0px');
                }, 5200);

                $timeout(function () {
                    dwChildAppContainer.css({
                        'opacity': 1,
                        'z-index': 1,
                        'top': '0px'
                    });
                }, 5200);

                $timeout(function () {
                    dwChildAppSaveButton.css('z-index', '1');
                }, 5200);

                scope.hideHeaderControlBar = true;
                console.log("im running it again");
            },
            controller: 'duoworld-framework-shell-launcher-customapps-ctrl'
        }
}]);
    shellDirectives.directive('frameworkappContainer', ['$compile', '$state', '$timeout', '$rootScope', function ($compile, $state, $timeout, $rootScope) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                routedAppName: "=routedappname",
                accentpalette: "=accentpalette",
                routedAppIconUri: "=routedappiconuri"
            },
            template: '<div id="dw-child-test-app-1" class="md-child-application-container" layout="column" layout-align="start center">\
<div style="height:1px;bckground-color:rgba(0, 0, 0, 0.15);width:100%;z-index:3;" ng-mouseenter="hideHeaderControlBar = false" ></div>\
	<div  class="dw-child-application-header-control-bar" layout="row" layout-align="space-between center" style="background-color:{{accentpalette}} !important;top:0px !important;"  ng-if="!hideHeaderControlBar || keepTitleBar">\
		<div class="dw-child-application-header-control-bar-left-section" layout="row" layout-align="center center">\
			<img class="dw-child-application-header-icon" ng-src="data:image/png;base64,{{routedAppIconUri}}" err-src="images/appIcons/untitledapplication.png" width="24" height="24" style="    border-radius: 100%;">\
			<span class="dw-child-application-header-title">{{routedAppName}}</span>\
		</div>\
		<div class="dw-child-application-header-control-bar-right-section">\
 <md-button class="md-icon-button animatedHeaderControl" aria-label="Minimise Application" ng-click="childApplicationTitleBarpin()">\
		        <md-icon md-svg-icon="icons/pin.svg" alt="pinit" class="cad24" ng-show="!keepTitleBar"></md-icon>\
<md-icon md-svg-icon="icons/pin-off.svg" alt="pinit" class="cad24" ng-show="keepTitleBar"></md-icon>\
		        <md-tooltip>pin It</md-tooltip>\
		    </md-button>\
			<md-button class="md-icon-button animatedHeaderControl" aria-label="Minimise Application" ng-click="childApplicationMinimise()">\
		        <md-icon md-svg-icon="icons/ic_fullscreen_exit_24px.svg" alt="minimise" class="cad24"></md-icon>\
		        <md-tooltip>Minimise</md-tooltip>\
		    </md-button>\
		    <md-button class="md-icon-button animatedHeaderControl" aria-label="Close Application" ng-click="childApplicationClose()">\
		    	<md-icon md-svg-icon="icons/ic_close_24px.svg" alt="close" class="cad24"></md-icon>\
		    	<md-tooltip>Close</md-tooltip>\
		    </md-button>\
		</div>\
	</div>\
	<div class="dw-childapp-backgroundcover defaultView" layout="column" layout-align="center center">\
		<div class="dw-childapp-splash-container" layout="column" layout-align="end center">\
			<div class="dw-childapp-splash-logo-container" layout="column" layout-align="center center">\
				<img ng-src="data:image/png;base64,{{routedAppIconUri}}" err-src="images/appIcons/untitledapplication.png" class="dw-childapp-splash-logo top-splash-elements-entry" width="100" height="100"/>\
			</div>\
			<div class="dw-childapp-splash-text-container" layout="column" layout-align="space-around center">\
				<span class="dw-childapp-splash-title bottom-splash-elements-entry">{{routedAppName}}</span>\
				<md-progress-circular  class="dw-childapp-splash-loadingspinner bottom-splash-elements-entry" md-mode="indeterminate"></md-progress-circular>\
				<span class="dw-childapp-splash-loadingtextindicator bottom-splash-elements-entry">loading</span>\
			</div>\
		</div>\
	</div>\
	<div  ng-mouseenter="hideHeaderControlBar = true" class="customeAppContainer"  ng-transclude ng-class="{adjustHeight : keepTitleBar}">\
	</div>\
</div>',
            link: function (scope, element) {
                var renderElement = "idRenderDiv";
                scope.defaultClassView = true;

                $("#" + renderElement).empty();


                var dwChildAppSplashCover = angular.element('.dw-childapp-backgroundcover');
                var dwChildAppContainer = angular.element('.customeAppContainer');
                var dwChildAppSplashLogo = angular.element('.dw-childapp-splash-logo');
                var dwChildAppSplashText = angular.element('.dw-childapp-splash-title');
                var dwChildAppSplashLoadingSpinner = angular.element('.dw-childapp-splash-loadingspinner');
                var dwChildAppSplashLoadingTextIndicator = angular.element('.dw-childapp-splash-loadingtextindicator');
                var dwChildAppHeaderController = angular.element('.dw-child-application-header-control-bar');
                var dwChildAppHeaderInfomationTitle = angular.element('.dw-child-application-header-control-bar-left-section span');
                var dwChildAppHeaderInfomationIcon = angular.element('.dw-child-application-header-control-bar-left-section img');
                var dwChildAppSaveButton = angular.element('.dw-child-app-saveButton');
                var mainAppContainer = angular.element('.md-child-application-container');

                mainAppContainer.css({
                    'transform': 'scale(0)',
                    'transform-origin': 'center top',
                });

                $timeout(function () {
                    mainAppContainer.css({
                        'transform': 'scale(1)',
                        'transform-origin': 'center top',
                    });
                }, 300);

                $timeout(function () {
                    dwChildAppHeaderController.css({
                        'top': '0px',
                        'background': scope.accentpalette
                    })
                }, 1000);
                $timeout(function () {
                    dwChildAppSplashLogo.css('bottom', '0px');
                }, 1300);

                $timeout(function () {
                    dwChildAppSplashText.css('top', '0px');
                }, 1500);

                $timeout(function () {
                    dwChildAppSplashLoadingSpinner.css('top', '0px');
                }, 1700);

                $timeout(function () {
                    dwChildAppSplashLoadingTextIndicator.css('top', '0px');
                }, 1800);


                $timeout(function () {
                    dwChildAppSplashLoadingSpinner.css('top', '-400px');
                    dwChildAppSplashLoadingTextIndicator.css('top', '-400px');
                }, 4500);

                $timeout(function () {
                    dwChildAppSplashText.css('top', '-400px');
                }, 4800);

                $timeout(function () {
                    dwChildAppSplashLogo.css('bottom', '-150px');
                }, 5000);

                $timeout(function () {
                    dwChildAppSplashCover.css('height', '300px');
                }, 5200);

                $timeout(function () {
                    dwChildAppHeaderInfomationTitle.css('top', '0px');
                    dwChildAppHeaderInfomationIcon.css('top', '0px');
                }, 5200);

                $timeout(function () {
                    dwChildAppContainer.css({
                        'opacity': 1,
                        'z-index': 1,
                        'top': '0px'
                    });
                }, 5200);

                $timeout(function () {
                    dwChildAppSaveButton.css('z-index', '1');
                }, 5200);

                scope.childApplicationClose = function () {
                    $rootScope.removeFromRunningApp(window.location.hash);

                    mainAppContainer.css({
                        'transform': 'scale(0)',
                        'opacity': '0',
                        'transform-origin': 'center bottom'
                    });

                    $timeout(function () {
                        $state.go('dock');
                    }, 300);
                };
                scope.childApplicationMinimise = function () {
                    $rootScope.addToRunningApp(scope.routedAppName, scope.routedAppIconUri);
                    $state.go('dock');
                };
                scope.hideHeaderControlBar = true;
                scope.keepTitleBar = true;
                scope.childApplicationTitleBarpin = function () {
                    scope.keepTitleBar = !scope.keepTitleBar;
                };
            },
        }
}]);

    shellDirectives.directive('draggable', function () {
        return {
            scope: {
                id: "=id",
                panel: "=panel"
            },
            link: function (scope, element) {
                // this gives us the native JS object
                var el = element[0];

                el.draggable = true;

                el.addEventListener(
                    'dragstart',
                    function (e) {
                        console.log("dragging started");
                        console.log(scope.id);
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('Text', JSON.stringify(scope.id));
                        e.dataTransfer.setData('Panel', JSON.stringify(scope.panel));
                        //                    this.classList.add('drag');
                        return false;
                    },
                    false
                );
                el.addEventListener(
                    'dragend',
                    function (e) {
                        this.classList.remove('drag');
                        return false;
                    },
                    false
                );
            }
        };
    });

    shellDirectives.directive('droppable', function () {
        return {
            scope: {

            },
            link: function (scope, element) {
                // again we need the native object
                var el = element[0];

                el.addEventListener(
                    'dragover',
                    function (e) {
                        e.dataTransfer.dropEffect = 'move';
                        // allows us to drop
                        if (e.preventDefault) e.preventDefault();
                        this.classList.add('over');
                        return false;
                    },
                    false
                );
                el.addEventListener(
                    'dragenter',
                    function (e) {
                        this.classList.add('over');
                        return false;
                    },
                    false
                );

                el.addEventListener(
                    'dragleave',
                    function (e) {
                        this.classList.remove('over');
                        return false;
                    },
                    false
                );
                el.addEventListener(
                    'drop',
                    function (e) {
                        // Stops some browsers from redirecting.
                        if (e.stopPropagation) e.stopPropagation();

                        this.classList.remove('over');

                        //var item = document.getElementById(e.dataTransfer.getData('Text'));
                        //this.appendChild(item);

                        console.log("dropping");
                        // call the drop passed drop function
                        scope.handleDrop(e);

                        return false;
                    },
                    //                scope.handleDrop(),
                    false
                );

            },
            controller: 'duoworld-framework-shell-ctrl'
        }
    });

    shellDirectives.directive('ngEsc', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress keyup", function (event) {
                if (event.which === 27) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEsc);
                    });

                    event.preventDefault();
                }
            });
        };
    });

    shellDirectives.directive('confirmDialog', ['$mdDialog', '$rootScope', function ($mdDialog, $rootScope) {
        return {
            restrict: 'E',
            scope: {
                title: '=title',
                content: '=content',
                icon: '=icon',
                okay: '=okay',
                cancel: '=cancel',
            },
            template: '<md-dialog>\
                        <div layout="row" style="width:100%;height:100%;height:200px;max-width:400px;background-color:{{$root.shellConfig.themeconfiguration.primarypalette}};color:whitesmoke;padding:15px;">\
                    <div layout="row" layout-align="center center" style="height:100%;">\
                    <md-icon md-svg-icon="{{icon}}" style="color:{{$root.shellConfig.themeconfiguration.accentpalette}};transform:scale(7); margin:0px;opacity: 1;" alt="switch tennants"></md-icon></div>\
                            <div layout="column" layout-align="center start" style="margin-left:20%;">\
                                <p style="font-size:34px;font-weight:300;margin:0px;">{{title}}</p>\
                      <p style = "font-size:14px;font-weight:300;margin:5px;color: rgba(255, 255, 255, 0.6);">{{content}}</p><div style = "width:100%;" layout = "row" layout-align = "end center"><md-button style="color:{{$root.shellConfig.themeconfiguration.accentpalette}}" ng-click="confirm();">{{okay}}</md-button><md-button style="color:{{$root.shellConfig.themeconfiguration.accentpalette}}" ng-click="deny();">{{cancel}}</md-button></div></div></md-dialog>',
        }
                     }]);

})(angular.module('shellDirectives', []));
