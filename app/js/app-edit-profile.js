;(function ($, window, document, undefined) {

    app.controller('EditProfileController', function($scope, $http, shared) {
        $scope.userURL = API_BASEPATH + '/users/' + $.cookie('userId');
        $scope.password = '';
        $scope.repassword = '';
        $scope.subscribe = true;
        $scope.shared = shared;
        var accessToken = $.cookie('accessToken');

        var isSetAddress = false;

        $scope.$watch('shared.loggedIn', function(newValue, oldValue) {
            var isFirstTime = newValue === undefined && newValue == oldValue;

            if (!isFirstTime && !newValue) {
                var redirectURL = HOME_URL + '/login.html?redirect=edit-profile.html';

                if ($scope.shared.state == 'logout') {
                    redirectURL = HOME_URL;
                }
                window.location = redirectURL;
            }
        });

        $scope.initial = function () {
            if (accessToken) {
                var params = {
                    accessToken: accessToken,
                };

                $http.get($scope.userURL, {params: params})
                    .success(function(resp) {
                        $scope.email = resp.response.email;
                        $scope.gender = resp.response.gender;
                        $scope.year = resp.response.birthYear ? resp.response.birthYear.toString() : '' ;
                        $scope.city = resp.response.address.city;
                        $scope.district = resp.response.address.district;
                        $scope.subdistrict = resp.response.address.subdistrict;
                        $scope.subscribe = resp.response.isSubscribed;

                        setTimeout(function () {
                            isSetAddress = true;
                        }, 1);
                    })
                    .error(function(resp) {
                        console.log('Error get user detail', resp);
                    });

            } else {
                window.location = HOME_URL;
            }
        }

        $scope.yearOptions = {};
        for (var i = 0; i < 100; i++) {
            $scope.yearOptions[2014 - i] = 2557 - i;
        }

        $scope.cityOptions = locations.provinces;

        $scope.$watch('city', function(newValue, oldValue) {
            if (newValue) {
                $scope.districts = locations[newValue].amphoes;

                if (isSetAddress) {
                    $scope.district = '';
                    $scope.subdistrict = '';
                }
            }
            else {
                $scope.districts = [];
            }
            $scope.subdistricts = [];
        });

        $scope.$watch('district', function(newValue, oldValue) {
            if (newValue) {
                $scope.subdistricts = locations[$scope.city][newValue];

                if (isSetAddress) {
                    $scope.subdistrict = '';
                }
            }
            else {
                $scope.subdistricts = [];
            }
        });

        $scope.validate = function() {
            $scope.invalidGender = $scope.gender ? false : true;
            $scope.invalidYear = $scope.year ? false : true;
            $scope.invalidCity = $scope.city ? false : true;
            $scope.invalidDistrict = $scope.district ? false : true;
            $scope.invalidSubdistrict = $scope.subdistrict ? false : true;

            return !($scope.invalidGender || $scope.invalidYear || $scope.invalidCity ||
                $scope.invalidDistrict || $scope.invalidSubdistrict);
        };

        $scope.submit = function() {
            if (!$scope.validate()) return false;
            if ($scope.submitting) return false;

            $scope.submitting = true;

            var data = {
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

            var params = {
                accessToken: accessToken,
            };

            $http.post($scope.userURL, data, {params: params})
                .success(function(resp) {
                    $scope.submitStatus = 'completed';
                    $scope.submitting = false;

                    window.location = window.location;
                })
                .error(function(resp) {
                    $scope.submitStatus = 'failed';
                    $scope.submitting = false;
                });
        };

    });

})(jQuery, this, this.document);
