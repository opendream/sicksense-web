sickconsole = function(message) {
    if (console) {
        console.log('SICKSENSE LOG: ' + message);
    }
};

$(document).foundation();

var app = angular.module('sicksense', []);

app.factory('shared', function() {
    return {};
});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
}])