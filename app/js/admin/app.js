var app = angular.module('admin', []);

(function () {
'use strict';

app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

app.factory('shared', function() {
    return {};
});

})();
