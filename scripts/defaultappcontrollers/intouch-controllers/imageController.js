mambatiFrameworkShell.controller('ImageController', function ($scope, $rootScope, $mdDialog, data, imageGallery) {

    $scope.data = data;
    $scope.imageGallery = imageGallery;

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.position = 0;

    for (i = 0; i < $scope.imageGallery.length; i++) {
        console.log($scope.imageGallery[i].content, $scope.data.content);
        if ($scope.imageGallery[i].content == $scope.data.content.content) {
            $scope.position = i;
        };
    };

    /*$scope.nextImage = function () {
        for (i = 0; i < $scope.imageGallery.length; i++) {
            if ($scope.data.content.content == $scope.imageGallery[i].content) {
                var flag = i;
            };
        };


        var next = parseInt(flag + 1);
        if (next == $scope.imageGallery.length) {
            $scope.data.content.content = $scope.imageGallery[0].content;
        } else {
            $scope.data.content.content = $scope.imageGallery[next].content;
        };

        $scope.animClass = "moveRight";
    };

    $scope.previousImage = function () {
        for (i = 0; i < $scope.imageGallery.length; i++) {
            if ($scope.data.content.content == $scope.imageGallery[i].content) {
                var flag = i;
            };
        };

        var previous = parseInt(flag - 1);
        if (previous == -1) {
            $scope.data.content.content = $scope.imageGallery[parseInt($scope.imageGallery.length - 1)].content;
        } else {
            $scope.data.content.content = $scope.imageGallery[previous].content;
        };
        $scope.animClass = "moveLeft";
    };*/


});
