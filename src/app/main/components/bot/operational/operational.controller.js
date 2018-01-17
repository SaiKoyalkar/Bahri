(function ()
{
    'use strict';

    angular
        .module('app.components.bot.operational')
        .controller('BotOperationalController', BotOperationalController);

    function BotOperationalController(fuseTheming,$mdSidenav,$timeout,$http,$scope,$location,commonUtils,apisUtils,usersApi)
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
        vm.date = new Date();
        vm.currentUrl = $location.absUrl();
        vm.username = usersApi.getCookieUserFullName();
        vm.graphInfo = {};
        vm.tableInfo = {};
        
        $(window).resize(function(){
           reInitializeGraphs();
        });

        var element = angular.element( document.querySelector( '.fold-toggle' ) );
        element.on('click', function(e){       
            reInitializeGraphs();
        });

        var btnGraph = angular.element( document.querySelector( '#btn-graph' ) );
        var btnTable = angular.element( document.querySelector( '#btn-table' ) );


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

        vm.exportTableData = function(type){
            var html = '';
            var file_name = '';

            if(type == 'spot_fleet'){
                html = commonUtils.getTableHtml(
                    'Spot Fleet',
                    '',
                    vm.tcop_row_first,
                    vm.tcop_row_second,
                    vm.tcop_attribute_name,
                    vm.tcop_series,
                    vm.currentDuration,
                    ''
                );
                file_name = 'spot_fleet';
            }

            var exportHref = commonUtils.tableToExcel(html,'sheet name');
            commonUtils.downloadExcel(exportHref,file_name+'.xls');
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

        function operationalGraphs(graph){
            
            commonUtils.initializeSettings();

            if(graph && graph.operational_days && angular.element('#operational-days-container').length){
                Highcharts.chart('operational-days-container', graph.operational_days.graphInfo);
            }
            if(graph && graph.lifting_vs_utilisation && angular.element('#bbl-lifting-container').length){
                Highcharts.chart('bbl-lifting-container', commonUtils.multipleAxisChartWithDecimal(graph.lifting_vs_utilisation.graphInfo));
            }
            if(graph && graph.speed_fuel_consumption && angular.element('#fleet-speed-container').length){
                Highcharts.chart('fleet-speed-container', commonUtils.multipleAxisChartWithDecimal(graph.speed_fuel_consumption.graphInfo));
            }
        }

        function operationalTables(table){
            if(table) {
                var tcop_header_duration = commonUtils.categories(table.categories);
                var tcop_series_data     = commonUtils.series(table.series);
                
                vm.tcop_row_first    = tcop_header_duration['row_first'];
                vm.tcop_row_second   = tcop_header_duration['row_second'];

                vm.tcop_attribute_name   = tcop_series_data['attribute_name'];
                vm.tcop_series           = tcop_series_data['series'];
            }
        }

        function reInitializeGraphs(){
            $timeout(function () {
                operationalGraphs(vm.graphInfo);
            },500);
        }

        function getServices(currentDuration){
            vm.loadingProgress = true;
            apisUtils.botOperationalPerformanceGraph(currentDuration)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        vm.date = response.current_date_time;
                        vm.graphInfo = response.bot_operational_performance;
                        vm.tableInfo = response.bot_operational_performance.tableInfo;

                        $timeout(function () {
                            vm.loadingProgress = false;
                            operationalGraphs(vm.graphInfo);
                            operationalTables(vm.tableInfo);
                        },500);
                        reInitializeGraphs();
                    }
                }, function(error) {
            });
        }
    }

})();