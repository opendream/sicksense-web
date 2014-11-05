;(function ($, window, document, undefined) {

  $(document).ready(function() {
    var knot = $('.knots-ui');

    $('.knot-pin').click(function(e) {
      $('.knot-pin', knot).removeClass('selected');
      $(this).addClass('selected');
    });

    $('.symptoms-stat .content').mCustomScrollbar({
      theme: 'dark-2'
    });
  });

  app.factory('dashboard', [ '$rootScope', function($rootScope) {

    var iconRed = L.icon({
      iconUrl: '/images/pin-red.png',
      iconSize: [17, 24],
      iconAnchor: [8, 24],
      popupAnchor: [8, -4],
      shadowUrl: '/images/pin-shadow.png',
      shadowSize: [27, 15],
      shadowAnchor: [4, 12]
    });

    var iconGreen = L.icon({
      iconUrl: '/images/pin-green.png',
      iconSize: [17, 24],
      iconAnchor: [8, 24],
      popupAnchor: [8, -4],
      shadowUrl: '/images/pin-shadow.png',
      shadowSize: [27, 15],
      shadowAnchor: [4, 12]
    });

    function Dashboard (options) {
      options = _.defaults(options || {}, {
        latitude: 13.751690,
        longitude: 100.491882,
        zoom: 10
      });

      var mapOptions = {
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        zoomControl: false
      };

      this.map = L.map('map', mapOptions).setView([options.latitude, options.longitude], options.zoom);
      L.tileLayer(MAP_TILE_URL, MAP_TILE_PARAMS).addTo(this.map);

      // Add city polygon layer
      this.cityLayer = L.layerGroup().addTo(this.map);
    }

    Dashboard.prototype.map = null;
    Dashboard.prototype.markers = [];

    Dashboard.prototype.clearMarkers = function() {
      var self = this;
      _.each(self.markers, function(item) {
        self.map.removeLayer(item);
      });
    };

    Dashboard.prototype.addMarker = function(item) {
      //this.markers.push( L.marker([latitude, longitude]).addTo(this.map) );
      var icon = (item.fineCount > item.sickCount) ? iconGreen : iconRed;

      this.markers.push( L.marker([item.latitude, item.longitude], { icon: icon }).addTo(this.map) );
    };

    Dashboard.prototype.cityLayer = null;
    Dashboard.prototype.drawCity = function(geometry) {
      this.clearCityOutline();
      var cityLayer = this.cityLayer;
      // Then draw the new one.
      cityLayer.addLayer(L.geoJson(geometry, { style: CITY_POLYGON_STYLE }));
    };
    Dashboard.prototype.clearCityOutline = function() {
      var cityLayer = this.cityLayer;
      // Clear all city.
      cityLayer.eachLayer(function(layer) {
        cityLayer.removeLayer(layer);
      });
    };

    // ----
    var dashboard = new Dashboard();

    $rootScope.$on('data.refresh', function(event, data) {
      sickconsole('Data is refreshed');
      dashboard.clearMarkers();

      _.each(data.response.reports.items, function(item) {
        dashboard.addMarker(item);
      });
    });

    return dashboard;

  }]);

  app.factory('data', [ '$rootScope', function($rootScope) {
    var self = this;

    var city = null;
    var weekDate = null;
    // state control to prevent short-duration(duplicated) data request.
    var posting = false;
    var duration = 100; // ms

    function Data() {
      this.delay = 200;
    }

    Data.prototype.response = null;

    Data.prototype.refresh = function() {
      var self = this;

      if (self.timer) {
        clearTimeout(self.timer);
        self.timer = null;
      }

      self.timer = setTimeout(function() {
        self.request();
      }, self.delay);
    };

    Data.prototype.request = function() {
      var self = this;
      var dateStr = (new Date(weekDate)).toISOString();

      if (self.xhr && self.xhr.readyState < 4) {
        self.xhr.abort();
      }

      // self.xhr = $.getJSON(API_BASEPATH + '/dashboard/now?includeReports=1&callback=?', { city: city.properties.en, date: dateStr })
      self.xhr = $.getJSON(API_BASEPATH + '/dashboard/now?includeReports=1&callback=?', { city: city.properties.en })
        .done(function(resp) {
          self.response = resp.response;
          $rootScope.$broadcast('data.refresh', self);
        });
    };

    // -----
    var data = new Data();

    $rootScope.$on('city.changed', function(event, value) {
      city = value;
      data.refresh();
    });

    $rootScope.$on('weekDate.changed', function(event, value) {
      weekDate = value;
      data.refresh();
    });

    return data;
  }]);

  app.controller('WeekSelector', [ '$scope', 'dashboard', 'data', function($scope, dashboard, data) {
    moment.lang('th', {
      monthsShort: [
        'ม.ค.',
        'ก.พ.',
        'มี.ค.',
        'เม.ย.',
        'พ.ค.',
        'มิ.ย.',
        'ก.ค.',
        'ส.ค.',
        'ก.ย.',
        'ต.ค.',
        'พ.ย.',
        'ธ.ค.',
      ]
    });

    $scope.year = moment().year();
    $scope.quarter = moment().quarter();

    $scope.$watch('weekDate', function(newValue, oldValue) {
      $scope.$emit('weekDate.changed', newValue);
    });
    $scope.weekDate = getWeekDate();

    $scope.$watch('weekNo', function (newValue, oldValue) {
      updateSliderTooltip(newValue);

      var weekDate = moment($scope.year.toString())
        .weeks(newValue)
        .startOf('week')
        .toDate();
      $scope.setWeek(weekDate);
    });
    $scope.weekNo = moment($scope.weekDate).weeks();
    $scope.weekName = moment($scope.weekDate).format('D MMM YYYY') + ' - ' + moment($scope.weekdate).endOf('week').format('D MMM YYYY');

    $scope.years = [ 2014, 2013, 2012, 2011, 2010 ];

    $scope.monthNames = moment.months();

    $scope.weeks = getWeeks($scope.year);

    $scope.monthsOptions = getMonthsOptions($scope.year);

    $scope.setYear = function(value) {
      Foundation.libs.dropdown.closeall();
      $scope.year = value;
      $scope.weeks = getWeeks($scope.year);
      $scope.monthsOptions = getMonthsOptions($scope.year);
    };

    $scope.setQuarter = function(quarter) {
      $scope.quarterExpand = false;
      $scope.quarter = quarter;
      $scope.weeks = getWeeks($scope.year, $scope.quarter);
    };

    $scope.setWeek = function(weekDate) {
      var yearPad = (LANG == 'th') ? 543 : 0;

      $scope.weekDate = new Date(weekDate);
      $scope.weekNo = moment($scope.weekDate).weeks();
      $scope.weekName = moment($scope.weekDate).format('D MMM ') +
                        (moment($scope.weekDate).year() + yearPad) +
                        ' - ' +
                        moment($scope.weekdate).endOf('week').format('D MMM ') +
                        (moment($scope.weekdate).endOf('week').year() + yearPad);
    };

    $scope.isSelectedWeek = function(date) {
      return (new Date(date)).getTime() === (new Date($scope.weekDate)).getTime();
    };

    $scope.quarterExpand = false;
    $scope.toggleQuartersUI = function() {
      $scope.quarterExpand = !$scope.quarterExpand;
    };

    (function ($) {
      var tooltip = $('.weekTooltip');
      var slider = $('.weekNo');

      tooltip.text($scope.weekNo);
      tooltip.addClass('processed');

      slider.slider({
        min: 1,
        max: 52,
        value: $scope.weekNo,

        slide: function (event, ui) {
          var weekDate = moment($scope.year.toString())
            .weeks(ui.value)
            .startOf('week')
            .toDate();
          $scope.setWeek(weekDate);
          $scope.$digest();

          runOnce('updateSliderTooltip', 50, null, function () {
            updateSliderTooltip(ui.value);
          });
        }
      });

      $(window).resize(function (e) {
        updateSliderTooltip($scope.weekNo);
      });
    })(jQuery);

    function getMonthsOptions(year) {
      var optgroups = {};
      // Prepare optgroups
      optgroups = _.map($scope.monthNames, function (name) {
        return {
          monthName: name,
          options: []
        };
      });

      _.each(getWeeks(year), function (weekDate, index) {
        var monthIndex;
        if (index === 0) {
          monthIndex = 0;
        }
        else {
          monthIndex = moment(weekDate).months();
        }

        optgroups[monthIndex].options.push({
          weekName: 'สัปดาห์ที่ ' + moment(weekDate).weeks(),
          weekNo: moment(weekDate).weeks()
        });
      });

      return optgroups;
    }

    function updateSliderTooltip(weekNo) {
      var tooltip = $('.weekTooltip');
      var slider = $('.weekNo');
      slider.slider('value', weekNo);

      // Rebuild tooltip text.
      var weekMonthName;
      if (weekNo == 1) {
        weekMonthName = moment($scope.year.toString())
          .weeks(1)
          .endOf('week')
          .format('MMMM');
      }
      else {
        weekMonthName = moment($scope.year.toString())
          .weeks(weekNo)
          .startOf('week')
          .format('MMMM');
      }
      var tipText = "สัปดาห์ที่ " + weekNo +  ", เดือน" + weekMonthName;
      tooltip.text(tipText);

      var tipWidth = tooltip.width();
      var handleLeft = parseFloat($('.ui-slider-handle', slider).css('left'));

      var actualLeft = handleLeft - (tipWidth / 2);
      var css = { 'left': actualLeft, 'right': 'auto' };

      if (actualLeft + 210 > slider.width()) {
        tooltip.css({ 'right': 0, 'left': 'auto' });
      }
      else if (actualLeft <= 0) {
        tooltip.css({ 'left': 0, 'right': 'auto' });
      }
      else {
        tooltip.css({ 'left': actualLeft, 'right': 'auto' });
      }
    }
  }]);

  app.controller('CitySelector', [ '$scope', 'dashboard', 'data', function($scope, dashboard, data) {
    var regions = [];
    var provinces = [];

    $scope.regions = [];
    $scope.city = null;
    $scope.thailandShape = null;

    async.parallel([
      function(callback) {
        $.getJSON('/data/region.min.json', function(resp) {
          regions = resp;
          callback();
        });
      },
      function(callback) {
        $.getJSON('/data/provinces.min.json', function(resp) {
          provinces = resp.features;
          callback();
        });
      },
      function(callback) {
        $.getJSON('/data/thailand.min.json', function(resp) {
          $scope.thailandShape = resp;
          callback();
        });
      }
    ], function(err) {
      $scope.$watch('city', function(newValue, oldValue) {
        $scope.$emit('city.changed', newValue);
      });
      $scope.setCity( _.find(provinces, { properties: { en: DEFAULT_CITY } }) );

      _.each(regions, function(region) {
        var regionData = {
          name: region.name,
          provinces: []
        };

        _.each(region.provinces, function(provinceTH) {
          regionData.provinces.push(_.find(provinces, { properties: { th: provinceTH } }));
        });

        $scope.regions.push(regionData);
      });

      // Trigger angular to update $scope variables.
      $scope.$digest();
    });

    $scope.setCity = function(city) {
      Foundation.libs.dropdown.closeall();

      if (city == 'all') {
        $scope.city = {
          properties: {
            th: 'ทั้งประเทศ',
            en: 'all'
          }
        };
      }
      else {
        $scope.city = city;
      }

      var bounds;
      var bbox;

      if (city != 'all') {
        dashboard.drawCity(city.geometry);

        // Swap lat <-> lng position.
        bounds = [
          [ city.bbox[1], city.bbox[0] ],
          [ city.bbox[3], city.bbox[2] ]
        ];

      }
      else {
        dashboard.drawCity($scope.thailandShape.features);
        bbox = $scope.thailandShape.bbox;

        bounds = [
          [ bbox[1], bbox[0] ],
          [ bbox[3], bbox[2] ]
        ];
      }

      var paddingTopLeft;
      if (matchMedia(Foundation.media_queries['large']).matches) {
        paddingTopLeft = [200, 0];
      }
      else {
        paddingTopLeft = [0, 100];
      }

      dashboard.map.fitBounds(bounds, {
        maxZoom: 19,
        animate: true,
        duration: 1,
        paddingTopLeft: paddingTopLeft
      });
    };

  }]);

  app.controller('ILIController', [ '$scope', 'data', function($scope, data) {
    var response = data.response || {
      ILI: {
        thisWeek: 0,
        lastWeek: 0,
        delta: 0
      },
      numberOfReporters: 0
    };

    $scope.thisWeek = response.ILI.thisWeek;
    $scope.delta = response.ILI.delta;
    $scope.numberOfReporters = response.numberOfReporters;

    $scope.$on('data.refresh', function(event, data) {
      var response = data.response;

      $scope.thisWeek = response.ILI.thisWeek;
      $scope.delta = response.ILI.delta;
      $scope.numberOfReporters = response.numberOfReporters;

      $scope.$digest();
    });
  }]);

  app.controller('SymptomsController', [ '$scope', function($scope) {
    $scope.$on('data.refresh', function(event, data) {
      $scope.symptoms = localeSymptoms(data.response.topSymptoms);
      $scope.$digest();
    });
  }]);

  function getWeeks (year) {
    var weeks = [];

    weeks = _.map(_.range(1, 53), function (week) {
      return moment(year.toString()).weeks(week).startOf('week').toDate();
    });

    return weeks;
  }

  function getWeekDate (dateInWeek) {
    var date = new Date(dateInWeek || new Date());
    return new Date(moment(date).startOf('week'));
  }

  var symptomMap = {
    'fever': 'มีไข้',
    'cough': 'ไอ',
    'nuasea': 'คลื่นไส้',
    'headache': 'ปวดหัว',
    'red-eye': 'ตาแดง',
    'sore-throat': 'เจ็บคอ',
    'rash': 'ผื่นคัน',
    'jointache': 'ปวดข้อ',
    'diarrhea': 'ท้องเสีย',
    'dark-urine': 'ปัสสาวะสีเข้ม',
    'bleeding': 'เลือดออก',
    'imfine': 'สบายดี',
    'aphthous': 'ร้อนใน'
  };

  function localeSymptoms(symptoms) {
    var _symptoms = [];
    _.each(symptoms, function(symptom, i) {
      var name = symptomMap[symptom.name];
      symptom.name = name || symptom.name;
      _symptoms.push(symptom);
    });
    return _symptoms;
  }

})(jQuery, this, this.document);
