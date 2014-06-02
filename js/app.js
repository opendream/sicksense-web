$(document).foundation();

$(document).ready(function() {
  var knot = $('.knots-ui');

  $('.knot-pin').click(function(e) {
    $('.knot-pin', knot).removeClass('selected');
    $(this).addClass('selected');
  });
});

function Dashboard () {
  var API_BASEPATH = "http://localhost:1337";

  this.map = null;
  this.markers = [];

  this.initMap = function(options) {
    options = _.defaults(options || {}, {
      latitude: 13.751690,
      longitude: 100.491882,
      zoom: 13
    });

    this.map = L.map('map').setView([options.latitude, options.longitude], options.zoom);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);

    return this.map;
  };

  this.clearMarkers = function() {
    var self = this;
    _.each(self.markers, function(item) {
      self.map.removeLayer(item);
    });
  };

  this.addMarker = function(latitude, longitude) {
    this.markers.push( L.marker([latitude, longitude]).addTo(this.map) );
  };

  this.refresh = function(city, weekDate) {
    var self = this;

    self.clearMarkers();

    $.getJSON(API_BASEPATH + '/dashboard?callback=?', { city: city, date: (new Date(weekDate)).toISOString() })
      .done(function(data) {
        _.each(data.response.reports.items, function(item) {
          self.addMarker(item.latitude, item.longitude);
        });
      });
  };
}

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

function WeekSelector ($scope) {
  // Init map
  var dashboard = new Dashboard();
  dashboard.initMap();

  moment.lang('en');

  $scope.city = "Bangkok";
  $scope.year = moment().year();
  $scope.quarter = moment().quarter();

  $scope.$watch('weekDate', function(newValue, oldValue) {
    dashboard.refresh($scope.city, newValue);
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
}
