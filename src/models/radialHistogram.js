/* 
 * Based on the book "Developing a D3 Edge"
 * http://backstopmedia.booktype.pro/developing-a-d3js-edge/copyright/
 */


nv.models.radialHistogram = function() {
  "use strict";

  var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 470,
    height = 400,
    slices = 24, //24 hours in a day.
    innerRadius = 50, //Default inner radius
    outerRadius = 150, //Default outer radius
    innerScale = d3.scale.linear(), //Define a scale for sizes segments based on value.
    group, //Our empty group variable
    dimension, //Our empty dimension variable.
    offset = 50, //Label offset value.
    lowerColor, //The color used for the minimum of our range
    upperColor, //The color used for the maximum of our range
    innerRange, //The lower bound for radius value
    outerRange, //The upper bound for radius value
    color = d3.scale.linear(); //Linear color scale used for the segments.
    
    var margin = {top: 0, right: 0, bottom: 0, left: 0}
        , container = null
        , strokeWidth = 1.5
        /*, color = nv.utils.defaultColor() // a function that returns a color*/
        , getX = function(d) { return d.x } // accessor to get the x value from a data point
        , getY = function(d) { return d.y } // accessor to get the y value from a data point
        , defined = function(d,i) { return !isNaN(getY(d,i)) && getY(d,i) !== null } // allows a line to be not continuous when it is not defined
        , isArea = function(d) { return d.area } // decides if a line is an area or just a line
        , clipEdge = false // if true, masks lines within x and y scale
        , x //can be accessed via chart.xScale()
        , y //can be accessed via chart.yScale()
        , interpolate = "linear" // controls the line interpolation
        /*, duration = 250*/
        , dispatch = d3.dispatch('elementClick', 'elementMouseover', 'elementMouseout', 'customHover', 'renderEnd')
        ;

    //var dispatch = d3.dispatch("customHover");
  //The chart function our module will return with the selection that called it,
  // as the only argument.
  function chart (_selection) {
    innerRange = innerRange  ? innerRange :  innerRadius;
    //If the outerRange is not defined, it equals the outerRadius.
    outerRange = outerRange ? outerRange : outerRadius;

    //Our d3 arc generator for the segments.
    var arc = d3.svg.arc()
      .innerRadius(function (d, i) {return innerScale(d);})
      .outerRadius(function (d, i) {return outerRadius;})
      .startAngle(function (d, i) {return 2 * Math.PI * (i/slices);})
      .endAngle(function (d, i) {return 2 * Math.PI * ((i+1)/slices);});

    //Our d3 arc generator for the labels.
    var label = d3.svg.arc()
      .innerRadius(outerRadius + offset)
      .outerRadius(outerRadius + offset)
      .startAngle(function (d, i) {return 2 * Math.PI * (i/slices);})
      .endAngle(function (d, i) {return 2 * Math.PI * ((i+1)/slices);});
      
    _selection.each(function(_data) {
      
      var totalRecordsMax = d3.max(_data, function (d) {return d.value;}),
        totalRecordsMin = d3.min(_data, function (d) {return d.value;});
      //Set the range and domain for our innerScale using the min and max from the totalRecords.
      innerScale.range([outerRange, innerRange]).domain([totalRecordsMin, totalRecordsMax]);
      //Set the color range similarly
      color.range([lowerColor, upperColor]).domain([totalRecordsMin, totalRecordsMax]);
    
      /*var svg = d3.select(this)
            .selectAll("path")
                .data([_data], function(d) { return d.key; });
      svg.enter().append("path");*/
        
      //Update our segments using the current data.
      var arcs = _selection.append('g').selectAll('path')
        .data(function(d, i) { return d; /* d === _data */ })
        .attr('d', function (d,i) {return arc(d.value,i);})
        .attr('fill', function (d) {return color(d.value);})
        .attr('stroke', 'black')
        .attr('class', 'slice');
        //.on("mouseover", dispatch.customHover);

        //Add any new segments using the current data.
        arcs.enter().append('path')
          .attr('d', function (d,i) {return arc(d.value,i);})
          .attr('fill', function (d) {return color(d.value);})
          .attr('class', 'slice')
          .attr('stroke', 'black');
          //.on("mouseover", dispatch.customHover);

        //Remove and extra segments.
        arcs.exit().remove();

        arcs.on('mouseover', mouseover);
        
        //Add our labels.
        var labels = _selection.append('g').selectAll('text')
          .data(function(d, i) { return d; /* d === _data */ })
          .enter()
          .append("text")
          .attr("transform", function(d,i) { return "translate(" + label.centroid(d,i) + ")"; })
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .text(function(d,i) { return i; });
  
        //Remove center text on chart update. TODO: Better way??
        _selection.selectAll('.centerText').remove();
        
        //Add the center text for the chart.
        var centerText = _selection.append('text')
          .attr('text-anchor', 'middle')
          .text('')
          .attr('class', 'centerText');

        function mouseover (d) {
          console.log('Total: ' + d.value);
          centerText.text(d.value);
          dispatch.customHover(d);
        }

      });
    }
    
  chart.width = function (_width) {
    if(!arguments.length) return width;
    width = _width;
    return chart;
  };
  chart.height = function (_height) {
    if(!arguments.length) return height;
    height = _height;
    return chart;
  };
    
    //Method to get/set the inner radius.
  chart.innerRadius = function (_innerRadius) {
    if(!arguments.length) return innerRadius;
    innerRadius = _innerRadius;
    return chart;
  };
  //Method to get/set the outer radius.
  chart.outerRadius = function (_outerRadius) {
    if(!arguments.length) return outerRadius;
    outerRadius = _outerRadius;
    return chart;
  };
  //Method to get/set the crossfilter group.
  chart.group = function (_group) {
    if(!arguments.length) return group;
    group = _group;
    return chart;
  };
  //Method to get/set the label offset.
  chart.offset = function (_offset) {
    if(!arguments.length) return offset;
    offset = _offset;
    return chart;
  };
  //Method to get/set the crossfilter dimension.
  chart.dimension = function (_dimension) {
    if(!arguments.length) return dimension;
    dimension = _dimension;
    return chart;
  };
  //Method to get/set the color range.
  chart.colorRange = function (_array) {
    if(!arguments.length) return [lowerColor, upperColor];
    lowerColor = _array[0];
    upperColor = _array[1];
    return chart;
  };
  //Method to get/set the radial range/
  chart.radialRange = function (_array) {
    if(!arguments.length) return [innerRange, outerRange];
    innerRange = _array[0];
    outerRange = _array[1];
    return chart;
  };
  
  chart.options = nv.utils.optionsFunc.bind(chart);

  chart._options = Object.create({}, {
      // simple options, just get/set the necessary values
      width:      {get: function(){return width;}, set: function(_){width=_;}},
      height:     {get: function(){return height;}, set: function(_){height=_;}},
      defined: {get: function(){return defined;}, set: function(_){defined=_;}},
      interpolate:      {get: function(){return interpolate;}, set: function(_){interpolate=_;}},
      clipEdge:    {get: function(){return clipEdge;}, set: function(_){clipEdge=_;}},
      radialRange: {get: function() {return [innerRange, outerRange];},
         set: function (_array) { 
            innerRange = _array[0];
            outerRange = _array[1];
          }
      },

      // options that require extra logic in the setter
      margin: {get: function(){return margin;}, set: function(_){
          margin.top    = _.top    !== undefined ? _.top    : margin.top;
          margin.right  = _.right  !== undefined ? _.right  : margin.right;
          margin.bottom = _.bottom !== undefined ? _.bottom : margin.bottom;
          margin.left   = _.left   !== undefined ? _.left   : margin.left;
      }},
      duration: {get: function(){return duration;}, set: function(_){
          duration = _;
          //renderWatch.reset(duration);
          //scatter.duration(duration);
      }},
      isArea: {get: function(){return isArea;}, set: function(_){
          isArea = d3.functor(_);
      }},
      x: {get: function(){return getX;}, set: function(_){
          getX = _;
          //scatter.x(_);
      }},
      y: {get: function(){return getY;}, set: function(_){
          getY = _;
          scatter.y(_);
      }},
      colorRange: {
        get:function() {return [lowerColor, upperColor]},
        set: function (_array) { 
          lowerColor = _array[0];
          upperColor = _array[1];
          return chart;
        }
      }
      //color:  {get: function(){return color;}, set: function(_){
      //    color = nv.utils.getColor(_);
      //    //scatter.color(color);
      //}}
  });

  //nv.utils.inheritOptions(chart /*, scatter*/);
  nv.utils.initOptions(chart);
    
  d3.rebind(chart, dispatch, "on");
  //Finally, return the chart.
  return chart;
};