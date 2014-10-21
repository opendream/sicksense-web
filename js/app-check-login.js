;(function ($, window, document, undefined) {

    app.controller('CheckLoginController', [ '$scope', '$http', 'shared', function($scope, $http, shared) {

        $scope.checkURL = API_BASEPATH + '/users/';
        $scope.shared = shared;

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
                    });
            }
            else {
                $scope.shared.loggedIn = false;
            }
        };

        $scope.buildQuery();
        $scope.checkLogin();

    }]);
    
})(jQuery, this, this.document);
