(function ()
{
    'use strict';

    angular
        .module('app.components.bot.financial')
        .controller('BotFinancialController', BotFinancialController);

    function BotFinancialController(fuseTheming,$mdSidenav,$timeout,$http,$scope,$location,commonUtils,apisUtils,usersApi)
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
        vm.currencyUSD = "USD";
        vm.currencySAR = "SAR";
        vm.currentAvgShipCurrency = vm.currencyUSD;
        vm.currentFKMTableCurrency = vm.currencySAR;
        vm.date = new Date();
        vm.currentUrl = $location.absUrl();
        vm.username = usersApi.getCookieUserFullName();
        vm.graphInfo = {};
        vm.tableInfo = {};
        vm.showBu ='bu-revenue';
        
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
            vm.currentAvgShipCurrency = vm.currencyUSD;
            vm.currentFKMTableCurrency = vm.currencySAR;
            getServices(vm.currentDuration);
        }

        vm.changeGraph = function(graph){
            if(graph == 'bu-revenue') {
                vm.showBu = graph;
                vm.showGraphTitle = "Bahri Oil Revenue (SAR M)";
                vm.graphId = 'bu-revenue-bar-container';
                reInitializeBarGraphs();
            }
            else if(graph == 'bu-ebitda') {
                vm.showBu = graph;
                vm.showGraphTitle = "Bahri Oil EBITDA (SAR M)";
                vm.graphId = 'bu-ebitda-bar-container';
                reInitializeBarGraphs();
            }
            else if(graph == 'bu-ebitda-margin') {
                vm.showBu = graph;
                vm.showGraphTitle = "Bahri Oil EBITDA Margin";
                vm.graphId = 'bu-ebitda-margin-bar-container';
                reInitializeBarGraphs();
            }
        }

        vm.isAvgShipTrue = false;
        vm.isFKMTrue = false;
        vm.convertData = function(type){
            if(type == 'fkm'){
                vm.fkm_series = commonUtils.toggleTableData(
                    vm.fkm_series,
                    vm.fkm_series_temp,
                    vm.currentFKMTableCurrency,
                    vm.currencySAR,
                    vm.isFKMTrue
                );
                vm.isFKMTrue = true;
                vm.currentFKMTableCurrency = (vm.currentFKMTableCurrency == 'SAR') ? 'USD' : 'SAR';
            }

            if(type == 'avg_ship_series'){
                vm.avg_ship_series = commonUtils.toggleTableData(
                    vm.avg_ship_series,
                    vm.avg_ship_series_temp,
                    vm.currentAvgShipCurrency,
                    vm.currencyUSD,
                    vm.isAvgShipTrue
                );
                vm.isAvgShipTrue = true;
                vm.currentAvgShipCurrency = (vm.currentAvgShipCurrency == 'SAR') ? 'USD' : 'SAR';
            }
        }

        vm.exportTableData = function(type){
            var html = '';
            var file_name = '';

            if(type == 'avg_ship_series') {
                html = commonUtils.getTableHtml(
                    'Ship Running Expenses Per Day ',
                    vm.currentAvgShipCurrency,
                    vm.avg_ship_row_first,
                    vm.avg_ship_row_second,
                    vm.avg_ship_attribute_name,
                    vm.avg_ship_series,
                    vm.currentDuration,
                    ''
                );
                file_name = 'avg_ship_series';

            } else if(type == 'fkm'){
                html = commonUtils.getTableHtml(
                    'Financial Key Metrics',
                    vm.currentFKMTableCurrency,
                    vm.fkm_row_first,
                    vm.fkm_row_second,
                    vm.fkm_attribute_name,
                    vm.fkm_series,
                    vm.currentDuration,
                    '(m)'
                );
                file_name = 'fkm';
            } else if(type == 'roce'){
                html = commonUtils.getPercentageTableHtml(
                    'ROCE',
                    'QUARTER',
                    vm.roce_row_first,
                    vm.roce_row_second,
                    vm.roce_attribute_name,
                    vm.roce_series,
                    vm.currentDuration
                );
                file_name = 'roce';
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

        function financialGraphs(graph){

            commonUtils.initializeSettings();

            if(graph && graph.bu_revenue && angular.element('#bu-revenue-container').length){
                Highcharts.chart('bu-revenue-container', commonUtils.activityChart(graph.bu_revenue.graphInfo,commonUtils.getNormalToolTip('SAR M',false)));
            }
            if(graph && graph.bu_ebitda && angular.element('#bu-ebitda-container').length){
                Highcharts.chart('bu-ebitda-container', commonUtils.activityChart(graph.bu_ebitda.graphInfo,commonUtils.getNormalToolTip('SAR M',false)));
            }
            if(graph && graph.bu_ebitda_margin && angular.element('#bu-ebitda-margin-container').length){
                Highcharts.chart('bu-ebitda-margin-container', commonUtils.activityChart(graph.bu_ebitda_margin.graphInfo,commonUtils.getNormalToolTip('%',true)));
            }
            if(graph && graph.vlcc && angular.element('#vlcc-expense-container').length){
                Highcharts.chart('vlcc-expense-container', commonUtils.activityChart(graph.vlcc.graphInfo));
            }
            if(graph && graph.product_tanker && angular.element('#product-tanker-container').length){
                Highcharts.chart('product-tanker-container', commonUtils.activityChart(graph.product_tanker.graphInfo));
            }
            if(graph && graph.revenue && angular.element('#bu-revenue-bar-container').length){
                buRevenueBar(graph.revenue.graphInfo);            
            }
            if(graph && graph.ebitda && angular.element('#bu-ebitda-bar-container').length){
                buEbitda(graph.ebitda.graphInfo);            
            }
            if(graph && graph.ebitda_margin && angular.element('#bu-ebitda-margin-bar-container').length){
                buEbitdaMargin(graph.ebitda_margin.graphInfo);            
            }
        }

        function buRevenueBar(data){
            Highcharts.chart('bu-revenue-bar-container', data);
        }

        function buEbitda(data){
            Highcharts.chart('bu-ebitda-bar-container', data);
        }

        function buEbitdaMargin(data){
            Highcharts.chart('bu-ebitda-margin-bar-container', data);
        }

        function financialTables(table){

            if(table && table.bot_avg_financial_revenue) {

                var fkm_header_duration = commonUtils.categories(table.bot_avg_financial_revenue.tableInfo.categories);
                var fkm_series_data     = commonUtils.series(table.bot_avg_financial_revenue.tableInfo.series);
                
                vm.fkm_row_first        = fkm_header_duration['row_first'];
                vm.fkm_row_second       = fkm_header_duration['row_second'];

                vm.fkm_attribute_name   = fkm_series_data['attribute_name'];
                vm.fkm_series           = fkm_series_data['series'];
                vm.fkm_series_temp      = fkm_series_data['series'];
            }

            if(table && table.avg_ship_running_exp_per_day) {

                var avg_ship_header_duration = commonUtils.categories(table.avg_ship_running_exp_per_day.tableInfo.categories);
                var avg_ship_series_data     = commonUtils.series(table.avg_ship_running_exp_per_day.tableInfo.series);
                
                vm.avg_ship_row_first        = avg_ship_header_duration['row_first'];
                vm.avg_ship_row_second       = avg_ship_header_duration['row_second'];

                vm.avg_ship_attribute_name   = avg_ship_series_data['attribute_name'];
                vm.avg_ship_series           = avg_ship_series_data['series'];
                vm.avg_ship_series_temp      = avg_ship_series_data['series'];
            }

            if(table && table.roce_data) {

                var roce_header_duration = commonUtils.categories(table.roce_data.tableInfo.categories);
                var roce_series_data     = commonUtils.series(table.roce_data.tableInfo.series);
                
                vm.roce_row_first        = roce_header_duration['row_first'];
                vm.roce_row_second       = roce_header_duration['row_second'];

                vm.roce_attribute_name   = roce_series_data['attribute_name'];
                vm.roce_series           = roce_series_data['series'];
            }
        }

        function reInitializeGraphs(){
            $timeout(function () {
                financialGraphs(vm.graphInfo);
                financialTables(vm.tableInfo);
            },500);
        }

        function reInitializeBarGraphs(){
            if(vm.graphInfo){
                $timeout(function () {
                    buRevenueBar(vm.graphInfo.revenue.graphInfo);
                    buEbitda(vm.graphInfo.ebitda.graphInfo);
                    buEbitdaMargin(vm.graphInfo.ebitda_margin.graphInfo);
                },500);
            }
        }
        
        function getServices(currentDuration){
             vm.loadingProgress = true;
            apisUtils.getBahriOilFinancialPerformanceGraph(currentDuration)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        vm.date = response.current_date_time;
                        vm.graphInfo = response.bot_financial_performance;

                        $timeout(function () {
                            vm.loadingProgress = false;
                            financialGraphs(vm.graphInfo);
                        },500);
                        reInitializeGraphs();
                    }
                }, function(error) {
            });    

            apisUtils.getBahriOilFinancialPerformanceTable(currentDuration)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        vm.tableInfo = response.bot_financial_performance;
                        vm.date = response.current_date_time;
                        financialTables(vm.tableInfo);
                    }
                }, function(error) {
            });  
        }
    }

})();