;(function ($, window, document, undefined) {

    app.controller('ForgotPasswordController', [ '$scope', '$http', 'shared', function($scope, $http, shared) {
        $scope.forgotPasswordURL = API_BASEPATH + '/users/forgot-password';
        $scope.email = '';
        $scope.shared = shared;
        $scope.isiOS = $.browser.ipad || $.browser.iphone;
        $scope.success = false;

        $scope.$watch('shared.loggedIn', function(newValue, oldValue) {
            if (newValue) {
                window.location = HOME_URL + '/report.html';
            }
        });

        $scope.isEmail = function(email) {
            var re = new RegExp(/^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            if (!email.match(re)) {
                return false;
            }
            return true;
        };

        $scope.validate = function() {
            $scope.invalidEmail = !$scope.isEmail($scope.email);
            return !$scope.invalidEmail;
        };

        $scope.submit = function() {
            $scope.message = '';
            $scope.error = false;
            $scope.invalidUser = false;

            if (!$scope.validate()) return false;
            if ($scope.submitting) return false;
            $scope.submitting = true;

            var params = {
                email: $scope.email
            };

            $http.post($scope.forgotPasswordURL, params)
                .success(function(resp) {
                    $scope.message = resp.response.message;
                    $scope.success = true;
                })
                .error(function(resp) {
                    if (resp.meta && resp.meta.status == 403) {
                        $scope.invalidUser = true;
                    }
                    else {
                        $scope.error = true;
                    }
                    $scope.submitting = false;
                });
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

        $scope.isInvalidLinkFromResetPassword = function () {
            if (_.has($scope.query, 'invalid-url')) {
                $scope.invalidResetLink = true;
            }
        };

        $scope.buildQuery();
        $scope.isInvalidLinkFromResetPassword();
    }]);

})(jQuery, this, this.document);
