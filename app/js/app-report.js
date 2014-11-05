;(function ($, window, document, undefined) {

    app.controller('ReportController', [ '$scope', '$http', 'shared', function($scope, $http, shared) {
        $scope.reportURL = API_BASEPATH + '/reports/';
        $scope.userURL = API_BASEPATH + '/users/';
        $scope.reportSuccess = false;

        $scope.isFine = getParameterByName('isFine');
        $scope.symptoms = [];
        $scope.symptoms_choices = [
            {
                'name': 'fever',
                'displayName': 'มีไข้',
                'image': './images/symptoms/fever@2x.png',
                'imageActive': './images/symptoms/fever-active@2x.png',
                'imageCurrent': './images/symptoms/fever@2x.png'
            },
            {
                'name': 'cough',
                'displayName': 'ไอ',
                'image': './images/symptoms/cough@2x.png',
                'imageActive': './images/symptoms/cough-active@2x.png',
                'imageCurrent': './images/symptoms/cough@2x.png'
            },
            {
                'name': 'nuasea',
                'displayName': 'คลื่นไส้',
                'image': './images/symptoms/nuasea@2x.png',
                'imageActive': './images/symptoms/nuasea-active@2x.png',
                'imageCurrent': './images/symptoms/nuasea@2x.png'
            },
            {
                'name': 'headache',
                'displayName': 'ปวดหัว',
                'image': './images/symptoms/headache@2x.png',
                'imageActive': './images/symptoms/headache-active@2x.png',
                'imageCurrent': './images/symptoms/headache@2x.png'
            },
            {
                'name': 'red-eye',
                'displayName': 'ตาแดง',
                'image': './images/symptoms/red-eye@2x.png',
                'imageActive': './images/symptoms/red-eye-active@2x.png',
                'imageCurrent': './images/symptoms/red-eye@2x.png'
            },
            {
                'name': 'sore-throat',
                'displayName': 'เจ็บคอ',
                'image': './images/symptoms/sore-throat@2x.png',
                'imageActive': './images/symptoms/sore-throat-active@2x.png',
                'imageCurrent': './images/symptoms/sore-throat@2x.png'
            },
            {
                'name': 'aphthous',
                'displayName': 'ร้อนใน',
                'image': './images/symptoms/aphthous@2x.png',
                'imageActive': './images/symptoms/aphthous-active@2x.png',
                'imageCurrent': './images/symptoms/aphthous@2x.png'
            },
            {
                'name': 'rash',
                'displayName': 'ผื่นคัน',
                'image': './images/symptoms/rash@2x.png',
                'imageActive': './images/symptoms/rash-active@2x.png',
                'imageCurrent': './images/symptoms/rash@2x.png'
            },
            {
                'name': 'jointache',
                'displayName': 'ปวดข้อ',
                'image': './images/symptoms/jointache@2x.png',
                'imageActive': './images/symptoms/jointache-active@2x.png',
                'imageCurrent': './images/symptoms/jointache@2x.png'
            },
            {
                'name': 'diarrhea',
                'displayName': 'ท้องเสีย',
                'image': './images/symptoms/diarrhea@2x.png',
                'imageActive': './images/symptoms/diarrhea-active@2x.png',
                'imageCurrent': './images/symptoms/diarrhea@2x.png'
            },
            {
                'name': 'dark-urine',
                'displayName': 'ปัสสาวะสีเข้ม',
                'image': './images/symptoms/dark-urine@2x.png',
                'imageActive': './images/symptoms/dark-urine-active@2x.png',
                'imageCurrent': './images/symptoms/dark-urine@2x.png'
            },
            {
                'name': 'bleeding',
                'displayName': 'เลือดออก',
                'image': './images/symptoms/bleeding@2x.png',
                'imageActive': './images/symptoms/bleeding-active@2x.png',
                'imageCurrent': './images/symptoms/bleeding@2x.png'
            }
        ];
        $scope.symptoms_summary = '';

        $scope.shared = shared;

        var isSetAddress = false;

        if (!$scope.shared.loggedIn) {
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
        }

        $scope.toggleImage = function (symptom) {
            if ($scope.symptoms.indexOf(symptom) < 0) {
                $scope.symptoms.push(symptom)
                symptom.imageCurrent = symptom.imageActive;
            } else {
                _.pull($scope.symptoms, symptom);
                symptom.imageCurrent = symptom.image;
            }
        };

        $scope.validate = function() {
            $scope.invalidIsFine = $scope.isFine ? false : true;
            $scope.invalidSymptoms = $scope.isFine == false && $scope.symptoms.length == 0 ? true : false;
            $scope.invalidAnimalContact = $scope.animalContact ? false : true;

            if ($scope.shared.loggedIn) {
                return !($scope.invalidIsFine || $scope.invalidSymptoms || $scope.invalidAnimalContact)
            } else {
                $scope.invalidGender = $scope.gender ? false : true;
                $scope.invalidYear = $scope.year ? false : true;
                $scope.invalidCity = $scope.city ? false : true;
                $scope.invalidDistrict = $scope.district ? false : true;
                $scope.invalidSubdistrict = $scope.subdistrict ? false : true;

                return !($scope.invalidIsFine || $scope.invalidSymptoms || $scope.invalidAnimalContact ||
                    $scope.invalidGender || $scope.invalidYear || $scope.invalidCity ||
                    $scope.invalidDistrict || $scope.invalidSubdistrict)
            }
        };

        $scope.submit = function() {
            if (!$scope.validate()) return false;
            if ($scope.submitting) return false;

            $scope.submitting = true;

            if ($scope.isFine == "1") {
                $scope.symptoms = [];
            }

            var symptoms = _.pluck($scope.symptoms, 'name');
            var data = {
                isFine: parseInt($scope.isFine),
                symptoms: symptoms,
                animalContact: parseInt($scope.animalContact),
                moreInfo: $scope.moreInfo,
                startedAt: new Date(),
                platform: 'sicksenseweb'
            };

            var registerData = {
                email: $.cookie('uuid') + '@sicksense.com',
                password: $.cookie('uuid'),
                uuid: $.cookie('uuid'),
                gender: $scope.gender,
                birthYear: $scope.year,
                address: {
                    city: $scope.city,
                    district: $scope.district,
                    subdistrict: $scope.subdistrict
                },
                platform: 'sicksenseweb'
            };

            var userURL, config = {};
            if ($.cookie('userId') && $.cookie('accessToken')) {
                userURL = $scope.userURL + $.cookie('userId');
                config = {
                    params: {
                        accessToken: $.cookie('accessToken')
                    }
                };
            }
            else {
                if (!$.cookie('accessToken')) {
                    shared.setUUID(uuid.v4());
                }

                userURL = $scope.userURL;
            }

            if (!$scope.shared.loggedIn) {
                $.extend(data, {
                    gender: $scope.gender,
                    birthYear: $scope.year,
                    address: {
                        city: $scope.city,
                        district: $scope.district,
                        subdistrict: $scope.subdistrict
                    }
                });
            }

            if ($scope.shared.loggedIn) {
                submitReport(data);
            }
            else {
                $http.post(userURL, registerData, config)
                    .success(function (resp) {
                        $.cookie('accessToken', resp.response.accessToken);
                        $.cookie('userId', resp.response.id);

                        submitReport(data);
                    })
                    .error(function (resp) {
                        console.log('error Register', resp);
                        $scope.submitting = false;
                    });
            }
        };

        function submitReport(data) {
            $http.post($scope.reportURL, data, {
                    params: {
                        accessToken: $.cookie('accessToken')
                    }
                })
                .success(function(resp) {

                    var symptoms_names = _.pluck($scope.symptoms, 'displayName');
                    $scope.symptoms_summary = symptoms_names.length > 0 ? symptoms_names.join(', ') : 'สบายดี';
                    $scope.reportSuccess = true;
                })
                .error(function(resp) {
                    console.log('error Report', resp);
                    $scope.submitting = false;
                });
        };

        function getUser() {
            var params = {
                accessToken: $.cookie('accessToken'),
            };
            $http.get($scope.userURL + $.cookie('userId'), {params: params})
                .success(function (resp) {
                    $scope.gender = resp.response.gender;
                    $scope.year = resp.response.birthYear ? resp.response.birthYear.toString() : '';
                    $scope.city = resp.response.address.city;
                    $scope.district = resp.response.address.district;
                    $scope.subdistrict = resp.response.address.subdistrict;

                    setTimeout(function () {
                        isSetAddress = true;
                    }, 1);

                })
                .error(function (resp) {
                    console.log('Error get User', resp);
                });
        }

        $scope.$watch('shared.loggedIn', function(newValue, oldValue) {
            if (newValue != oldValue && !newValue && $.cookie('userId') && $.cookie('accessToken')) {
                getUser();
            }
        });

    }]);

})(jQuery, this, this.document);
