;(function ($, window, document, undefined) {

    app.controller('RegisterController', [ '$scope', '$http', 'shared', function($scope, $http, shared) {
        $scope.registerURL = API_BASEPATH + '/users/';

        $scope.email = '';
        $scope.password = '';
        $scope.repassword = '';
        $scope.subscribe = true;
        $scope.submitSuccess = false;
        $scope.shared = shared;

        $scope.$watch('shared.loggedIn', function(newValue, oldValue) {
            if (newValue && !$scope.submitSuccess) {
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

        $scope.validate = function() {
            $scope.invalidEmail = $scope.registerForm.email.$invalid;

            if ($scope.password.length < 8 || $scope.password.length > 64) {
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
            if ($scope.submitting) return false;

            $scope.unverifiedEmail = false;
            $scope.invalidDuplicateEmail = false;
            if (!$scope.validate()) return false;

            $scope.submitting = true;

            var endpoint = $scope.registerURL;

            var tmpUUID = uuid.v4();

            var params = {
                uuid: tmpUUID,
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

            $http.post(endpoint, params)
                .success(function(resp) {
                    $scope.submitSuccess = true;

                    shared.setUUID(tmpUUID);
                    $.cookie('accessToken', resp.response.accessToken);
                    $.cookie('userId', resp.response.id);

                    $scope.shared.loggedIn = true;
                    $scope.shared.state = 'login';
                })
                .error(function(resp) {
                    if (resp.meta.status == 403 && resp.meta.errorSubType == 'unverified_email') {
                        $scope.unverifiedEmail = true;
                    }
                    // HOT FIX ON REGISTER WITH EXISTS EMAIL AND WRONG PASSWORD
                    else if (resp.meta.status == 409 || resp.meta.status == 403) {
                        $scope.invalidDuplicateEmail = true;
                    }
                    $scope.submitting = false;
                });
        };

    }]);

})(jQuery, this, this.document);
