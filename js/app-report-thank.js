;(function ($, window, document, undefined) {

    app.controller('ReportThankController', [ '$scope', '$http', 'shared', function($scope, $http, shared) {

        $scope.shared = shared;

        $scope.$watch('shared.loggedIn', function(newValue, oldValue) {
            var isFirstTime = newValue === undefined && newValue == oldValue;

            if (!isFirstTime && !newValue) {
                window.location = '/frontpage.html?success';
            }
        });

    }]);

})(jQuery, this, this.document);
