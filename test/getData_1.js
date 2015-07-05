/*
for debug myStartThis.get("charts")
*/

function dirname(path) {
  return path.toString().replace(/\\/g,'/').replace(/\/[^\/]*$/, '');
}
function basename(path) { 
	return path.toString().replace(/\\/g, '/').replace(/.*\//, '' );
}

function drawThreshold(thres, vals) {
	var tmpVal = [];
	var thresObj = {};
	thresObj.color = thres.color || 'red';
	thresObj.val = thres.val || thres;
	thresObj.key = thres.key || 'Target';
    var lastVal = vals.length - 1;
    if (vals && vals.length > 1) {
      tmpVal.push({x:vals[0].x, y:thresObj.val});
      tmpVal.push({x:vals[lastVal].x, y:thresObj.val});
    }
	/*for (var i = 0; i < vals.length; i++) {
		var val = vals[i];
		tmpVal.push({x:val.x, y:thresObj.val});
	}*/
	return { values:tmpVal, key: thresObj.key, color: thresObj.color };
}

function myCallBack(data) {
        for (var idx in data) {
            var chart = data[idx];
            var type = chart.type || "lineChart";
            if (type === "linePlusBarChart") {
                    lineAndBar(chart);
            }
            else if (type === "lineWithFocusChart") {
                    lineAndFocus(chart);
            }
            else {
                defaultChart(chart); 
            }
        }
}

function defaultChart(data) {
    var divname = data.name;
    var width = data.width || 300;
    var height = data.height || 300;
    var forceY = data.forceY || [0,100];
    var yDomain = data.yDomain;
    var margin = data.margin || {top:30,right:30,bottom:30,left:30};
    var decimal = data.decimal || ',.2f';
    var tFormat = data.displayTimeFormat;// || "%d-%b-%y %H";
    nv.addGraph({
      generate: function() {
        //var width = nv.utils.windowSize().width;
        //var height = nv.utils.windowSize().height;
        
        var chart = nv.models[data.type]()
            .options({
              margin: margin,
              transitionDuration: 500,
              useInteractiveGuideline: true
            })
            .x(function(d) { return d.x })
            .y(function(d) { return d.y })
            .showControls(true)
            .color(d3.scale.category10().range())
            .width(width)
            .height(height);
        
        chart.xAxis.showMaxMin(true)
          .tickFormat(function(d) {  if (!d) return; else if (! $.isNumeric(d)) return d; else return d3.time.format("%Y-%m-%d %H")(new Date(d)); }); //d3.time.format("%Y-%m-%d")(new Date(d))
        
        chart.tooltip.headerFormatter(function (d) { return d + ' monkeys' })
        
        var svg = d3.select('#'+divname+' svg').datum(data.series).call(chart);
        //svg.transition().duration(500).call(chart);
        return chart;
            
        /*var chart = nv.models[data.type]()
          .options({
            margin: margin,
            transitionDuration: 500,
            useInteractiveGuideline: true
          })
          .x(function(d,i) { return d.x })
          .y(function(d) { return d.y })
          .color(d3.scale.category10().range())
          .width(width)
          .height(height);
  
        chart.xAxis.showMaxMin(true)
          .tickFormat(function(d) { return d3.time.format(tFormat)(new Date(d)) });

        var svg = d3.select('#'+divname+' svg').datum(data.series);
        svg.transition().duration(500).call(chart);
          
        return chart;*/
        
        /*var chart = nv.models[data.type]()
          .options({
          margin: margin,
          transitionDuration: 500,
          useInteractiveGuideline: true
        })
        .x(function(d,i) { return d.x })
        //.y(function(d) { return d.y })
        .color(d3.scale.category10().range());
        //chart.height(height);
        chart.xAxis.showMaxMin(true)
                .tickFormat(function(d) { console.log(d3.time.format(tFormat)(new Date(d))); return d3.time.format(tFormat)(new Date(d)) });
        //chart.yAxis.tickFormat(d3.format(decimal));
        //chart.forceY(forceY);
        //chart.yDomain(yDomain);
        d3.select('#'+divname).append('svg').datum(data.series).call(chart);
        nv.utils.windowResize(chart.update);
        chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
        return chart;*/
    } /*,
    callback: function(graph) {

        graph.dispatch.on('tooltipShow', function(e) {
            var offsetElement = document.getElementById('#'+divname),
                left = e.pos[0] + offsetElement.offsetLeft,
                top = e.pos[1] + offsetElement.offsetTop,
                formatterY = d3.format(",.2%"),
                formatterX = function(d) {
                    return   d3.time.format('%x')(new Date(d))
                };

            var content = '<h3>' + e.series.key + '</h3>' +
                '<p>' +
                formatterY(graph.y()(e.point)) + ' at ' + formatterX(graph.x()(e.point)) +
                '</p>';

            nv.tooltip.show([left, top], content);
        });

        graph.dispatch.on('tooltipHide', function(e) {
            nv.tooltip.cleanup();
        });

        nv.utils.windowResize(function() {
            var width = nv.utils.windowSize().width;
            var height = nv.utils.windowSize().height;

            graph.width(width).height(height);
            d3.select('#'+divname+' svg').call(graph);
        });
    } */
  });
}

function lineAndBar(data) {
	var divname = data.name;
	var height = data.height || 300;
	var forceY1 = data.forceY1 || [0];
	var forceY2 = data.forceY2 || [0,100];
	var margin = data.margin || {top:30,right:30,bottom:30,left:30};
	var decimal1 = data.decimal1 || ',f';
	var decimal2 = data.decimal2 || ',.2f';
	var tFormat = data.displayTimeFormat;
	nv.addGraph(function() {
		d3.selectAll('#'+divname+' g').remove();
		var chart = nv.models.linePlusBarChart()
            .options({
				margin: margin,
				transitionDuration: 500,
				useInteractiveGuideline: true
			})
          .x(function(d,i) { return d.x })
          .y(function(d) { return d.y })
          .color(d3.scale.category10().range());
		chart.height(height);
		//chart.focusEnable(chart.focusEnable());
		chart.xAxis.showMaxMin(true).tickFormat(function(d) { return d3.time.format(tFormat)(new Date(d)) });
		chart.y1Axis.tickFormat(d3.format(decimal1));
		chart.y2Axis.tickFormat(function(d) { return d3.format(decimal2)(d) });
		chart.bars.forceY(forceY1);
		chart.lines.forceY(forceY2);
		d3.select('#'+divname).datum(data.series).call(chart);
		nv.utils.windowResize(chart.update);
		chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
		return chart;
  });
}

function lineAndFocus(data) {
	var divname = data.name;
    var height = data.height || 300;
    var forceY = data.forceY || [0];
    var margin = data.margin || {top:30,right:30,bottom:30,left:30};
    var decimal = data.decimal || ',f';
    var tFormat = data.displayTimeFormat;
	nv.addGraph(function() {
		d3.selectAll('#'+divname+' g').remove();
		var chart = nv.models.lineWithFocusChart()
            .options({
				margin: margin,
				transitionDuration: 500,
				useInteractiveGuideline: true
			})
          .x(function(d,i) { return d.x })
          .y(function(d) { return d.y })
          .color(d3.scale.category10().range());
      chart.height(height);
      chart.xAxis.showMaxMin(true).tickFormat(function(d) { return d3.time.format(tFormat)(new Date(d)) });
      chart.x2Axis.showMaxMin(true).tickFormat(function(d) { return d3.time.format(tFormat)(new Date(d)) });
      chart.yAxis.tickFormat(d3.format(decimal));
      chart.y2Axis.tickFormat(d3.format(decimal));
      chart.forceY(forceY);
      d3.select('#'+divname).datum(data.series).call(chart);
      nv.utils.windowResize(chart.update);
	  chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
      return chart;
  });
}

function StartThis(filter) {
   var _vars = {
      csv_file: false,
      filter: "",
      charts: [],
      cb: "",
      s : new ChartSeries(),
      dropDownDomID: "",
	"controllerFileLocation": "",	
	"nodeFileLocation": "",
      controllerFileTemplate: "XXXX_Controller(partA).csv",
      nodeFileTemplate: "XXXX_Node(partA).csv",
      controllerFile: "UMTS_Controller(partA).csv",
      preFilterSelectionKey: {'key':'Node'}, // this can be overwritten in testing, filter based on this key.
      sourceInfo: {'use':false}, // default
      debug: true
    };
  this.get = function(key) {
      return _vars[key];
  };
  this.set = function(key, value) {
    _vars[key] = value;
    if (key === "preFilterControllerSelect" && typeof(this.get('sourceInfo')) === typeof({})) {
      // "preFilterControllerSelect" is set on dropDown change, the values is the controller name.
      //preFilterControllerSelect, this will be an Array, currently only use the first entry.
      this.get('sourceInfo')['controller'] = value[0];
      if (this.get('sourceInfo')['use']) {
        //var name = this.get('sourceInfo')['tech']+'_'+this.get('sourceInfo')['controller']+'_'+this.get('sourceInfo')['file'];
	// new filename convention "UMTS_Cell_Hour(RNC03SJH).csv"
	var newFilename = this.get('sourceInfo')['file'].replace("XXX", this.get('sourceInfo')['controller']);
        this.get('sourceInfo')['newCsvFile'] = newFilename;
        this.set('csv_file', newFilename);
      }
    }
    if (key === "sourceInfo" && typeof(this.get('sourceInfo')) === typeof({}) && typeof this.get('sourceInfo')['tech'] !== 'undefined') {
      this.set("tech", this.get('sourceInfo')['tech']);
    }
    return this;
  };
  this.allKeys = function() {
	_.map(_vars, function(v, k) {console.log(k,'=',v) });
  };
}

StartThis.prototype = {
  makeGraphs: function(data) {
      var self = this;
      var charts = this.get("charts");
      var cb = this.get("cb");
      var filter = this.get("filter");
      
      var dropDownStyleObj = this.get("dropDownStyle");
      var s = self.get("s");
      if (typeof(filter) === 'undefined') {
      	filter = ''; // first time
      }
      if (filter.filterType && filter.filterType === 'objFilter') {
      	filter = filter.filter;
      }
      
      s.set("dropList",[]);	
      s.set('filter',filter)
        .set('charts',charts)
        .set('dropSelected',filter)
        .data(data);
      
      
      if (typeof(this.get("dropDownDomID")) !== 'undefined' && this.get("dropDownDomID") !== '') {
        var dropDownDom = this.get("dropDownDomID");
        /*
         * clear dropList in object "s", doing this is only needed when s is not refreshed ie when paged is not newly loaded.
         */    
        s.get('dropList').sort();
        self.set("dropDownObject", s.get('dropList') ); //objects
        d3.selectAll('#'+dropDownDom+' select').remove();
        d3.select('#'+dropDownDom)
          .append('select')
          .on('change', function(){
            var options = {filterType:'objFilter',filter:this.options[this.selectedIndex].value};
            self.set("filter",options);
            self.getMyData();
          })
          .selectAll('option')
          .data(s.get('dropList'))
          .enter()
          .append('option')
          .attr("value", function(d){ return d; })
          .attr("selected", function(d){ if (d === s.get('dropSelected')) { return "selected";} })
          .text( function(d) {return d;} );
          if (dropDownStyleObj && dropDownStyleObj['class']) {
                  d3.select('#'+dropDownDom+' select').attr('class', dropDownStyleObj['class']);
          }
      }
      cb(charts);
  },
  addDropDown: function(div_id, data, prevSelect, cb) {
	d3.selectAll('#'+div_id+' .custom-select').remove();
    d3.select('#'+div_id)
          .append('select')
	  .classed("custom-select",true)
	  .attr("name","standard")
          .selectAll('option')
          .data(data)
          .enter()
          .append('option')
          .attr("value", function(d){ return d; })
          .attr("selected", function(d){ if (d === prevSelect) { return "selected";} })
          .text( function(d) {return d;});
	  $('#'+div_id+' select')
          .on('change', function(){
		//console.log('got event from custom select');
           	var options = {filterType:'objFilter',filter:this.options[this.selectedIndex].value};
           	//console.log('dropdown',this.options[this.selectedIndex].value);
			cb(this.options[this.selectedIndex].value);
          });
	  $('#'+div_id+' select').customselect({"emptytext":"Select a Node...","hoveropen":false});
	//try {$("#nodeDropDown select").customselect()
	//	.on('select', function(){
           //console.log('dropdown',this.options[this.selectedIndex].value);
         //  cb(this.options[this.selectedIndex].value);
        //});
	//} catch(e){ console.log('fail')}
  },
  getMyData: function() {
      var self = this;
      var charts = this.get("charts");
      //var tech = "UMTS";
      var cb = this.get("cb");
	  console.log(cb);
      var filter = this.get("filter");
      var dropDownDom = this.get("dropDownDomID");
      if (typeof(cb) !== 'function') {
	  	console.log('error: callback not valid');
        return;
      }
      // this.set("sourceInfo",{tech:"UMTS",file:"Cell_Hour(partA).csv"});
      if (typeof this.get("csv_file") === 'undefined' || this.get("csv_file") === '') {
		console.log('error: csv not valid');
        return;
      }
      
      var controllerFile = this.get("controllerFileTemplate").replace('XXXX',this.get("tech"));
      var nodeFile = this.get("nodeFileTemplate").replace('XXXX',this.get("tech"));

      if (basename(this.get("controllerFileLocation")) !== "") {
	controllerFile = this.get("controllerFileLocation");
      }	
      else {
        controllerFile = this.get("controllerFileLocation")+this.get("controllerFileTemplate").replace('XXXX',this.get("tech"));
      }	
      if (basename(this.get("nodeFileLocation")) !== "") {
		nodeFile = this.get("nodeFileLocation");
      }	
      else {
        nodeFile = this.get("nodeFileLocation")+this.get("nodeFileTemplate").replace('XXXX',this.get("tech"));
      }	

      this.set("controllerFile", controllerFile);
      this.set("nodeFile", nodeFile);
      
      var preFilter = (function () {
          var retObj = {'is':false,'empty':true,'filter':[]};
          if (typeof(self.get("preFilter")) === 'undefined') {
            retObj = {'is':false,'empty':true,'filter':[]};
            return retObj;
          } 
          else if (typeof(self.get("preFilter")) === 'boolean' && ! self.get("preFilter")) {
            retObj = {'is':false,'empty':true,'filter':[]};
            return retObj;
          }
          else if (typeof(self.get("preFilter")) === 'object' && typeof(self.get("preFilter").length) === 'number') {
           if (self.get("preFilter").length) {
             retObj = {'is':true,'empty':false,'filter':self.get("preFilter")};
           }
           else {
             /*
            * return true even if zero elements in array, as long as this is an Array.
            * When Array empty it means first time that this is running and we need to build a selection list before graphing any data
            */
             retObj = {'is':true,'empty':true,'filter':[]};
           }
            return retObj;
          }
          else {
            retObj = {'is':false,'empty':true,'filter':[]};
            return retObj;
          }
      })();
      
      //console.log('preFilter = ',preFilter);
      console.log('info: start loading');
      if (this.get("loadLocal") && this.get("data")) {
        var csv = this.get("data");
        var dataTmp = $.csv.toArrays(csv);
		console.log(dataTmp);
        if (dataTmp[0] == "") {
            dataTmp.splice(0, 6); // remove first 6 lines
            dataTmp.splice(dataTmp.length - 1, 1);
            csv = d3.csv.format(dataTmp);
        }
        var data = d3.csv.parse(csv);
        setTimeout(function() {self.makeGraphs(data)}, 0);
      }
      else {
		console.log('info: else dataTmp');
        if (preFilter.is) {
          // myStartThis.set("preFilter",[{'key':'Controller', value: 'RNC01KPR'}]);
          // myStartThis.set("preFilter",[{'key':'Node', value: '3G-007-077_AVDE_Avondale_East'}]);
          var preFilterObjects = self.get("preFilter"); // or preFilter.filter
          // myStartThis.set("preFilterSelectionKey",{'key':'Node'}); or key=Controller
          var preFilterSelectionKey = self.get("preFilterSelectionKey");
          var tmpArr = [];
            
              if (preFilter.empty) {
                console.log('preFilter is empty, load Controller and Node data');
                /*
                 * preFilter is empty, load controller and node data from static files
                 */
                self.progress('start');
                d3.csv(self.get("controllerFile"), function (data) {
                  // only return the Object column
                  tmpArr.push(data.map(function(d) {
                                    return d.Object;
                                })
                  );
                  self.set("preFilterControllerObjectList",tmpArr[0]);
                  tmpArr = [];
                  //"UMTS_Node(partA).csv"
                  d3.csv(self.get("nodeFile"), function (data) {
                    var controllerSelect = ''; // Current selected controller, needed for filtering nodes.
                    if (typeof(self.get("preFilterControllerSelect")) === typeof([]) && self.get("preFilterControllerSelect").length) {
                      // TODO: if mulit select loop through this
                      controllerSelect = self.get("preFilterControllerSelect")[0];
                    }
                    else {
                      controllerSelect = self.get("preFilterControllerObjectList")[0];
                    }
                    /*
                     * Filter based on controller selected
                     */
                    data = data.filter(function(d,i) {
                      if (d.Controller === controllerSelect) return true;    
                    });
                    tmpArr.push(data.map(function(d,i) {
                      return d.Object;
                      })
                    );
                    tmpArr[0].sort();
                    self.set("preFilterNodeObjectList",tmpArr[0]);
                    self.progress('done');
                  });
                });
                
                console.log('First time, not opening csv file',self.get("csv_file"));
                /*
                 * First time running, no selection exists.
                 * Don't show any data, just make select lists available.
                 */
              }
              else {
                if (typeof(self.get('csvData')) === typeof([]) ) {
                  /*
                   * previously saved filted data exists, use this.
                   * Should only get here when changing cell names.
                   */
                  console.log('Not loading csv file');
                  self.progress('start');
                  self.makeGraphs(self.get('csvData'));
                  self.progress('done');
                }
                else {
                  self.progress('start');
                  d3.csv(self.get("csv_file"), function (data) {
                    console.log('opening csv file for load',self.get("csv_file"));
                    var filterKey = preFilterSelectionKey.key;
                    data = data.filter(function(d,i) {
                      //console.log(d[filterKey], preFilterObjects[0], filterKey, preFilterObjects[0]['key'])
                      // TODO: Add loop here so we can add more than one item to filter.
                      if (d[filterKey] === preFilterObjects[0]['value']) {
                          return true;
                      }
                    });
                    console.log('After filter num records = ',data.length);
                    self.set('csvData',data);
                    // clear filter, this will trigger a new graph render.
                    self.set('filter','');
                    self.makeGraphs(data);
                    self.progress('done');
                  });
                }
              }
            
        }
        else {
          /*
           * No preFilter set, do normal file load
           */
          console.log('No preFilter, default load', this.get("csv_file"));
         self.progress('start');
          d3.csv(this.get("csv_file"), function (data) {
			//console.log(data);
            self.makeGraphs(data);
            self.progress('done');
          });
        }
      }
  },
  progress: function(status) {
    var etype = false;
    //console.log('got event trigger',status);
    if (status === 'start') {
      etype = 'graphLoadStart';
      $.event.trigger({
        type:    etype,
        message: "Start loading.",
        time:    new Date()
      });
    }
    else if (status === 'done') {
      etype = 'graphLoadDone';
      $.event.trigger({
        type:    etype,
        message: "Done loading.",
        time:    new Date()
      });
    }
    
    if (typeof this.get('progress') === 'function') {
      this.get('progress')(status);
    }
  }
};

var ChartSeries = function() {
    var _vars = {
        filter: "",
        type: "kpi", // 'object',
        charts: [
          {name:"chart1",type:"stackedAreaChart",kpi:['1','2']},
          {name:"chart2",type:"linePlusBarChart",kpi:['3','4'],'3':'bar'}
        ],
  timeFormat: false,
        dropList: [],
        dropSelected: "",
        debug: true
    };
    this.get = function(key){
        return _vars[key];
    };
    this.set = function(key, value){
      _vars[key] = value;
        return this;
    };
};

ChartSeries.prototype = {
    parseDate1: d3.time.format("%Y-%m-%d").parse,
    clearFilter: function() {
	this.set("filter", "");
        this.set('dropSelected', '');
    },
    parseDate: function (dStr) {
      if (! this.get('timeFormat')) {
        var dateReg = /^\d{4}-\d{2}-\d{2}$/;
        var dater = /^\d{1,2}\/\d{1,2}\/\d{4}$/; // 1/12/2013	
        var dateYM = /^\d{4}-\d{2}$/;
        if(dateReg.test(dStr)) {
            this.set('timeFormat',"%Y-%m-%d");
            this.set('displayTimeFormat',"%d-%b-%y");
        }
        else if(dateYM.test(dStr)) {
            this.set('timeFormat',"%Y-%m");
            this.set('displayTimeFormat',"%b-%y");
        }
        else {
            this.set('timeFormat',"%Y-%m-%d %H:%M");
            this.set('displayTimeFormat',"%d-%b-%y %H");
        }
      }
      return d3.time.format(this.get('timeFormat')).parse;
    },
    addThreshold: function() {
      //chart=myStartThis.get('charts')[0]['series'][0].values
      //_.first(chart).x
	var charts = this.get('charts');
	for (var chartKey in charts) {
		var chart = charts[chartKey];
		if (chart.series && chart.threshold) {
			var thres = chart.threshold;
			chart.series.push(drawThreshold(thres, chart.series[0].values));
		}
	}
    },	
    addToSeries: function() {
	var charts = this.get('charts');
	for (var chartKey in charts) {
		var chart = charts[chartKey];
		if (chart.series && chart.seriesStyle) {
			for (var seriesKey in chart.series) {
				var series = chart.series[seriesKey];
	    			if (chart['seriesStyle'] && chart['seriesStyle'][series.key]) {
					var styleObj = chart['seriesStyle'][series.key];
					for (var styleObjKey in styleObj) {
						// Add all keys
						series[styleObjKey] = styleObj[styleObjKey];
					}	
	    			} 	
			}
		}
	}
    },	
  addDataSeries: function(series) {
    var charts = this.get('charts');
    var numSeries = charts[0]['series'].length;
    var newSeries = {key:'myline', values:[
        {x:this.parseDate("2014-08-02 00:00")("2014-08-02 00:00").getTime(), y:0},
        {x:this.parseDate("2014-08-02 00:00")("2014-08-02 00:00").getTime(), y:100}]
      };
    charts[0]['series'][numSeries] = newSeries;
  },	
    data: function(data) {
      var filter = this.get('filter');
      var series = {};
      var seriesName = [];
      var self = this;
      var charts = this.get('charts');
      for (var chartKey in charts) {
          var chart = charts[chartKey];
          chart['series'] = [];
      }
      var chartMaxSeriesCheck = [];

      data.forEach(function(d,i) {
        d.Time = d.Time.replace(' DST','');
        d.dd = self.parseDate(d.Time)(d.Time).getTime();
          for (var chartKey in charts) {
            var chart = charts[chartKey];
		if (chart['valueFormat'] && chart['valueFormat'].length) {
			// expect an object 
			// valueFormat:[{'L.Thrp.bits.DL(bit)': function(d){return d/8;} }]
			// "d" would be the value from the key
			var vFObj = chart['valueFormat'];
			for (var i = 0, n = vFObj.length; i < n; i++) {
				var vF = vFObj[i];
				for (var vFKey in vF) {
					if (d[vFKey]) {
						if (typeof vF[vFKey] === 'function') {
							d[vFKey] = vF[vFKey](d[vFKey]);	
						}
					}
				}
			}
		}		
	    chart['displayTimeFormat'] = self.get('displayTimeFormat');	
	    chart.margin.left = chart.margin.left || 20;
            var chartName = chart.name;
	    if (chartMaxSeriesCheck.indexOf(chartName) < 0) {
          chartMaxSeriesCheck.push(chartName);
          chartMaxSeriesCheck[chartName] = [];
	    }	
	    	
        if (chart['chType'] === 'metric') {
                var filter = charts[chartKey].kpi[0];
                var found = false;
                var min = chart['forceY'][0] <= d[filter] ? chart['forceY'][0] : d[filter];
                var max = chart['forceY'][1] > d[filter] ? chart['forceY'][1] : d[filter];
                chart['forceY'] = [parseFloat(min),parseFloat(max)];
		if (typeof(max) === 'undefined') {
			max = 0;
		}
		var yAxisStrLen = parseInt(max.toString().length);
		if (yAxisStrLen > 3) {
			var chLen = parseInt(yAxisStrLen / 3) * 23;
			var def = 30;
			var left = def + chLen;
			chart.margin.left = chart.margin.left > left ? chart.margin.left : left;
		}
		if (d[filter] === '') {
                    d[filter] = null;
                }
                for (var idx in chart['series']) {
                  if (chart['series'][idx]['key'] === d['Object']) {
		    var newVal = d[filter] == null || isNaN(d[filter]) ? null : +d[filter];
                      chart['series'][idx]['values'].push({x:d.dd,y:newVal});
                      found = true;
                  }
                }
                if (! found) {
                  var lastItem = chart['series'].length;
                  chart['series'][lastItem] = {};
                  chart['series'][lastItem]['key'] = d['Object'];
		  var newVal = d[filter] == null || isNaN(d[filter]) ? null : +d[filter];
                  chart['series'][lastItem]['values'] = [{x:d.dd,y:newVal}];
                }
            }
            else if (chart['chType'] === 'object') {
          	//chart.margin = {top:30,right:50,bottom:50,left:50};
                if (self.get('dropSelected') === '') {
                  self.set('dropSelected', d['Object']); // set first object as filter when no filter
                }
                if (self.get('dropList').indexOf(d['Object']) < 0) {
                      self.get('dropList').push(d['Object']);
                }
                if (self.get('dropSelected') === d['Object']) {
                    var st = chart.kpi;
                    if (! chart.series) {
                        chart.series = [];
                    }
                    for (var i in st) {
                        var seriesKey = st[i];
		        if (d[seriesKey] === '') {
                           d[seriesKey] = null;
                        }
			if (chartMaxSeriesCheck[chartName].indexOf(seriesKey) < 0) {
				chartMaxSeriesCheck[chartName].push(seriesKey);
      				var max = d3.max(data, function(dMax) {
					if (dMax['Object'] === d['Object']) {
						//return parseFloat(dMax[seriesKey]);
						if (dMax[seriesKey] === '') {
							return 0;
						}
						else if (dMax[seriesKey] == null) {
							return 0;
						}
						else if (typeof(dMax[seriesKey]) === 'undefined') {
							return 0;
						}
						return parseInt(dMax[seriesKey].toString().length);
					}
      				});	
				if (typeof(max) === 'undefined') {
					max = 0;
				}
				var yAxisStrLen = parseFloat(max.toString().length);
				var yAxisStrLen = max;
				if (yAxisStrLen > 3) {
					var chLen = parseInt(yAxisStrLen / 3) * 23;
					var def = 30;
					var left = def + chLen;
					chart.margin.left = chart.margin.left > left ? chart.margin.left : left;
				}
				//console.log(seriesKey,'yAxisStrLen',yAxisStrLen,max,'margin.left',chart.margin.left);
			}
                        var found = false;
                        for (var idx in chart['series']) {
                            if (chart['series'][idx]['key'] === seriesKey) {
				var newVal = d[seriesKey] == null  || isNaN(d[seriesKey]) ? null : +d[seriesKey];
                              chart['series'][idx]['values'].push({x:d.dd,y:newVal});
                              found = true;
                            }
                        }
                        if (! found) {
                            var lastItem = chart['series'].length;
                            chart['series'][lastItem] = {};
                            chart['series'][lastItem]['key'] = seriesKey;
                            if (chart[seriesKey]) {
                                  chart['series'][lastItem][chart[seriesKey]] = true; // current 'bar'
                              }
			     var newVal = d[seriesKey] == null || isNaN(d[seriesKey]) ? null : +d[seriesKey];
                            chart['series'][lastItem]['values'] = [{x:d.dd,y:newVal}];
                        }
                    }
                }
            }
        }
    });
    self.addThreshold();	
    self.addToSeries();	
  }
};
