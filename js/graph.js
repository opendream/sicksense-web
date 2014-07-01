app.controller('GraphController', [ '$scope', '$rootScope', function ($scope, $rootScope) {
  'use strict';

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

  var area = d3.svg.area()
    .x(function (d) {
      return x(d.date);
    })
    .y0(height)
    .y1(function (d) {
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
    var customTimeFormat = d3.time.format.multi([
      ['',      function (d) { return d.getTime() == oldestDate.getTime(); }],
      ["%b %d", function (d) { return d.getTime() != latestDate.getTime(); }],
      ["สัปดาห์", function (d) { return d.getTime() == latestDate.getTime(); }]
    ]);

    x.domain(d3.extent(BOE, function (d) { return d.date; }));
    // Find max `y`.
    var maxBOE = _.max(_.pluck(BOE, 'value'));
    var maxSickSense = _.max(_.pluck(SickSense, 'value'));
    y.domain([0, _.max([maxBOE, maxSickSense])]);

    xAxis.tickValues(_.pluck(BOE, 'date'));
    xAxis.tickSize(0, 0);
    xAxis.tickFormat(customTimeFormat);

    if (!BOEPath) {
      BOEPath = svg
        .append('path')
        .attr('class', 'area-boe')
        .attr('d', area(BOE));
    }
    else {
      BOEPath
        .transition()
        .duration(750)
        .attr('d', area(BOE));
    }

    if (!SickSensePath) {
      SickSensePath = svg
        .append('path')
        .attr('class', 'area-sicksense')
        .attr('d', area(SickSense));
    }
    else {
      SickSensePath
        .transition()
        .duration(750)
        .attr('d', area(SickSense));
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