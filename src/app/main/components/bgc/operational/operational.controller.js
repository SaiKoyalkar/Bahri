(function ()
{
    'use strict';

    angular
        .module('app.components.bgc.operational')
        .controller('BgcOperationalController', BgcOperationalController);

    function BgcOperationalController(fuseTheming,$mdSidenav,$timeout,$http,$scope,$location,commonUtils,apisUtils,usersApi)
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

            if(type == 'owned_fleet'){
                html = commonUtils.getTableHtml(
                    'Owned Fleet',
                    '',
                    vm.tcop_row_first,
                    vm.tcop_row_second,
                    vm.tcop_attribute_name,
                    vm.tcop_series,
                    vm.currentDuration,
                    ''
                );
                file_name = 'owned_fleet';
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

            if(graph && graph.voyage_days_details && angular.element('#voyage-days-container').length){
                Highcharts.chart('voyage-days-container', graph.voyage_days_details.graphInfo);
            }
            if(graph && graph.utilisation && angular.element('#utilisation-container').length){
                Highcharts.chart('utilisation-container', graph.utilisation.graphInfo);
            }
            if(graph && graph.cargo_volume && angular.element('#cargo-volume-container').length){
                Highcharts.chart('cargo-volume-container', graph.cargo_volume.graphInfo);
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
            apisUtils.getBahriGeneralCargoOperationalPerformanceGraph(currentDuration)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){

                        vm.date = response.current_date_time;
                        vm.graphInfo = response.bgc_operational_performance;
                        vm.tableInfo = response.bgc_operational_performance.tableInfo;

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