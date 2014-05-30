$(document).foundation();

$(document).ready(function() {
  var map = L.map('map').setView([13.751690, 100.491882], 13);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

  var knot = $('.knots-ui');

  $('.knot-pin').click(function(e) {
    $('.knot-pin', knot).removeClass('selected');
    $(this).addClass('selected');
  });
});

function getWeeks(year, quarter) {
  // 1. Get first day of quarter
  var firstDateOfQuarter = new Date(moment(year + '-01-01').quarter(quarter));

  // 2. Get first day of that week
  var firstDateOfTheWeek = moment(new Date(firstDateOfQuarter)).subtract('day', firstDateOfQuarter.getDay());
  // 3. Generate each first day of week by adding 7 days until the last week before next quarter
  var weeks = [ new Date(firstDateOfTheWeek) ];
  var run = true;
  var tmp;

  while (run) {
    tmp = moment(new Date(_.last(weeks))).add('days', 7);
    if (tmp.quarter() > quarter) {
      run = false;
    }
    else {
      weeks.push(new Date(tmp));
    }
  }

  return weeks;
}

function WeekSelector($scope) {
  moment.lang('en');

  $scope.year = moment().year();
  $scope.quarter = moment().quarter();
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

  };
}
