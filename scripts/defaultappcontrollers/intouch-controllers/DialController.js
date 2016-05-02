mambatiFrameworkShell.controller('DialCtrl', function ($scope, $rootScope, dataHandler) {

    $scope.scrollbarConfig2 = {
        autoHideScrollbar: false,
        setWidth: "80vw",
        setHeight: "15vh",
        axis: 'x',
        advanced: {
            updateOnContentResize: true
        },
        scrollButtons: {
            enable: true
        },
        theme: 'minimal-dark',
        scrollInertia: 500
    };

    var currentNumber;
    $scope.dialingNumber = "";
    $scope.changeNumber = function (num) {
        if ($scope.dialingNumber == null || $scope.dialingNumber == "") {
            $scope.dialingNumber = num;
            //            $scope.dialingNumber = currentNumber;
            $rootScope.filterNumber = $scope.dialingNumber;
        } else {
            //            currentNumber = currentNumber + num;
            $scope.dialingNumber = $scope.dialingNumber + num;
            $rootScope.filterNumber = $scope.dialingNumber;
        }
        console.log($scope.dialingNumber);
    };

    $scope.backspace = function () {
        console.log($scope.dialingNumber.toString());
        $scope.dialingNumber = $scope.dialingNumber.toString();
        $scope.dialingNumber = $scope.dialingNumber.substring(0, $scope.dialingNumber.length - 1);
        $rootScope.filterNumber = $scope.dialingNumber;
    };


    $scope.clickIcon = "icons/ic_call_24px.svg";
    $scope.color = "green";
    $scope.calling = false;

    $scope.clickIconMorph = function () {
        // console.log($scope.dialingNumber);

        if ($scope.clickIcon == 'icons/ic_call_24px.svg') {
            $scope.clickIcon = 'icons/ic_call_end_24px.svg';
            $scope.color = "red";
            $scope.calling = true;
            $scope.checkContact($scope.dialingNumber);
            $scope.playBeep();
            //$('#decline').css("background-color","red");
        } else {
            $scope.clickIcon = 'icons/ic_call_24px.svg';
            $scope.color = "green";
            $scope.calling = false;
            $scope.stopBeep();
            //$('#decline').css("background-color","green");
        }

    };

    $scope.callFromDialpad = function (user) {
        // console.log($scope.dialingNumber);
        if ($scope.clickIcon == 'icons/ic_call_24px.svg') {
            $scope.dialingNumber = user.mobile;
            $scope.clickIcon = 'icons/ic_call_end_24px.svg';
            $scope.color = "red";
            $scope.calling = true;
            $scope.checkContact($scope.dialingNumber);
            $scope.playBeep();
            //$('#decline').css("background-color","red");
        } else {
            $scope.clickIcon = 'icons/ic_call_24px.svg';
            $scope.color = "green";
            $scope.calling = false;
            $scope.stopBeep();
            //$('#decline').css("background-color","green");
        }
    };

    $scope.profile_pic = "images/connect/chat2.jpg";

    $scope.checkContact = function (number) {
        $scope.reciever_name = "UNKNOWN";
        $scope.profile_pic = "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozOUUwQzZGRTE2QkIxMUUzQUVGNUZDQ0I3MzQ1ODU1QiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozOUUwQzZGRjE2QkIxMUUzQUVGNUZDQ0I3MzQ1ODU1QiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjJGNTQ1QkZGMTZCQjExRTNBRUY1RkNDQjczNDU4NTVCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjJGNTQ1QzAwMTZCQjExRTNBRUY1RkNDQjczNDU4NTVCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+za7CHgAAEmJJREFUeNrsXWlw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";
        var flag = false;
        for (i = 0; i < $scope.contacts.length; i++) {
            if ($scope.contacts[i].mobile == number) {
                $scope.reciever_name = $scope.contacts[i].fname + " " + $scope.contacts[i].lname;
                $scope.profile_pic = $scope.contacts[i].profile_pic;
                dataHandler.addToCallLog($scope.contacts[i], 'outgoing');
                flag = true;
            };
        }

        if (flag == false) {
            dataHandler.addToCallLog(number, 'unknown');
        };
    };

    $scope.playBeep = function () {
        var audio = document.getElementById("dialerTune");
        audio.loop = true;
        audio.load();
        audio.play();
    };

    $scope.stopBeep = function () {
        var audio = document.getElementById("dialerTune");
        audio.pause();
    };

    $scope.show = false;

    $scope.contacts = dataHandler.getUsers();

}); //END OF DialCtrl
