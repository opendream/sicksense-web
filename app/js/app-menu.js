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

                    shared.setUUID(uuid.v4());
                    $.cookie('accessToken', '');
                    $.cookie('userId', '');

                    window.location = BASE_URL;
                })
                .error(function (resp) {
                    // TODO: show error popup
                    window.location = BASE_URL;
                });
        };

    });

})(jQuery, this, this.document);
