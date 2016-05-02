mambatiFrameworkShell.controller('addUserController', function ($scope, $rootScope, $mdDialog, data, $timeout, $q, dataHandler) {
    console.log(data);
    $scope.users = [];
    $scope.showProgress = false;
    var nativeUser = dataHandler.getNativeUser();

    for (a = 0; a < data.users.length; a++) {
        if (data.users[a].username == nativeUser) {
            data.users.splice(a, 1);
        };
    };

    if (data.channel !== undefined) {
        $scope.channel = data.channel;
    };


    if (data.channel !== undefined) {
        for (b = 0; b < data.users.length; b++) {
            $scope.users.push(data.users[b]);

            for (c = 0; c < data.channel.members.length; c++) {
                if (data.users[b].username == data.channel.members[c].name && data.channel.members[c].status == 'active') {
                    $scope.users.pop();
                };
            };

        };
        console.log($scope.users);
    } else {
        $scope.users = data.users;
    };

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.contacts = [];

    $scope.returnSelectedUsers = function (type) {
        $scope.showProgress = true;
        var newChannel = {
            topic: $scope.channelName,
            members: []
        };
        for (a = 0; a < $scope.users.length; a++) {
            if ($scope.users[a].selected == true) {
                newChannel.members.push($scope.users[a].username);
            };
        };

        if (type == 'new') {
            dataHandler.createNewChannel(newChannel);
        } else {
            $mdDialog.hide(newChannel);
        };

    };







});
