(function ($, window, document, undefined) {

  var app = angular.module('sicksense', []);

  app.controller('NotificationList', ['$scope', function($scope) {

    $scope.items = [
      {
        body: 'This is longer content Donec id elit non mi porta gravida at eget metus.',
        published: '1 กรกฎาคม 2557 - 23:00:00',
        age_start: 25,
        age_stop: 34,
        gender: 'f',
        province: 'Bangkok',
        status: 1
      },

      {
        body: 'This is longer Content Goes Here Donec id elit non mi porta gravida at eget metus.',
        published: '10 กรกฎาคม 2557 - 12:00:00',
        age_start: 13,
        age_stop: 50,
        gender: 'all',
        province: 'Chiang Mai',
        status: 0
      },

      {
        body: 'This is longer Content Goes Here Donec id elit non mi porta gravida at eget metus.',
        published: '22 กรกฎาคม 2557 - 8:00:00',
        age_start: 35,
        age_stop: 45,
        gender: 'm',
        province: 'Bangkok',
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
      $scope.body = '';
      $scope.gender = 'all';
      $scope.published = moment().format('YYYY-MM-DDT08:00:00') + 'Z';
      $scope.province = '-';
      $scope.age_start = 20;
      $scope.age_stop = 40;
    };

    $scope.validate = function() {

    };

    $scope.add = function() {
      $scope.validate();

      var params = {
        body: $scope.body,
        published: $scope.published,
        gender: $scope.gender,
        province: $scope.province,
        age_start: $scope.age_start,
        age_stop: $scope.age_stop
      };

      // $.post(addURL, params)
      //   .done(function(resp) {
      //     $scope.$apply(function() {
            params._id = Math.random();
            params.status = 0;
            $scope.items.unshift(params);
        //   });
        // })
        // .error(function(resp) {

        // });

      $scope.close();
    };

    $scope.delete = function() {

    };

    $scope.cancel = function() {
      $scope.close();
      $scope.reset();
    };

    $scope.close = function() {
      $('#add-new').foundation('reveal', 'close');
    };

    $scope.getProvinceText = function(province) {
      return $scope.provinceOptions[province];
    };

    $scope.getGenderText = function(gender) {
      return $scope.genderOptions[gender];
    };

    $scope.reset();

    // Init date picker.
    $('.date-picker').dtpicker({
      calendarMouseScroll: false,
      minuteInterval: 15,
      current: $scope.published,
      timelistScroll: false,
      onHide: function(handler) {
        $scope.$apply(function() {
          var dt = moment(handler.getDate());
          $scope.published = dt.format('YYYY-MM-DDTHH:mm:ss') + 'Z';
        });
      }
    });

    // Init slider.
    $('#slider-range').slider({
      range: true,
      min: 1,
      max: 125,
      values: [ $scope.age_start, $scope.age_stop ],
      slide: function( event, ui ) {
        $scope.$apply(function() {
          var values = ui.values;
          $scope.age_start = values[0];
          $scope.age_stop = values[1];
        });
      }
    });

  }]);

  $(document).foundation();

})(jQuery, this, this.document);
