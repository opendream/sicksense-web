(function () {
'use strict';

app.controller('AdminMenuController', function ($scope, $rootScope, shared) {

    $scope.$watch('token', function (newValue, oldValue) {
        shared.token = newValue;
    });

    $scope.loginAdmin = function () {
        $rootScope.$broadcast('tokenChanged', shared.token);
    };

});

})();
