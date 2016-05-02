mambatiFrameworkShell.controller('CallCtrl', function ($scope, $rootScope, $mdDialog, $chat, $state) {
//    $scope.user = $rootScope.dialingUser;
 //    $scope.endCall = false;
 //    $scope.startCall = true;
 //
 //    $scope.callData = $rootScope.callData;
 //
 $scope.decline = function () {
         $mdDialog.hide('declined');
    };
    $scope.accept = function () {
        $mdDialog.hide('accepted');
    };
 //
 //    $rootScope.showDeclinedMessage = function () {
 //        $scope.end_call();
 //        $mdDialog.show(
 //            $mdDialog.alert()
 //            .parent(angular.element(document.querySelector('#popupContainer')))
 //            .clickOutsideToClose(true)
 //            .title('Call timed out!')
 //            .content('Seems ' + $scope.user.fname + ' is busy at the moment')
 //            .ariaLabel('Alert Dialog Demo')
 //            .ok('Got it!')
 //        );
 //    };
 //
 //    $rootScope.showAcceptedMessage = function () {
 //        $scope.end_call();
 //        $mdDialog.show(
 //            $mdDialog.alert()
 //            .parent(angular.element(document.querySelector('#popupContainer')))
 //            .clickOutsideToClose(true)
 //            .title('Call Answered!')
 //            .content('wait till we connect you with  ' + $scope.user.fname)
 //            .ariaLabel('Alert Dialog Demo')
 //            .ok('Got it!')
 //        );
 //    };
 //
 //    $rootScope.endIncomingCall = function () {
 //        $mdDialog.cancel();
 //    };
 //
 //    $scope.endBeforeAnswer = function () {
 //        $rootScope.endOutgoingCall($scope.user);
 //        $scope.end_call();
 //    };
 //
 //    $rootScope.disconnectCall = function () {
 //        $scope.end_call();
 //    };
 //
 //    $scope.end_call = function () {
 //
 //        $scope.endCall = true;
 //        $scope.stopBeep();
 //        $rootScope.videoCall = false;
 //        $rootScope.selfCam = false;
 //        $rootScope.gotoConversation($scope.user);
 //        //setTimeout(function () {
 //        //$rootScope.changeState($scope.user.username);
 //        //$state.go("conversation");
 //        // }, 500);
 //    };
 //
 //    $scope.webCam = "icons/ic_videocam_24px.svg";
 //
 //    $scope.webCamOn = function () {
 //        if ($rootScope.selfCam == true) {
 //            $scope.webCam = "icons/ic_videocam_24px.svg ";
 //            $rootScope.selfCam = false;
 //        } else {
 //            $scope.webCam = "icons/ic_videocam_off_24px.svg ";
 //            $rootScope.selfCam = true;
 //        }
 //    };
 //
 //    $scope.mic = "icons/ic_mic_24px.svg";
 //    $scope.micOn = function () {
 //        if ($scope.mic == "icons/ic_mic_24px.svg") {
 //            $scope.mic = "icons/ic_mic_off_24px.svg ";
 //        } else {
 //            $scope.mic = "icons/ic_mic_24px.svg ";
 //        }
 //    };
 //
 //    $scope.stopBeep = function () {
 //        var audio = document.getElementById("dialerTune");
 //        audio.pause();
 //    };
});
