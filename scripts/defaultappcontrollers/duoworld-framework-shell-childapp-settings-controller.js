//duoworld-framework-shell-launcher-settings-ctrl

(function () {

    var duoworldFrameworkShellLauncherSettingsControl = function ($rootScope, $scope, $state, $objectstore, $http, $rootScope, ngDialog, $timeout, $mdToast, $mdDialog, $uploader, $auth) {

        /*Dont touch This*/
        $scope.childApplicationClose = function () {
            if (!angular.equals($rootScope.shellConfig, $scope.originalConfig)) {
                $scope.saveGlobalSettings();
            };
            $state.go('dock');
        };

        $scope.closePanelCustomizingTray = function () {
            if (!angular.equals($rootScope.shellConfig, $scope.originalConfig)) {
                $scope.saveGlobalSettings();
            };
            $rootScope.panelCustomizingTray = false;
            $mdDialog.hide();
        };

        $scope.childApplicationMinimise = function () {
            $state.go('dock');
        };

        /*Do what you want !*/

        $scope.originalConfig = angular.copy($rootScope.shellConfig);

        $scope.defaultThemes = [
            {
                primarypaletteName: 'red',
                primarypalette: '#F44336',
                accentpalette: '#FFC107'
            },
            {
                primarypaletteName: 'pink',
                primarypalette: '#E91E63',
                accentpalette: '#CDDC39'
            },
            {
                primarypaletteName: 'puple',
                primarypalette: '#9C27B0',
                accentpalette: '#00BCD4'
            },
            {
                primarypaletteName: 'deep-purple',
                primarypalette: '#673AB7',
                accentpalette: '#FF5722'
            },
            {
                primarypaletteName: 'indigo',
                primarypalette: '#3F51B5',
                accentpalette: '#FF4081'
            },
            {
                primarypaletteName: 'blue',
                primarypalette: '#2196F3',
                accentpalette: '#607D8B'
            },
            {
                primarypaletteName: 'light-blue',
                primarypalette: '#03A9F4',
                accentpalette: '#FF5252'
            },
            {
                primarypaletteName: 'cyan',
                primarypalette: '#00BCD4',
                accentpalette: '#FFC107'
            },
            {
                primarypaletteName: 'teal',
                primarypalette: '#009688',
                accentpalette: '#FF9800'
            },
            {
                primarypaletteName: 'green',
                primarypalette: '#4CAF50',
                accentpalette: '#7C4DFF'
            },
            {
                primarypaletteName: 'light-green',
                primarypalette: '#8BC34A',
                accentpalette: '#607D8B'
            },
            {
                primarypaletteName: 'lime',
                primarypalette: '#CDDC39',
                accentpalette: '#00BCD4'
            },
            {
                primarypaletteName: 'yellow',
                primarypalette: '#FFEB3B',
                accentpalette: '#536DFE'
            },
            {
                primarypaletteName: 'amber',
                primarypalette: '#FFC107',
                accentpalette: '#03A9F4'
            },
            {
                primarypaletteName: 'orange',
                primarypalette: '#FF9800',
                accentpalette: '#009688'
            },
            {
                primarypaletteName: 'deep-orange',
                primarypalette: '#FF5722',
                accentpalette: '#CDDC39'
            },
            {
                primarypaletteName: 'brown',
                primarypalette: '#795548',
                accentpalette: '#CDDC39'
            },
            {
                primarypaletteName: 'grey',
                primarypalette: '#9E9E9E',
                accentpalette: '#00BCD4'
            },
            {
                primarypaletteName: 'blue-grey',
                primarypalette: '#607D8B',
                accentpalette: '#FFC107'
            }
		];

        $scope.defaultWallPapers = [
            {
                imgUrl: 'images/shellassets/background/blur-background01.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background01.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background02.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background02.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background03.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background03.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background04.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background04.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background05.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background05.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background06.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background06.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background07.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background07.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background08.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background08.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background09.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background09.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background10.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background10.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background11.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background11.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background12.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background01.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background13.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background13.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background14.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background14.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background15.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background15.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background16.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background16.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background17.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background17.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background18.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background18.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background19.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background19.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background20.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background20.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background21.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background21.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background22.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background22.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background23.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background23.jpg'
            },
            {
                imgUrl: 'images/shellassets/background/blur-background24.jpg',
                thumb: 'images/shellassets/background/250x250_blur-background24.jpg'
            }
		];

        $scope.gridsterOpts = {
            columns: 4, // the width of the grid, in columns
            pushing: true, // whether to push other items out of the way on move or resize
            floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
            swapping: true, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
            width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
            colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
            rowHeight: 160, // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
            //margins: [10, 10], // the pixel distance between each widget
            outerMargin: true, // whether margins apply to outer edges of the grid
            isMobile: false, // stacks the grid items if true
            mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
            mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
            minColumns: 4, // the minimum columns the grid must have
            minRows: 1, // the minimum height of the grid, in rows
            //maxRows: ,
            defaultSizeX: 2, // the default width of a gridster item, if not specifed
            defaultSizeY: 1, // the default height of a gridster item, if not specified
            minSizeX: 1, // minimum column width of an item
            maxSizeX: null, // maximum column width of an item
            minSizeY: 1, // minumum row height of an item
            maxSizeY: 150, // maximum row height of an item
            resizable: {
                enabled: false
            },
            draggable: {
                enabled: true, // whether dragging items is supported
            }
        };

        $scope.customItemMap = {
            sizeX: '1',
            sizeY: '1',
            row: 'pannelRepNode.row',
            col: 'pannelRepNode.col'
        };


        $scope.$watch('shellConfig.docklayoutconfiguration.pannelcollection', function () {
            console.log('panel arrangement changed');
            for (a = 0; a < $rootScope.shellConfig.docklayoutconfiguration.pannelcollection.length; a++) {
                $rootScope.shellConfig.docklayoutconfiguration.pannelcollection[a].panelArrangement = $rootScope.shellConfig.docklayoutconfiguration.pannelcollection[a].row + $rootScope.shellConfig.docklayoutconfiguration.pannelcollection[a].col;
            };
        }, true);

        $scope.changeTheme = function (selectedTheme) {
            console.log(selectedTheme);
            $rootScope.shellConfig.themeconfiguration.palettename = selectedTheme.primarypaletteName;
            $rootScope.shellConfig.themeconfiguration.primarypalette = selectedTheme.primarypalette;
            $rootScope.shellConfig.themeconfiguration.accentpalette = selectedTheme.accentpalette;
        };

        $scope.changeWallPaper = function (wallPaper) {
            $mdDialog.hide();
            $rootScope.shellConfig.backgroundconfiguration[2].backgroundimageconfig.imageurl = wallPaper.imgUrl;
        };

        $scope.saveGlobalSettings = function () {
            console.log($rootScope.shellConfig);
            $rootScope.shellConfig.username = $auth.getUserName();
            var client = $objectstore.getClient("shellconfig");
            client.onComplete(function (data) {
                console.log(data);
                $mdToast.show(
                    $mdToast.simple()
                    .content('Changes have been saved !')
                    .hideDelay(3000)
                );
                //shellnotification
                $rootScope.sendBulkNotification('shell congiguration changed');
            });
            client.onError(function (data) {
                console.log(data);
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

        $scope.hideProgress = true;
        $scope.getMyWallpapers = function () {
            console.log("getting my wallpapers");
            var client = $objectstore.getClient("duosoftware.com", "shellConfigWallpapers", true);
            client.onGetMany(function (data, status, headers, config) {
                console.log(data);
                $scope.hideProgress = false;
            });
            client.onError(function (data, status, headers, config) {
                console.log(data, status);
            });

            client.getByKey($auth.getUserName());
        };

        $scope.showDefaultWallpapers = function (ev) {
            $mdDialog.show({
                    controller: 'duoworld-framework-shell-launcher-settings-ctrl',
                    templateUrl: 'partials/modal-templates/partials.modal-templates.defaultwallpapers.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {

                }, function () {

                });
        };

        $scope.showMyWallpapers = function (ev) {
            $scope.getMyWallpapers();
            $mdDialog.show({
                    controller: 'duoworld-framework-shell-launcher-settings-ctrl',
                    templateUrl: 'partials/modal-templates/partials.modal-templates.mywallpapers.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {

                }, function () {

                });
        };
        $scope.uploadingWallpaper = false;
        $scope.uploadNewWallpaper = function () {
            $mdDialog.hide();
            document.getElementById("selectPicture").click();
        };

        $scope.file_changed = function (element) {
            $scope.uploadingWallpaper = true;
            var photofile = element.files[0];
            console.log(photofile, $auth.getUserName());
            $uploader.upload("duosoftware.com", "shellConfigWallpapers", photofile, $auth.getUserName(), true);
            $uploader.onSuccess(function (e, data) {
                $mdToast.show(
                    $mdToast.simple()
                    .content('Successfully uploaded wallpaper!')
                    .hideDelay(3000)
                );
                $scope.uploadingWallpaper = false;
                $scope.changeWallPaper(photofile);
            });

            $uploader.onError(function (e, data) {
                $mdToast.show(
                    $mdToast.simple()
                    .content('Something went wrong !')
                    .hideDelay(3000)
                );
                $scope.uploadingWallpaper = false;
            });

        };

        $scope.showAddNewPanel = function (ev) {
            $mdDialog.show({
                    controller: 'duoworld-framework-shell-launcher-settings-ctrl',
                    templateUrl: 'partials/modal-templates/partials.modal-templates.addnewpanel.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {

                }, function () {

                });
        };

        $scope.newPanelType = "Collections";

        $scope.addNewPanel = function () {
            $mdDialog.hide();
            var lastposition = "0";
            for (b = 0; b < $rootScope.shellConfig.docklayoutconfiguration.pannelcollection.length; b++) {
                if ($rootScope.shellConfig.docklayoutconfiguration.pannelcollection[b].panelArrangement > lastposition) {
                    lastposition = $rootScope.shellConfig.docklayoutconfiguration.pannelcollection[b].panelArrangement;
                    var prevPanelPosition = $rootScope.shellConfig.docklayoutconfiguration.pannelcollection[b];
                };

            };
            console.log(prevPanelPosition);
            if (prevPanelPosition.col == 3) {
                var newPanelPosition = {
                    "col": 0,
                    "row": parseInt(prevPanelPosition.row + 1)
                };
            } else {
                var newPanelPosition = {
                    "col": parseInt(prevPanelPosition.col + 1),
                    "row": prevPanelPosition.row
                }
            };
            var obj = {
                "shellRelationship": "DuoWorld Alpha Shell v 1.0",
                "panelDescription": "Framework shell applications panel",
                "panelTitle": $scope.newPanelTitle,
                "pannnelDirectiveContentTemplate": "partials/panel-templates/collections-pannel.html",
                "panelArrangement": newPanelPosition.row + newPanelPosition.col,
                "pannelContentCollectionType": "application-component",
                "row": newPanelPosition.row,
                "col": newPanelPosition.col,
                "panelType": $scope.newPanelType
            };
            $rootScope.shellConfig.docklayoutconfiguration.pannelcollection.push(obj);
            console.log(obj);
            $mdToast.show(
                $mdToast.simple()
                .content('Successfully added panel!')
                .hideDelay(3000)
            );
            //shellnotification
            $rootScope.sendShellNotification('new panel added');
        };

        $scope.close = function () {
            $mdDialog.cancel();
        };

        $scope.deletePanel = function (panel) {
            for (a = 0; a < $rootScope.shellConfig.docklayoutconfiguration.pannelcollection.length; a++) {
                if ($rootScope.shellConfig.docklayoutconfiguration.pannelcollection[a].panelTitle == panel.panelTitle) {
                    $rootScope.shellConfig.docklayoutconfiguration.pannelcollection.splice(a, 1);
                };
            };
        };


    };

    duoworldFrameworkShellLauncherSettingsControl.$inject = ['$rootScope', '$scope', '$state', '$objectstore', '$http', '$rootScope', 'ngDialog', '$timeout', '$mdToast', '$mdDialog', '$uploader', '$auth'];

    mambatiFrameworkShell.controller('duoworld-framework-shell-launcher-settings-ctrl', duoworldFrameworkShellLauncherSettingsControl);
})();
