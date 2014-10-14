;(function ($, window, document, undefined) {

    app.controller('ResetPasswordController', [ '$scope', '$http', 'shared', function($scope, $http, shared) {
        $scope.resetPasswordURL = API_BASEPATH + '/reset_password/';
        $scope.checkResetPasswordURL = API_BASEPATH + '/check_reset_password/';
        $scope.password = '';
        $scope.repassword = '';
        $scope.shared = shared;

        $scope.$watch('shared.loggedIn', function(newValue, oldValue) {
            if (newValue) {
                window.location = HOME_URL;
            }
        });

        $scope.initial = function () {
            var token = getParameterByName('token');
            if (token) {
                var params = {
                    token: token,
                };

                $http.post($scope.checkResetPasswordURL, params)
                    .success(function(resp) {})
                    .error(function(resp) {
                        window.location = HOME_URL;
                    });

            } else {
                window.location = HOME_URL;
            }
        }

        $scope.validate = function() {
            if ($scope.password.length < 8) {
                $scope.invalidSamePassword = false;
                $scope.invalidPassword = true;
            }
            else if ($scope.password != $scope.repassword) {
                $scope.invalidSamePassword = true;
                $scope.invalidPassword = false;
            }
            else {
                $scope.invalidSamePassword = false;
                $scope.invalidPassword = false;
            }

            return !($scope.invalidSamePassword || $scope.invalidPassword);
        };

        $scope.submit = function() {
            if (!$scope.validate()) return false;
            if ($scope.submitting) return false;

            $scope.submitting = true;

            var params = {
                password: $scope.password,
            };

            $http.post($scope.resetPasswordURL, params)
                .success(function(resp) {
                    window.location = HOME_URL + '?login';
                })
                .error(function(resp) {
                    console.log(resp);
                    $scope.submitting = false;
                });
        };

    }]);

})(jQuery, this, this.document);
