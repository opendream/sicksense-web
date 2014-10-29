;(function ($, window, document, undefined) {

    app.controller('CheckLoginController', [ '$scope', '$http', 'shared', function($scope, $http, shared) {

        // be sure we always has uuid
        shared.setUUID();

        // Regen UUID when accessToken lose
        if (!$.cookie('uuid') || !$.cookie('accessToken')) {
            shared.setUUID(uuid.v4());
        }

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
                var url = $scope.checkURL + userId + '?accessToken=' + accessToken;
                $http.get(url)
                    .success(function(resp) {
                        // He is sicksense id obviously, make him logged-in.
                        if (resp.response.sicksenseId) {
                            $scope.shared.loggedIn = true;
                            $scope.shared.state = 'login';
                        } else {
                            $scope.shared.loggedIn = false;
                            $scope.shared.state = 'logout';
                        }

                        if (_.has($scope.query, 'redirect') && $scope.query.redirect) {
                            window.location = BASE_URL + '/' + $scope.query.redirect;
                        }

                    })
                    .error(function(resp) {
                        // reset uuid if cannot login successfully.
                        shared.setUUID(uuid.v4());

                        $scope.shared.loggedIn = false;
                        $scope.shared.state = 'logout';

                        $.removeCookie('accessToken');
                        $.removeCookie('userId');
                    });
            }
            else {
                shared.setUUID();

                $scope.shared.loggedIn = false;
                // TODO: Actually I don't why we need `state` variables. Need to
                // check later if it necessary or not.
                $scope.shared.state = false;
            }
        };

        $scope.buildQuery();
        $scope.checkLogin();

    }]);

})(jQuery, this, this.document);
