;(function ($, window, document, undefined) {

    app.controller('MenuController', [ '$scope', 'shared', function($scope, shared) {
        $scope.shared = shared;

        $scope.logout = function() {
            $scope.shared.loggedIn = false;
            $.removeCookie('accessToken');
            $.removeCookie('userId');
        };

    }]);

})(jQuery, this, this.document);