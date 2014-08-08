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
