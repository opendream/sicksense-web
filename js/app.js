var API_BASEPATH = "//localhost:1337";

sickconsole = function(message) {
  if (console) {
    console.log('SICKSENSE LOG: ' + message);
  }
};

$(document).foundation();

$(document).ready(function() {
  var knot = $('.knots-ui');

  $('.knot-pin').click(function(e) {
    $('.knot-pin', knot).removeClass('selected');
    $(this).addClass('selected');
  });
});

var app = angular.module('sicksense', []);

app.factory('dashboard', [ '$rootScope', function($rootScope) {

  function Dashboard (options) {
    options = _.defaults(options || {}, {
      latitude: 13.751690,
      longitude: 100.491882,
      zoom: 13
    });

    this.map = L.map('map').setView([options.latitude, options.longitude], options.zoom);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);
  }

  Dashboard.prototype.map = null;
  Dashboard.prototype.markers = [];

  Dashboard.prototype.clearMarkers = function() {
    var self = this;
    _.each(self.markers, function(item) {
      self.map.removeLayer(item);
    });
  };

  Dashboard.prototype.addMarker = function(latitude, longitude) {
    this.markers.push( L.marker([latitude, longitude]).addTo(this.map) );
  };

  // ----
  var dashboard = new Dashboard();

  $rootScope.$on('data.refresh', function(event, data) {
    sickconsole('Data is refreshed');
    dashboard.clearMarkers();

    _.each(data.response.reports.items, function(item) {
      dashboard.addMarker(item.latitude, item.longitude);
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

  function Data() {}

  Data.prototype.response = null;

  Data.prototype.refresh = function() {
    var self = this;
    var dateStr = (new Date(weekDate)).toISOString();

    $.getJSON(API_BASEPATH + '/dashboard?callback=?', { city: city.en, date: dateStr })
      .done(function(resp) {
        self.response = resp.response;
        $rootScope.$broadcast('data.refresh', self);
      });
  };

  // -----
  var data = new Data();

  $rootScope.$on('city.changed', function(event, value) {
    city = value;
    runOnce('refreshData', 200, self, data.refresh);
  });

  $rootScope.$on('weekDate.changed', function(event, value) {
    weekDate = value;
    runOnce('refreshData', 200, self, data.refresh);
  });

  return data;
}]);

app.controller('WeekSelector', [ '$scope', 'dashboard', 'data', function($scope, dashboard, data) {
  moment.lang('en');

  $scope.year = moment().year();
  $scope.quarter = moment().quarter();

  $scope.$watch('weekDate', function(newValue, oldValue) {
    $scope.$emit('weekDate.changed', newValue);
  });
  $scope.weekDate = getWeekDate();

  $scope.years = [ 2014, 2013 ];

  $scope.monthNames = moment.months();

  $scope.weeks = getWeeks($scope.year, $scope.quarter);

  $scope.setYear = function(value) {
    Foundation.libs.dropdown.closeall();
    $scope.year = value;
  };

  $scope.setQuarter = function(quarter) {
    $scope.quarter = quarter;
    $scope.weeks = getWeeks($scope.year, $scope.quarter);
  };

  $scope.setWeek = function(weekDate) {
    $scope.weekDate = new Date(weekDate);
  };

  $scope.isSelectedWeek = function(date) {
    return (new Date(date)).getTime() === (new Date($scope.weekDate)).getTime();
  };

  $scope.quarterExpand = false;
  $scope.toggleQuartersUI = function() {
    $scope.quarterExpand = !$scope.quarterExpand;
  };
}]);

app.controller('CitySelector', [ '$scope', 'dashboard', 'data', function($scope, dashboard, data) {
  var regions = [];
  var provinces = [];

  $scope.regions = [];
  $scope.city = null;

  async.parallel([
    function(callback) {
      $.getJSON('/js/region.json', function(resp) {
        regions = resp;
        callback();
      });
    },
    function(callback) {
      $.getJSON('/js/province.json', function(resp) {
        provinces = resp;
        callback();
      });
    }
  ], function(err) {
    $scope.$watch('city', function(newValue, oldValue) {
      $scope.$emit('city.changed', newValue);
    });
    $scope.city = _.find(provinces, { en: "Bangkok" });

    _.each(regions, function(region) {
      var regionData = {
        name: region.name,
        provinces: []
      };

      _.each(region.provinces, function(provinceTH) {
        regionData.provinces.push(_.find(provinces, { th: provinceTH }));
      });

      $scope.regions.push(regionData);
    });

    // Trigger angular to update $scope variables.
    $scope.$digest();
  });

  $scope.setCity = function(city) {
    Foundation.libs.dropdown.closeall();
    $scope.city = city;

    // Set map center by city.
    dashboard.map.setView([ city.latitude, city.longitude ], 9, {
      animate: true,
      duration: 1
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

function getWeeks (year, quarter) {
  // 1. Get first day of quarter
  var firstDateOfQuarter = new Date(moment(year + '-01-01').quarter(quarter));

  // 2. Get first day of that week
  var firstDateOfTheWeek = moment(new Date(firstDateOfQuarter)).startOf('week');
  // 3. Generate each first day of week by adding 7 days until the last week before next quarter
  var weeks = [ new Date(firstDateOfTheWeek) ];
  var run = true;
  var tmp;

  while (run) {
    tmp = moment(new Date(_.last(weeks))).add('days', 7);
    if (tmp.year() > year || tmp.quarter() > quarter) {
      run = false;
    }
    else {
      weeks.push(new Date(tmp));
    }
  }

  return weeks;
}

function getWeekDate (dateInWeek) {
  var date = new Date(dateInWeek || new Date());
  return new Date(moment(date).startOf('week'));
}