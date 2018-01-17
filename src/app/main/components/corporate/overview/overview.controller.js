(function ()
{
    'use strict';

    angular
        .module('app.components.corporate.overview')
        .controller('CorporateOverviewController', CorporateOverviewController);

    function CorporateOverviewController(fuseTheming,$mdSidenav,$timeout,$http,$location,commonUtils,apisUtils,usersApi)
    {

        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;
        vm.dataGraphView = true;
        vm.toggleSidenav = toggleSidenav;
        vm.date = new Date();
        vm.currentUrl = $location.absUrl();
        vm.username = usersApi.getCookieUserFullName();
        vm.overviewInfo = {};
        vm.current_month = '';
        
        var btnGraph = angular.element( document.querySelector( '#btn-graph' ) );
        var btnTable = angular.element( document.querySelector( '#btn-table' ) );
        
        getServices();

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

        vm.navigateToModules = function (module){
            $location.path("/components/corporate/" + module);
        }

        vm.setGraphView = function(e){
            commonUtils.activeBtn(btnGraph,btnTable);
            
            vm.dataGraphView = true;
            reInitializeGraphs();
        }

        vm.setTableView = function(){
            vm.changedDurationValue = vm.currentDuration;
            commonUtils.activeBtn(btnTable,btnGraph);

            vm.dataGraphView = false;
            reInitializeGraphs();
        }

        function overview(data){
            
            commonUtils.initializeSettings();

            if(data.extra_params != undefined)
                vm.current_month  = data.extra_params.current_month;

            if(data && data.bahri_financial_performance){
                var financialPerformance = data.bahri_financial_performance;

                vm.groupRevenueMonth = financialPerformance.bu_revenue.month[0];
                vm.groupRevenueYTD   = financialPerformance.bu_revenue.ytd[0];
                
                vm.groupEbitdaMonth = financialPerformance.bu_ebitda.month[0];
                vm.groupEbitdaYTD   = financialPerformance.bu_ebitda.ytd[0];

                vm.groupEbitdaMarginMonth = financialPerformance.bu_ebitdamargin.month[0];
                vm.groupEbitdaMarginYTD   = financialPerformance.bu_ebitdamargin.ytd[0];

                if(angular.element('#bu-revenue-ebitda-month-container').length)
                    Highcharts.chart('bu-revenue-ebitda-month-container', commonUtils.activityChart(financialPerformance.bu_revenue_ebitda.month.graphInfo));    
                if(angular.element('#bu-revenue-ebitda-ytd-container').length)
                    Highcharts.chart('bu-revenue-ebitda-ytd-container', commonUtils.activityChart(financialPerformance.bu_revenue_ebitda.ytd.graphInfo));    
            }

            if(data && data.bahri_operational_performance){
                var operationalPerformance = data.bahri_operational_performance;

                vm.bahriOilMonth = operationalPerformance.bahri_oil_ebitda.month[0];
                vm.bahriOilYTD   = operationalPerformance.bahri_oil_ebitda.ytd[0];

                vm.bahriChemicalMonth = operationalPerformance.bahri_chemicals_ebitda.month[0];
                vm.bahriChemicalYTD   = operationalPerformance.bahri_chemicals_ebitda.ytd[0];

                vm.bahriDryBulkMonth = operationalPerformance.bahri_dry_bulk_ebitda.month[0];
                vm.bahriDryBulkYTD   = operationalPerformance.bahri_dry_bulk_ebitda.ytd[0];

                vm.bahriGeneralCargoMonth = operationalPerformance.bahri_general_cargo_ebitda.month[0];
                vm.bahriGeneralCargoYTD   = operationalPerformance.bahri_general_cargo_ebitda.ytd[0];

                vm.bahriMideastMonth = operationalPerformance.mideast_expsense.month[0];
                vm.bahriMideastYTD   = operationalPerformance.mideast_expsense.ytd[0];
            }

            if(data && data.bahri_ship_running_expenses){
                if(data && data.bahri_ship_running_expenses.vlcc.graphInfo && angular.element('#vlcc-expense-month-container').length)
                    Highcharts.chart('vlcc-expense-month-container', commonUtils.activityChart(data.bahri_ship_running_expenses.vlcc.graphInfo));

                if(data && data.bahri_ship_running_expenses.product_tanker.graphInfo && angular.element('#mr-expense-month-container').length)
                    Highcharts.chart('mr-expense-month-container', commonUtils.activityChart(data.bahri_ship_running_expenses.product_tanker.graphInfo));

                if(data && data.bahri_ship_running_expenses.drybulk.graphInfo && angular.element('#drybulk-expense-month-container').length)
                    Highcharts.chart('drybulk-expense-month-container', commonUtils.activityChart(data.bahri_ship_running_expenses.drybulk.graphInfo)); 
                
                if(data && data.bahri_ship_running_expenses.general_cargo.graphInfo && angular.element('#rocons-expense-month-container').length)
                    Highcharts.chart('rocons-expense-month-container', commonUtils.activityChart(data.bahri_ship_running_expenses.general_cargo.graphInfo));

                if(data && data.bahri_ship_running_expenses.chemical.graphInfo && angular.element('#chemical-expense-month-container').length)
                    Highcharts.chart('chemical-expense-month-container', commonUtils.activityChart(data.bahri_ship_running_expenses.chemical.graphInfo));
                
                if(data && data.bahri_ship_running_expenses.chemical_product.graphInfo && angular.element('#chemical-product-expense-month-container').length)
                    Highcharts.chart('chemical-product-expense-month-container', commonUtils.activityChart(data.bahri_ship_running_expenses.chemical_product.graphInfo));

                if(data && data.bahri_ship_running_expenses.vlcc.graphInfo && angular.element('#vlcc-expense-ytd-container').length)
                    Highcharts.chart('vlcc-expense-ytd-container', commonUtils.activityChart(data.bahri_ship_running_expenses.vlcc.graphInfo));

                if(data && data.bahri_ship_running_expenses.product_tanker.graphInfo && angular.element('#mr-expense-ytd-container').length)
                    Highcharts.chart('mr-expense-ytd-container', commonUtils.activityChart(data.bahri_ship_running_expenses.product_tanker.graphInfo));

                if(data && data.bahri_ship_running_expenses.drybulk.graphInfo && angular.element('#drybulk-expense-ytd-container').length)
                    Highcharts.chart('drybulk-expense-ytd-container', commonUtils.activityChart(data.bahri_ship_running_expenses.drybulk.graphInfo)); 
                
                if(data && data.bahri_ship_running_expenses.general_cargo.graphInfo && angular.element('#rocons-expense-ytd-container').length)
                    Highcharts.chart('rocons-expense-ytd-container', commonUtils.activityChart(data.bahri_ship_running_expenses.general_cargo.graphInfo));

                if(data && data.bahri_ship_running_expenses.chemical.graphInfo && angular.element('#chemical-expense-ytd-container').length)
                    Highcharts.chart('chemical-expense-ytd-container', commonUtils.activityChart(data.bahri_ship_running_expenses.chemical.graphInfo));
                
                if(data && data.bahri_ship_running_expenses.chemical_product.graphInfo && angular.element('#chemical-product-expense-ytd-container').length)
                    Highcharts.chart('chemical-product-expense-ytd-container', commonUtils.activityChart(data.bahri_ship_running_expenses.chemical_product.graphInfo));
            }

            if(data && data.bahri_market_sentiment){
                vm.marketPrediction = data.bahri_market_sentiment;
            }
        }

        function reInitializeGraphs(){
            $timeout(function () {
                overview(vm.overviewInfo);
            },500);
        }

        function getServices(){
            vm.loadingProgress = true;
            apisUtils.getBahriGroupOverview()
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        vm.overviewInfo = response;
                        vm.date = response.current_date_time;
                        
                        $timeout(function () {
                            vm.loadingProgress = false;
                            overview(vm.overviewInfo);
                        },500);
                        reInitializeGraphs();
                    }
                }, function(error) {
            });
        }

        
    }

})();