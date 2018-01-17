(function ()
{
    'use strict';

    angular
        .module('app.components.bgc.chartering')
        .controller('BgcCharteringController', BgcCharteringController);

    function BgcCharteringController(fuseTheming,$mdSidenav,$timeout,$http,$scope,$location,commonUtils,apisUtils,usersApi)
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
                    'Rates (TEU/MTON)',
                    vm.currentTCECurrency,
                    vm.tce_row_first,
                    vm.tce_row_second,
                    vm.tce_attribute_name,
                    vm.tce_series,
                    vm.currentDuration,
                    ''
                );
                file_name = 'rates_teu_mton';
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

            if(graph && graph.market_trend && angular.element('#market-trend-container').length)
                Highcharts.chart('market-trend-container', graph.market_trend.graphInfo);
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
        }

        function reInitializeGraphs(){
            $timeout(function () {
                charteringGraphs(vm.graphInfo);
            },500);
        }

        function getServices(currentDuration){
            vm.loadingProgress = true;
            apisUtils.getBahriGeneralCargoCharter(currentDuration)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        vm.graphInfo = response.bgc_charter;
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