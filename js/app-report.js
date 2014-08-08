;(function ($, window, document, undefined) {

    app.controller('ReportController', [ '$scope', '$http', 'shared', function($scope, $http, shared) {
        $scope.reportURL = API_BASEPATH + '/reports/';
        $scope.isFine = null;
        $scope.symptoms = [];
        $scope.symptoms_choices = [
            {
                'name': 'fever',
                'image': './images/symptoms/fever@2x.png',
                'imageActive': './images/symptoms/fever-active@2x.png',
                'imageCurrent': './images/symptoms/fever@2x.png'
            },
            {
                'name': 'cough',
                'image': './images/symptoms/cough@2x.png',
                'imageActive': './images/symptoms/cough-active@2x.png',
                'imageCurrent': './images/symptoms/cough@2x.png'
            },
            {
                'name': 'nuasea',
                'image': './images/symptoms/nuasea@2x.png',
                'imageActive': './images/symptoms/nuasea-active@2x.png',
                'imageCurrent': './images/symptoms/nuasea@2x.png'
            },
            {
                'name': 'headache',
                'image': './images/symptoms/headache@2x.png',
                'imageActive': './images/symptoms/headache-active@2x.png',
                'imageCurrent': './images/symptoms/headache@2x.png'
            },
            {
                'name': 'red-eye',
                'image': './images/symptoms/red-eye@2x.png',
                'imageActive': './images/symptoms/red-eye-active@2x.png',
                'imageCurrent': './images/symptoms/red-eye@2x.png'
            },
            {
                'name': 'sore-throat',
                'image': './images/symptoms/sore-throat@2x.png',
                'imageActive': './images/symptoms/sore-throat-active@2x.png',
                'imageCurrent': './images/symptoms/sore-throat@2x.png'
            },
            {
                'name': 'aphthous',
                'image': './images/symptoms/aphthous@2x.png',
                'imageActive': './images/symptoms/aphthous-active@2x.png',
                'imageCurrent': './images/symptoms/aphthous@2x.png'
            },
            {
                'name': 'rash',
                'image': './images/symptoms/rash@2x.png',
                'imageActive': './images/symptoms/rash-active@2x.png',
                'imageCurrent': './images/symptoms/rash@2x.png'
            },
            {
                'name': 'jointache',
                'image': './images/symptoms/jointache@2x.png',
                'imageActive': './images/symptoms/jointache-active@2x.png',
                'imageCurrent': './images/symptoms/jointache@2x.png'
            },
            {
                'name': 'diarrhea',
                'image': './images/symptoms/diarrhea@2x.png',
                'imageActive': './images/symptoms/diarrhea-active@2x.png',
                'imageCurrent': './images/symptoms/diarrhea@2x.png'
            },
            {
                'name': 'dark-urine',
                'image': './images/symptoms/dark-urine@2x.png',
                'imageActive': './images/symptoms/dark-urine-active@2x.png',
                'imageCurrent': './images/symptoms/dark-urine@2x.png'
            },
            {
                'name': 'bleeding',
                'image': './images/symptoms/bleeding@2x.png',
                'imageActive': './images/symptoms/bleeding-active@2x.png',
                'imageCurrent': './images/symptoms/bleeding@2x.png'
            }
        ];

        $scope.shared = shared;

        $scope.$watch('shared.loggedIn', function(newValue, oldValue) {
            var isFirstTime = newValue === undefined && newValue == oldValue;

            if (!isFirstTime && !newValue) {
                window.location = '/frontpage.html?success';
            }
        });


        $scope.toggleImage = function (symptom) {
            if ($scope.symptoms.indexOf(symptom.name) < 0) {
                $scope.symptoms.push(symptom.name)
                symptom.imageCurrent = symptom.imageActive;
            } else {
                _.pull($scope.symptoms, symptom.name);
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

            var data = {
                isFine: $scope.isFine,
                symptoms: $scope.symptoms,
                animalContact: $scope.animalContact,
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
                    console.log('success', resp);
                    // window.location = '/report-thank.html';
                })
                .error(function(resp) {
                    console.log('errorr', resp);
                    $scope.submitting = false;
                });
        };

    }]);

})(jQuery, this, this.document);
