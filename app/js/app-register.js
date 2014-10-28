;(function ($, window, document, undefined) {

    app.controller('RegisterController', [ '$scope', '$http', 'shared', function($scope, $http, shared) {
        $scope.registerURL = API_BASEPATH + '/users/';
        $scope.connectURL = API_BASEPATH + '/connect/';

        $scope.email = '';
        $scope.password = '';
        $scope.repassword = '';
        $scope.subscribe = true;
        $scope.submitSuccess = false;
        $scope.shared = shared;

        $scope.$watch('shared.loggedIn', function(newValue, oldValue) {
            if (newValue) {
                window.location = HOME_URL + '/report.html';
            }
        });

        $scope.yearOptions = {};
        for (var i = 0; i < 100; i++) {
            $scope.yearOptions[2014 - i] = 2557 - i;
        }

        $scope.cityOptions = locations.provinces;

        $scope.$watch('city', function(newValue, oldValue) {
            if (newValue) {
                $scope.districts = locations[newValue].amphoes;
                $scope.district = '';
                $scope.subdistrict = '';
            }
            else {
                $scope.districts = [];
            }
            $scope.subdistricts = [];
        });

        $scope.$watch('district', function(newValue, oldValue) {
            if (newValue) {
                $scope.subdistricts = locations[$scope.city][newValue];
                $scope.subdistrict = '';
            }
            else {
                $scope.subdistricts = [];
            }
        });

        $scope.isEmail = function(email) {
            var re = new RegExp(/^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            if (!email.match(re)) {
                return false;
            }
            return true;
        };

        $scope.validate = function() {
            $scope.invalidEmail = !$scope.isEmail($scope.email);

            if ($scope.password.length < 8) {
                $scope.invalidSamePassword = false;
                $scope.invalidPassword = true;
            }
            else if ($scope.password != $scope.repassword) {
                $scope.invalidSamePassword = true;
                $scope.invalidPassword = false;
            }
            else {
                $scope.invalidSamePassword = false;
                $scope.invalidPassword = false;
            }

            $scope.invalidGender = $scope.gender ? false : true;
            $scope.invalidYear = $scope.year ? false : true;
            $scope.invalidCity = $scope.city ? false : true;
            $scope.invalidDistrict = $scope.district ? false : true;
            $scope.invalidSubdistrict = $scope.subdistrict ? false : true;

            return !($scope.invalidEmail || $scope.invalidSamePassword || $scope.invalidPassword ||
                $scope.invalidGender || $scope.invalidYear || $scope.invalidCity ||
                $scope.invalidDistrict || $scope.invalidSubdistrict);
        };

        $scope.submit = function() {
            if (!$scope.validate()) return false;
            if ($scope.submitting) return false;

            $scope.submitting = true;

            var accessToken = $.cookie('accessToken'),
                endpoint = accessToken ? $scope.connectURL : $scope.registerURL,
                config = accessToken ? {
                    params: {
                        accessToken: accessToken
                    }
                } : {};

            var params = {
                uuid: shared.uuid,
                email: $scope.email,
                password: $scope.password,
                gender: $scope.gender,
                birthYear: $scope.year,
                address: {
                    city: $scope.city,
                    district: $scope.district,
                    subdistrict: $scope.subdistrict
                },
                subscribe: $scope.subscribe,
                platform: 'sicksenseweb'
            };



            $http.post(endpoint, params, config)
                .success(function(resp) {
                    $scope.submitSuccess = true;

                    $.cookie('accessToken', resp.response.accessToken);
                    $.cookie('userId', resp.response.id);
                    $scope.shared.loggedIn = true;
                })
                .error(function(resp) {
                    if (resp.meta.status == 409) {
                        $scope.invalidDuplicateEmail = true;
                    }
                    $scope.submitting = false;
                });
        };

    }]);

})(jQuery, this, this.document);
