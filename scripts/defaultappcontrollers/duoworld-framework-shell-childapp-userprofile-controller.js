(function () {

    var duoworldFrameworksShellLauncherUserProfileControl = function ($rootScope, $scope, $state, $http, $timeout, $presence, $objectstore, $uploader, $mdToast, $window, $auth, $mdDialog) {

        $scope.defaultClassView = true;


        //$scope.shellUserProfileSection = [];
        console.log($rootScope.shellUserProfileSection);
        $rootScope.shellUserProfileSection.disabled = true;

        $scope.shellUserProfileSectionEdit = function () {
            if ($rootScope.shellUserProfileSection.disabled == true) {
                $rootScope.shellUserProfileSection.disabled = false;
                $scope.selectedIcon = "save";
            } else {
                $rootScope.shellUserProfileSection.disabled = true;
                $scope.selectedIcon = "mode_edit";
                saveProfile();
            }
        };

        $auth.checkSession();
        $scope.selectedIcon = "mode_edit";
        //default banner
        //$scope.banner = "images/userassets/contactcoverimg/cover1.jpg";
        //cover picture uploading progress
        $scope.progressCircle = false;
        //banner picture uploading progress
        $scope.bannerProgress = false;
        //hides the img tag which displays the user uploaded banner
        $scope.hideObjectstoreBanner = true;
        //bannerFrom is a refference,whether to load the banner from object store(user uploaded) or from the pre-defined set of covers
        $scope.bannerFrom = $rootScope.shellUserProfileSection.bannerPicture;

        $scope.changeBanner = function (ev) {
            $mdDialog.show({
                controller: userProfileBannerController,
                templateUrl: 'partials/frameworktemplates/changeBanner.html',
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function (answer) {
                if (answer.type == "selected") {
                    $rootScope.banner = answer.data;
                    $scope.bannerFrom = $rootScope.banner;
                    $rootScope.hideObjectstoreBanner = true;
                    saveProfile();
                    //                    shell notifiaction
                    $rootScope.sendShellNotification('changed cover picture');

                } else if (answer.type == "upload") {
                    $scope.bannerProgress = true;
                    $rootScope.hideObjectstoreBanner = false;
                    var photofile = answer.data;
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            var str = e.target.result;
                            str = str.replace("data:image/png;base64,", "");
                            str = str.replace("data:image/jpeg;base64,", "");
                            //console.log(str);
                            $rootScope.banner = str;
                        });
                    };

                    reader.readAsDataURL(photofile);
                    $uploader.upload("duoworld.duoweb.info", "coverPictures", photofile, $auth.getUserName(), true);
                    $uploader.onSuccess(function (e, data) {
                        $scope.bannerFrom = "fromObjectStore";
                        saveProfile();
                        $scope.bannerProgress = false;
                        //                    shell notifiaction
                        $rootScope.sendShellNotification('uploaded new cover picture');

                    });

                    $uploader.onError(function (e, data) {
                        Toast("Error occured");

                        //                    shell notifiaction
                        $rootScope.sendShellNotification('failed to change cover picture');

                    });
                };
            });

        };

        function saveProfile() {

            //sorting where the banner picture is from
            if ($scope.bannerFrom == "fromObjectStore") {
                var banner = "fromObjectStore";
            } else {
                var banner = $rootScope.banner;
            };

            $scope.user = {
                name: $rootScope.shellUserProfileSection.name,
                phone: $rootScope.shellUserProfileSection.phone,
                email: $rootScope.shellUserProfileSection.email,
                company: $rootScope.shellUserProfileSection.company,
                country: $rootScope.shellUserProfileSection.country,
                zipcode: $rootScope.shellUserProfileSection.zipcode,
                bannerPicture: banner,
                id: "admin@duosoftware.com",
                username: $auth.getUserName()
            };
            console.log($scope.user);
            var client = $objectstore.getClient("duosoftware.com", "profile", true);

            client.onError(function (data) {
                Toast("Error occured while saving");


            });

            client.onComplete(function (data) {
                Toast("you profile got updated!");

                //                    shell notifiaction
                $rootScope.sendShellNotification('updated profile info');

            });

            client.update($scope.user, {
                KeyProperty: "username"
            });
        };


        //        $scope.getProfilePicture = function () {
        //
        //            var client = $objectstore.getClient(window.location.hostname, "profilepictures", true);
        //            client.onGetOne(function (data) {
        //                if (data)
        //                    console.log(data, window.location.hostname);
        //                $scope.profilePicture = data.Body;
        //            });
        //            client.onError(function (data) {
        //                Toast("Error occured while fetching profile picture");
        //            });
        //            client.getByKey($rootScope.shellUserProfileSection.email);
        //        };
        //
        //        $scope.getBannerPicture = function () {
        //            var client = $objectstore.getClient(window.location.hostname, "coverPictures", true);
        //            client.onGetOne(function (data) {
        //                if (data)
        //                    console.log(data);
        //                $scope.banner = data.Body;
        //                if (data.Body == undefined) {
        //                    $scope.banner = "images/userassets/contactcoverimg/cover1.jpg";
        //                    $scope.hideObjectstoreBanner = true;
        //                };
        //            });
        //            client.onError(function (data) {
        //                Toast("Error occured while fetching Banner");
        //            });
        //            client.getByKey($rootScope.shellUserProfileSection.email);
        //        };

        //$scope.getProfilePicture();


        //        console.log($rootScope.shellUserProfileSection);
        //        if ($rootScope.shellUserProfileSection.bannerPicture == undefined) {
        //            $rootScope.shellUserProfileSection.bannerPicture = "fromObjectStore";
        //        };
        //
        //        if ($rootScope.shellUserProfileSection.bannerPicture == "fromObjectStore") {
        //            console.log($rootScope.shellUserProfileSection.bannerPicture);
        //            $scope.getBannerPicture();
        //            $scope.hideObjectstoreBanner = false;
        //        } else {
        //            $scope.hideObjectstoreBanner = true;
        //            $scope.banner = $rootScope.shellUserProfileSection.bannerPicture;
        //            console.log($scope.banner);
        //        };


        //test();
        $scope.EditProfpic = function () {
            document.getElementById("selectPicture").click();
        }

        $scope.file_changed = function (element) {
            $scope.progressCircle = true;

            var photofile = element.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {

                $scope.$apply(function () {
                    var str = e.target.result;
                    str = str.replace("data:image/png;base64,", "");
                    str = str.replace("data:image/jpeg;base64,", "");
                    // console.log(str);
                    $rootScope.profilePicture = str;
                });
            };

            reader.readAsDataURL(photofile);
            //console.log($scope.myFile, photofile);
            console.log("username is : ");
            console.log($auth.getUserName());
            //            $uploader.upload("duoworld.duoweb.info", "profilepictures", photofile, $auth.getUserName(), true);
            //            $uploader.onSuccess(function (e, data) {
            //                $scope.progressCircle = false;
            //                //console.log("successfull");
            //                Toast('successfully updated');
            //                //$scope.getProfilePicture();
            //
            //                //shellnotification
            //                $rootScope.shellSettingsChangeNotification('changed profile picture');
            //            });
            //
            //            $uploader.onError(function (e, data) {
            //                $scope.progressCircle = false;
            //                Toast("Error occured");
            //                console.log(data);
            //                //shellnotification
            //                $rootScope.shellSettingsChangeNotification('couldnt change profile picture');
            //            });

            $uploader.onSuccess(function () {
                $scope.progressCircle = false;
                Toast('successfully updated');
                $rootScope.sendShellNotification('changed profile picture');
            });
            $uploader.onError(function () {
                $scope.progressCircle = false;
                Toast("Error occured");
            });
            $uploader.uploadUserMedia("profilepictures", $scope.myFile, "profile.jpg");

        };

        function Toast(msg) {
            $mdToast.show(
                $mdToast.simple()
                .content(msg)
                .position('bottom left')
                .hideDelay(500)
            );
        };
        $scope.userProfileChangePassword = function (ev) {
            var changePasswordTemplate = "<md-dialog style='min-width:30%;'><md-content layout-padding>\
            <form name='changePasswordForm'><md-input-container>\
                                            <label>Previous Password</label>\
                                        <input ng-model='changePasswordForm.oldPass' type='password' required>\
                                        </md-input-container>\
     <md-input-container>\
          <label>New Password</label>\
          <input ng-model='changePasswordForm.newPass' name='pass' type='password' minlength='8' required>\
<div ng-messages='changePasswordForm.pass.$error' ng-show='changePasswordForm.pass.$dirty'>\
          <div ng-message='minlength'>requires minimum of 8 characters</div>\
<div ng-message='required'>Password is a must</div>\
        </div>\
        </md-input-container>\
           <md-input-container>\
          <label>Re-enter New Password</label>\
          <input ng-model='changePasswordForm.reNewPass' type='password' required>\
          <div ng-if='changePasswordForm.reNewPass !== changePasswordForm.newPass' style='font-size: 11px;position:absolute;bottom: 0px;color: #F45144;'>Re-Check your password</div>\
        </md-input-container>\
<div class='md-actions' layout='row'>\
<md-button class='md-primary' ng-disabled='changePasswordForm.reNewPass !== changePasswordForm.newPass' ng-click='changePassword();'>Save</md-button></div></form>\
</md-content></md-dialog>";
            $mdDialog.show({
                controller: userProfileChangePasswordController,
                template: changePasswordTemplate,
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function (data) {
                console.log(data);

                $http({
                    method: 'GET',
                    url: 'http://' + $rootScope.currenttenantsessioninfo.Domain + '/auth/ChangePassword/' + data.oldPass + '/' + data.newPass,

                }).
                success(function (data, status, headers, config) {
                    console.log(data);
                    Toast('Password Changed Successfully');
                }).
                error(function (data, status, headers, config) {
                    console.log(data, $auth.getSecurityToken());
                    Toast('Invalid Credentials!');
                });
            });
        };

        function getPaymentDetails() {
            $scope.paymentDetailsLocked = false;
            $http({
                method: 'GET',
                url: 'http://' + $rootScope.currenttenantsessioninfo.Domain + '/payapi/account/get',

            }).
            success(function (data, status, headers, config) {
                console.log(data);
                $scope.paymentAccountDetails = data[0];
                if ($scope.paymentAccountDetails == null) {
                    $scope.paymentDetailsLocked = true;
                };
            }).
            error(function (data, status, headers, config) {
                $scope.paymentDetailsLocked = true;
                console.log(data, $auth.getSecurityToken());
            });
        };

        getPaymentDetails();

        function userProfileChangePasswordController($scope, $mdDialog) {
            $scope.changePassword = function () {
                $mdDialog.hide($scope.changePasswordForm);
                //console.log($scope.changePasswordForm);
            };

            $scope.matchPassword = function () {
                if (changePasswordForm.newPass == changePasswordForm.reNewPass) {
                    $scope.passwordMatchError = false;
                } else {
                    $scope.passwordMatchError = true;
                };
                return
            };
        };


    };

    function userProfileBannerController($scope, $mdDialog) {
        $scope.closeDialog = function () {
            // Easily hides most recent dialog shown...
            // no specific instance reference is needed.
            $mdDialog.hide();
        };
        $scope.selectedBanner = function (ans) {
            var obj = {
                data: ans,
                type: "selected"
            };
            $mdDialog.hide(obj);
        };

        $scope.changeBanner = function () {
            document.getElementById("selectCover").click();
        };

        $scope.coverBanners = ['1', '2', '3', '4', '5', '6', '7'];

        $scope.cover_changed = function (element) {
            var photofile = element.files[0];
            var obj = {
                data: photofile,
                type: "upload"
            };
            $mdDialog.hide(obj);

        };
    };


    duoworldFrameworksShellLauncherUserProfileControl.$inject = ['$rootScope', '$scope', '$state', '$http', '$timeout', '$presence', '$objectstore', '$uploader', '$mdToast', '$window', '$auth', '$mdDialog'];
    //    mambatiFrameworkShell.controller('tableCtrl', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
    //
    //
    //}]);

    mambatiFrameworkShell.controller('duoworld-framework-shell-launcher-userprofile-ctrl', duoworldFrameworksShellLauncherUserProfileControl);
}());
