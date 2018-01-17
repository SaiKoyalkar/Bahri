(function ()
{
    'use strict';

    angular
        .module('app.components.bot.overview')
        .controller('BotOverviewController', BotOverviewController);

    function BotOverviewController(fuseTheming,$mdSidenav,$timeout,$http,$location,commonUtils,apisUtils,usersApi)
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

        $(window).resize(function(){
           reInitializeGraphs();
        });
        
        var element = angular.element( document.querySelector( '.fold-toggle' ) );
        element.on('click', function(e){       
            reInitializeGraphs();
        });
        
        getServices();
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
            $location.path("/components/bot/" + module);
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

            if(data && data.bot_financial_performance){
                var financialPerformance = data.bot_financial_performance;

                vm.tceFixturesMonth = financialPerformance.tce_fixtures.month[0];
                vm.tceFixturesYTD   = financialPerformance.tce_fixtures.ytd[0];
                
                vm.tceRevenueMonth = financialPerformance.revenue.month[0];
                vm.tceRevenueYTD   = financialPerformance.revenue.ytd[0];

                vm.tceEbitdaOwnedMonth = financialPerformance.ebitda_owned.month[0];
                vm.tceEbitdaOwnedYTD   = financialPerformance.ebitda_owned.ytd[0];

                vm.tceEbitdaCharterInMonth = financialPerformance.ebitda_charter_in.month[0];
                vm.tceEbitdaCharterInYTD   = financialPerformance.ebitda_charter_in.ytd[0];


                if(angular.element('#bu-revenue-ebitda-month-container').length)
                    Highcharts.chart('bu-revenue-ebitda-month-container', commonUtils.activityChart(financialPerformance.bu_revenue_ebitda.month.graphInfo));    
                
                if(angular.element('#bu-revenue-ebitda-ytd-container').length)
                    Highcharts.chart('bu-revenue-ebitda-ytd-container', commonUtils.activityChart(financialPerformance.bu_revenue_ebitda.ytd.graphInfo));    
            }

            if(data && data.bot_operational_performance){
                var operationalperformance = data.bot_operational_performance;

                vm.bblLiftingMonth = operationalperformance.bbl_lifting.month[0];
                vm.bblLiftingYTD   = operationalperformance.bbl_lifting.ytd[0];

                vm.utilizationMonth = operationalperformance.utilization.month[0];
                vm.utilizationYTD   = operationalperformance.utilization.ytd[0];
      
                vm.ballastDaysMonth = operationalperformance.ballast_days.month[0];
                vm.ballastDaysYTD   = operationalperformance.ballast_days.ytd[0];

                vm.openPositionMonth = operationalperformance.open_position.month[0];
                vm.openPositionYTD   = operationalperformance.open_position.ytd[0];

                if(angular.element('#vlcc-month-container').length)
                    Highcharts.chart('vlcc-month-container', commonUtils.activityChart(operationalperformance.vlcc.graphInfo));    
                
                if(angular.element('#vlcc-ytd-container').length)
                    Highcharts.chart('vlcc-ytd-container', commonUtils.activityChart(operationalperformance.vlcc.graphInfo));    
            }

            if(data && data.bot_market_prediction){
                vm.marketPrediction = data.bot_market_prediction;
            if(data && data.bot_fr_prediction)
                vm.freightratePrediction = data.bot_fr_prediction;
            }
            if(data && data.bot_wsrate_prediction)
                vm.wsratePrediction = data.bot_wsrate_prediction;
        }

        function reInitializeGraphs(){
            $timeout(function () {
                overview(vm.overviewInfo);
            },500);
        }
    
        function getServices(){
            vm.loadingProgress = true;
            apisUtils.getBahriOilOverview()
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        vm.date = response.current_date_time;
                        vm.overviewInfo = response;
                        
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