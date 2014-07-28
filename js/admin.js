(function ($, window, document, undefined) {

  var app = angular.module('sicksense', []);

  app.controller('NotificationList', ['$scope', function($scope) {

    $scope.items = [
      {
        message: 'This is longer content Donec id elit non mi porta gravida at eget metus.',
        schedule: '1 กรกฎาคม 2557 - 23:00:00',
        age: '25-34',
        gender: 'หญิง',
        province: 'กรุงเทพมหานคร',
        status: 1
      },

      {
        message: 'This is longer Content Goes Here Donec id elit non mi porta gravida at eget metus.',
        schedule: '10 กรกฎาคม 2557 - 12:00:00',
        age: '13-50',
        gender: 'ทุกเพศ',
        province: 'กรุงเทพมหานคร',
        status: 0
      },

      {
        message: 'This is longer Content Goes Here Donec id elit non mi porta gravida at eget metus.',
        schedule: '22 กรกฎาคม 2557 - 8:00:00',
        age: '35-45',
        gender: 'ชาย',
        province: 'กรุงเทพมหานคร',
        status: 0
      }
    ];

  }]);

})(jQuery, this, this.document);
