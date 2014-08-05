;(function ($, window, document, undefined) {

    $(document).foundation();

    var app = angular.module('sicksense', []);

    app.controller('RegisterController', [ '$scope', function($scope) {
        $scope.yearOptions = {};
        for (var i = 0; i < 100; i++) {
            var year = 2557 - i;
            $scope.yearOptions[year] = year;
        }

        $scope.provinceOptions = locations.provinces;

        $scope.$watch('province', function(newValue, oldValue) {
            if (newValue) {
                $scope.amphoes = locations[newValue].amphoes;
            }
            else {
                $scope.amphoes = [];
                $scope.tambons = [];
            }
        });

        $scope.$watch('amphoe', function(newValue, oldValue) {
            if (newValue) {
                $scope.tambons = locations[$scope.province][newValue];
            }
            else {
                $scope.tambons = [];
            }
        });
    }]);

})(jQuery, this, this.document);
