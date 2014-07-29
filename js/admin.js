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

    // Gender.
    $scope.genderOptions = {
      'all': 'ทุกเพศ',
      'm': 'ชาย',
      'f': 'หญิง'
    };

    // Province.
    $scope.provinceOptions = {'-': '- เลือกจังหวัด ',"Bangkok":"กรุงเทพมหานคร","Bueng Kan":"บึงกาฬ","Samut Prakarn":"สมุทรปราการ","Nonthaburi":"นนทบุรี","Pathumthani":"ปทุมธานี","Phra Nakhon Sri Ayutthaya":"พระนครศรีอยุธยา","Angthong":"อ่างทอง","Lopburi":"ลพบุรี","Singburi":"สิงห์บุรี","Chainat":"ชัยนาท","Saraburi":"สระบุรี","Chonburi":"ชลบุรี","Rayong":"ระยอง","Chanthaburi":"จันทบุรี","Trat":"ตราด","Chachoengsao":"ฉะเชิงเทรา","Prachinburi":"ปราจีนบุรี","Nakhon Nayok":"นครนายก","Srakaeo":"สระแก้ว","Nakhon Ratchasima":"นครราชสีมา","Buri Ram":"บุรีรัมย์","Surin":"สุรินทร์","Si Sa Ket":"ศรีสะเกษ","Ubon Ratchathani":"อุบลราชธานี","Yasothon":"ยโสธร","Chaiyaphum":"ชัยภูมิ","Amnat Charoen":"อำนาจเจริญ","Nong Bua Lam Phu":"หนองบัวลำภู","Khon Kaen":"ขอนแก่น","Udon Thani":"อุดรธานี","Loei":"เลย","Nongkai":"หนองคาย","Maha Sarakham":"มหาสารคาม","Roi Et":"ร้อยเอ็ด","Kalasin":"กาฬสินธุ์","Sakon Nakhon":"สกลนคร","Nakhon Phanom":"นครพนม","Mukdahan":"มุกดาหาร","Chiang Mai":"เชียงใหม่","Lamphun":"ลำพูน","Lamphang":"ลำปาง","Uttaradit":"อุตรดิตถ์","Phrae":"แพร่","Nan":"น่าน","Phayao":"พะเยา","Chiang Rai":"เชียงราย","Mae Hong Son":"แม่ฮ่องสอน","Nakhon Sawan":"นครสวรรค์","Uthai Thani":"อุทัยธานี","Kamphaeng Phet":"กำแพงเพชร","Tak":"ตาก","Sukhothai":"สุโขทัย","Phitsanulok":"พิษณุโลก","Phichit":"พิจิตร","Phetchabun":"เพชรบูรณ์","Ratchburi":"ราชบุรี","Kanchanaburi":"กาญจนบุรี","Supanburi":"สุพรรณบุรี","Nakhon Pathom":"นครปฐม","Samut Sakhon":"สมุทรสาคร","Samut Songkram":"สมุทรสงคราม","Petchburi":"เพชรบุรี","Phangnga":"พังงา","Prachaubkirikhan":"ประจวบคีรีขันธ์","Nakhon Sri Thammarat":"นครศรีธรรมราช","Krabi":"กระบี่","Phuket":"ภูเก็ต","Surat Thani":"สุราษฎร์ธานี","Ranong":"ระนอง","Chumphon":"ชุมพร","Songkhla":"สงขลา","Satun":"สตูล","Trang":"ตรัง","Phatthalung":"พัทลุง","Pattani":"ปัตตานี","Yala":"ยะลา","Narathiwat":"นราธิวาส"};

    $scope.reset = function() {
      $scope.message = '';
      $scope.gender = 'all';
      $scope.schedule = moment().format('YYYY-MM-DD 08:00');
      $scope.province = '-';
      $scope.age_start = 20;
      $scope.age_end = 40;
    };

    $scope.add = function() {
      $scope.validate();

      $scope.close();
    };

    $scope.cancel = function() {
      $scope.close();
      $scope.reset();
    };

    $scope.close = function() {
      $('#add-new').foundation('reveal', 'close');
    };

    $scope.reset();

    $('.date-picker').dtpicker({
      calendarMouseScroll: false,
      minuteInterval: 15,
      current: $scope.schedule,
      timelistScroll: false,
      onHide: function(handler) {
        $scope.$apply(function() {
          var dt = moment(handler.getDate());
          $scope.schedule = dt.format('YYYY-MM-DD HH:mm:ss');
        });
      }
    });

    $('#slider-range').slider({
      range: true,
      min: 1,
      max: 125,
      values: [ $scope.age_start, $scope.age_end ],
      slide: function( event, ui ) {
        $scope.$apply(function() {
          var values = ui.values;
          $scope.age_start = values[0];
          $scope.age_end = values[1];
        });
      }
    });

  }]);

  $(document).foundation();

})(jQuery, this, this.document);
