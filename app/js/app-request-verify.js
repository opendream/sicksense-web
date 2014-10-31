;(function ($, window, document, undefined) {

    app.controller('RequestVerifyController', [ '$scope', '$http', 'shared', function($scope, $http, shared) {
        $scope.forgotPasswordURL = API_BASEPATH + '/users/request-verify';
        $scope.email = '';
        $scope.shared = shared;

        $scope.$watch('shared.loggedIn', function(newValue, oldValue) {
            if (newValue) {
                window.location = HOME_URL + '/report.html';
            }
        });

        $scope.validate = function() {
            $scope.error = false;
            $scope.success = false;

            $scope.invalidEmail = $scope.requestVerifyForm.email.$invalid;

            return $scope.requestVerifyForm.$valid;
        };

        $scope.submit = function() {
            $scope.message = '';
            $scope.error = false;
            $scope.invalidUser = false;
            $scope.alreadyVerified = false;

            if (!$scope.validate()) return false;
            if ($scope.submitting) return false;
            $scope.submitting = true;

            var params = {
                email: $scope.email
            };

            $http.post($scope.forgotPasswordURL, params)
                .success(function(resp) {
                    $scope.success = true;
                    $scope.error = false;
                    $scope.submitting = false;
                })
                .error(function(resp) {
                    if ( resp.meta &&
                         resp.meta.status == 400 &&
                         resp.meta.errorMessage.match(/(not found)|(ไม่พบ)/i) ) {
                        $scope.invalidUser = true;
                    }
                    else if ( resp.meta &&
                         resp.meta.status == 400 &&
                         resp.meta.errorSubType == 'email_is_already_verified' ) {
                        $scope.alreadyVerified = true;
                    }
                    else {
                        $scope.error = true;
                        $scope.success = false;
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

        $scope.buildQuery();
    }]);

})(jQuery, this, this.document);
