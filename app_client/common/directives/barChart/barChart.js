(function () {
angular.module('d3', [])
  .directive('barChart', ['d3service', function (d3service) {
    return {
      restrict: 'EA',
      scope: {},
      link: function (scope, element, attrs) {
        d3service.d3().then(function (d3) {
          var margin = parseInt(attrs.margin) || 20,
              barHeight = parseInt(attrs.barHeight) || 20,
              barPadding = parseInt(attrs.barPadding) || 5;

          var svg = d3.select(ele[0])
                    .append("svg")
                    .style('width', '100%');

          //Listen for resize events
          window.onresize = function () {
            scope.render(scope.data);
          };

          //Example data
          scope.data = [
            {name: "Greg", score: 98},
            {name: "Ari", score: 96},
            {name: 'Q', score: 75},
            {name: "Loser", score: 48}
          ];

          //Watch other resize events
          scope.$watch(function () {
            return angular.element($window)[0].innerWidth;
          }, function () {
            scope.render(scope.data);
          });

          //Time to render some SVG graphics!
          scope.render = function (data) {
            console.log('rendering');
            //Clear everything before rendering.
            svg.selectAll('*').remove();

            //obviously we need data
            if (!data) { return; }

            //Setup, defining variables based ideally on window or data properties
            var width = d3.select(ele[0]).node().offsetWidth - margin,
                height = scope.data.length * (barHeight + barPadding),
                color = d3.scale.category20(),
                xScale = d3.scale.linear()
                  .domain([0, d3.max(data, function (d) {
                    return d.score;
                  })])
                  .range([0, width]);

            //Make SVG props
            svg.attr('height', height);

            //Make objects by 'selecting' them. Weird, huh?
            svg.selectAll('rect')
              .data(data).enter()
                .append('rect')
                .attr('height', barHeight)
                .attr('width', 140)
                .attr('x', Math.round(margin/2))
                .attr('y', function (d, i) {
                  return i * (barHeight + barPadding);
                })
                .attr('fill', function (d) {
                  return color(d.score);
                })
                .transition()
                  .duration(1000)
                  .attr('width', function (d) {
                    return xScale(d.score);
                  });
          };

        });
      }
    };
  }]);
})()
