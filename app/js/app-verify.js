;(function ($, window, document, undefined) {

'use strict';

app.controller('VerifyController', function ($scope, $http, shared) {
    $scope.verifyPasswordURL = API_BASEPATH + '/users/verify/';
    $scope.verifySuccess = false;
    $scope.verifyFail = false;
    $scope.shared = shared;
    $scope.isiOS = $.browser.ipad || $.browser.iphone;

    $http.post($scope.verifyPasswordURL, {
        token: getParameterByName('token')
    })
    .success(function (resp) {
        $scope.verifySuccess = true;
    })
    .error(function (resp) {
        $scope.verifyFail = true;
    });

});


})(jQuery, window, document);
