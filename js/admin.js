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
      $scope.published = moment().add(1, 'hour').format('YYYY-MM-DD HH:00');
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
          alert('Error: ' + resp.responseJSON.meta.errorMessage);
        });
    };

    /**
     * Add new item.
     */
    $scope.addItem = function() {
      if (processing) return false;

      var published = moment($('#edit-published').handleDtpicker('getDate'));

      var params = {
        body: $scope.body,
        published: published.format('YYYY-MM-DDTHH:mm:ssZ'),
        gender: $scope.gender,
        city: $scope.province,
        age_start: $scope.age_start,
        age_stop: $scope.age_stop
      };

      processing = true;
      $scope.disableButtons();

      $.post(url, params)
        .done(function(resp) {
          $scope.$apply(function() {
            $scope.items.unshift(resp.response.notification);
            $scope.cancelModal('#add-new');
          });
        })
        .error(function(resp) {
          alert('Error: ' + resp.responseJSON.meta.errorMessage);
          $scope.enableButtons();
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
      if (processing) return false;

      processing = true;
      $scope.disableButtons();

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
          alert('Error: ' + resp.responseJSON.meta.errorMessage);
          $scope.enableButtons();
        });
    };

    /**
     * Cancel button action.
     */
    $scope.cancelModal = function(selector) {
      $scope.closeModal(selector);
      $scope.enableButtons();
      $scope.resetForm();
    };

    /**
     * Enable all buttons.
     */
    $scope.enableButtons = function() {
      $('#add-item-button').prop('disabled', false);
      $('#add-cancel-button').prop('disabled', false);
      $('#delete-item-button').prop('disabled', false);
      $('#delete-cancel-button').prop('disabled', false);
      $('#add-item-button').removeClass('disabled');
      $('#add-cancel-button').removeClass('disabled');
      $('#delete-item-button').removeClass('disabled');
      $('#delete-cancel-button').removeClass('disabled');
      processing = false;
    };

    /**
     * Disable all buttons.
     */
    $scope.disableButtons = function() {
      $('#add-item-button').prop('disabled', true);
      $('#add-cancel-button').prop('disabled', true);
      $('#delete-item-button').prop('disabled', true);
      $('#delete-cancel-button').prop('disabled', true);
      $('#add-item-button').addClass('disabled');
      $('#add-cancel-button').addClass('disabled');
      $('#delete-item-button').addClass('disabled');
      $('#delete-cancel-button').addClass('disabled');
    };

    /**
     * Close reveal modal by CSS selector.
     */
    $scope.closeModal = function(selector) {
      $(selector).foundation('reveal', 'close');
      processing = false;
      $scope.enableButtons();
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
     * Generate date picker.
     */
    $scope.generateDatePicker = function() {
      $('#edit-published').appendDtpicker({
        calendarMouseScroll: false,
        minuteInterval: 15,
        autoDateOnStart: true,
        current: $scope.published,
        futureOnly: true,
        timelistScroll: false,
        inline: true
      });
    };

    $scope.destroyDatePicker = function() {
      $('#edit-published').handleDtpicker('destroy');
    };

    /**
     * Initialize app.
     */
    $scope.init = function() {
      // Set default values to add form.
      $scope.resetForm();

      // Start load items.
      $scope.loadItems();

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

      // Regenerate date picker.
      $('#add-new').on('opened', function() {
        $scope.generateDatePicker();
      }).on('closed', function() {
        $scope.destroyDatePicker();
        $scope.resetForm();
      });
    };

    // Start
    $scope.init();

  }]);

  $(document).foundation();

})(jQuery, this, this.document);
