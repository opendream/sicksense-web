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
        setUUID: function setUUID(customUUID, options) {
            var _options = _.extend({
                expires: 365 * 10 // 10 years
            }, options);

            if (!customUUID) {
                this.uuid = this.uuid || $.cookie('uuid') || uuid.v4();
                $.cookie('uuid', this.uuid, _options);
            }
            else {
                this.uuid = customUUID;
                $.cookie('uuid', customUUID, _options);
            }
        }
    };
});

app.run(function (shared) {
    shared.setUUID();
});
