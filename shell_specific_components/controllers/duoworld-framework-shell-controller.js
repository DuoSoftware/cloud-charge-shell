// duoworld-framework-shell-ctrl.js

(function () {

    var duoWorldFrameworkShellCtrl = function ($rootScope, $scope, $state, $http, $location, $mdSidenav, $mdDialog, $mdToast, $presence, $auth, $apps, $v6urls, $helpers, $objectstore, $timeout, dataHandler, $fws, $document, $q) {


        $('.systemTrayScroller').perfectScrollbar({
            wheelSpeed: 2,
            wheelPropagation: true,
            minScrollbarLength: 20,
            suppressScrollX: true
        });


        /*Framework Shell Initialization Components Block - Start*/
        //Define Initialization Variables block start
        console.log('This is the main controller');
        var isLoggedIn = false; //framework logged in default status
        $rootScope.shellConfig = {}; //framework configuration
        $scope.selectedTennantID = document.domain; //framework tennant ID
        $rootScope.frameworkShellSecurityToken = ""; //framwork shell security token
        $rootScope.dwFrameworkActiveApps = []; //framework active apps
        $rootScope.recivedTennantCollection = []; // framework recived tennant collection
        $scope.allApps = [];
        $rootScope.frameworkFavoriteApplication = [];
        $rootScope.currenttenantsessioninfo = [];
        $rootScope.shellUserProfileSection = [];
        $rootScope.v6urls = $v6urls;
        $rootScope.opendAppIconUrl = "";

        $rootScope.panelCustomizingTray = false;

        var dwLoadingFrameIndicator = angular.element('.dw-loadingFrame');

        /*utility function - start*/
        function isEmpty(obj) {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    return false;
                }
            }
            return true;
        }
        /*utility function - end*/

        //Define Initialization Variables block end

        //Define Initialization Functions block start
        var frameworkSessionCheck = function () {
            if ($auth.checkSession()) {
                isLoggedIn = true;
            } else {
                isLoggedIn = false;
            }
        }

        frameworkSessionCheck(); //framework session check

        var getFrameworkSessionInfo = function () {
            $rootScope.currenttenantsessioninfo = $auth.getSession();
            console.log($rootScope.currenttenantsessioninfo);
        }

        getFrameworkSessionInfo();

        var frameworkSessionLog = function () {
            if (isLoggedIn === true) {
                $state.go('dock');
                $rootScope.frameworkShellSecurityToken = $auth.getSecurityToken()
            } else {
                $state.go('unrecognized');
            }
        }

        frameworkSessionLog();

        var retriveUserProfile = function () {
            var userProfileInfo = $auth.getSession();

            var client = $objectstore.getClient("duosoftware.com", "profile", true);

            client.onGetOne(function (userProfileInfo) {
                console.log("user profile details");
                console.log(userProfileInfo);
                if (userProfileInfo) {
                    $rootScope.shellUserProfileSection = userProfileInfo;
                    console.log(userProfileInfo);
                    $scope.getProfilePicture();
                    bannerDecider();

                } else {

                }
            });

            client.onError(function (data) {
                // alert ("Error occured");
            });

            client.getByKey($auth.getUserName());
        };

        retriveUserProfile();

        var getDefaultShellConfig = function () {
            $http.get('shell_specific_components/local_data/shellconfiguration.json').
            success(function (data, status, headers, config) {
                $rootScope.shellConfig = data;
                console.log($rootScope.shellConfig);
            }).
            error(function (data, status, headers, config) {
                console.log('error in retriving default shell configuration !');
            });
        }

        var saveShellConfiguratation = function () {
            $rootScope.shellConfig.username = $auth.getUserName();
            var client = $objectstore.getClient("shellconfig");
            client.onComplete(function (data) {
                console.log(data);
            });
            client.onError(function (data) {
                console.log(data);
            });
            client.insert($rootScope.shellConfig, {
                KeyProperty: "username"
            });

            console.log($rootScope.shellConfig);
        }

        var loadShellConfig = function () {
            console.log("loading shellconfig from objectstore");
            var client = $objectstore.getClient("shellconfig");
            client.onGetOne(function (data, status, headers, config) {
                console.log(data);
                if (data.docklayoutconfiguration == undefined) {
                    getDefaultShellConfig();
                    saveShellConfiguratation();
                } else {

                    $rootScope.shellConfig = data;
                    $scope.panels = $rootScope.shellConfig.docklayoutconfiguration.pannelcollection;
                }
            });
            client.onError(function (data, status, headers, config) {
                console.log(data, status);
                getDefaultShellConfig();

            });

            client.getByKey($auth.getUserName());
        }

        loadShellConfig();

        var globalAppInfoPush = function () {
            for (var i = 0; i < $scope.allApps.length; i++) {
                var appTempRef = $scope.allApps[i];
                $rootScope.frameworkApplications.push({
                    applicationID: appTempRef.ApplicationID,
                    applicationTitle: appTempRef.Name,
                    applicationUri: "/duoworld-framework/launcher/customapps/" + appTempRef.ApplicationID + "/" + appTempRef.Name,
                    applicationIcoUri: "/images/appIcons/" + appTempRef.ImageId,
                    applicationDesription: appTempRef.Description
                });
            }
            console.log($rootScope.frameworkApplications);
        };

        $scope.getProfilePicture = function () {

            //            var client = $objectstore.getClient('duoworld.duoweb.info', "profilepictures", true);
            //            client.onGetOne(function (data) {
            //                if (data)
            //                    console.log(data);
            //                //made the profile picture a rootscope variable, so it could be accessible from anywhere without another service call
            //                $rootScope.profilePicture = data.Body;
            //            });
            //            client.onError(function (data) {
            //                Toast("Error occured while fetching profile picture");
            //            });
            //            client.getByKey($auth.getUserName());

            $storage.getProfilePicture(function (res) {
                console.log(res);
                $rootScope.profilePicture = res.data;
            });
        };

        $scope.getBannerPicture = function () {
            var client = $objectstore.getClient('duoworld.duoweb.info', "coverPictures", true);
            client.onGetOne(function (data) {
                if (data)
                //console.log(data);
                //made the banner a rootscope  variable, so it could be accessible from anywhere without another service call
                    $rootScope.banner = data.Body;
                if (data.Body == undefined) {
                    $rootScope.banner = "images/userassets/contactcoverimg/cover1.jpg";
                    $rootScope.hideObjectstoreBanner = true;
                };
            });
            client.onError(function (data) {
                Toast("Error occured while fetching Banner");
            });
            client.getByKey($auth.getUserName());
        };

        //$scope.getProfilePicture();

        function bannerDecider() {
            if ($rootScope.shellUserProfileSection.bannerPicture == undefined) {
                $rootScope.shellUserProfileSection.bannerPicture = "fromObjectStore";
            };

            if ($rootScope.shellUserProfileSection.bannerPicture == "fromObjectStore") {
                console.log($rootScope.shellUserProfileSection.bannerPicture);
                $scope.getBannerPicture();
                $rootScope.hideObjectstoreBanner = false;
            } else {
                $rootScope.hideObjectstoreBanner = true;
                $rootScope.banner = $rootScope.shellUserProfileSection.bannerPicture;
                console.log($rootScope.banner);
            };
        };


        $scope.globalTenantRetrivel = function () {
            $http.get($rootScope.v6urls.auth + '/tenant/GetTenants/' + $rootScope.frameworkShellSecurityToken + '').
            success(function (data, status, headers, config) {
                $rootScope.recivedTennantCollection = data;
                // console.log($rootScope.recivedTennantCollection);
            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });
        }

        $scope.globalTenantRetrivel(); //framework tenant retrival

        $scope.globalAppRetrivel = function () {
            $apps.onAppsRetrieved(function (e, data) {
                var appIconHostName = window.location.hostname;
                for (appIndex in data.apps) {
                    var iconUrl = data.apps[appIndex].iconUrl;
                    if (iconUrl) {
                        if (iconUrl.indexOf('http') === 0) {
                            data.apps[appIndex].iconUrl = iconUrl;
                        } else {
                            data.apps[appIndex].iconUrl = window.location.protocol + "//" + appIconHostName + iconUrl;
                        }
                    } else {
                        data.apps[appIndex].iconUrl = "/devportal/appicons/29fa48d1ffbb1f3792a417cda647df7d.png";
                    }
                }

                $scope.allApps = data.apps;
                addMissingGridsterFields($scope.allApps);
                // $rootScope.allApps = $scope.allApps;
            });

            $apps.getAppsForUser();
            // globalAppInfoPush();
            console.log($scope.allApps);
        }

        $scope.globalAppRetrivel();

        $scope.inTouchLogin = function () {
            //$scope.connecting = true;
            // $fws.connect();
            $presence.onOnline(function () {
                alert('prsence set online !');
            });
            //$presence.setOnline();
            var username = $auth.getUserName();
            console.log(username);
            $http.get('/payapi/checkRegisterd/' + username)
                .success(function (response) {
                    console.log("registered with sip user successfully");
                    $rootScope.sipuser = response.sipuser;
                    //                   $scope.notConnected = false;
                    //                    $scope.connecting = false;
                    //$rootScope.sipUserRegistration = true;
                    $rootScope.sipUserRegistrationInit();
                    $presence.setOnline();
                    dataHandler.nativeUser($auth.getUserName());
                    $scope.getAllContatcs();
                }).error(function (data) {
                    console.log(data);
                    $rootScope.sipUserRegistration = false;
                    //$scope.inTouchLogin();
                });
        };

        $scope.getAllContatcs = function () {
            var username = $auth.getUserName();
            $http.get('/payapi/getAllContact')
                .success(function (response) {
                    console.log("all contatcs");
                    dataHandler.createAllUsers(response);
                }).error(function (e) {
                    console.log(e);
                });
        };

        $scope.inTouchLogin();



        //Define Initialization Functions block end

        /*Framework Shell Initialization Components Block - End*/

        /*dw framework session check (uimicrokernal) */

        //framework specific functions

        /*Tennant Switch*/
        $scope.switchTennant = function () {

        };

        /*dialog controler*/
        function tennantSelectionModalCtrl($scope, $mdDialog) {
            console.log($scope.recivedTennantCollection);
            $scope.switchTennantSelection = function (switchedSelection) {
                $mdDialog.hide();
            };
        };

        /*toggle left menu*/
        $scope.toggleLeftMenu = function () {
            $mdSidenav('left').toggle();
        };

        /*toggle right menu*/
        $scope.toggleRightMenu = function () {
            $mdSidenav('right').toggle();
            $rootScope.rightNavContent = "intouch";
        };

        $scope.toggleNotifications = function () {
            $mdSidenav('right').toggle();
            $rootScope.rightNavContent = "notifications";
        };

        /*to return home*/
        $scope.returnHome = function () {
            $scope.toggleLeftMenu();
            $location.path('/');
        }

        $scope.quickLaunchAppAccess = function (appdetail) {
            $scope.toggleLeftMenu();
            var quickLaunchUri = "launcher/customapp/" + appdetail.ApplicationID + "/" + appdetail.Name;
            $location.path(quickLaunchUri);
            $rootScope.opendAppIconUrl = appdetail.iconUrl;
        };

        $scope.dwSwitchTennant = function (ev, tennantDomain) {
            $scope.toggleRightMenu();

            var switchConfirm = $mdDialog.confirm()
                .title('Tennant switch confirm.')
                .content('Are you sure you want to switch to "' + tennantDomain + '" ?')
                .ariaLabel('Switch Tennant')
                .ok('Yes go ahead !')
                .cancel('Dont do it')
                .targetEvent(ev);
            $mdDialog.show(switchConfirm).then(function () {
                location.replace('http://' + tennantDomain);
            }, function () {

            });
        };

        /*dwFrameworkNavigationScript*/

        $scope.dwFrameworkBuiltinAppNavigation = function (appName) {
            switch (appName) {
                case "market place":
                    $state.go('launcher.marketplace');
                    break;
                case "user profile":
                    $state.go('launcher.userprofile');
                    break;
                case "tennant explorer":
                    $state.go('launcher.tennantexplorer');
                    break;
                case "settings":
                    $state.go('launcher.settings');
                    break;
                default:
                    console.log('wrong selection !');
            }
        };

        $scope.dwFrameworkConnectAppNavigation = function () {
            $state.go('duoworld-framework.launcher.connect');
        };

        $scope.appUninstall = function (appObject) {
            $objectstore.getClient("application")
                .onComplete(function (data) {
                    console.log(data);
                })
                .onError(function (data) {
                    console.log(data);
                })
                .delete(appObject, {
                    "KeyProperty": "ApplicationID"
                });
        };

        $scope.quitApplication = function (ev) {

            $rootScope.showCustomConfirmDialog("icons/ic_exit_to_app_24px.svg", "Quit Application", "are you sure you want to continue?", "do it!", "oh no!", ev).then(function (data) {
                if (data) {
                    location.replace('http://duoworld.com/logout.php'); //logout location change
                };
            });
        };

        //global function for custom confirm dialog,
        $rootScope.showCustomConfirmDialog = function (icon, title, content, okay, cancel, ev) {
            var defered = $q.defer();
            var data = {
                icon: icon,
                title: title,
                content: content,
                okay: okay,
                cancel: cancel
            };
            $mdDialog.show({
                    template: '<md-dialog>\
                <div layout="row" style="width:100%;height:100%;height:200px;min-width:350px;background-color:{{$root.shellConfig.themeconfiguration.primarypalette}};color:whitesmoke;padding:15px;">\
            <div layout="row" layout-align="center center" style="height:100%;">\
            <md-icon md-svg-icon="{{data.icon}}" style="color:{{$root.shellConfig.themeconfiguration.accentpalette}};transform:scale(7); margin:0px;opacity: 1;" alt="switch tennants"></md-icon></div>\
                    <div layout="column" layout-align="center start" style="margin-left:20%;">\
                        <p style="font-size:34px;font-weight:300;margin:0px;">{{data.title}}</p>\
              <p style = "font-size:14px;font-weight:300;margin:5px;color: rgba(255, 255, 255, 0.6);">{{data.content}}</p><div style = "width:100%;" layout = "row" layout-align = "end center"><md-button style="color:{{$root.shellConfig.themeconfiguration.accentpalette}}" ng-click="confirm();">{{data.okay}} </md-button><md-button style="color:{{$root.shellConfig.themeconfiguration.accentpalette}}" ng-click="deny();">{{data.cancel}}</md-button></div></div></md-dialog>',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: {
                        data: data,
                    },
                    controller: function ($scope, $mdDialog, data) {
                        $scope.data = data;
                        $scope.confirm = function () {
                            $mdDialog.hide(true);
                        };
                        $scope.deny = function () {
                            $mdDialog.hide(false);
                        };
                    },
                })
                .then(function (answer) {
                    if (answer == true) {
                        //confirmQuit();
                        defered.resolve(true);
                    } else {
                        defered.resolve(false);
                    }
                }, function () {

                });
            return defered.promise;
        };

        //panel customiztion start

        $scope.showTransition = false;

        $scope.showPanelEditTray = function (ev, panel) {
            console.log("showing customizing panel");
            $scope.panelCustomizingTray = true;
            $scope.showTransition = true;
            $scope.selectedPanel = panel;
            $scope.originalPanel = angular.copy($scope.selectedPanel);
            if ($scope.selectedPanel.panelComponents == undefined) {
                $scope.selectedPanel.panelComponents = [];
            };
            console.log("panel selected");
        };

        $scope.$watch('selectedPanel', function () {
            console.log('apps arrangement changed');
        }, true);


        $scope.addToPanel = function (app, type, panelid) {

            for (z = 0; z < $rootScope.shellConfig.docklayoutconfiguration.pannelcollection.length; z++) {
                if ($rootScope.shellConfig.docklayoutconfiguration.pannelcollection[z].panelTitle == panelid) {
                    $scope.selectedPanel = $rootScope.shellConfig.docklayoutconfiguration.pannelcollection[z];
                };
            };

            if ($scope.selectedPanel !== undefined) {
                var obj = {
                    "comp_Id": app.ApplicationID,
                    "comp_Name": app.Name,
                    "comp_Type": type,
                    "comp_Data": app,
                    "comp_extra": {
                        "visible": true,
                        "row": app.row,
                        "col": app.col,
                        "sizeX": 2,
                        "sizeY": 1
                    }
                }
                if (type !== "appshortcut") {
                    obj.comp_extra.sizeX = 3;
                    obj.comp_extra.sizeY = 2;
                    obj.comp_extra.widgetImage = app.image;
                }
                $scope.selectedPanel.panelComponents.push(obj);
                console.log($scope.selectedPanel.panelComponents);
            }
        };

        $scope.alreadyAddedValues = function () {
            if ($scope.selectedPanel !== undefined) {
                return $scope.selectedPanel.panelComponents;
            };
        }

        $scope.filterAlreadyAdded = function (item) {
            if ($scope.selectedPanel !== undefined) {
                return ($scope.alreadyAddedValues().indexOf(item) == -1);
            };
        };

        $scope.closeCustomizingTray = function () {
            console.log("closing customizing tray");
            $scope.showTransition = false;
            $timeout(function () {
                $scope.panelCustomizingTray = false;
            }, 400);
            for (x = 0; x < $rootScope.shellConfig.docklayoutconfiguration.pannelcollection.length; x++) {
                if ($rootScope.shellConfig.docklayoutconfiguration.pannelcollection[x].panelTitle == $scope.selectedPanel.panelTitle) {
                    $rootScope.shellConfig.docklayoutconfiguration.pannelcollection[x] = $scope.selectedPanel;
                };
            }

            if (!angular.equals($scope.originalPanel, $scope.selectedPanel)) {
                $scope.saveGlobalSettings();
            };
        };

        $scope.gridsterOpts = {
            columns: 12,
            pushing: true,
            floating: false,
            swapping: true,
            width: 'auto',
            colWidth: 'auto',
            rowHeight: 200,
            outerMargin: true,
            isMobile: false,
            mobileBreakPoint: 600,
            mobileModeEnabled: true,
            minColumns: 5,
            minRows: 4,
            maxRows: 4,
            defaultSizeX: 2,
            defaultSizeY: 1,
            minSizeX: 1,
            maxSizeX: null,
            minSizeY: 1,
            maxSizeY: 100,
            resizable: {
                enabled: false
            },
            draggable: {
                enabled: true,
            }
        };

        $scope.collectionpanelOpts = {
            columns: 12,
            //            pushing: true,
            //            floating: false,
            //            swapping: true,
            width: 'auto',
            colWidth: 'auto',
            rowHeight: 200,
            outerMargin: true,
            isMobile: false,
            mobileBreakPoint: 600,
            mobileModeEnabled: true,
            minColumns: 5,
            minRows: 4,
            maxRows: 4,
            defaultSizeX: 2,
            defaultSizeY: 1,
            minSizeX: 1,
            maxSizeX: null,
            minSizeY: 1,
            maxSizeY: 100,
            resizable: {
                enabled: false
            },
            draggable: {
                enabled: false,
            }
        };

        $scope.customItemMap = {
            sizeX: 'app.comp_extra.sizeX',
            sizeY: 'app.comp_extra.sizeY',
            row: 'app.comp_extra.row',
            col: 'app.comp_extra.col'
        };
        $scope.widgetItemMap = {
            sizeX: 'componentdata.comp_extra.sizeX',
            sizeY: 'componentdata.comp_extra.sizeY',
            row: 'componentdata.comp_extra.row',
            col: 'componentdata.comp_extra.col'
        };

        function addMissingGridsterFields(apps) {
            var x = 1;
            var y = 0;
            for (a = 0; a < apps.length; a++) {
                apps[a].col = y;
                apps[a].row = x;
                y = y + 1;
                if (y == 5) {
                    x = x + 1;
                    y = 0;
                };
            };
            $scope.allApps = apps;
            $rootScope.allApps = apps;
            console.log($rootScope.allApps);
        };

        $scope.saveGlobalSettings = function () {
            $rootScope.shellConfig.username = $auth.getUserName();
            var client = $objectstore.getClient("shellconfig");
            client.onComplete(function (data) {
                $mdToast.show(
                    $mdToast.simple()
                    .content('Changes have been saved !')
                    .hideDelay(3000)
                );
            });
            client.onError(function (data) {
                $mdToast.show(
                    $mdToast.simple()
                    .content('Something went wrong!')
                    .hideDelay(3000)
                );
            });
            client.insert($rootScope.shellConfig, {
                KeyProperty: "username"
            });

        };

        $scope.removeAppFromPanel = function (app) {
            for (e = 0; e < $scope.selectedPanel.panelComponents.length; e++) {
                if (app.comp_Id == $scope.selectedPanel.panelComponents[e].comp_Id) {
                    $scope.selectedPanel.panelComponents.splice(e, 1);
                    $mdToast.show(
                        $mdToast.simple()
                        .content(app.comp_Name + ' deleted')
                        .position('top right')
                        .hideDelay(2000)
                    );
                };
            };
        };

        $scope.handleDrop = function (app) {
            console.log("adding it to panel");
            var panel = JSON.parse(app.dataTransfer.getData('Panel'));
            var app = JSON.parse(app.dataTransfer.getData('Text'));
            console.log(app);

            if (app.ApplicationID !== undefined) {
                $scope.addToPanel(app, 'appshortcut', panel);
            } else {
                $scope.addToPanel(app, app.Name, panel);
            };
        };



        $scope.goToNextStep = function () {
            var elmnt = document.getElementById("appTray-content");
            elmnt.scrollTop += 85;
        };

        $scope.goToPrevStep = function () {
            var elmnt = document.getElementById("appTray-content");
            elmnt.scrollTop += -85;
        };
        //end of panel customization

        //search bar start
        $scope.searchBarRevealed = false;
        $scope.revealSearchBar = function () {
            $scope.searchBarRevealed = !$scope.searchBarRevealed;
            $scope.globalSearchKeyword = "";
        };


        //end of search bar

        //        app Switcher start
        $rootScope.runningApps = [];

        $scope.showRunningApps = function (ev) {
            $mdDialog.show({
                    controller: 'duoworld-framework-shell-appswitcher-ctrl',
                    templateUrl: 'partials/frameworktemplates/duoworld-framework.application-switcher.html',
                    parent: angular.element(document.body),
                    //targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (app) {
                        if (app.appLocation.match(/customapp.*/)) {
                            console.log('custom app recognized', app);
                            var location = "";
                            location = app.appLocation.slice(2);
                            $rootScope.removeFromRunningApp(app.appLocation);
                            $rootScope.addToRunningApp();
                            $location.path(location);
                        } else {
                            var location = "";
                            location = app.appLocation.slice(2);
                            location = location.replace(/\//g, ".");
                            $rootScope.removeFromRunningApp(app.appLocation);
                            $rootScope.addToRunningApp();
                            $state.go(location);
                        };
                    },
                    function () {

                    });
        };

        $rootScope.addToRunningApp = function (name, img) {
            console.log($state.current.name);
            console.log(name, img);
            //var name = $state.current.name;
            var hash = window.location.hash;
            for (b = 0; b < $rootScope.runningApps.length; b++) {
                if ($rootScope.runningApps[b].appLocation == hash) {
                    $rootScope.runningApps.splice(b, 1);
                };
            };
            var obj = {
                appName: name,
                appLocation: hash,
                imageUrl: img
            };
            if (obj.appLocation == "#/dock") {
                console.log('moving out of dock');
            } else {
                $rootScope.runningApps.push(obj);
            };
            console.log($rootScope.runningApps);
        };
        $rootScope.removeFromRunningApp = function (hash) {
            console.log('closing the application', hash);
            for (a = 0; a < $rootScope.runningApps.length; a++) {
                if (hash == $rootScope.runningApps[a].appLocation) {
                    $rootScope.runningApps.splice(a, 1);
                };
            };
        };
        //app switcehr end

        //all the widgets
        $scope.allWidgets = [{
            Name: "clock",
            image: "images/widget/clock.png",
            color: 'lime',
            icon: 'ic_watch_24px.svg'
        }, {
            Name: "weather",
            image: "images/widget/weather.png",
            color: 'yellow',
            icon: 'ic_cloud_24px.svg'
        }, {
            Name: "userprofile",
            image: "images/widget/profile.png",
            color: 'red',
            icon: 'ic_person_24px.svg'
        }, {
            Name: "calender",
            image: "images/widget/calender.png",
            color: 'blue',
            icon: 'ic_timer_24px.svg'
        }];

        //shell ntification start
        $scope.unseenNotificationCount = 0;
        $scope.shellNotifications = [];
        var NotificationColors = ['blue', 'lime', 'purple', 'grey', 'red', 'teal', 'cyan', 'amber'];
        var isNotificationMenuOpen = false;

        function getPreviousNotifications() {
            $http({
                    method: 'GET',
                    url: 'http://duoworld.duoweb.info:3000/erangaduocom.space.duoworld.com/notifications',
                    headers: {
                        securityToken: 'securityToken'
                    }
                })
                .success(function (data) {
                    console.log(data);
                    for (x = 0; x < data.length; x++) {
                        var obj = {
                            from: data[x].from,
                            timestamp: data[x].timestamp,
                            message: data[x].content,
                            viewstatus: false,
                            color: NotificationColors[Math.floor(Math.random() * NotificationColors.length)]
                        };

                        $scope.shellNotifications.push(obj);
                    };

                }).error(function (data) {
                    console.log(data);
                });
        };

        getPreviousNotifications();

        $scope.showNotifications = function ($mdOpenMenu) {
            $mdOpenMenu();
            isNotificationMenuOpen = !isNotificationMenuOpen;

            if (!isNotificationMenuOpen) {
                $scope.removeAllSeenNotifications();
            };
        };

        $rootScope.sendShellNotification = function (msg) {
            console.log("sending shell notification");
            $fws.command("notification", {
                "type": "shell",
                "from": $rootScope.currenttenantsessioninfo.Username,
                "to": $rootScope.currenttenantsessioninfo.Username,
                "message": msg
            });
        };

        $rootScope.sendBulkNotification = function (msg) {
            console.log("sending bulk notificaion");
            $fws.command("notification", {
                "type": "tenantbulkshell",
                "from": $rootScope.currenttenantsessioninfo.Username,
                "message": msg
            });
        };

        $fws.onRecieveCommand("notification_response", function (e, data) {
            console.log(data);
        });

        $fws.onRecieveCommand("send_notification", function (e, data) {
            console.log(data);
            var obj = {
                from: data.from,
                timestamp: data.timestamp,
                message: data.content,
                viewstatus: true,
                color: NotificationColors[Math.floor(Math.random() * NotificationColors.length)]
            };


            $scope.shellNotifications.push(obj);
            $scope.unseenNotificationCount = $scope.unseenNotificationCount + 1;
        });

        $scope.removeAllSeenNotifications = function () {
            for (q = 0; q < $scope.shellNotifications.length; q++) {
                if ($scope.shellNotifications[q].viewstatus == true) {
                    $scope.shellNotifications[q].viewstatus = false;
                };
            };

            $scope.unseenNotificationCount = 0;
        };

        $scope.isNotificationeEmpty = function () {
            var answer = true;

            for (n = 0; n < $scope.shellNotifications.length; n++) {
                if ($scope.shellNotifications[n].viewstatus == true) {
                    answer = false
                };
            };
            return answer;
        };

        //end of shell notification

        //app uninstall
        $rootScope.deleteApp = function (data) {
            $http.get('/apps/' + data.ApplicationID + '?unshare=true')
                .success(function (response) {
                    console.log(response);
                    $scope.globalAppRetrivel();
                    $mdToast.show(
                        $mdToast.simple()
                        .content(data.Name + ' uninstalled successfully!')
                        .position("right bottom")
                        .hideDelay(3000)
                    );
                }).error(function (data) {
                    console.log(data);
                    $mdToast.show(
                        $mdToast.simple()
                        .content('couldnt uninstall')
                        .position("right bottom")
                        .hideDelay(3000)
                    );
                });
        };
        //end of app uninstall

    };

    duoWorldFrameworkShellCtrl.$inject = ['$rootScope', '$scope', '$state', '$http', '$location', '$mdSidenav', '$mdDialog', '$mdToast', '$presence', '$auth', '$apps', '$v6urls', '$helpers', '$objectstore', '$timeout', 'dataHandler', '$fws', '$document', '$q'];

    mambatiFrameworkShell.controller('duoworld-framework-shell-ctrl', duoWorldFrameworkShellCtrl);

}());
