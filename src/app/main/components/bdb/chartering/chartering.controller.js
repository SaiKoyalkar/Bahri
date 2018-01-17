(function ()
{
    'use strict';

    angular
        .module('app.components.bdb.chartering')
        .controller('BdbCharteringController', BdbCharteringController);

    function BdbCharteringController(fuseTheming,$mdSidenav,$timeout,$http,$scope,$location,commonUtils,apisUtils,usersApi)
    {

        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;
        vm.durations = commonUtils.durations();
        vm.exportGraphOptions = commonUtils.exportOptions();
        vm.exportProgressOptions = commonUtils.exportProgressOptions();
        vm.currentDuration = {"month" : "Month"};
        vm.currentExportOption = {"": "Export As"};
        vm.dataGraphView = true;
        vm.toggleSidenav = toggleSidenav;
        vm.defaultCurrency = "USD";
        vm.currentTCECurrency = vm.defaultCurrency;
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
            vm.currentTCECurrency = vm.defaultCurrency;
            getServices(vm.currentDuration);
        }

        vm.isTCETrue = false;
        vm.convertData = function(type){
            if(type == 'tce'){
                vm.tce_series = commonUtils.toggleTableData(
                    vm.tce_series,
                    vm.tce_series_temp,
                    vm.currentTCECurrency,
                    vm.defaultCurrency,
                    vm.isTCETrue
                );

                vm.isTCETrue = true;
                vm.currentTCECurrency = (vm.currentTCECurrency == 'SAR') ? 'USD' : 'SAR';
            }
        }

        vm.exportTableData = function(type){
            var html = '';
            var file_name = '';

            if(type == 'tce'){
                html = commonUtils.getTableHtml(
                    'TCE',
                    vm.currentTCECurrency,
                    vm.tce_row_first,
                    vm.tce_row_second,
                    vm.tce_attribute_name,
                    vm.tce_series,
                    vm.currentDuration,
                    ''
                );
                file_name = 'tce';
            } else if(type == 'spot_fixtures'){
                html = commonUtils.getColumnTableHtml(
                    'Spot Fixtures',
                    vm.spot_fixtures_row_first,
                    vm.spot_fixtures_series,
                    vm.currentDuration,
                    ''
                );
                file_name = 'spot_fixtures';
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

        vm.exportProgressBar = function(title){
            if(vm.currentExportOption != ""){
                var theCanvas = '';
                html2canvas($("#tce-progress-bar"), {
                    onrendered: function(canvas) {
                        theCanvas = canvas;
                        canvas.toBlob(function(blob) {
                            saveAs(blob, title+".jpg");
                        })
                    }
                });
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

    
        function charteringGraphs(graph){
            commonUtils.initializeSettings();
    
            if(graph && graph.tce_graph)
                vm.tceGraph = graph.tce_graph.graphInfo;

            if(graph && graph.tce_trend && angular.element('#tce-trend-container').length)
                Highcharts.chart('tce-trend-container', graph.tce_trend.graphInfo);

            if(graph && graph.voyage_profit_loss && angular.element('#voyage-profit-loss-container').length)
                Highcharts.chart('voyage-profit-loss-container', graph.voyage_profit_loss.graphInfo);
            
            if(graph && graph.top_charter && angular.element('#top-charter-container').length)
                Highcharts.chart('top-charter-container', graph.top_charter.graphInfo);
            
            if(graph && graph.top_cargoes && angular.element('#top-cargoes-container').length)
                Highcharts.chart('top-cargoes-container', graph.top_cargoes.graphInfo);

            if(graph && graph.top_charters_revenue && angular.element('#top-charters-revenue-container').length)
                Highcharts.chart('top-charters-revenue-container', graph.top_charters_revenue.graphInfo);

            if(graph && graph.top_cargoes_revenue && angular.element('#top-cargoes-revenue-container').length)
                Highcharts.chart('top-cargoes-revenue-container', graph.top_cargoes_revenue.graphInfo);

            if(graph && graph.vessel_voyage && angular.element('#vessel-voyage-container').length)
                Highcharts.chart('vessel-voyage-container', graph.vessel_voyage.graphInfo);
        }

        function charteringTables(table){
            if(table && table.tce_trend) {

                var tce_header_duration = commonUtils.categories(table.tce_trend.tableInfo.categories);
                var tce_series_data     = commonUtils.series(table.tce_trend.tableInfo.series);
                
                vm.tce_row_first        = tce_header_duration['row_first'];
                vm.tce_row_second       = tce_header_duration['row_second'];

                vm.tce_attribute_name   = tce_series_data['attribute_name'];
                vm.tce_series           = tce_series_data['series'];
                vm.tce_series_temp      = tce_series_data['series'];
            }

            if(table && table.spot_fixtures) {
                var spot_fixtures_series_data     = commonUtils.series(table.spot_fixtures.tableInfo.series);
                vm.spot_fixtures_row_first        = table.spot_fixtures.tableInfo.categories;   
                
                vm.spot_fixtures_attribute_name   = spot_fixtures_series_data['attribute_name'];
                vm.spot_fixtures_series           = spot_fixtures_series_data['series'];
            }
        }

        function reInitializeGraphs(){
            $timeout(function () {
                charteringGraphs(vm.graphInfo);
            },500);
        }

        function getServices(currentDuration){
            vm.loadingProgress = true;
            apisUtils.getBahriDryBulkCharter(currentDuration)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        vm.graphInfo = response.bdb_charter;
                        vm.date = response.current_date_time;

                        $timeout(function () {
                            vm.loadingProgress = false;
                            charteringGraphs(vm.graphInfo);
                            charteringTables(vm.graphInfo);
                        },500);
                        reInitializeGraphs();
                    }
                }, function(error) {
            });
        }
    }

})();