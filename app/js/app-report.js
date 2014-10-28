;(function ($, window, document, undefined) {

    app.controller('ReportController', [ '$scope', '$http', 'shared', function($scope, $http, shared) {
        $scope.reportURL = API_BASEPATH + '/reports/';
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
            $scope.invalidSymptoms = $scope.isFine == false && $scope.symptoms ? false : true;
            $scope.invalidAnimalContact = $scope.animalContact ? false : true;

            return (!$scope.invalidIsFine || !$scope.invalidSymptoms || !$scope.invalidAnimalContact)
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

            $http.post($scope.reportURL, data, {
                    'params': {
                        accessToken: $.cookie('accessToken')
                    }
                })
                .success(function(resp) {

                    var symptoms_names = _.pluck($scope.symptoms, 'displayName');
                    $scope.symptoms_summary = symptoms_names.length > 0 ? symptoms_names.join(', ') : 'สบายดี';
                    $scope.reportSuccess = true;
                })
                .error(function(resp) {
                    console.log('errorr', resp);
                    $scope.submitting = false;
                });
        };

    }]);

})(jQuery, this, this.document);
