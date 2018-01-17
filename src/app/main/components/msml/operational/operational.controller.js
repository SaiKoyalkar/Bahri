(function ()
{
    'use strict';

    angular
        .module('app.components.msml.operational')
        .controller('OperationalController', OperationalController);

    function OperationalController(fuseTheming,$mdSidenav,$timeout,$http,$scope,$location,$filter,commonUtils,apisUtils,usersApi)
    {

        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;

        vm.durations = commonUtils.durations();
        vm.exportGraphOptions = commonUtils.exportOptions();
        vm.currentDuration = {"month" : "Month"};
        vm.currentExportOption = {"": "Export As"};
        vm.dataGraphView = true;
        vm.toggleSidenav = toggleSidenav;
        vm.marpol_violations = 0;
        vm.pms_reliability = 0;
        vm.sqr_blocks = [];
        vm.date = new Date();
        vm.currentUrl = $location.absUrl();
        vm.username = usersApi.getCookieUserFullName();
        vm.graphInfo = {};
        vm.tableInfo = {};
        vm.cur_year = new Date().getFullYear()
        vm.quarter_data = ["All", "1", "2", "3", "4"];
        vm.selectedquarter = vm.quarter_data[0];
        var btnGraph = angular.element( document.querySelector( '#btn-graph' ) );
        var btnTable = angular.element( document.querySelector( '#btn-table' ) );

        $(window).resize(function(){
           reInitializeGraphs();
        });

        var element = angular.element( document.querySelector( '.fold-toggle' ) );
        element.on('click', function(e){       
            reInitializeGraphs();
        });

         function DrawCalendar(){
            var cal_data = [];
            var month;
            var days = [];
            var week_day;
            var month_days = [];
            var day_counter;
            var week_days = [];
            var week_rows = [];
            var k = 1;
            var dys = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            $.each(dys, function(i, ele){
                month = ele;
                days = new Date(vm.year, i+1, 0).getDate();
                week_day = new Date(vm.year+"-"+(i+1)+"-"+1).getDay();
                day_counter = 1;
                week_rows = [];
                k = 1;
                for(i=0;i<35;i++){
                    if(i<week_day || i-week_day>=days){
                        if(i == 0){
                            if(week_day == 6 && days == 30)
                            {
                                week_days.push({'backgroundColor':'FFF', 'day':'30', 'color': '#09486b'});
                            }
                            else if(week_day == 5 && days == 31)
                            {
                                week_days.push({'backgroundColor':'FFF', 'day':'31', 'color': '#09486b'});
                            }else if(week_day == 6 && days == 31)
                            {
                                week_days.push({'backgroundColor':'FFF', 'day':'30', 'color': '#09486b'});
                            }
                            else{
                                week_days.push({'backgroundColor':'#CCC', 'day':'', 'color': '#09486b'});
                            }
                        }else if(i == 1){
                            if(week_day == 6 && days == 31)
                            {
                                week_days.push({'backgroundColor':'#FFF', 'day':'31', 'color': '#09486b'});
                            }
                            else{
                                week_days.push({'backgroundColor':'#CCC', 'day':'', 'color': '#09486b'});
                            }
                        }
                        else{
                            week_days.push({'backgroundColor':'#CCC', 'day':'','color': '#09486b'});
                        }
                    }else{
                        week_days.push({'backgroundColor':'FFF', 'day': day_counter++,'color': '#09486b'});
                    }

                    if(k%7 == 0)
                    {
                        week_rows.push(week_days);
                        week_days = [];
                        
                    }

                    k++;
                }
                cal_data.push({'month': month, 'week_day':week_day, 'days' : days, 'month_rows':week_rows});
            });

            return cal_data;
        }

        function show_calendar_data(drydock_grpah_data){
            vm.cal_data = DrawCalendar();
            $.each(drydock_grpah_data, function(i, ele){
                var week_day = new Date(vm.year+"-"+(ele.Month)+"-"+1).getDay();
                var row_count = Math.floor((week_day+ele.Day-1)/7);
                var index = (week_day+ele.Day) - (7*row_count) -1;
                vm.cal_data[ele.Month-1]['month_rows'][row_count][index]['backgroundColor'] = '#f1701a';
                vm.cal_data[ele.Month-1]['month_rows'][row_count][index]['color'] = '#FFF';
                if(vm.cal_data[ele.Month-1]['month_rows'][row_count][index]['vessel_name'])
                    vm.cal_data[ele.Month-1]['month_rows'][row_count][index]['vessel_name'] = vm.cal_data[ele.Month-1]['month_rows'][row_count][index]['vessel_name']+", "+ele.VesselName;
                else
                    vm.cal_data[ele.Month-1]['month_rows'][row_count][index]['vessel_name'] = ele.VesselName;
            });
        }

        vm.getCalendarData = function(year){
            vm.year = year;
            var filter_dict = {};
            if(vm.selectedvessel == 'All')
                filter_dict = {Year: year};
            else
                filter_dict = {Year: vm.year, VesselName:vm.selectedvessel};
            var filtered = $filter('filter')(vm.graphInfo.drydock.graphInfo, filter_dict);
            show_calendar_data(filtered);
            if(vm.selectedquarter != 'All')
                vm.getQuarterlyData(vm.selectedquarter);
        }

        function setVesselNames(){
            var vessel_names = [];
            $.each(vm.graphInfo.drydock.graphInfo, function(i, ele){
                vessel_names.push(ele.VesselName);
            });
            return vessel_names;
        }

        vm.getQuarterlyData = function(quarter){
            if(vm.cal_data.length == 12)
                $scope.calendar_data = vm.cal_data;
            if(quarter == 'All')
                vm.cal_data = $scope.calendar_data;
            else
                vm.cal_data = $scope.calendar_data.slice((quarter-1)*3, (quarter-1)*3 + 3);
        }


        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }

        vm.logout = function (){
            var user_id = usersApi.getCookieUserID();
            usersApi.logout(user_id);
        }
        
        vm.changeDuration = function(){
            vm.increaseHeight = (vm.currentDuration == 'year') ? "height-92" : "";
            getServices(vm.currentDuration);
        }

        vm.exportData = function(id,title){
            if(vm.currentExportOption != ""){
                commonUtils.exportGraph(id,title,vm.currentExportOption);
                vm.currentExportOption = "";
            }
        }

        vm.setGraphView = function(e){
            commonUtils.activeBtn(btnGraph,btnTable);
            vm.dataGraphView = true;

            if(vm.changedDurationValue != vm.currentDuration) {
                reInitializeGraphs();
            }
        }

        vm.setTableView = function(){
            vm.changedDurationValue = vm.currentDuration;
            
            commonUtils.activeBtn(btnTable,btnGraph);
            vm.dataGraphView = false;
        }

        vm.exportTableData = function(type){
            var html = '';
            var file_name = '';

            if(type == 'sqr') {
                html = commonUtils.getTableHtml(
                    'Safety, Quality & Reliability',
                    'Count (No.Of)',
                    vm.sqr_row_first,
                    vm.sqr_row_second,
                    vm.sqr_attribute_name,
                    vm.sqr_series,
                    vm.currentDuration,
                    ''
                );
                file_name = 'sqr';

            } else if(type == 'technical_operation'){
                html = commonUtils.getTableHtml(
                    'Technical Operation',
                    'Days',
                    vm.tcop_row_first,
                    vm.tcop_row_second,
                    vm.tcop_attribute_name,
                    vm.tcop_series,
                    vm.currentDuration,
                    ''
                );
                file_name = 'technical_operation';
            } else if(type == 'drydock'){
                html = commonUtils.getDiffrentRowspanTableHtml(
                    'Dry Docking',
                    vm.drydock_categories,
                    vm.drydock_data
                );
                file_name = 'drydock';
            } else if(type == 'cspares_and_ecertificates'){
                html = commonUtils.getDiffrentRowspanTableHtml(
                    'Cspares and Expired Certificates',
                    vm.cspares_and_ecertificates_categories,
                    vm.cspares_and_ecertificates_data
                );
                file_name = 'cspares_and_ecertificates';
            } else if(type == 'incident_category'){
                html = commonUtils.getTableHtml(
                    'Incident Category Count Details',
                    'Event Sub Type',
                    vm.iadet_row_first,
                    vm.iadet_row_second,
                    vm.iadet_attribute_name,
                    vm.iadet_series,
                    vm.currentDuration,
                    ''
                );
                file_name = 'incident_category';
            } else if(type == 'accident_category'){
                html = commonUtils.getTableHtml(
                    'Incident Category Count Details',
                    'Event Sub Type',
                    vm.acccat_row_first,
                    vm.acccat_row_second,
                    vm.acccat_attribute_name,
                    vm.acccat_series,
                    vm.currentDuration,
                    ''
                );
                file_name = 'accident_category';
            } else if(type == 'accident_cause'){
                html = commonUtils.getTableHtml(
                    'Accident Cause Details',
                    'Event Sub Type',
                    vm.acccause_row_first,
                    vm.acccause_row_second,
                    vm.acccause_attribute_name,
                    vm.acccause_series,
                    vm.currentDuration,
                    ''
                );
                file_name = 'accident_cause';
            } else if(type == 'pmsdue'){
                html = commonUtils.getDiffrentRowspanTableHtml(
                    'YTD PMS Outstanding Jobs',
                    vm.pmsdue_categories,
                    vm.pmsdue_data
                );
                file_name = 'pms_outstanding_jobs';
            }

            var exportHref = commonUtils.tableToExcel(html,'sheet name');
            commonUtils.downloadExcel(exportHref,file_name+'.xls');
        }

        function operationalGraphs(graph){
            commonUtils.initializeSettings();

            if(graph && graph.sqr.graphInfo)
                Highcharts.chart('sqr-container', graph.sqr.graphInfo);
            if(graph && graph.technical_operation.graphInfo)
                Highcharts.chart('technical-operation-container', graph.technical_operation.graphInfo);
            if(graph && graph.single_value_graph)
                vm.sqr_blocks = graph.single_value_graph;
            if(graph && graph.cspares_and_ecertificates)
                Highcharts.chart('cspares-ecertificate-container', graph.cspares_and_ecertificates.graphInfo);
            if(graph && graph.incident_category_details)
                Highcharts.chart('incident-category-container', graph.incident_category_details.graphInfo);
            if(graph && graph.incident_category_details)
                Highcharts.chart('accident-category-container', graph.accident_category_details.graphInfo);
            if(graph && graph.accident_cause_details)
                Highcharts.chart('accident-cause-container', graph.accident_cause_details.graphInfo);
            if(graph && graph.ltif)
                Highcharts.chart('ltif-container', commonUtils.getGroupedLineGraphWithDecimal(graph.ltif.graphInfo));
            if(graph && graph.trcf)
                Highcharts.chart('trcf-container', commonUtils.getGroupedLineGraphWithDecimal(graph.trcf.graphInfo));
            if(graph && graph.avg_obs_per_insp)
                Highcharts.chart('obs-per-insp-container', graph.avg_obs_per_insp.graphInfo);
            if(graph && graph.avg_obs_per_siri)
                Highcharts.chart('obs-per-siriparent-container', commonUtils.getGroupedStackedColumnGraphWithDecimal(graph.avg_obs_per_siri.graphInfo));
            if(graph && graph.drydock){
               vm.getCalendarData(vm.cur_year);
               vm.vessel_names = setVesselNames();
               vm.vessel_names.splice(0, 0, 'All');
               vm.selectedvessel = vm.vessel_names[0];
            }
        }

        function operationalTables(table){
            if(table && table.sqr.tableInfo) {
                var sqr_header_duration = commonUtils.categories(table.sqr.tableInfo.categories);
                var sqr_series_data     = commonUtils.series(table.sqr.tableInfo.series);
                
                vm.sqr_row_first    = sqr_header_duration['row_first'];
                vm.sqr_row_second   = sqr_header_duration['row_second'];

                vm.sqr_attribute_name   = sqr_series_data['attribute_name'];
                vm.sqr_series           = sqr_series_data['series'];

            }
            if(table && table.technical_operation.tableInfo) {
                var tcop_header_duration = commonUtils.categories(table.technical_operation.tableInfo.categories);
                var tcop_series_data     = commonUtils.series(table.technical_operation.tableInfo.series);
                
                vm.tcop_row_first    = tcop_header_duration['row_first'];
                vm.tcop_row_second   = tcop_header_duration['row_second'];

                vm.tcop_attribute_name   = tcop_series_data['attribute_name'];
                vm.tcop_series           = tcop_series_data['series'];
            }
            if(table && table.drydock.tableInfo) {
                vm.drydock_data   = commonUtils.formatRowSpanData(table.drydock.tableInfo.series);
                vm.drydock_categories   = table.drydock.tableInfo.categories;
            }
            if(table && table.cspares_and_ecertificates.tableInfo) {
                vm.cspares_and_ecertificates_data   = commonUtils.formatRowSpanData(table.cspares_and_ecertificates.tableInfo.series);
                vm.cspares_and_ecertificates_categories   = table.cspares_and_ecertificates.tableInfo.categories;
            }
            if(table && table.incident_category_details.tableInfo) {
                var iadet_header_duration = commonUtils.categories(table.incident_category_details.tableInfo.categories);
                var iadet_series_data     = commonUtils.series(table.incident_category_details.tableInfo.series);
                
                vm.iadet_row_first    = iadet_header_duration['row_first'];
                vm.iadet_row_second   = iadet_header_duration['row_second'];

                vm.iadet_attribute_name   = iadet_series_data['attribute_name'];
                vm.iadet_series           = iadet_series_data['series'];
            }
            if(table && table.accident_category_details.tableInfo) {
                var acccat_header_duration = commonUtils.categories(table.accident_category_details.tableInfo.categories);
                var acccat_series_data     = commonUtils.series(table.accident_category_details.tableInfo.series);
                
                vm.acccat_row_first    = acccat_header_duration['row_first'];
                vm.acccat_row_second   = acccat_header_duration['row_second'];

                vm.acccat_attribute_name   = acccat_series_data['attribute_name'];
                vm.acccat_series           = acccat_series_data['series'];
            }
            if(table && table.accident_cause_details.tableInfo) {
                var acccause_header_duration = commonUtils.categories(table.accident_cause_details.tableInfo.categories);
                var acccause_series_data     = commonUtils.series(table.accident_cause_details.tableInfo.series);
                
                vm.acccause_row_first    = acccause_header_duration['row_first'];
                vm.acccause_row_second   = acccause_header_duration['row_second'];

                vm.acccause_attribute_name   = acccause_series_data['attribute_name'];
                vm.acccause_series           = acccause_series_data['series'];
            }
            if(table && table.pmsdue.tableInfo) {
                vm.pmsdue_data   = commonUtils.formatRowSpanData(table.pmsdue.tableInfo.series);
                vm.pmsdue_categories   = table.pmsdue.tableInfo.categories;
            }
        }

        function reInitializeGraphs(){
            $timeout(function () {
                operationalGraphs(vm.graphInfo);
            },500);
        }

        function getServices(currentDuration){
            vm.loadingProgress = true;
            apisUtils.getMidEastOperationalPerformance(currentDuration)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        vm.date = response.current_date_time;
                        vm.graphInfo = response.mideast_operational_performance;
                        $timeout(function () {
                            vm.loadingProgress = false;
                            operationalGraphs(vm.graphInfo);
                            operationalTables(vm.graphInfo);
                        },500);
                        reInitializeGraphs();
                    }
                }, function(error) {
            });      
        }
    }

})();