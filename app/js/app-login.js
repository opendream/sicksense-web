;(function ($, window, document, undefined) {

    app.controller('LoginController', [ '$scope', '$http', 'shared', function($scope, $http, shared) {

        $scope.loginURL = API_BASEPATH + '/connect/';
        $scope.checkURL = API_BASEPATH + '/users/';
        $scope.email = '';
        $scope.password = '';
        $scope.shared = shared;
        // $scope.shared.loggedIn = false;

        $scope.$watch('shared.loggedIn', function(newValue, oldValue) {
            if (newValue && !_.has($scope.query, 'redirect') && !$scope.query.redirect) {
                window.location = HOME_URL + '/report.html';
            }
        });

        $scope.validate = function() {
            var isValid = true;

            $scope.invalidLogin = false;

            if ($scope.loginForm.email.$invalid) {
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
            $scope.invalidLogin = false;
            $scope.unverifiedEmail = false;

            // Regen UUID when accessToken lose. Existing UUID is trivial cuz
            // no one can use this UUID unless he has accessToken. So regen
            // is still ok.
            if (!$.cookie('uuid') || !$.cookie('accessToken')) {
                shared.setUUID(uuid.v4());
            }

            var tmpUUID = uuid.v4();

            var params = {
                uuid: tmpUUID,
                email: $scope.email,
                password: $scope.password
            };

            var config = {};
            if ($.cookie('accessToken')) {
                config.params = {
                    accessToken: $.cookie('accessToken')
                };
            }

            $http.post($scope.loginURL, params)
                .success(function(resp) {
                    $scope.submitting = false;

                    shared.setUUID(tmpUUID);
                    $.cookie('accessToken', resp.response.accessToken);
                    $.cookie('userId', resp.response.id);

                    if (resp.response.sicksenseId) {
                        $scope.shared.loggedIn = true;
                        $scope.shared.state = 'login';
                    }

                    $scope.email = '';
                    $scope.password = '';

                    if (_.has($scope.query, 'redirect') && $scope.query.redirect) {
                        window.location = BASE_URL + '/' + $scope.query.redirect;
                    }
                })
                .error(function(resp) {
                    $scope.submitting = false;
                    if (resp.meta && resp.meta.status == 403) {

                        if (resp.meta.errorSubType && resp.meta.errorSubType == 'unverified_email') {
                            $scope.unverifiedEmail = true;
                        }
                        else {
                            $scope.invalidLogin = true;
                        }
                        $scope.invalidEmail = false;
                        $scope.invalidPassword = false;
                    }
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

        $scope.buildQuery();

    }]);

})(jQuery, this, this.document);
