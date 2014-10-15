;(function ($, window, document, undefined) {

    app.controller('ForgotPasswordController', [ '$scope', '$http', 'shared', function($scope, $http, shared) {
        $scope.forgotPasswordURL = API_BASEPATH + '/users/forgotpassword';
        $scope.email = '';
        $scope.shared = shared;

        $scope.$watch('shared.loggedIn', function(newValue, oldValue) {
            if (newValue) {
                window.location = HOME_URL;
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
    }]);

})(jQuery, this, this.document);
