sickconsole = function(message) {
    if (console) {
        console.log('SICKSENSE LOG: ' + message);
    }
};

$(document).foundation();

var app = angular.module('sicksense', []);

app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

app.factory('shared', function() {
    return {
        uuid: null,
        setUUID: function setUUID(uuid, options) {
            var _options = _.extend({
                expires: 365 * 10 // 10 years
            }, options);

            if (!uuid) {
                this.uuid = this.uuid || $.cookie('uuid') || uuid.v4();
                $.cookie('uuid', this.uuid, _options);
            }
            else {
                this.uuid = uuid;
                $.cookie('uuid', uuid, _options);
            }
        }
    };
});

app.run(function (shared) {
    shared.setUUID();
});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
