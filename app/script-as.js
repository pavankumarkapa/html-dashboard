
var data = [30, 40, 50]
var r = 50;
var pi = function(d3, cssSelector){    
    var canvas = d3.select(cssSelector)
        .append("svg")
        .attr("width", 200)
        .attr("height", 150);
    var group = canvas.append("g")
        .attr("transform", "translate(50,60)");
    var arc = d3.svg.arc()
        .innerRadius(50)
        .outerRadius(40);
    var pie = d3.layout.pie()
        .value(function (d) { return d; });
    var color = d3.scale.ordinal()
        .range(["#808080","#ffcc00","#333"]);
    var arcs = group.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", function (d) { return color(d.data); });
    // arcs.append("text")
    //     .attr("transform", "translate(-15,5)")//function (d) { return "translate(" + arc.centroid(d) + ")"; })
    //     .text(function (d) { return d.data; })
    //     .attr("font-size","30");
    };
    pi(window.d3_3, "#doNut1" );
    pi(window.d3_3, "#doNut2");
    pi(window.d3_3, "#doNut3");
    pi(window.d3_3, "#doNut4");