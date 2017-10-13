
var data = [10]
var r = 30;
var pi = function(cssSelector){    
    
    var canvas = d3.select(cssSelector)
        .append("svg")
        .attr("width", 500)
        .attr("height", 500);
    var group = canvas.append("g")
        .attr("transform", "translate(100,100)");
    var arc = d3.arc()
        .innerRadius(60)
        .outerRadius(50);
    var pie = d3.pie()
        .value(function (d) { return d; });
    var color = d3.scaleOrdinal()
        .range(["#FEBF03"]);
    var arcs = group.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", function (d) { return color(d.data); });
    arcs.append("text")
        .attr("transform", "translate(-15,5)")//function (d) { return "translate(" + arc.centroid(d) + ")"; })
        .text(function (d) { return d.data; })
        .attr("font-size","30");
    }
    pi("#doNut1" );
    pi("#doNut2");
    pi("#doNut3");
    pi("#doNut4");


   
    // var cirsm1 = function(cssSelector) {
    //         var canvas = d3.select(cssSelector)
    // var width = 90;
    // var height = 90;	
    // var color = colors.green;
    
    // var radius = 41;
    // var border = 2;
    // var padding = 2;
    // var startPercent = 0;
    // var endPercent = 0.55;
    
    
    // var twoPi = Math.PI * 2;
    // var formatPercent = d3.format('.0%');
    // var boxSize = (radius + padding) * 2;
    
    
    // var count = Math.abs((endPercent - startPercent) / 0.01);
    // var step = endPercent < startPercent ? -0.01 : 0.01;
    
    // var arc = d3.arc()
    //     .startAngle(0)
    //     .innerRadius(radius)
    //     .outerRadius(radius - border);
    
    // var parent = d3.select('div#cirsm1');
    
    
    // var svg = parent.append('svg')
    //     .attr('width', width)
    //     .attr('height', height);
    
    // var defs = svg.append('defs');
    
    // var filter = defs.append('filter')
    //     .attr('id', 'blur');
    
    // filter.append('feGaussianBlur')
    //     .attr('in', 'SourceGraphic')
    //     .attr('stdDeviation', '1');
    
    // var g = svg.append('g')
    //     .attr('transform', 'translate(' + boxSize / 2 + ',' + boxSize / 2 + ')');
    
    // var meter = g.append('g')
    //     .attr('class', 'progress-meter');
    
    // meter.append('path')
    //     .attr('class', 'background')
    //     .attr('fill', '#ccc')
    //     .attr('fill-opacity', 0.5)
    //     .attr('d', arc.endAngle(twoPi));
    
    // var foreground = meter.append('path')
    //     .attr('class', 'foreground')
    //     .attr('fill', color)
    //     .attr('fill-opacity', 1)
    //     .attr('stroke', color)
    //     .attr('stroke-width', 2)
    //     .attr('stroke-opacity', 1)
    //     .attr('filter', 'url(#blur)');
    
    // var front = meter.append('path')
    //     .attr('class', 'foreground')
    //     .attr('fill', color)
    //     .attr('fill-opacity', 1);
    
    // var numberText = svg.append('text')
    //     .attr('class', 'text')
    //      .attr('transform', 'translate(45,42)')
    //     .attr('fill', '#fff')
    //     .attr('text-anchor', 'middle')
    //      .attr('font-size', '20px')
    //     .attr('font-weight', '600')
    //     .attr('dy', '.35em');
    
    // function updateProgress(progress) {
    //     foreground.attr('d', arc.endAngle(twoPi * progress));
    //     front.attr('d', arc.endAngle(twoPi * progress));
    //     numberText.text(formatPercent(progress));
    // }
    
    // var progress = startPercent;
    
    // (function loops() {
    //     updateProgress(progress);
    
    //     if (count > 0) {
    //         count--;
    //         progress += step;
    //         setTimeout(loops, 10);
    //     }
    // })();
    // } 
    