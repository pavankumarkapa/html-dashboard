/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }

  function responsivefy(svg) {
    // var container = d3.select(svg.node().parentNode),
    //   width = parseInt(svg.style('width')),
    //   height = parseInt(svg.style('height')),
    //   aspect = width / height;
    // svg.attr('viewBox', '0 0 ' + width + ' ' + height)
    //   .attr('preserveAspectRatio', 'xMinYMid')
    //   .call(resize);
    // d3.select(window).on('resize.' + container.attr('id'), resize);
    // function resize() {
    //   var targetWidth = parseInt(container.style('width'));
    //   svg.attr('width', targetWidth);
    //   svg.attr('height', Math.round(targetWidth / aspect));
    // }
  }

  // Your custom JavaScript goes here
  (function(d3) {
    var w = 500;
    var h = 300;

    var projection = d3.geoAlbersUsa()
      .translate([w / 2, h / 2])
      .scale([500]);

    var path = d3.geoPath()
      .projection(projection);

    var color = d3.scaleQuantize()
      .range(['#25AE9C', '#94D4CC', '#CFD3DD']);
      // .range(['rgb(158,121,252)', 'rgb(83,216,234)', 'rgb(245,125,161)', 'rgb(145,161,245)']);

    var svg = d3.select('.geojson')
      .append('svg')
      .attr('width', w)
      .attr('height', h)
      .call(responsivefy);

    d3.csv('geojson/us-ag-productivity.csv', function(data) {

      color.domain([
        d3.min(data, function(d) {
          return d.value;
        }),
        d3.max(data, function(d) {
          return d.value;
        })
      ]);

      d3.json('geojson/us-states.json', function(json) {

        for (var i = 0; i < data.length; i++) {
          var dataState = data[i].state;
          var dataValue = parseFloat(data[i].value);
          for (var j = 0; j < json.features.length; j++) {
            var jsonState = json.features[j].properties.name;
            if (dataState === jsonState) {
              json.features[j].properties.value = dataValue;
              break;
            }
          }
        }
        svg.selectAll('path')
          .data(json.features)
          .enter()
          .append('path')
          .attr('d', path)
          .style('fill', function(d) {
            var value = d.properties.value;
            if (value) {
              return color(value);
            } else {
              return '#ccc';
            }
          })
          .style('fill-opacity', '0.9')
          .on('mouseover', function() {
            d3.select(this)
              .style('fill-opacity', '1');
          })
          .on('mouseout', function() {
            d3.select(this)
              .style('fill-opacity', '0.9');
          });
      });
    });
  })(window.d3);

  (function(d3) {
    var w = 800;
    var h = 150;
    var padding = 20;

    var dataset, xScale, yScale, xAxis, yAxis, area;
    var parseTime = d3.timeParse('%Y-%m');

    var formatTime = d3.timeFormat('%b %Y');
    var rowConverter = function(d, i, cols) {
      var row = {
        date: parseTime(d.Date)
      };
      for (var i = 1; i < cols.length; i++) {
        var col = cols[i];
        if (d[cols[i]]) {
          row[cols[i]] = +d[cols[i]];
        } else {
          row[cols[i]] = 0;
        }
      }

      return row;
    };

    var stack = d3.stack()
      .order(d3.stackOrderDescending);

    // var color = d3.scaleQuantize()
    //   .range(['#25AE9C', '#B2AFC4', '#8C87A6', '#94D4CC', '#332A60']);

    var color = ['#25AE9C', '#94D4CC', '#CFD3DD'];

    d3.csv('geojson/ev_sales_data.csv', rowConverter, function(data) {
      var dataset = data;
      var keys = dataset.columns;
      keys.shift();
      stack.keys(keys);

      var series = stack(dataset);
      xScale = d3.scaleTime()
        .domain([
          d3.min(dataset, function(d) {
            return d.date;
          }),
          d3.max(dataset, function(d) {
            return d.date;
          })
        ])
        .range([padding, w - padding * 2]);

      yScale = d3.scaleLinear()
        .domain([
          0,
          d3.max(dataset, function(d) {
            var sum = 0;

            for (var i = 0; i < keys.length; i++) {
              sum += d[keys[i]];
            }

            return sum;
          })
        ])
        .range([h - padding, padding / 2])
        .nice();

      xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(15)
        .tickSize(0)
        .tickSizeOuter(0);

      area = d3.area()
        .curve(d3.curveBasis)
        .x(function(d) {
          return xScale(d.data.date);
        })
        .y0(function(d) {
          return yScale(d[0]);
        })
        .y1(function(d) {
          return yScale(d[1]);
        });

      var svg = d3.select('.areagraph')
        .append('svg')
        .attr('width', w)
        .attr('height', h)
        .call(responsivefy);

      svg.selectAll('path')
        .data(series)
        .enter()
        .append('path')
        .attr('class', 'area')
        .attr('d', area)
        .attr('fill', function(d, i) {
          console.log(i);
          return color[i];
          // return d3.schemeCategory20[i];
        })
        .append('title')
        .text(function(d) {
          return d.key;
        });

      // svg.append('g')
      //   .attr('class', 'axis')
      //   .attr('transform', 'translate(0,' + (h - padding) + ')')
      //   .call(xAxis);

    });
  })(window.d3);

  (function(d3) {
    var w = 800;
    var h = 300;
    var padding = 20;

    var dataset, xScale, yScale, xAxis, yAxis, area;
    var parseTime = d3.timeParse('%Y-%m');

    var formatTime = d3.timeFormat('%b %Y');
    var rowConverter = function(d, i, cols) {
      var row = {
        date: parseTime(d.Date)
      };
      for (var i = 1; i < cols.length; i++) {
        var col = cols[i];
        if (d[cols[i]]) {
          row[cols[i]] = +d[cols[i]];
        } else {
          row[cols[i]] = 0;
        }
      }

      return row;
    };

    var stack = d3.stack()
      .order(d3.stackOrderDescending);

    var color = d3.scaleQuantize()
      .range(['#25AE9C', '#B2AFC4', '#8C87A6', '#94D4CC', '#332A60']);
    // var color = ['#25AE9C', '#B2AFC4', '#8C87A6', '#94D4CC', '#332A60'];

    d3.csv('geojson/traffic_data.csv', rowConverter, function(data) {
      var dataset = data;
      var keys = dataset.columns;
      keys.shift();
      stack.keys(keys);

      var series = stack(dataset);
      xScale = d3.scaleTime()
        .domain([
          d3.min(dataset, function(d) {
            return d.date;
          }),
          d3.max(dataset, function(d) {
            return d.date;
          })
        ])
        .range([padding, w - padding * 2]);

      yScale = d3.scaleLinear()
        .domain([
          0,
          d3.max(dataset, function(d) {
            var sum = 0;

            for (var i = 0; i < keys.length; i++) {
              sum += d[keys[i]];
            }

            return sum;
          })
        ])
        .range([h - padding, padding / 2])
        .nice();

      area = d3.area()
        .curve(d3.curveBasis)
        .x(function(d) {
          console.log(d);
          return xScale(d.data.date);
        })
        .y0(function(d) {
          return yScale(d[0]);
        })
        .y1(function(d) {
          return yScale(d[1]);
        });

      var svg = d3.select('.traffic')
        .append('svg')
        .attr('width', w)
        .attr('height', h)
        .call(responsivefy);

      svg.selectAll('path')
        .data(series)
        .enter()
        .append('path')
        .attr('class', 'area')
        .attr('d', area)
        .attr('fill', function() {
          return '#25AE9C';
        })
        .append('title')
        .text(function(d) {
          return d.key;
        });
    });
  })(window.d3);

  var createDoNut = (function(d3, css, data) {
    var r = 250;
    var canvas = d3.select(css)
      .append('svg')
      .attr('width', 800)
      .attr('height', 800)
      .call(responsivefy);
    var group = canvas.append('g')
      .attr('transform', 'translate(300,300)');
    var arc = d3.arc()
      .innerRadius(225)
      .outerRadius(300)
      .cornerRadius(20);
    var pie = d3.pie()
      .value(function(d) { return d; });
    var color = d3.scaleOrdinal()
      .range(['#25AE9C', '#eae9ef']);
    var arcs = group.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', function(d) { return color(d.data); });
  });

  createDoNut(window.d3, '.bar-container-1', [75, 25]);
  createDoNut(window.d3, '.bar-container-2', [80, 20]);
  createDoNut(window.d3, '.bar-container-3', [60, 30]);

  var createBarChart = (function(d3, css, data) {
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);
    var y = d3.scaleLinear()
      .range([height, 0]);

    var svg = d3.select('.bar-container-2').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .call(responsivefy)
      .append('g')
      .attr('transform',
        'translate(' + 100 + ',' + 100 + ')');

    d3.csv('geojson/bargraph.csv', function(error, data) {
      if (error) throw error;

      data.forEach(function(d) {
        d.sales = +d.sales;
      });

      x.domain(data.map(function(d) { return d.salesperson; }));
      y.domain([0, d3.max(data, function(d) { return d.sales; })]);

      svg.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) { return x(d.salesperson); })
        .attr('width', x.bandwidth())
        .attr('y', function(d) { return y(d.sales); })
        .attr('height', function(d) { return height - y(d.sales); })
        .style('fill', '#25AE9C');
    });
  });

  var createGaugeChart = (function(d3, css) {
    var width = 260,
      height = 100;

    var svg = d3.select(css)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .call(responsivefy);

    var arc = d3.arc()
      .innerRadius(50)
      .outerRadius(80)
      .cornerRadius(5)
      .padAngle(0);

    var color = ['#91cf60', '#d9ef8b', '#fee08b', '#fc8d59', '#d73027'].reverse();

    var data = makeData();

    var pie = d3.pie()
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2)
      .value(function(d) {
        return d;
      });

    var arcs = svg.selectAll('.arc')
      .data(pie(data[1]))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('transform', 'translate(120,90)')
      .style('fill', function(d, i) {
        return color[i];
      });

    var needle = svg.selectAll('.needle')
      .data(data[0])
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', -79)
      .attr('y1', 0)
      .attr('y2', 0)
      .style('stroke', 'black')
      .attr('transform', function(d) {
        var r = 180 * d / data[1][3];
        return ' translate(120,90) rotate(' + r + ')';
      });

    d3.select('#button')
      .on('click', function() {
        data = makeData();
        arcs.data(pie(data[1]))
          .transition()
          .attr('d', arc);
        needle.data(data[0])
          .transition()
          .ease(d3.easeElasticOut)
          .duration(2000)
          .attr('transform', function(d) {
            var r = 180 * d / data[1][3];
            return ' translate(120,90) rotate(' + r + ')';
          });
      });

    function makeData() {
      var newarcsdata = d3.range(4)
        .map(function() {
          return d3.randomUniform()();
        })
        .sort();
      var newneedledata = [d3.randomUniform(0, newarcsdata[3])()];
      return [newneedledata, newarcsdata];
    }
  });

  createGaugeChart(window.d3, '.health-indicator');
})();

