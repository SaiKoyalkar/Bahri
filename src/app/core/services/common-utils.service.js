(function ()
{
    'use strict';

    angular
        .module('app.core')
        .factory('commonUtils', commonUtils);

    /** @ngInject */
    function commonUtils($window,$mdToast,$timeout)
    {
        var vm = this;
        //var factory = {}; 

        vm.method1 = function() {
            var a = 'abc';
            //console.log(a); 
        };

        /* Common Starts */
        vm.durations = function(){
            var range = {
                "month"     : "Month",
                "quarter"   : "Quarter",
                "year"      : "Year"
            };
            return range;
        }

        vm.voyageDurations = function(){
            var range = {
                "month"     : "Month",
                "quarter"   : "Quarter",
                "year"      : "Year",
                "voyage"    : "Voyage"
            };
            return range;
        }

        vm.overlays = function(){
            var range = {
                "wind"          : "Wind",
                "temp"          : "Temp",
                "pressure"      : "Pressure",
                "clouds"        : "Clouds",
                "rh"            : "RH",
                "gust"          : "Gust",
                "waves"         : "Waves",
                "swell"         : "Swell",
                "swellperiod"   :"Swellperiod",
                "currents"      :"Currents"
            };
            return range;
        }   

        vm.levels = function(){
            var range = {
                "surface" : "Surface",
                "975h"    : "975h",
                "950h"    : "950h",
                "925h"    : "925h",
                "900h"    : "900h",
                "850h"    : "850h",
                "750h"    : "750h",
                "700h"    : "700h",
                "550h"    : "550h",
                "450h"    : "450h",
                "350h"    : "350h",
                "300h"    : "300h",
                "250h"    : "250h",
                "200h"    : "200h",
                "150h"    : "150h"
            };
            return range;
        }

        vm.businessUnits = function(){
            var  businessUnits = [{
                "unit_id" : "bot",
                "unit_name" : "Bahri Oil Transport"
            },{
                "unit_id" : "bcc",
                "unit_name" : "Bahri Chemical Carriers"
            },{
                "unit_id" : "bdb",
                "unit_name" : "Bahri Dry Bulk"
            },{
                "unit_id" : "bgc",
                "unit_name" : "Bahri General Cargo"
            }];

            return businessUnits;
        }

        vm.buNames = function(){
            var units = {
                "bot" : "Bahri Oil Transport",
                "bcc" : "Bahri Chemical Carriers",
                "bdb" : "Bahri Dry Bulk",
                "bgc" : "Bahri General Cargo"
            };

            return units;
        }

        vm.exportOptions = function(){
            var range = {
                "": "Export As",
                "jepg": "JPEG",
               // "png" : "PNG",
                "pdf" : "PDF"
            };
            return range;
        }

        vm.exportProgressOptions = function(){
            var range = {
                "": "Export As",
                "jepg": "JPEG"
            };
            return range;
        }

        vm.activeBtn = function(activeBtn,inactiveBtn){
            activeBtn.addClass('active');
            inactiveBtn.removeClass('active');
        }

        /* Common Ends */

        /* Graph Starts */ 

        vm.initializeSettings = function(){
            Highcharts.setOptions({
                lang: {
                    numericSymbols: ['K', 'M', 'G', 'T', 'P', 'E'],
                    decimalPoint: '.',
                    thousandsSep: ','
                },
                yAxis: {
                    labels: {
                        formatter: function () {
                            if(this.value >= 1000000000000000 || this.value <= -1000000000000000)
                                return Math.round(this.value/1000000000000000) + 'P';
                            else if(this.value >= 1000000000000 || this.value <= -1000000000000)
                                return Math.round(this.value/1000000000000) + 'T';
                            else if(this.value >= 1000000000 || this.value <= -1000000000)
                                return Math.round(this.value/1000000000) + 'G';
                            else if(this.value >= 1000000 || this.value <= -1000000)
                                return Math.round(this.value/1000000) + 'M';
                            else if(this.value >= 1000 || this.value <= -1000)
                                return Math.round(this.value/1000) + 'K';
                            else
                                return Highcharts.numberFormat(this.value,0);
                        }
                    }
                }
            });
            
            Highcharts.wrap(Highcharts.seriesTypes.solidgauge.prototype, 'drawPoints', function (proceed) {
                    var chartRadius = this.chart.yAxis[0].center[2] / 2,
                        borderWidth = chartRadius * 24 / 100; // outer - inner radius percentage
                this.options.borderWidth = borderWidth;
                proceed.apply(this, Array.prototype.slice.call(arguments, 1));
                $.each(this.points, function (i, point) {
                        if (point.graphic) {
                            point.graphic.element.setAttribute('stroke-width', borderWidth);
                    }
                });
            });
        }

        vm.activityChart = function(data,tooltip){
            var tooltip = (tooltip != undefined) ? tooltip : getToolTip();
            var result = {
                chart: data.chart,
                title: data.title,
                colors: data.colors,
                pane: data.pane,
                yAxis: data.yAxis,
                tooltip: tooltip,
                legend: data.legend,
                plotOptions: data.plotOptions,
                series: data.series,
                exporting: data.exporting,
                credits: data.credits
            };
            return result;
        }

        vm.multipleAxisChartWithDecimal = function(data){
            var result = {
                chart: data.chart,
                title: data.title,
                colors: data.colors,
                xAxis: data.xAxis,
                pane: data.pane,
                yAxis: [{
                  "title": {
                    "text": "",
                    "style": {
                      "color": data.yAxis[0].title.style.color
                    }
                  },
                  "labels": {
                    "style": {
                      "color": data.yAxis[0].labels.style.color
                    },
                    formatter: function () {
                        return Highcharts.numberFormat(this.value,1);
                    }
                  },
                  "opposite": true
                },
                {
                  "title": {
                    "text": "",
                    "style": {
                      "color": data.yAxis[1].title.style.color
                    }
                  },
                  "labels": {
                    "style": {
                      "color": data.yAxis[1].labels.style.color
                    },
                    formatter: function () {
                        return Highcharts.numberFormat(this.value,1);
                    }
                  },
                  "opposite": false
                }],
                tooltip: data.tooltip,
                legend: data.legend,
                plotOptions: data.plotOptions,
                series: data.series,
                exporting: data.exporting,
                credits: data.credits
            };
            return result;
        }

        vm.getGroupedLineGraphWithDecimal = function(data){
            var result = {
                chart: data.chart,
                title: data.title,
                colors: data.colors,
                xAxis: data.xAxis,
                pane: data.pane,
                yAxis: [{
                  "title": {
                    "text": ""
                  },
                  "labels": {
                    formatter: function () {
                        return Highcharts.numberFormat(this.value,2);
                    }
                  }
                }],
                plotOptions: data.plotOptions,
                tooltip: data.tooltip,
                legend: data.legend,
                series: data.series,
                exporting: data.exporting,
                credits: data.credits
            };
            return result;
        }

        vm.getGroupedStackedColumnGraphWithDecimal = function(data){
            var result = {
                chart: data.chart,
                title: data.title,
                colors: data.colors,
                xAxis: data.xAxis,
                pane: data.pane,
                yAxis: [{
                  "title": {
                    "text": ""
                  },
                  "labels": {
                    formatter: function () {
                        return Highcharts.numberFormat(this.value,2);
                    }
                  }
                }],
                tooltip: data.tooltip,
                legend: data.legend,
                plotOptions: data.plotOptions,
                series: data.series,
                exporting: data.exporting,
                credits: data.credits
            };
            return result;
        }
        function getToolTip(){
            var tooltip = {
                borderWidth: 0,
                backgroundColor: "none",
                shadow: false,
                style: {
                    fontSize: "13px"
                },
                positioner: function (labelWidth, labelHeight) {
                    return {
                        x: this.chart.yAxis[0].center[0] - labelWidth / 4,
                        y: this.chart.yAxis[0].center[1] - labelHeight / 3
                    };
                },
                formatter: function(){
                    if(this.y >= 100){
                        return '<span style="font-size:1.25em; color: #FF0000; font-weight: normal">'+this.y+'%</span><br>'+this.series.name;
                    }else{
                        return '<span style="font-size:1.25em; color: #008000; font-weight: normal">'+this.y+'%</span><br>'+this.series.name;
                    }
                }
            };

            return tooltip;
        }

        vm.getNormalToolTip = function(tooltipSuffix,concat){
            var suffix = !(tooltipSuffix) ? "" : tooltipSuffix;
            var value;
            var tooltip = {
                borderWidth: 0,
                backgroundColor: "none",
                shadow: false,
                style: {
                    fontSize: "13px"
                },
                positioner: function (labelWidth, labelHeight) {
                    var center_position = (this.chart.series[0].dataMax < 100) ? 4 : 3;
                    return {
                        x: this.chart.yAxis[0].center[0] - labelWidth / center_position,
                        y: this.chart.yAxis[0].center[1] - labelHeight / 3
                    };
                },
                formatter: function(){
                    //console.log(e.chart.yAxis[0].max);
                    if(concat == true)
                        return '<span style="font-size:1.50em; color: #09486B; font-weight: bold">'+this.y+suffix+'</span>';
                    else
                        return '<span style="font-size:1.50em; color: #09486B; font-weight: bold">'+this.y+'</span><br><span style="font-size:1em; color: #000000; font-weight: normal">'+suffix+'</span>';
                }
            };

            return tooltip;
        }
        // groupedBarChart
        
        vm.groupedBarChart = function(data){

            var result= {
            chart: {
                type: 'column'
            },
        
            title: {
                text: 'Main Engine vs Total Consumption Savings'
            },
        
            xAxis: {
                categories: ['2017', '2016', '2015', '2014', '2013']
            },
        
            yAxis: {
                allowDecimals: false,
                min: 0,
                title: {
                    text: 'Main Engine'
                }
            },
        
            tooltip: {
                formatter: function () {
                    return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y + '<br/>' +
                        'Total: ' + this.point.stackTotal;
                }
            },
        
            plotOptions: {
                column: {
                    stacking: 'normal'
                }
            },
        
            series: [{
                name: '',
                data: [5, 3, 4, 7, 2],
                stack: 'male'
            }, {
                name: '',
                data: [3, 4, 4, 2, 5],
                stack: 'male'
            }, {
                name: '',
                data: [2, 5, 6, 2, 1],
                stack: 'female'
            }, {
                name: '',
                data: [3, 0, 4, 4, 3],
                stack: 'female'
            }]
        }

            return result;
        }

        //line graph

        vm.vesselLineGraph = function(data){

            var result= {
            
            title: {
                text: 'Main Engine RPM vs Pitch Propeller'
            },
        
        
            // subtitle: {
            //     text: 'Source: thesolarfoundation.com'
            // },
        
            yAxis: {
                title: {
                    text: 'Avg. Slip'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
        
            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    pointStart: 2010
                }
            },
        
            series: [{
                name: 'Installation',
                data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
            }, {
                name: 'Manufacturing',
                data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
            }, {
                name: 'Sales & Distribution',
                data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
            }, {
                name: 'Project Development',
                data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
            }, {
                name: 'Other',
                data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
            }],
        
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        }
            
            return result;
        }
        

        vm.groupedColumnChart = function(data){
            var result = {
                    chart: data.chart,
                    title: data.title,
                    colors: data.colors,
                    pane: data.pane,
                    xAxis: data.xAxis,
                    yAxis: data.yAxis,
                    tooltip: getGroupedColumnToolTip(),
                    legend: data.legend,
                    plotOptions: data.plotOptions,
                    series: data.series,
                    exporting: data.exporting,
                    credits: data.credits
                };
            return result;
        }

        vm.sankeyChart = function(data){
            sankeySettings();
            var result = {

                title: {
                    text: ''
                },

                series: [{
                    keys: ['from', 'to', 'weight'],
                    data: data,
                    type: 'sankey',
                    name: 'Sankey demo series'
                }],
                exporting: false,
                credits: false
            };

            return result;
        }

        function sankeySettings(){
            (function (H) {

        /**
         * @todo
         * - Handle options for nodes. This can be added as special point items that
         *   have a flag, isNode, or type: 'node'. It would allow setting specific
         *   color, className etc. Then these options must be linked by id and used
         *   when generating the node items.
         * - Dynamics (Point.update, setData, addPoint etc).
         * - From and to can be null when links enter or exit the diagram.
         * - Separate data label and tooltip point formatters for nodes vs links? A
         *   possible pattern would be to add a point.type, and automate the
         *   implementation of formatters through the type, for example nodeFormat
         *   or tooltip.linkFormat. This could be reused for other series types,
         *   even generic like point.format = 'null' => tooltip.nullFormat.
         */

        var defined = H.defined,
            each = H.each;


        H.seriesType('sankey', 'column', {
            colorByPoint: true,
            dataLabels: {
                enabled: true,
                backgroundColor: 'none', // enable padding
                crop: false,
                formatter: function () {
                    return this.point.isNode && this.point.id;
                    // Include data labels for the links like this:
                    // return this.point.isNode ? this.point.id : this.point.weight;
                },
                inside: true
            },
            linkOpacity: 0.5,
            nodeWidth: 20,
            nodePadding: 10,
            showInLegend: false,
            states: {
                hover: {
                    linkOpacity: 1
                }
            },
            tooltip: {
                followPointer: true,
                headerFormat:
                    '<span style="font-size: 0.85em">{series.name}</span><br/>',
                pointFormatter: function () {
                    if (this.isNode) {
                        return this.id + ': ' + this.sum();
                    }
                    return this.from + ' \u2192 ' + this.to +
                        ': <b>' + this.weight + '</b>';
                }
            }

        }, {
            isCartesian: false,
            forceDL: true,
            /**
             * Create a single node that holds information on incoming and outgoing
             * links.
             */
            createNode: function (id) {
                var node = H.find(this.nodes, function (node) {
                    return node.id === id;
                });

                if (!node) {
                    node = (new H.Point()).init(this, { isNode: true, id: id });
                    node.linksTo = [];
                    node.linksFrom = [];
                    /**
                     * Return the largest sum of either the incoming or outgoing links.
                     */
                    node.sum = function () {
                        var sumTo = 0,
                            sumFrom = 0;
                        each(node.linksTo, function (link) {
                            sumTo += link.weight;
                        });
                        each(node.linksFrom, function (link) {
                            sumFrom += link.weight;
                        });
                        return Math.max(sumTo, sumFrom);
                    };
                    /**
                     * Get the offset in weight values of a point/link.
                     */
                    node.offset = function (point, coll) {
                        var offset = 0;
                        for (var i = 0; i < node[coll].length; i++) {
                            if (node[coll][i] === point) {
                                return offset;
                            }
                            offset += node[coll][i].weight;
                        }
                    };

                    this.nodes.push(node);
                }
                return node;
            },

            /**
             * Create a node column.
             */
            createNodeColumn: function () {
                var chart = this.chart,
                    column = [],
                    nodePadding = this.options.nodePadding;

                column.sum = function () {
                    var sum = 0;
                    each(this, function (node) {
                        sum += node.sum();
                    });
                    return sum;
                };
                /**
                 * Get the offset in pixels of a node inside the column.
                 */
                column.offset = function (node, factor) {
                    var offset = 0;
                    for (var i = 0; i < column.length; i++) {
                        if (column[i] === node) {
                            return offset;
                        }
                        offset += column[i].sum() * factor + nodePadding;
                    }
                };

                /**
                 * Get the column height in pixels.
                 */
                column.top = function (factor) {
                    var height = 0;
                    for (var i = 0; i < column.length; i++) {
                        if (i > 0) {
                            height += nodePadding;
                        }
                        height += column[i].sum() * factor;
                    }
                    return (chart.plotHeight - height) / 2;
                };

                return column;
            },

            /**
             * Create node columns by analyzing the nodes and the relations between
             * incoming and outgoing links.
             */
            createNodeColumns: function () {
                var columns = [];
                each(this.nodes, function (node) {
                    var fromColumn = 0,
                        i,
                        point;

                    // No links to this node, place it left
                    if (node.linksTo.length === 0) {
                        node.column = 0;

                    // There are incoming links, place it to the right of the
                    // highest order column that links to this one.
                    } else {
                        for (i = 0; i < node.linksTo.length; i++) {
                            point = node.linksTo[0];
                            if (point.fromNode.column > fromColumn) {
                                fromColumn = point.fromNode.column;
                            }
                        }
                        node.column = fromColumn + 1;
                    }

                    if (!columns[node.column]) {
                        columns[node.column] = this.createNodeColumn();
                    }

                    columns[node.column].push(node);

                }, this);
                return columns;
            },

            /**
             * Return the presentational attributes.
             */
            pointAttribs: function (point, state) {

                var opacity = this.options.linkOpacity;

                if (state) {
                    opacity = this.options.states[state].linkOpacity || opacity;
                }

                return {
                    fill: point.isNode ?
                        point.color :
                        H.color(point.color).setOpacity(opacity).get()
                };
            },

            /**
             * Extend generatePoints by adding the nodes, which are Point objects
             * but pushed to the this.nodes array.
             */
            generatePoints: function () {

                var nodeLookup = {};

                H.Series.prototype.generatePoints.call(this);

                if (!this.nodes) {
                    this.nodes = []; // List of Point-like node items
                }
                this.colorCounter = 0;

                // Reset links from previous run
                each(this.nodes, function (node) {
                    node.linksFrom.length = 0;
                    node.linksTo.length = 0;
                });

                // Create the node list
                each(this.points, function (point) {
                    if (defined(point.from)) {
                        if (!nodeLookup[point.from]) {
                            nodeLookup[point.from] = this.createNode(point.from);
                        }
                        nodeLookup[point.from].linksFrom.push(point);
                        point.fromNode = nodeLookup[point.from];
                    }
                    if (defined(point.to)) {
                        if (!nodeLookup[point.to]) {
                            nodeLookup[point.to] = this.createNode(point.to);
                        }
                        nodeLookup[point.to].linksTo.push(point);
                        point.toNode = nodeLookup[point.to];
                    }

                }, this);
            },

            /**
             * Run pre-translation by generating the nodeColumns.
             */
            translate: function () {
                this.generatePoints();

                this.nodeColumns = this.createNodeColumns();

                var chart = this.chart,
                    options = this.options,
                    left = 0,
                    nodeWidth = options.nodeWidth,
                    nodeColumns = this.nodeColumns,
                    colDistance = (chart.plotWidth - nodeWidth) /
                        (nodeColumns.length - 1),
                    curvy = colDistance / 3,
                    factor = Infinity;

                // Find out how much space is needed. Base it on the translation
                // factor of the most spaceous column.
                each(this.nodeColumns, function (column) {
                    var height = chart.plotHeight -
                        (column.length - 1) * options.nodePadding;

                    factor = Math.min(factor, height / column.sum());
                });

                each(this.nodeColumns, function (column) {
                    each(column, function (node) {
                        var height = node.sum() * factor,
                            fromNodeTop = column.top(factor) +
                                column.offset(node, factor);

                        // Draw the node
                        node.shapeType = 'rect';
                        node.shapeArgs = {
                            x: left,
                            y: fromNodeTop,
                            width: nodeWidth,
                            height: height
                        };
                        // Pass test in drawPoints
                        node.y = node.plotY = 1;

                        // Draw the links from this node
                        each(node.linksFrom, function (point) {
                            var linkHeight = point.weight * factor,
                                fromLinkTop = node.offset(point, 'linksFrom') *
                                    factor,
                                fromY = fromNodeTop + fromLinkTop,
                                toNode = point.toNode,
                                toColTop = nodeColumns[toNode.column].top(factor),
                                toY = toColTop + toNode.offset(point, 'linksTo') *
                                    factor + nodeColumns[toNode.column].offset(
                                        toNode,
                                        factor
                                    ),
                                right = toNode.column * colDistance;

                            point.shapeType = 'path';
                            point.shapeArgs = {
                                d: [
                                    'M', left + nodeWidth, fromY,
                                    'C', left + nodeWidth + curvy, fromY,
                                    right - curvy, toY,
                                    right, toY,
                                    'L', right, toY + linkHeight,
                                    'C', right - curvy, toY + linkHeight,
                                    left + nodeWidth + curvy, fromY + linkHeight,
                                    left + nodeWidth, fromY + linkHeight,
                                    'z'
                                ]
                            };

                            // Place data labels in the middle
                            point.dlBox = {
                                x: left + (right - left + nodeWidth) / 2,
                                y: fromY + (toY - fromY) / 2,
                                height: linkHeight,
                                width: 0
                            };
                            // Pass test in drawPoints
                            point.y = point.plotY = 1;

                            if (!point.color) {
                                point.color = node.color;
                            }
                        });
                    });
                    left += colDistance;

                }, this);
            },
            /**
             * Extend the render function to also render this.nodes together with
             * the points.
             */
            render: function () {
                var points = this.points;
                this.points = this.points.concat(this.nodes);
                H.seriesTypes.column.prototype.render.call(this);
                this.points = points;
            },
            animate: H.Series.prototype.animate
        });
    }(Highcharts));
        }

        function getGroupedColumnToolTip(){
            var tooltip = {
                formatter: function () {
                    return 'Port : <b>' + this.series.userOptions.stack + '</b><br/> Vessel Name : <b>' 
                    + this.series.name + '</b>';
                }
            };

            return tooltip;
        }
        

        vm.customLineChart = function(data){
            var result = {
                    chart: data.chart,
                    title: data.title,
                    colors: data.colors,
                    xAxis: data.xAxis,
                    yAxis: data.yAxis,
                    tooltip: getMultipleToolTipValuesForLineChart(),
                    legend: data.legend,
                    series: data.series,
                    exporting: data.exporting,
                    credits: data.credits
                };
            return result;
        }

        vm.customScatterWithRegressionLineChart = function(data){
            data.tooltip = getMultipleToolTipValues();
            return data;
        }

        function getMultipleToolTipValuesForLineChart(){

            var tooltip = {
                formatter: function () {
                    var s1 = (typeof this.series.chart.series[0].processedYData[this.point.index] != 'undefined') ? this.series.chart.series[0].processedYData[this.point.index] : '0.0';
                    var s2 = (typeof this.series.chart.series[this.series.index].processedYData[this.point.index] != 'undefined') ? this.series.chart.series[this.series.index].processedYData[this.point.index] : '0.0';
                        return '<b>Date : '+this.x +'</b><br /><b>' + this.series.chart.series[0].name + ' :' + s1 + '</b><br /><b>' + this.series.name + ' :' + s2 + '<b>';
                }
            };

            return tooltip;
        }
        vm.getFleetPerformanceGraphsWithTooltip =function(data)
        {
            data.tooltip = getFleetPerformanceTooltip(data);
            return data;
        }

        function getFleetPerformanceTooltip(data)
        {
            var tooltip = {
                shared: false,
                formatter: function () {
                    var serie = this.series;
                    //NOTE: may cause efficiency issue when we got lots of points, data in series
                    //should be change from [x, y] to {"x": x, "y": y, "index": index}
                    var index = this.series.data.indexOf(this.point);
                    var s = '<b>' + this.x + '</b><br>';
                    s += '<span style="color:' + serie.color + '">' + serie.options.name + '</span>: <b>' + this.y + '</b><br/>';
                    $.each(serie.options.composition, function (name, value) {
                        s += '<b>' + name + ':</b> ' + value[index] + '<br>';
                    });
                    return s;
                }
            }

            return tooltip;
        }

         vm.getGraphsWithTooltip =function(data, xaxis_label)
        {
            data.tooltip = getDataWithTooltip(data, xaxis_label);
            return data;
        }

        function getDataWithTooltip(data, xaxis_label)
        {
            var tooltip = {
                shared: false,
                formatter: function () {
                    var serie = this.series;
                    //NOTE: may cause efficiency issue when we got lots of points, data in series
                    //should be change from [x, y] to {"x": x, "y": y, "index": index}
                    var index = this.series.data.indexOf(this.point);
                    var s = '<b>' + xaxis_label +':'+ this.x + '</b><br>';
                    s += '<span style="color:' + serie.color + '">' + serie.options.name + '</span>: <b>' + this.y + '</b><br/>';
                    $.each(serie.options.composition, function (name, value) {
                        s += '<b>' + name + ':</b> ' + value[index] + '<br>';
                    });
                    return s;
                }
            }

            return tooltip;
        }


        function getMultipleToolTipValues(){
            var tooltip = {
                formatter: function () {
                    return 'Speed: <b>' + this.key +'</b><br/>'+ this.series.name +': <b>' + Highcharts.numberFormat(this.y, 2)+'</b>';
                }
            };

            return tooltip;
        }


        /* Graph Ends */ 

        /* Table Starts */
        vm.categories = function(data) {
            var row_first = [];
            var row_second = [];
            var colspan = [];
            var categories = [];
            var counter = 0;
            
            $.each(data, function (outer_index, outer_value) {
                row_first.push({
                    year : outer_value.year, 
                    colspan : outer_value.month.length
                });
            
                $.each(outer_value.month, function (inner_index, inner_value) {
                    row_second.push(inner_value);
                });
            });
            
            categories['row_first'] = row_first;
            categories['row_second'] = row_second;
            categories['colspan'] = colspan;
            
            return categories;
        }

        vm.series = function(data) {
            var series_obj = [];
            var series_data_obj = [];
            var attribute_name = [];
            var series = [];
            $(data).each(function( outer_index ) {
                var series_name_obj = [];
                attribute_name.push(this.name);
                $(this.data).each(function( inner_index, inner_value ) {
                    series_data_obj[inner_index] = ($.isNumeric( inner_value )) ? (inner_value + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") : inner_value;
                });
                series_obj[outer_index] = series_name_obj.concat(series_data_obj);
            });

            series['attribute_name'] = attribute_name;
            series['series'] = series_obj;
            return series;
        }

        vm.seriesComaLess = function(data) {
            var series_obj = [];
            var series_data_obj = [];
            var attribute_name = [];
            var series = [];
            $(data).each(function( outer_index ) {
                var series_name_obj = [];
                attribute_name.push(this.name);
                $(this.data).each(function( inner_index, inner_value ) {
                    series_data_obj[inner_index] = inner_value;
                });
                series_obj[outer_index] = series_name_obj.concat(series_data_obj);
            });

            series['attribute_name'] = attribute_name;
            series['series'] = series_obj;
            return series;
        }

        vm.toggleTableData = function(data,clone,currency,defaultCurrency,flag){
            var series_obj = [];
            if(currency != defaultCurrency && flag == true){
                series_obj = clone;
            } else{
                $(data).each(function( outer_index,outer_value ) {
                    var series_data_obj = [];
                    $(outer_value).each(function( inner_index, inner_value ) {
                        var new_value = 0;
                        if(currency == 'SAR')
                            new_value = Math.round(parseInt(inner_value.replace(',','')) / 3.75);
                        else if(currency == 'USD')
                            new_value = Math.round(parseInt(inner_value.replace(',','')) * 3.75);
                        
                        series_data_obj[inner_index] = ($.isNumeric( new_value )) ? (new_value + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") : new_value;
                    });
                    series_obj[outer_index] = series_data_obj;
                });
            }

            return series_obj;
        }

        vm.showToast = function(message,type){
            return $mdToast.show({
                template: '<md-toast class="md-toast. ' + type +'">' + message + '</md-toast>',
                hideDelay: 3000,
                position: 'top right'
            });
        }

        vm.isModuleAssigned = function(modules){
          var flag = false;
          $.each(modules,function(outer_index,outer_value){
            $.each(outer_value,function(inner_index,module){
                if(module.is_checked == true){
                   flag = true;
                   return false;
                }
            });
            if(flag == true)
                return false;
          });

          if(flag == true)
            return true;
          else
            return false;
        }

        vm.isGroupAssigned = function(groups){
            if(groups.length == 0)
                return false;
            else
                return true;
        }

        vm.formatModule = function(modules){
            var formatted_modules = {};

            $.each(modules,function(outer_index,outer_value){
                var parent_module = [];
                var key;
                
                $.each(outer_value,function(inner_index,inner_value){
                    if(inner_value.is_parent == true){
                      key = inner_value.module_name;
                    } else if(inner_value.is_parent == false){
                      parent_module.push(inner_value);
                    }
                });
                formatted_modules[key] = parent_module;
            });
          
            return formatted_modules;
        }

        /* Export Graph */
        vm.exportGraph = function(id,title,type){
            var fileType = (type == 'pdf') ? 'application/pdf' : 'image/jpeg';
            var chart = $('#'+id).highcharts();
            chart.options.title.text = title;
            chart.exportChart({
                type: fileType,
                filename: title.replace(/\s/g,'-')
            });
        }

        vm.formatRowSpanData = function(series){
            var final_data = [];
            var data = [];
            var i = 0;
            angular.forEach(series, function(value, key){
                data.push({value:  value['name'], rowspan:  value['data'].length});
                angular.forEach(value['data'], function(data_value, key){
                        angular.forEach(data_value, function(res_value, key){
                            if(angular.isString(res_value)){
                                var res = (res_value).replace(/\n/g, '<br />');
                                data.push({value: res, rowspan:  1});
                            }else{
                                data.push({value: res_value, rowspan:  1});
                            }
                        });
                    final_data.push(data);
                    data = [];
                });
            });
            return final_data;
        }

        vm.formatSingleRowData = function(series){
            var final_data = [];
            var data = [];
            var i = 0;
            angular.forEach(series, function(value, key){
                data.push({value:  value['name']});
                angular.forEach(value['data'], function(data_value, key){
                    if(angular.isString(data_value)){
                        var res = (data_value).replace(/\n/g, '<br />');
                        data.push({value: res});
                    }else{
                        data.push({value: data_value});
                    }
                });
                final_data.push(data);
                data = [];
            });
            return final_data;
        }

        /* Export Table */
        vm.getTableHtml = function(name,currency,row_first,row_second,attributes,series,duration,million){
            var html = "";
                html += "<table>";
                    html += "<thead>";
                        html += "<tr>";
                            var total_colspan = 1;
                            $.each(row_first,function(index,value){
                                total_colspan += value.colspan;
                            });
                            html += "<th rowspan='2' colspan='"+ total_colspan +"'>"+ name +"<th>";
                        html += "</tr>";
                        html += "<tr>";
                            html += "<th colspan='"+ total_colspan +"'>&nbsp;<th>";
                        html += "</tr>";

                        if(duration != 'year'){
                            /* Row First */
                            html += "<tr>";
                                html += "<th rowspan='2'>"+currency+ ' ' +million+"</th>";
                                $.each(row_first,function(first_index,first_value){
                                    html += "<th colspan='"+ first_value.colspan +"'>"+ first_value.year +"</th>";
                                });
                            html += "</tr>";

                            /* Row Second */
                            html += "<tr>";
                                $.each(row_second,function(second_index,second_value){
                                    html += "<th>"+ second_value +"</th>";
                                });
                            html += "</tr>";
                        } else {
                             /* Row First */
                            html += "<tr>";
                                html += "<th rowspan='2'>"+currency+ ' ' +million+"</th>";
                                $.each(row_first,function(first_index,first_value){
                                    html += "<th rowspan='2' colspan='"+ first_value.colspan +"'>"+ first_value.year +"</th>";
                                });
                            html += "</tr>";

                            /* Row Second */
                            html += "<tr>";
                                $.each(row_second,function(second_index,second_value){
                                    html += "<th>&nbsp;</th>";
                                });
                            html += "</tr>";
                        }
                    html += "</thead>";

                    html += "<tbody>";
                        /* Attributes + Data */

                        $.each(series,function(outer_index,outer_value){
                            html += "<tr>";
                            html += "<th align='left'>"+ attributes[outer_index] +"</th>";
                            $.each(outer_value,function(inner_index,inner_value){
                                html += "<td>"+ inner_value +"</td>";
                            });
                            html += "</tr>";
                        });
                    html += "</tbody>";
                html += "</table>";
            return html;
        }

        vm.getPercentageTableHtml = function(name,currency,row_first,row_second,attributes,series,duration){
            var html = "";
                html += "<table>";
                    html += "<thead>";
                        html += "<tr>";
                            var total_colspan = 1;
                            $.each(row_first,function(index,value){
                                total_colspan += value.colspan;
                            });
                            html += "<th rowspan='2' colspan='"+ total_colspan +"'>"+ name +"<th>";
                        html += "</tr>";
                        html += "<tr>";
                            html += "<th colspan='"+ total_colspan +"'>&nbsp;<th>";
                        html += "</tr>";

                        if(duration != 'year'){
                            /* Row First */
                            html += "<tr>";
                                html += "<th rowspan='2'>"+currency+"</th>";
                                $.each(row_first,function(first_index,first_value){
                                    html += "<th colspan='"+ first_value.colspan +"'>"+ first_value.year +"</th>";
                                });
                            html += "</tr>";

                            /* Row Second */
                            html += "<tr>";
                                $.each(row_second,function(second_index,second_value){
                                    html += "<th>"+ second_value +"</th>";
                                });
                            html += "</tr>";
                        } else {
                             /* Row First */
                            html += "<tr>";
                                html += "<th rowspan='2'>"+currency+"</th>";
                                $.each(row_first,function(first_index,first_value){
                                    html += "<th rowspan='2' colspan='"+ first_value.colspan +"'>"+ first_value.year +"</th>";
                                });
                            html += "</tr>";

                            /* Row Second */
                            html += "<tr>";
                                $.each(row_second,function(second_index,second_value){
                                    html += "<th>&nbsp;</th>";
                                });
                            html += "</tr>";
                        }
                    html += "</thead>";

                    html += "<tbody>";
                        /* Attributes + Data */

                        $.each(series,function(outer_index,outer_value){
                            html += "<tr>";
                            html += "<th align='left'>"+ attributes[outer_index] +"</th>";
                            $.each(outer_value,function(inner_index,inner_value){
                                html += "<td>"+ inner_value +"%</td>";
                            });
                            html += "</tr>";
                        });
                    html += "</tbody>";
                html += "</table>";
            return html;
        }

        vm.getTableHtmlNoHeader = function(name,attributes,series){
            var total_colspan = 1;
            $.each(series,function(outer_index,outer_value){
                $.each(outer_value,function(inner_index,inner_value){
                    total_colspan += 1;
                });
                return false;
            });

            var html = "";
                html += "<table>";
                    html += "<thead>";
                        html += "<tr>";
                            html += "<th rowspan='2' colspan='"+  total_colspan +"'>"+ name +"</th>";
                        html += "</tr>";
                        html += "<tr>";
                            html += "<th colspan='"+  total_colspan +"'>&nbsp;</th>";
                        html += "</tr>";
                    html += "</thead>";
                    html += "</tbody>";
                        /* Attributes + Data */
                        $.each(series,function(outer_index,outer_value){
                            html += "<tr>";
                            html += "<th align='left'>"+ attributes[outer_index] +"</th>";
                            $.each(outer_value,function(inner_index,inner_value){
                                html += "<td>"+ inner_value +"</td>";
                            });
                            html += "</tr>";
                        });
                    html += "</tbody>";
                html += "</table>";
            return html;
        }

        vm.getTableHtmlNormalTable = function(name,currency,row_first,attributes,series,million){
            var total_colspan = 1;
            $.each(series,function(outer_index,outer_value){
                $.each(outer_value,function(inner_index,inner_value){
                    total_colspan += 1;
                });
                return false;
            });

            var html = "";
                html += "<table>";
                    html += "<thead>";
                        html += "<tr>";
                            html += "<th rowspan='2' colspan='"+  total_colspan +"'>"+ name +"</th>";
                        html += "</tr>";
                        html += "<tr>";
                            html += "<th colspan='"+  total_colspan +"'>&nbsp;</th>";
                        html += "</tr>";

                        html += "<tr>";
                            html += "<th rowspan='2'>"+currency+ ' ' +million+"</th>";                        
                            $.each(row_first,function(first_index,first_value){
                                html += "<th rowspan='2'>"+ first_value +"</th>";
                            });
                        html += "</tr>";
                        html += "<tr>";
                            $.each(row_first,function(second_index,second_value){
                                html += "<th>&nbsp;</th>";
                            });
                        html += "</tr>";
                    html += "</thead>";
                    html += "</tbody>";
                        /* Attributes + Data */
                        $.each(series,function(outer_index,outer_value){
                            html += "<tr>";
                            html += "<th align='left'>"+ attributes[outer_index] +"</th>";
                            $.each(outer_value,function(inner_index,inner_value){
                                html += "<td>"+ inner_value +"</td>";
                            });
                            html += "</tr>";
                        });
                    html += "</tbody>";
                html += "</table>";
            return html;
        } 

        vm.getColumnTableHtml = function(name,row_first,series){
            var total_colspan = 0;
            $.each(series,function(outer_index,outer_value){
                $.each(outer_value,function(inner_index,inner_value){
                    total_colspan += 1;
                });
                return false;
            });

            var html = "";
                html += "<table>";
                    html += "<thead>";
                        html += "<tr>";
                            html += "<th rowspan='2' colspan='"+  total_colspan +"'>"+ name +"</th>";
                        html += "</tr>";
                        html += "<tr>";
                            html += "<th colspan='"+  total_colspan +"'>&nbsp;</th>";
                        html += "</tr>";

                        html += "<tr>";
                            $.each(row_first,function(first_index,first_value){
                                html += "<th rowspan='2'>"+ first_value +"</th>";
                            });
                        html += "</tr>";
                        html += "<tr>";
                            $.each(row_first,function(second_index,second_value){
                                html += "<th>&nbsp;</th>";
                            });
                        html += "</tr>";
                    html += "</thead>";
                    html += "</tbody>";
                        /* Attributes + Data */
                        $.each(series,function(outer_index,outer_value){
                            html += "<tr>";
                            $.each(outer_value,function(inner_index,inner_value){
                                if(inner_value == null)
                                    html += "<td>&nbsp;</td>";
                                else
                                    html += "<td>"+ inner_value +"</td>";
                            });
                            html += "</tr>";
                        });
                    html += "</tbody>";
                html += "</table>";
            return html;
        }

        var uri='data:application/vnd.ms-excel;base64,',template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
        vm.tableToExcel = function(tableId,worksheetName){

            //var table=$(tableId),
            var table = tableId,
                ctx={worksheet:worksheetName,table:table},
                href=uri+base64(format(template,ctx));
            return href;
        }

        vm.downloadExcel = function(exportHref,file){
            $timeout(function(){
                var link = document.createElement("a");
                link.download = file;
                link.href = exportHref;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },100); // trigger download
        }
        vm.getDiffrentRowspanTableHtml = function(name, header, series){
            var total_colspan = 1;
            $.each(series,function(outer_index,outer_value){
                $.each(outer_value,function(inner_index,inner_value){
                    total_colspan += 1;
                });
                return false;
            });

            var html = "";
                html += "<table>";
                    html += "<thead>";
                        html += "<tr>";
                            html += "<th rowspan='2' colspan='"+  total_colspan +"'>"+ name +"</th>";
                        html += "</tr>";
                        html += "<tr>";
                            html += "<th colspan='"+  total_colspan +"'>&nbsp;</th>";
                        html += "</tr>";
                        html += "<tr>";
                        $.each(header,function(outer_index,outer_value){
                            html += "<th>&nbsp;"+outer_value+"</th>";
                        });
                        html += "</tr>";
                    html += "</thead>";
                    html += "<tbody>";
                    var index;
                    $.each(series,function(series_index,series_value){
                        html += "<tr>";
                        $.each(series_value,function(data_index,data_value){
                            if(data_value.loop){
                                html += "<td>";
                                $.each(data_value.value,function(des_index,des_value){
                                    index = des_index + 1;
                                    html += ""+ index +".&nbsp;"+des_value+" </br>";
                                });
                                html += "</td>";
                                
                            }else{
                                html += "<td rowspan='"+ data_value.rowspan +"'>&nbsp;"+data_value.value+"</td>";
                            }
                        });
                        html += "</tr>";
                    });
                    html += "</tbody>";
                html += "</table>";
            return html;
        }

        return vm;
    }
}());