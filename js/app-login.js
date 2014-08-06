;(function ($, window, document, undefined) {

    app.controller('LoginController', [ '$scope', '$http', 'shared', function($scope, $http, shared) {

        $scope.loginURL = API_BASEPATH + '/login/';
        $scope.checkURL = API_BASEPATH + '/users/';
        $scope.email = '';
        $scope.password = '';
        $scope.shared = shared;
        $scope.shared.loggedIn = false;

        $scope.validate = function() {
            var isValid = true;

            return isValid;
        };

        $scope.login = function() {
            if (!$scope.validate()) return false;
            if ($scope.submitting) return false;

            $scope.submitting = true;

            var params = {
                email: $scope.email,
                password: $scope.password
            };

            $http.post($scope.loginURL, params)
                .success(function(resp) {
                    $('#loginModal').foundation('reveal', 'close');
                    $.cookie('accessToken', resp.response.accessToken);
                    $.cookie('userId', resp.response.id);
                    $scope.shared.loggedIn = true;
                })
                .error(function(resp) {
                    $scope.submitting = false;
                    if (resp.error && resp.error.statusCode == 403) {
                        console.log('login failed');
                    }
                });
        };

        $scope.checkLogin = function() {
            var accessToken = $.cookie('accessToken');
            var userId = $.cookie('userId');

            if (accessToken && userId) {
                var url = $scope.checkURL + userId + '?accessToken=' + accessToken
                $http.get(url)
                    .success(function(resp) {
                        $scope.shared.loggedIn = true;
                    });
            }
        };

        $scope.checkLogin();

    }]);
    
})(jQuery, this, this.document);
