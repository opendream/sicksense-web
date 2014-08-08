;(function ($, window, document, undefined) {

    app.controller('LoginController', [ '$scope', '$http', 'shared', function($scope, $http, shared) {

        $scope.loginURL = API_BASEPATH + '/login/';
        $scope.checkURL = API_BASEPATH + '/users/';
        $scope.email = '';
        $scope.password = '';
        $scope.shared = shared;
        // $scope.shared.loggedIn = false;

        $scope.isEmail = function(email) {
            var re = new RegExp(/^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            if (!email.match(re)) {
                return false;
            }
            return true;
        };

        $scope.validate = function() {
            var isValid = true;

            $scope.invalidLogin = false;

            if (!$scope.isEmail($scope.email)) {
                $scope.invalidEmail = true;
                isValid = false;
            }
            else {
                $scope.invalidEmail = false;
            }

            if ($scope.password.length < 8) {
                $scope.invalidPassword = true;
                isValid = false;
            }
            else {
                $scope.invalidPassword = false;
            }

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
                    $scope.submitting = false;
                    $scope.email = '';
                    $scope.password = '';
                })
                .error(function(resp) {
                    $scope.submitting = false;
                    if (resp.error && resp.error.statusCode == 403) {
                        $scope.invalidLogin = true;
                        $scope.invalidEmail = false;
                        $scope.invalidPassword = false;
                    }
                });
        };

        $scope.checkModal = function() {
            var query = window.location.search.substr(1);
            if (query === 'success') {
                $('#loginModal').foundation('reveal', 'open');
            }
        };

        $scope.checkLogin = function() {
            var accessToken = $.cookie('accessToken');
            var userId = $.cookie('userId');

            $scope.invalidLogin = false;

            if (accessToken && userId) {
                var url = $scope.checkURL + userId + '?accessToken=' + accessToken
                $http.get(url)
                    .success(function(resp) {
                        $scope.shared.loggedIn = true;
                    })
                    .error(function(resp) {
                        $scope.checkModal();
                    });
            }
            else {
                $scope.checkModal();
            }
        };

        $scope.checkLogin();

    }]);
    
})(jQuery, this, this.document);