window.$(function() {

  var slider_one_focus = true;
  var slider_two_focus = false;
  var slide_count = 0;

  function startAnimation() {
    if (slider_two_focus) {
      slider_two_focus = false;
      $('.a-slider-2').css({
        'opacity': 0.2
      });
      $('.a-slider-1').css({
        'opacity': 1
      });
    }
    if (slider_one_focus) {
      $('.a-slider-1').animate({
        left: '-=100'
      }, 250, function() {
        slide_count++;
        if (slide_count === 3) {
          $('.a-slider-2').css({
            'opacity': 1
          });
          $('.a-slider-1').css({
            'opacity': 0,
            'left': 100 + 'px'
          });
          slide_count = 0;
          slider_two_focus = true;
        }
      });
    }

    setTimeout(function() {
      // debugger;
      startAnimation();
    }, 1000);
  }

  setTimeout(function() {
    startAnimation();
  }, 1000);
});

(function(d3) {
  var width = 480,
    height = 250,
    outerRadius = Math.min(width, height) * .5 - 10,
    innerRadius = outerRadius * .6;

  var n = 10,
    data0 = d3.range(n).map(Math.random),
    data1 = d3.range(n).map(Math.random),
    data;

  // var color = d3.scale.category20();
  var color = ['#8a8a8a', '#d5d5d5'];

  var arc = d3.svg.arc();

  var pie = d3.layout.pie()
    .sort(null);

  var svg = d3.select('.animation').append('svg')
    .attr('width', width)
    .attr('height', height);

  svg.append('circle')
    .attr('cx', 240)
    .attr('cy', 125)
    .attr('r', 115)
    .attr('fill', '#dedede');

  svg.selectAll('.arc')
    .data(arcs(data0, data1))
    .enter().append('g')
    .attr('class', 'arc')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
    .append('path')
    .attr('fill', function(d, i) { return color[i % 2]; })
    .attr('d', arc);

  transition(1);

  function arcs(data0, data1) {
    var arcs0 = pie(data0),
      arcs1 = pie(data1),
      i = -1,
      arc;
    while (++i < n) {
      arc = arcs0[i];
      arc.innerRadius = innerRadius;
      arc.outerRadius = outerRadius;
      arc.next = arcs1[i];
    }
    return arcs0;
  }

  function transition(state) {
    var path = d3.selectAll('.arc > path')
      .data(state ? arcs(data0, data1) : arcs(data1, data0));

    // Wedges split into two rings.
    var t0 = path.transition()
      .duration(750)
      .attrTween('d', tweenArc(function(d, i) {
        return {
          innerRadius: i & 1 ? innerRadius + 30 : (innerRadius + outerRadius) / 2,
          outerRadius: i & 1 ? (innerRadius + outerRadius) / 2 : outerRadius
        };
      }));

    // Wedges translate to be centered on their final position.
    var t1 = t0.transition()
      .attrTween('d', tweenArc(function(d, i) {
        var a0 = (d.next.startAngle + d.next.endAngle) + 15,
          a1 = (d.startAngle - d.endAngle);
        return {
          startAngle: (a0 + a1) / 2,
          endAngle: (a0 - a1) / 2
        };
      }));

    // Wedges then update their values, changing size.
    var t2 = t1.transition()
      .attrTween('d', tweenArc(function(d, i) {
        return {
          startAngle: d.next.startAngle,
          endAngle: d.next.endAngle
        };
      }));

    // Wedges reunite into a single ring.
    var t3 = t2.transition()
      .attrTween('d', tweenArc(function(d, i) {
        return {
          innerRadius: innerRadius,
          outerRadius: outerRadius
        };
      }));

    setTimeout(function() { transition(!state); }, 3000);
  }

  function tweenArc(b) {
    return function(a, i) {
      var d = b.call(this, a, i), i = d3.interpolate(a, d);
      for (var k in d) a[k] = d[k]; // update data
      return function(t) { return arc(i(t)); };
    };
  }
})(window.d3_3);

$(function() {
  var i = 1;
  setInterval(function() {
    var prevClass = '.anim-' + (i - 1) + '> a';
    $('.ball').removeClass('ball-a-' + (i - 1) + '');
    if (i === 7) {
      i = 1;
    }
    var nextClass = '.anim-' + (i) + '> a';
    $(prevClass).removeClass('active');
    $(nextClass).addClass('active');
    $('.ball').addClass('ball-a-' + i + '');
    i++;
  }, 2000);
});
