(function ()
{
    'use strict';

    angular
        .module('app.components.msml.financial')
        .controller('FinancialController', FinancialController);

    function FinancialController(fuseTheming,$mdSidenav,$timeout,$location,commonUtils,apisUtils,usersApi)
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
        vm.currencySAR = "SAR";
        vm.currencyUSD = "USD";
        vm.date = new Date();
        vm.currentUrl = $location.absUrl();
        vm.currentAvgShipCurrency = vm.currencyUSD;
        vm.currentKMECurrency = vm.currencySAR;
        vm.username = usersApi.getCookieUserFullName();
        vm.graphInfo = {};
        vm.tableInfo = {};

        var btnGraph = angular.element( document.querySelector( '#btn-graph' ) );
        var btnTable = angular.element( document.querySelector( '#btn-table' ) );
       
        $(window).resize(function(){
           reInitializeGraphs();
        });

        var element = angular.element( document.querySelector( '.fold-toggle' ) );
        element.on('click', function(e){       
            reInitializeGraphs();
        });

        /*vm.exportToExcel=function(tableId){ // ex: '#my-table'
            vm.exportHref=commonUtils.tableToExcel(tableId,'sheet name');
            $timeout(function(){location.href = vm.exportHref;},100); // trigger download
        }
*/
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
            vm.currentKMECurrency = vm.currencySAR;     
            getService(vm.currentDuration);     
        }

        vm.isKMETrue = false;
        vm.isAvgShipTrue = false;

        vm.convertData = function(type){
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
            else if(type == 'key_mideast_expense'){
                vm.kme_series = commonUtils.toggleTableData(
                    vm.kme_series,
                    vm.kme_series_temp,
                    vm.currentKMECurrency,
                    vm.currencySAR,
                    vm.isKMETrue
                );
                vm.isKMETrue = true;
                vm.currentKMECurrency = (vm.currentKMECurrency == 'SAR') ? 'USD' : 'SAR';
            }
        }

        vm.exportTableData = function(type){
            var html = '';
            var file_name = '';

            if(type == 'avg_ship_series') {
                html = commonUtils.getTableHtml(
                    'Average Ship Running Expense',
                    vm.currentAvgShipCurrency,
                    vm.avg_ship_row_first,
                    vm.avg_ship_row_second,
                    vm.avg_ship_attribute_name,
                    vm.avg_ship_series,
                    vm.currentDuration,
                    ''
                );
                file_name = 'avg_ship_series';

            } else if(type == 'key_mideast_expense'){
                html = commonUtils.getTableHtml(
                    'Key Mideast Expense',
                    vm.currentKMECurrency,
                    vm.kme_row_first,
                    vm.kme_row_second,
                    vm.kme_attribute_name,
                    vm.kme_series,
                    vm.currentDuration,
                    '(m)'
                );
                file_name = 'key_mideast_expense';
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
           // captureCurrentDiv();
            vm.changedDurationValue = vm.currentDuration;
            commonUtils.activeBtn(btnTable,btnGraph);
            vm.dataGraphView = false;
        }

    
        function financialGraphs(graph){
            commonUtils.initializeSettings();

            if(graph && graph.key_mideast_expense.graphInfo && angular.element('#key-mideast-expense-container').length)
                Highcharts.chart('key-mideast-expense-container', graph.key_mideast_expense.graphInfo);
            if(graph && graph.vlcc.graphInfo && angular.element('#vlcc-expense-container').length)
                Highcharts.chart('vlcc-expense-container', commonUtils.activityChart(graph.vlcc.graphInfo));
            if(graph && graph.product_tanker.graphInfo && angular.element('#mr-expense-container').length)
                Highcharts.chart('mr-expense-container', commonUtils.activityChart(graph.product_tanker.graphInfo));
            if(graph && graph.drybulk.graphInfo && angular.element('#drybulk-expense-container').length)
                Highcharts.chart('drybulk-expense-container', commonUtils.activityChart(graph.drybulk.graphInfo)); 
            if(graph && graph.general_cargo.graphInfo && angular.element('#rocons-expense-container').length)
                Highcharts.chart('rocons-expense-container', commonUtils.activityChart(graph.general_cargo.graphInfo));
            if(graph && graph.chemical.graphInfo && angular.element('#chemical-expense-container').length)
                Highcharts.chart('chemical-expense-container', commonUtils.activityChart(graph.chemical.graphInfo));
            if(graph && graph.chemical_product.graphInfo && angular.element('#chemical-product-expense-container').length)
                Highcharts.chart('chemical-product-expense-container', commonUtils.activityChart(graph.chemical_product.graphInfo));
        }

        function financialTables(table){
            if(table && table.key_mideast_expense.tableInfo) {

                var kme_header_duration = commonUtils.categories(table.key_mideast_expense.tableInfo.categories);
                var kme_series_data     = commonUtils.series(table.key_mideast_expense.tableInfo.series);
                
                vm.kme_row_first        = kme_header_duration['row_first'];
                vm.kme_row_second       = kme_header_duration['row_second'];

                vm.kme_attribute_name   = kme_series_data['attribute_name'];
                vm.kme_series           = kme_series_data['series'];
                vm.kme_series_temp      = kme_series_data['series'];
            }
        }

        function avgExpTable(result){
            if(result && result.avg_ship_running_exp_per_day.tableInfo){

                var avg_ship_header_duration= commonUtils.categories(result.avg_ship_running_exp_per_day.tableInfo.categories);
                var avg_ship_series_data    = commonUtils.series(result.avg_ship_running_exp_per_day.tableInfo.series);
                
                vm.avg_ship_row_first       = avg_ship_header_duration['row_first'];
                vm.avg_ship_row_second      = avg_ship_header_duration['row_second'];

                vm.avg_ship_attribute_name  = avg_ship_series_data['attribute_name'];
                vm.avg_ship_series          = avg_ship_series_data['series'];
                vm.avg_ship_series_temp     = avg_ship_series_data['series'];
            }
        }

        function reInitializeGraphs(){
            $timeout(function () {
                financialGraphs(vm.graphInfo);
                financialTables(vm.graphInfo);
            },500);
        }  

        function getService(currentDuration){
            vm.loadingProgress = true;
            apisUtils.getMidEastFinancialPerformance(currentDuration)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        vm.graphInfo = response.mideast_financial_performance;
                        vm.date = response.current_date_time;

                        $timeout(function () {
                            vm.loadingProgress = false;
                            financialGraphs(vm.graphInfo);
                            financialTables(vm.graphInfo);
                        },500);
                        
                        reInitializeGraphs();
                    }
                }, function(error) {
            });

            apisUtils.getAverageShipRunningExpense(currentDuration)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        vm.avgExpTableInfo = response.mideast_financial_performance;
                        vm.date = response.current_date_time;
                        avgExpTable(vm.avgExpTableInfo);
                    }
                }, function(error) {
            });
        }

        function captureCurrentDiv()
        {
            var scrollPos;
            scrollPos = document.body.scrollTop;
            $(document.body).css('overflow','auto');
            html2canvas(document.body, {  
                useCORS: true,
                allowTaint: true,
                onrendered: function(canvas)  
                {
                    window.scrollTo(0,scrollPos);
                    var img = canvas.toDataURL()
                    $.post("http://localhost/demos/screenshot/save.php", {data: img}, function (file) {
                    window.location.href =  "http://localhost/demos/screenshot/download.php?path="+ file});   
                }
            });
        }
    }

})();