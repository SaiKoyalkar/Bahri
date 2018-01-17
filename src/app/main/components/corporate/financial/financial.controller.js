(function ()
{
    'use strict';

    angular
        .module('app.components.corporate.financial')
        .controller('CorporateFinancialController', CorporateFinancialController);

    function CorporateFinancialController(fuseTheming,$mdSidenav,$timeout,$http,$scope,$location,commonUtils,apisUtils,usersApi)
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
        vm.currentBahriUnitsCurrency = vm.currencySAR;
        vm.currentBahriConsolidatedCurrency = vm.currencySAR;
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
            vm.currentBahriUnitsCurrency = vm.currencySAR;
            vm.currentBahriConsolidatedCurrency = vm.currencySAR;

            getServices(vm.currentDuration);            
        }

        vm.changeGraph = function(graph){
            if(graph == 'bu-revenue') {
                vm.showBu = graph;
                vm.showGraphTitle = "Bahri Group Revenue Contribution (SAR M)";
                vm.graphId = 'bu-revenue-bar-container';
                reInitializeBarGraphs();
            }
            else if(graph == 'bu-ebitda') {
                vm.showBu = graph;
                vm.showGraphTitle = "Bahri Group EBITDA Contribution (SAR M)";
                vm.graphId = 'bu-ebitda-bar-container';
                reInitializeBarGraphs();
            }
            else if(graph == 'bu-ebitda-margin') {
                vm.showBu = graph;
                vm.showGraphTitle = "Bahri Group EBITDA Margin Contribution";
                vm.graphId = 'bu-ebitda-margin-bar-container';
                reInitializeBarGraphs();
            }
        }

        vm.isUnitsTrue = false;
        vm.isConsolidatedTrue = false;

        vm.convertData = function(type){
            if(type == 'bahri_consolidated'){
                vm.bahri_consolidated_series = commonUtils.toggleTableData(
                    vm.bahri_consolidated_series,
                    vm.bahri_consolidated_series_temp,
                    vm.currentBahriConsolidatedCurrency,
                    vm.currencySAR,
                    vm.isConsolidatedTrue
                );

                vm.currentBahriConsolidatedCurrency = (vm.currentBahriConsolidatedCurrency == 'SAR') ? 'USD' : 'SAR';
            }
             if(type == 'bahri_units_series'){
                vm.bahri_units_series = commonUtils.toggleTableData(
                    vm.bahri_units_series,
                    vm.bahri_units_series_temp,
                    vm.currentBahriUnitsCurrency,
                    vm.currencySAR,
                    vm.isConsolidatedTrue
                );

                vm.currentBahriUnitsCurrency = (vm.currentBahriUnitsCurrency == 'SAR') ? 'USD' : 'SAR';
            }
        }

        vm.exportTableData = function(type){
            var html = '';
            var file_name = '';

            if(type == 'bahri_consolidated') {
                html = commonUtils.getTableHtml(
                    'Bahri Consolidated Financials',
                    vm.currentBahriConsolidatedCurrency,
                    vm.bahri_consolidated_row_first,
                    vm.bahri_consolidated_row_second,
                    vm.bahri_consolidated_attribute_name,
                    vm.bahri_consolidated_series,
                    vm.currentDuration,
                    '(m)'
                );
                file_name = 'bahri_consolidated';

            } else if(type == 'bahri_units_series'){
                html = commonUtils.getTableHtml(
                    'Business Units Monthly Highlights',
                    vm.currentBahriUnitsCurrency,
                    vm.bahri_units_row_first,
                    vm.bahri_units_row_second,
                    vm.bahri_units_attribute_name,
                    vm.bahri_units_series,
                    '(m)'
                );
                file_name = 'bahri_units_series';
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

            if(table && table.bahri_consolidated) {

                var bahri_consolidated_header_duration = commonUtils.categories(table.bahri_consolidated.tableInfo.categories);
                var bahri_consolidated_series_data     = commonUtils.series(table.bahri_consolidated.tableInfo.series);
                
                vm.bahri_consolidated_row_first        = bahri_consolidated_header_duration['row_first'];
                vm.bahri_consolidated_row_second       = bahri_consolidated_header_duration['row_second'];

                vm.bahri_consolidated_attribute_name   = bahri_consolidated_series_data['attribute_name'];
                vm.bahri_consolidated_series           = bahri_consolidated_series_data['series'];
                vm.bahri_consolidated_series_temp      = bahri_consolidated_series_data['series'];
            }

            if(table && table.bahri_units) {

                var bahri_units_header_duration = commonUtils.categories(table.bahri_units.tableInfo.categories);
                var bahri_units_series_data     = commonUtils.series(table.bahri_units.tableInfo.series);
                
                vm.bahri_units_row_first        = bahri_units_header_duration['row_first'];
                vm.bahri_units_row_second       = bahri_units_header_duration['row_second'];

                vm.bahri_units_attribute_name   = bahri_units_series_data['attribute_name'];
                vm.bahri_units_series           = bahri_units_series_data['series'];
                vm.bahri_units_series_temp      = bahri_units_series_data['series'];
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
            apisUtils.getBahriGroupFinancialPerformance(currentDuration)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        vm.graphInfo = response.bahri_financial_performance;
                        vm.date = response.current_date_time;
                        $timeout(function () {
                            vm.loadingProgress = false;
                            financialGraphs(vm.graphInfo);
                        },500);
                        reInitializeGraphs();
                    }
                }, function(error) {
            });

            apisUtils.getBahriGroupFinancialPerformanceTable(currentDuration)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        vm.tableInfo = response.bahri_financial_performance;
                        vm.date = response.current_date_time;
                        financialTables(vm.tableInfo);
                    }
                }, function(error) {
            });  
        }
    }

})();