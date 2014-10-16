;(function ($, window, document, undefined) {

    app.controller('ChangePasswordController', [ '$scope', '$http', 'shared', function($scope, $http, shared) {
        $scope.changePasswordURL = API_BASEPATH + '/change_password/';
        $scope.getUserURL = API_BASEPATH + '/users/' + $.cookie('userId');
        $scope.oldpassword = '';
        $scope.password = '';
        $scope.repassword = '';
        $scope.shared = shared;

        $scope.$watch('shared.loggedIn', function(newValue, oldValue) {
            var isFirstTime = newValue === undefined && newValue == oldValue;

            if (!isFirstTime && !newValue) {
                var redirectURL = HOME_URL;
                if ($scope.shared.state != 'logout') {
                    redirectURL += '?login&redirect=change-password.html';
                }
                window.location = redirectURL;
            }
        });

        $scope.initial = function () {
            var accessToken = $.cookie('accessToken');
            if (accessToken) {
                var params = {
                    accessToken: accessToken,
                };

                $http.get($scope.getUserURL, {params: params})
                    .success(function(resp) {
                        $scope.email = resp.response.email;
                    })
                    .error(function(resp) {
                        console.log(resp);
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

            $scope.invalidOldPassword = $scope.oldpassword.length < 8 ? true : false;

            return !($scope.invalidOldPassword || $scope.invalidSamePassword || $scope.invalidPassword);
        };

        $scope.submit = function() {
            if (!$scope.validate()) return false;
            if ($scope.submitting) return false;

            $scope.submitting = true;

            var params = {
                oldpassword: $scope.oldpassword,
                password: $scope.password,
            };

            $http.post($scope.changePasswordURL, params)
                .success(function(resp) {
                    // TODO: UPDATE NEW ACCESS TOKEN
                    $scope.submitStatus = 'completed';
                    $scope.submitting = false;
                })
                .error(function(resp) {
                    // TODO: CHECK IF OLD PASSWORD IS WRONG
                    // $scope.wrongOldPassword = true;
                    $scope.submitStatus = 'failed';
                    $scope.submitting = false;
                });
        };

    }]);

})(jQuery, this, this.document);
