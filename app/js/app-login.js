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
                    $.cookie('accessToken', resp.response.accessToken);
                    $.cookie('userId', resp.response.id);
                    $scope.shared.loggedIn = true;
                    $scope.submitting = false;
                    $scope.email = '';
                    $scope.password = '';

                    if (_.has($scope.query, 'redirect') && $scope.query.redirect) {
                        window.location = BASE_URL + '/' + $scope.query.redirect;
                    }
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
            if (_.has($scope.query, 'login')) {
                $('#loginModal').foundation('reveal', 'open');
            }
        };

        $scope.buildQuery = function() {
            var queryString = window.location.search.substr(1);
            var queries = queryString.split('&');
            var results = {};
            queries.forEach(function(query) {
                var tmp = query.split('=');
                results[tmp[0]] = tmp[1];
            });
            $scope.query = results;
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
                        $scope.shared.state = 'login';

                        if (_.has($scope.query, 'redirect') && $scope.query.redirect) {
                            window.location = BASE_URL + '/' + $scope.query.redirect;
                        }
                    })
                    .error(function(resp) {
                        $scope.shared.loggedIn = false;
                        $.removeCookie('accessToken');
                        $.removeCookie('userId');
                        $scope.checkModal();
                    });
            }
            else {
                $scope.shared.loggedIn = false;
                $scope.checkModal();
            }
        };

        $scope.buildQuery();
        $scope.checkLogin();

    }]);
    
})(jQuery, this, this.document);
