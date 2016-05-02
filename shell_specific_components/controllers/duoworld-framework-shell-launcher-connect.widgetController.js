mambatiFrameworkShell.controller('WidgetCtrl', function ($scope, $rootScope, dataHandler) {
    //creating temporarty users
    $scope.users = [];
    $scope.contacts = dataHandler.getAllContacts();

    for (i = 0; i < $scope.contacts.length; i++) {
        $scope.users.push({
            username: $scope.contacts[i].username,
            Msg: [],
            count: 0,
            id: $scope.users.length,
            fname: $scope.contacts[i].fname,
            lname: $scope.contacts[i].lname,
            location: $scope.contacts[i].location,
            email: $scope.contacts[i].email,
            mobile: $scope.contacts[i].mobile,
            profile_pic: $scope.contacts[i].profile_pic,
            status: "offline",
            quickNote: ""
        });
        console.log($scope.users);
        $rootScope.users = $scope.users;
    };

});
