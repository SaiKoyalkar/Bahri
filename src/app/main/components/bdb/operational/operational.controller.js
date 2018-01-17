(function ()
{
    'use strict';

    angular
        .module('app.components.bdb.operational')
        .controller('BdbOperationalController', BdbOperationalController);

    function BdbOperationalController(fuseTheming,$mdSidenav,$timeout,$http,$scope,$location,commonUtils,apisUtils,usersApi)
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
        vm.changedDurationValue = vm.currentDuration;
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

            if(type == 'opdov'){
                html = commonUtils.getTableHtml(
                    'Operation Details (Owned Vessel) ',
                    'Days',
                    vm.opdov_row_first,
                    vm.opdov_row_second,
                    vm.opdov_attribute_name,
                    vm.opdov_series,
                    vm.currentDuration,
                    ''
                );
                file_name = 'operation_details_owned_vessel';
            } else if(type == 'opdom'){
                html = commonUtils.getTableHtml(
                    'Operation Details (Operator Model) ',
                    '',
                    vm.opdom_row_first,
                    vm.opdom_row_second,
                    vm.opdom_attribute_name,
                    vm.opdom_series,
                    vm.currentDuration,
                    ''
                );
                file_name = 'operation_details_operator_model';
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

        vm.setGraphView = function(){
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

            if(graph && graph.owned_vessel_operational_days){
                
                if(angular.element('#operational-days-owned-vessel-container').length)
                    Highcharts.chart('operational-days-owned-vessel-container', graph.owned_vessel_operational_days.graphInfo);
                
                var table = graph.owned_vessel_operational_days.tableInfo;
                var opdov_header_duration = commonUtils.categories(table.categories);
                var opdov_series_data     = commonUtils.series(table.series);
                
                vm.opdov_row_first    = opdov_header_duration['row_first'];
                vm.opdov_row_second   = opdov_header_duration['row_second'];

                vm.opdov_attribute_name   = opdov_series_data['attribute_name'];
                vm.opdov_series           = opdov_series_data['series'];
            }

            if(graph && graph.trade_days && angular.element('#trade-days-container').length){
                Highcharts.chart('trade-days-container', graph.trade_days.graphInfo);
            }

            if(graph && graph.operator_model && angular.element('#operational-days-operator-model-container').length){
                Highcharts.chart('operational-days-operator-model-container', graph.operator_model.graphInfo);

                var table = graph.operator_model.tableInfo;
                var opdom_header_duration= commonUtils.categories(table.categories);
                var opdom_series_data    = commonUtils.series(table.series);
                
                vm.opdom_row_first    = opdom_header_duration['row_first'];
                vm.opdom_row_second   = opdom_header_duration['row_second'];

                vm.opdom_attribute_name   = opdom_series_data['attribute_name'];
                vm.opdom_series           = opdom_series_data['series'];
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
            apisUtils.getBahriDryBulkOperationalPerformanceGraph(currentDuration)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        vm.date = response.current_date_time;
                        vm.graphInfo = response.bdb_operational_performance;
                        $timeout(function () {
                            vm.loadingProgress = false;
                            operationalGraphs(vm.graphInfo);
                        },500);
                        reInitializeGraphs();
                    }
                }, function(error) {
            });
        }
    }

})();