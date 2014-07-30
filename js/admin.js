(function ($, window, document, undefined) {
  var url = API_BASEPATH + '/notifications/';
  var minAge = 1;
  var maxAge = 130;
  var processing = false;

  var app = angular.module('sicksense', []);

  app.controller('NotificationList', ['$scope', function($scope) {

    /**
     * Items to display.
     */
    $scope.items = [];

    /**
     * Gender options.
     */
    $scope.genderOptions = {
      'all': 'ทุกเพศ',
      'male': 'ชาย',
      'female': 'หญิง'
    };

    /**
     * Province options.
     */
    $scope.provinceOptions = {'-': 'ทุกจังหวัด ',"Bangkok":"กรุงเทพมหานคร","Bueng Kan":"บึงกาฬ","Samut Prakarn":"สมุทรปราการ","Nonthaburi":"นนทบุรี","Pathumthani":"ปทุมธานี","Phra Nakhon Sri Ayutthaya":"พระนครศรีอยุธยา","Angthong":"อ่างทอง","Lopburi":"ลพบุรี","Singburi":"สิงห์บุรี","Chainat":"ชัยนาท","Saraburi":"สระบุรี","Chonburi":"ชลบุรี","Rayong":"ระยอง","Chanthaburi":"จันทบุรี","Trat":"ตราด","Chachoengsao":"ฉะเชิงเทรา","Prachinburi":"ปราจีนบุรี","Nakhon Nayok":"นครนายก","Srakaeo":"สระแก้ว","Nakhon Ratchasima":"นครราชสีมา","Buri Ram":"บุรีรัมย์","Surin":"สุรินทร์","Si Sa Ket":"ศรีสะเกษ","Ubon Ratchathani":"อุบลราชธานี","Yasothon":"ยโสธร","Chaiyaphum":"ชัยภูมิ","Amnat Charoen":"อำนาจเจริญ","Nong Bua Lam Phu":"หนองบัวลำภู","Khon Kaen":"ขอนแก่น","Udon Thani":"อุดรธานี","Loei":"เลย","Nongkai":"หนองคาย","Maha Sarakham":"มหาสารคาม","Roi Et":"ร้อยเอ็ด","Kalasin":"กาฬสินธุ์","Sakon Nakhon":"สกลนคร","Nakhon Phanom":"นครพนม","Mukdahan":"มุกดาหาร","Chiang Mai":"เชียงใหม่","Lamphun":"ลำพูน","Lamphang":"ลำปาง","Uttaradit":"อุตรดิตถ์","Phrae":"แพร่","Nan":"น่าน","Phayao":"พะเยา","Chiang Rai":"เชียงราย","Mae Hong Son":"แม่ฮ่องสอน","Nakhon Sawan":"นครสวรรค์","Uthai Thani":"อุทัยธานี","Kamphaeng Phet":"กำแพงเพชร","Tak":"ตาก","Sukhothai":"สุโขทัย","Phitsanulok":"พิษณุโลก","Phichit":"พิจิตร","Phetchabun":"เพชรบูรณ์","Ratchburi":"ราชบุรี","Kanchanaburi":"กาญจนบุรี","Supanburi":"สุพรรณบุรี","Nakhon Pathom":"นครปฐม","Samut Sakhon":"สมุทรสาคร","Samut Songkram":"สมุทรสงคราม","Petchburi":"เพชรบุรี","Phangnga":"พังงา","Prachaubkirikhan":"ประจวบคีรีขันธ์","Nakhon Sri Thammarat":"นครศรีธรรมราช","Krabi":"กระบี่","Phuket":"ภูเก็ต","Surat Thani":"สุราษฎร์ธานี","Ranong":"ระนอง","Chumphon":"ชุมพร","Songkhla":"สงขลา","Satun":"สตูล","Trang":"ตรัง","Phatthalung":"พัทลุง","Pattani":"ปัตตานี","Yala":"ยะลา","Narathiwat":"นราธิวาส"};

    /**
     * Reset add form.
     */
    $scope.resetForm = function() {
      $scope.body = '';
      $scope.gender = 'all';
      $scope.published = moment().format('YYYY-MM-DDT08:00:00') + 'Z';
      $scope.province = '-';
      $scope.age_start = minAge;
      $scope.age_stop = maxAge;
    };

    /**
     * Load items.
     */
    $scope.loadItems = function() {
      $.getJSON(url)
        .done(function(resp) {
          $scope.$apply(function() {
            resp.response.notifications.items.forEach(function(notification) {
              $scope.items.push(notification);
            });
          });
        })
        .error(function(resp) {
          alert('Error: ' + resp.responseJSON.meta.errorDetail);
        });
    };

    $scope.validate = function() {

    };

    /**
     * Add new item.
     */
    $scope.addItem = function() {
      $scope.validate();

      var params = {
        body: $scope.body,
        published: $scope.published,
        gender: $scope.gender,
        city: $scope.province,
        age_start: $scope.age_start,
        age_stop: $scope.age_stop
      };

      processing = true;
      $('#delete-item-button').prop('disabled', true);
      $('#delete-cancel-button').prop('disabled', true);

      $.post(url, params)
        .done(function(resp) {
          $scope.$apply(function() {
            $scope.items.unshift(resp.response.notification);
          });

          $scope.cancelModal('#add-new');
        })
        .error(function(resp) {
          alert('Error: ' + resp.responseJSON.meta.errorDetail);
          processing = false;
          $scope.cancelModal('#add-new');
        });
    };

    /**
     * Show confirm delete dialog.
     */
    $scope.showConfirmDeleteDialog = function() {
      $scope.current = this.item;
      $('#confirm-delete').foundation('reveal', 'open');
    };

    /**
     * Delete item.
     */
    $scope.deleteItem = function() {
      var deleteURL = url + $scope.current.id + '/delete/';
      $.post(deleteURL)
        .done(function(resp) {
          $scope.$apply(function() {
            $scope.items.forEach(function(item, idx) {
              if (item.id == $scope.current.id) {
                item.status = 3;
              }
            });
            $scope.closeModal('#confirm-delete');
          });
        })
        .error(function(resp) {
          alert('Error: ' + resp.responseJSON.meta.errorDetail);
          $scope.closeModal('#confirm-delete');
        });

    };

    /**
     * Cancel button action.
     */
    $scope.cancelModal = function(selector) {
      $scope.closeModal(selector);
      $scope.resetForm();
    };

    /**
     * Close reveal modal by CSS selector.
     */
    $scope.closeModal = function(selector) {
      $(selector).foundation('reveal', 'close');
      processing = false;
      $('#add-item-button').prop('disabled', false);
      $('#add-cancel-button').prop('disabled', false);
      $('#delete-item-button').prop('disabled', false);
      $('#delete-cancel-button').prop('disabled', false);
    };

    /**
     * Return province as Thai.
     */
    $scope.getProvinceText = function(province) {
      return $scope.provinceOptions[province];
    };

    /**
     * Return gender code as text.
     */
    $scope.getGenderText = function(gender) {
      return $scope.genderOptions[gender];
    };

    /**
     * Return date formatted.
     */
    $scope.getDateFormatted = function(date) {
      return moment(date).format('D MMM YYYY - HH:mm:ss');
    }

    /**
     * Initialize app.
     */
    $scope.init = function() {
      // Set default values to add form.
      $scope.resetForm();

      // Start load items.
      $scope.loadItems();

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
        min: minAge,
        max: maxAge,
        values: [ $scope.age_start, $scope.age_stop ],
        slide: function( event, ui ) {
          $scope.$apply(function() {
            var values = ui.values;
            $scope.age_start = values[0];
            $scope.age_stop = values[1];
          });
        }
      });
    };

    // Start
    $scope.init();

  }]);

  $(document).foundation();

})(jQuery, this, this.document);
