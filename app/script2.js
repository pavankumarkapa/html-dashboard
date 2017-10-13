var data = [100]
var r = 50;
// function  responsivefy(svg) {
//     var  container  = d3.select(svg.node().parentNode),
//         width  =  parseInt(svg.style('width')),
//         height  =  parseInt(svg.style('height')),
//         aspect  =  width  /  height;
//     svg.attr('viewBox',  '0 0 '  +  width  +  ' '  +  height)
//         .attr('preserveAspectRatio',  'xMinYMid')
//         .call(resize);
//     d3.select(window).on('resize.'  +  container.attr('id'),  resize);
//     function  resize() {
//         var  targetWidth  =  parseInt(container.style('width'));
//         svg.attr('width',  targetWidth);
//         svg.attr('height',  Math.round(targetWidth  /  aspect));
//     }
// }

var createDoNutChart = function(cssSelector) {
    var canvas = d3.select(cssSelector)
    .append("svg")
    .attr("width", 300)
    .attr("height", 193)  
    // .call(responsivefy);
var group = canvas.append("g")
    .attr("transform", "translate(100,100)");
var arc = d3.arc()
    .innerRadius(70)
    .outerRadius(60)
var pie = d3.pie()
    .value(function (d) { return d; });
var color = d3.scaleOrdinal()
    .range(["#24bba2"]);
var arcs = group.selectAll("arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");
arcs.append("path")
    .attr("d", arc)
    .attr("fill", function (d) { return color(d.data); });
arcs.append("text")
    .attr("transform", "translate(-45,15)")
    .text(function (d) { return d.data; })
    .attr("font-family", "sans-serif")
    .attr("font-size", "50px")
    .attr("font-weight", "bold")
    .attr("fill", "#24bba2");
}

createDoNutChart("#doNut1");
createDoNutChart("#doNut2");
createDoNutChart("#doNut3");
createDoNutChart("#doNut4");


