;(function ($, window, document, undefined) {
    'use strict';

    app.controller('MenuController', function($scope, shared, $http) {
        $scope.shared = shared;

        $scope.logoutURL = API_BASEPATH + '/unlink/';

        $scope.logout = function() {

            var config = {
                params: {
                    accessToken: $.cookie('accessToken')
                }
            };

            var data = {
                uuid: $.cookie('uuid')
            };

            $http.post($scope.logoutURL, data, config)
                .success(function (resp) {
                    $scope.shared.loggedIn = false;
                    $scope.shared.state = 'logout';
                })
                .error(function (resp) {
                    // TODO: show error popup
                });
        };

    });

})(jQuery, this, this.document);
