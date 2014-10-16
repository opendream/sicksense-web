;(function ($, window, document, undefined) {

'use strict';

app.controller('VerifyController', function ($scope, $http, shared) {
    $scope.verifyPasswordURL = API_BASEPATH + '/users/verify/';
    $scope.shared = shared;

    $http.post($scope.verifyPasswordURL, {
        token: getParameterByName('token')
    })
    .success(function (resp) {
        $scope.verifySuccess = true;
        $.cookie('accessToken', resp.response.accessToken);
        $.cookie('userId', resp.response.id);
        $scope.shared.loggedIn = true;
    })
    .error(function (resp) {
        $scope.verifySuccess = false;
    });

});


})(jQuery, window, document);
