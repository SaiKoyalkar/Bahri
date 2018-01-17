(function ()
{
    'use strict';

    angular
        .module('app.components.bot.chartering')
        .controller('BotCharteringController', BotCharteringController);

    function BotCharteringController(fuseTheming,$mdSidenav,$timeout,$http,$scope,$location,commonUtils,apisUtils,usersApi)
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
        vm.date = new Date();
        vm.currentUrl = $location.absUrl();
        vm.currentTCECurrency = vm.defaultCurrency;
        vm.currentTCEPQCurrency = vm.defaultCurrency;
        vm.username = usersApi.getCookieUserFullName();
        vm.graphInfo = {};
        vm.tableInfo = {};
        
        var btnGraph = angular.element( document.querySelector( '#btn-graph' ) );
        var btnTable = angular.element( document.querySelector( '#btn-table' ) );

        //vm.graphInfo = '';
        //vm.tableInfo = '';

        $(window).resize(function(){
           reInitializeGraphs();
        });

        var element = angular.element( document.querySelector( '.fold-toggle' ) );
        element.on('click', function(e){       
            reInitializeGraphs();
        });
        
        
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
        vm.isTCEPQTrue = false;
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
            if(type == 'tcePQ'){
                vm.tce_quarter_series = commonUtils.toggleTableData(
                    vm.tce_quarter_series,
                    vm.tce_quarter_series_temp,
                    vm.currentTCEPQCurrency,
                    vm.defaultCurrency,
                    vm.isTCEPQTrue
                );
                vm.isTCEPQTrue = true;
                vm.currentTCEPQCurrency = (vm.currentTCEPQCurrency == 'SAR') ? 'USD' : 'SAR';
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
            } else if(type == 'tcePQ'){
                html = commonUtils.getTableHtml(
                    'TCE Per Quarter',
                    vm.currentTCEPQCurrency,
                    vm.tce_quarter_row_first,
                    vm.tce_quarter_row_second,
                    vm.tce_quarter_attribute_name,
                    vm.tce_quarter_series,
                    vm.currentDuration,
                    ''
                );
                file_name = 'tce_per_quarter';
            } else if(type == 'ag_vessel'){
                html = commonUtils.getTableHtml(
                    'Vessel Availability (AG)',
                    'PORT',
                    vm.ag_vessel_row_first,
                    vm.ag_vessel_row_second,
                    vm.ag_vessel_attribute_name,
                    vm.ag_vessel_series,
                    vm.currentDuration,
                    ''
                );
                file_name = 'ag_vessel';
            } else if(type == 'usg_vessel'){
                html = commonUtils.getTableHtml(
                    'Vessel Availability (USG)',
                    'PORT',
                    vm.usg_vessel_row_first,
                    vm.usg_vessel_row_second,
                    vm.usg_vessel_attribute_name,
                    vm.usg_vessel_series,
                    vm.currentDuration,
                    ''
                );
                file_name = 'usg_vessel';
            } else if(type == 'top_charter'){
                html = commonUtils.getTableHtml(
                    "Top in Charter's Revenue (USD M)",
                    'CHARTER NAME',
                    vm.top_charter_row_first,
                    vm.top_charter_row_second,
                    vm.top_charter_attribute_name,
                    vm.top_charter_series,
                    vm.currentDuration,
                    ''
                );
                file_name = 'top_charter';
            }else if(type == 'out_claims'){
                html = commonUtils.getTableHtmlNoHeader(
                    "Outstanding Claims as of Today by Aging (USD)",
                    vm.out_claims_attribute_name,
                    vm.out_claims_series
                );
                file_name = 'out_claims';
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
            
            if(graph && graph.tce_per_quarter_graph && angular.element('#tce-per-quarter-container').length)
                Highcharts.chart('tce-per-quarter-container', graph.tce_per_quarter_graph.graphInfo);
            
            if(graph && graph.vessel_availability && angular.element('#open-position-container').length)
                Highcharts.chart('open-position-container', commonUtils.groupedColumnChart(graph.vessel_availability.graphInfo));
                
            if(graph && graph.outstanding_claims_graph && angular.element('#claims-amount-container').length)
                Highcharts.chart('claims-amount-container', graph.outstanding_claims_graph.graphInfo);

            if(graph && graph.top_charter_revenue && angular.element('#top-ten-charterers-container').length)
                Highcharts.chart('top-ten-charterers-container', graph.top_charter_revenue.graphInfo);

            if(graph && graph.voyage_profit_loss && angular.element('#voyage-profit-loss-container').length)
                Highcharts.chart('voyage-profit-loss-container', graph.voyage_profit_loss.graphInfo);
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

            if(table && table.tce_per_quarter_graph) {

                var tce_quarter_header_duration = commonUtils.categories(table.tce_per_quarter_graph.tableInfo.categories);
                var tce_quarter_series_data     = commonUtils.series(table.tce_per_quarter_graph.tableInfo.series);
                
                vm.tce_quarter_row_first        = tce_quarter_header_duration['row_first'];
                vm.tce_quarter_row_second       = tce_quarter_header_duration['row_second'];

                vm.tce_quarter_attribute_name   = tce_quarter_series_data['attribute_name'];
                vm.tce_quarter_series           = tce_quarter_series_data['series'];
                vm.tce_quarter_series_temp      = tce_quarter_series_data['series'];
            }

            if(table && table.top_charter_revenue) {

                var top_charter_header_duration = commonUtils.categories(table.top_charter_revenue.tableInfo.categories);
                var top_charter_series_data     = commonUtils.series(table.top_charter_revenue.tableInfo.series);
                
                vm.top_charter_row_first        = top_charter_header_duration['row_first'];
                vm.top_charter_row_second       = top_charter_header_duration['row_second'];

                vm.top_charter_attribute_name   = top_charter_series_data['attribute_name'];
                vm.top_charter_series           = top_charter_series_data['series'];
            }

            if(table && table.arab_gulf) {

                var ag_vessel_header_duration = commonUtils.categories(table.arab_gulf.tableInfo.categories);
                var ag_vessel_series_data     = commonUtils.series(table.arab_gulf.tableInfo.series);
                
                vm.ag_vessel_row_first        = ag_vessel_header_duration['row_first'];
                vm.ag_vessel_row_second       = ag_vessel_header_duration['row_second'];

                vm.ag_vessel_attribute_name   = ag_vessel_series_data['attribute_name'];
                vm.ag_vessel_series           = ag_vessel_series_data['series'];
            }

            if(table && table.us_gulf) {

                var usg_vessel_header_duration = commonUtils.categories(table.us_gulf.tableInfo.categories);
                var usg_vessel_series_data     = commonUtils.series(table.us_gulf.tableInfo.series);
                
                vm.usg_vessel_row_first        = usg_vessel_header_duration['row_first'];
                vm.usg_vessel_row_second       = usg_vessel_header_duration['row_second'];      
                
                vm.usg_vessel_attribute_name   = usg_vessel_series_data['attribute_name'];
                vm.usg_vessel_series           = usg_vessel_series_data['series'];
            }

            if(table && table.outstanding_claims_graph) {

                var out_claims_series_data     = commonUtils.series(table.outstanding_claims_graph.tableInfo.series);                
                vm.out_claims_row_first        = table.outstanding_claims_graph.tableInfo.categories;
                
                vm.out_claims_attribute_name   = out_claims_series_data['attribute_name'];
                vm.out_claims_series           = out_claims_series_data['series'];
            }
        }

        function reInitializeGraphs(){
            $timeout(function () {
                charteringGraphs(vm.graphInfo);
            },500);
        }

        function getServices(currentDuration){
            vm.loadingProgress = true;
            apisUtils.getBahriOilCharter(currentDuration)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){

                        vm.date = response.current_date_time;
                        vm.graphInfo = response.bot_charter;
                        vm.tableInfo = vm.graphInfo;
                        
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