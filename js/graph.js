app.controller('GraphController', [ '$scope', '$rootScope', function ($scope, $rootScope) {
  'use strict';

  var timeFormat = d3.time.format;

  if (LANG == 'th') {
    timeFormat = d3.locale({
      decimal: ".",
      thousands: ",",
      grouping: [ 3 ],
      currency: [ "$", "" ],
      dateTime: "%a %b %e %X %Y",
      date: "%m/%d/%Y",
      time: "%H:%M:%S",
      periods: [ "AM", "PM" ],
      days: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
      shortDays: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
      months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
      shortMonths: [ 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.' ]
    }).timeFormat;
  }

  var $chart = jQuery('#chart');

  var margin = {
    top: 40,
    right: 30,
    bottom: 40,
    left: 30
  };

  var width = $chart.width() - margin.left - margin.right;
  var height = $chart.height() - margin.top - margin.bottom;

  var x = d3.time.scale()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

  var line = d3.svg.line()
    .x(function (d) {
      return x(d.date);
    })
    .y(function (d) {
      return y(d.value);
    });

  var svg = d3.select('#chart')
    .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var BOEPath, SickSensePath;

  $scope.$on('data.refresh', function (event, data) {
    var graphs = data.response.graphs;

    var BOE = _.map(graphs.BOE, function (d) {
      return {
        date: new Date(Date.parse(d.date)),
        value: d.value
      };
    });

    var SickSense = _.map(graphs.SickSense, function (d) {
      return {
        date: new Date(Date.parse(d.date)),
        value: d.value
      };
    });

    var oldestDate = moment(_.first(BOE).date).toDate();
    var latestDate = moment(_.last(BOE).date).toDate();
    var customTimeFormat = timeFormat.multi([
      ['',      function (d) { return d.getTime() == oldestDate.getTime(); }],
      ["%_d %b", function (d) { return d.getTime() != latestDate.getTime(); }],
      ["สัปดาห์", function (d) { return d.getTime() == latestDate.getTime(); }]
    ]);

    x.domain(d3.extent(BOE, function (d) { return d.date; }));
    // Find max `y`.
    var maxBOE = _.max(_.pluck(BOE, 'value'));
    var maxSickSense = _.max(_.pluck(SickSense, 'value'));
    var maxY = _.max([maxBOE, maxSickSense]);
    maxY = _.max([maxY, GRAPH_MAX_Y]);
    y.domain([0, maxY]);

    xAxis.tickValues(_.pluck(BOE, 'date'));
    xAxis.tickSize(0, 0);
    xAxis.tickFormat(customTimeFormat);

    if (!BOEPath) {
      BOEPath = svg
        .append('path')
        .attr('class', 'line-boe')
        .attr('d', line(BOE));
    }
    else {
      BOEPath
        .transition()
        .duration(750)
        .attr('d', line(BOE));
    }

    if (!SickSensePath) {
      SickSensePath = svg
        .append('path')
        .attr('class', 'line-sicksense')
        .attr('d', line(SickSense));
    }
    else {
      SickSensePath
        .transition()
        .duration(750)
        .attr('d', line(SickSense));
    }

    d3.selectAll('.axis').remove();

    svg
      .append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + height + ')')
        .call(xAxis);

    svg
      .append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
          .attr('y', -10)
          .attr('class', 'y-label')
          .style('text-anchor', 'middle')
          .text('ILI (%)');
  });


}]);
