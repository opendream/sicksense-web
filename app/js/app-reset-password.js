;(function ($, window, document, undefined) {

    app.controller('ResetPasswordController', [ '$scope', '$http', 'shared', function($scope, $http, shared) {
        $scope.resetPasswordURL = API_BASEPATH + '/users/reset-password/';
        $scope.validateTokenURL = API_BASEPATH + '/onetimetoken/validate/';
        $scope.forgotPasswordURL = HOME_URL + '/forgot-password.html?invalid-url';
        $scope.password = '';
        $scope.repassword = '';
        $scope.shared = shared;
        $scope.isiOS = $.browser.ipad || $.browser.iphone;

        $scope.$watch('shared.loggedIn', function(newValue, oldValue) {
            if (newValue) {
                window.location = HOME_URL + '/report.html';
            }
        });

        $scope.initial = function () {
            var token = getParameterByName('token');

            if (token) {
                var params = {
                    token: token,
                    type: 'user.resetPassword'
                };

                $http.post($scope.validateTokenURL, params)
                    .success(function(resp) {})
                    .error(function(resp) {
                        window.location = $scope.forgotPasswordURL;
                    });

            } else {
                window.location = $scope.forgotPasswordURL;
            }
        }

        $scope.validate = function() {
            if ($scope.password.length < 8 || $scope.password.length > 64) {
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
            if ($scope.submitting) return false;

            $scope.submitStatus = '';
            if (!$scope.validate()) return false;

            $scope.submitting = true;

            var params = {
                password: $scope.password,
                token: getParameterByName('token')
            };

            $http.post($scope.resetPasswordURL, params)
                .success(function(resp) {
                    $scope.submitStatus = 'completed';
                })
                .error(function(resp) {
                    console.log(resp);
                    $scope.submitStatus = 'failed';
                    $scope.submitting = false;
                });
        };

    }]);

})(jQuery, this, this.document);
