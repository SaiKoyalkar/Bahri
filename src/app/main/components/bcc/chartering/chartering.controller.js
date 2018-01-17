(function ()
{
    'use strict';

    angular
        .module('app.components.bcc.chartering')
        .controller('BccCharteringController', BccCharteringController);

    function BccCharteringController(fuseTheming,$mdSidenav,$timeout,$http,$scope,$location,commonUtils,apisUtils,usersApi)
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
            } else if(type == 'top_cargoes'){
                html = commonUtils.getTableHtml(
                    "Top 10 Cargoes by TCE ",
                    'CARGO NAME',
                    vm.top_cargoes_row_first,
                    vm.top_cargoes_row_second,
                    vm.top_cargoes_attribute_name,
                    vm.top_cargoes_series,
                    vm.currentDuration,
                    ''
                );
                file_name = 'top_cargoes';
            } else if(type == 'top_charter'){
                html = commonUtils.getTableHtml(
                    "Top 10 Charter's by TCE ",
                    'CHARTER NAME',
                    vm.top_charter_row_first,
                    vm.top_charter_row_second,
                    vm.top_charter_attribute_name,
                    vm.top_charter_series,
                    vm.currentDuration,
                    ''
                );
                file_name = 'top_charter';
            } else if(type == 'usg_vessel'){
                html = commonUtils.getColumnTableHtml(
                    'Vessel Availability (USG)',
                    vm.usg_vessel_row_first,
                    vm.usg_vessel_series,
                    vm.currentDuration,
                    ''
                );
                file_name = 'usg_vessel';
            } 
            else if(type == 'tce_projection'){
                html = commonUtils.getDiffrentRowspanTableHtml(
                    'TCE Projection',
                    vm.tce_projection_categories,
                    vm.tce_projection_data
                );
                file_name = 'tce_projection';
            }
            else if(type == 'ytd_tce'){
                html = commonUtils.getDiffrentRowspanTableHtml(
                    'YTD TCE',
                    vm.ytd_tce_categories,
                    vm.ytd_tce_data
                );
                file_name = 'ytd_tce';
            }
            else if(type == 'ship_daily_tce'){
                html = commonUtils.getDiffrentRowspanTableHtml(
                    'Ship Daily TCE',
                    vm.ship_daily_tce_categories,
                    vm.ship_daily_tce_data
                );
                file_name = 'ship_daily_tce';
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

            if(graph && graph.bcc_tce_trend && angular.element('#tce-trend-container').length)
                Highcharts.chart('tce-trend-container', graph.bcc_tce_trend.graphInfo);
            
            if(graph && graph.top_cargoes && angular.element('#top-cargoes-container').length)
                Highcharts.chart('top-cargoes-container', graph.top_cargoes.graphInfo);
            
            if(graph && graph.top_charter && angular.element('#top-charter-container').length)
                Highcharts.chart('top-charter-container', graph.top_charter.graphInfo);
            
            if(graph && graph.open_position_charter && angular.element('#open-position-charters-container').length)
                Highcharts.chart('open-position-charters-container', graph.open_position_charter.graphInfo);
            
            if(graph && graph.voyage_profit_loss && angular.element('#voyage-profit-loss-container').length)
                Highcharts.chart('voyage-profit-loss-container', graph.voyage_profit_loss.graphInfo);

            if(graph && graph.ytd_tce && angular.element('#ytd-tce-container').length)
                Highcharts.chart('ytd-tce-container', graph.ytd_tce.graphInfo);

            if(graph && graph.tce_projection && angular.element('#tce-projection-container').length)
                Highcharts.chart('tce-projection-container', graph.tce_projection.graphInfo);

            if(graph && graph.ship_daily_tce && angular.element('#ship-daily-tce-container').length)
                Highcharts.chart('ship-daily-tce-container', graph.ship_daily_tce.graphInfo);
        }

        function charteringTables(table){
            if(table && table.tce_graph) {

                var tce_header_duration = commonUtils.categories(table.tce_graph.tableInfo.categories);
                var tce_series_data     = commonUtils.series(table.tce_graph.tableInfo.series);
                
                vm.tce_row_first        = tce_header_duration['row_first'];
                vm.tce_row_second       = tce_header_duration['row_second'];

                vm.tce_attribute_name   = tce_series_data['attribute_name'];
                vm.tce_series           = tce_series_data['series'];
                vm.tce_series_temp      = tce_series_data['series'];
            }

            if(table && table.top_cargoes) {

                var top_cargoes_header_duration = commonUtils.categories(table.top_cargoes.tableInfo.categories);
                var top_cargoes_series_data     = commonUtils.series(table.top_cargoes.tableInfo.series);
                
                vm.top_cargoes_row_first        = top_cargoes_header_duration['row_first'];
                vm.top_cargoes_row_second       = top_cargoes_header_duration['row_second'];

                vm.top_cargoes_attribute_name   = top_cargoes_series_data['attribute_name'];
                vm.top_cargoes_series           = top_cargoes_series_data['series'];
            }

            if(table && table.top_charter) {

                var top_charter_header_duration = commonUtils.categories(table.top_charter.tableInfo.categories);
                var top_charter_series_data     = commonUtils.series(table.top_charter.tableInfo.series);
                
                vm.top_charter_row_first        = top_charter_header_duration['row_first'];
                vm.top_charter_row_second       = top_charter_header_duration['row_second'];

                vm.top_charter_attribute_name   = top_charter_series_data['attribute_name'];
                vm.top_charter_series           = top_charter_series_data['series'];
            }

            if(table && table.open_position_charter) {
                var usg_vessel_series_data     = commonUtils.seriesComaLess(table.open_position_charter.tableInfo.series);
                vm.usg_vessel_row_first        = table.open_position_charter.tableInfo.categories;   
                
                vm.usg_vessel_attribute_name   = usg_vessel_series_data['attribute_name'];
                vm.usg_vessel_series           = usg_vessel_series_data['series'];
            }

            if(table && table.ytd_tce.tableInfo) {
                vm.ytd_tce_data   = commonUtils.formatRowSpanData(table.ytd_tce.tableInfo.series);
                vm.ytd_tce_categories   = table.ytd_tce.tableInfo.categories;
            }

            if(table && table.tce_projection.tableInfo) {
                vm.tce_projection_data   = commonUtils.formatRowSpanData(table.tce_projection.tableInfo.series);
                vm.tce_projection_categories   = table.tce_projection.tableInfo.categories;
            }

            if(table && table.ship_daily_tce.tableInfo) {
                vm.ship_daily_tce_data   = commonUtils.formatSingleRowData(table.ship_daily_tce.tableInfo.series);
                vm.ship_daily_tce_categories   = table.ship_daily_tce.tableInfo.categories;
            }
        }

        function reInitializeGraphs(){
            $timeout(function () {
                charteringGraphs(vm.graphInfo);
            },500);
        }

        function getServices(currentDuration){
            vm.loadingProgress = true;
            apisUtils.getBahriChemicalCharter(currentDuration)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        vm.graphInfo = response.bcc_charter;
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