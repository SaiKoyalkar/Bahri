(function ()
{
    'use strict';

    angular
        .module('app.components.bcc.overview')
        .controller('BccOverviewController', BccOverviewController);

    function BccOverviewController(fuseTheming,$mdSidenav,$timeout,$http,$location,commonUtils,apisUtils,usersApi)
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

        //console.log(localStorage.getItem("currentUserData"));

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
            $location.path("/components/bcc/" + module);
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

            if(data && data.bcc_financial_performance){
                var financialPerformance = data.bcc_financial_performance;

                vm.tceSpotMonth = financialPerformance.tce_spot.month[0];
                vm.tceSpotYTD   = financialPerformance.tce_spot.ytd[0];
                
                vm.revenueSpotMonth = financialPerformance.revenue_spot.month[0];
                vm.revenueSpotYTD   = financialPerformance.revenue_spot.ytd[0];

                vm.ebitdaSpotMonth = financialPerformance.ebitda_spot.month[0];
                vm.ebitdaSpotYTD   = financialPerformance.ebitda_spot.ytd[0];

                vm.revenuePoolMonth = financialPerformance.revenue_pool.month[0];
                vm.revenuePoolYTD   = financialPerformance.revenue_pool.ytd[0];

                if(angular.element('#bu-revenue-ebitda-month-container').length)
                    Highcharts.chart('bu-revenue-ebitda-month-container', commonUtils.activityChart(financialPerformance.bu_revenue_ebitda.month.graphInfo));    
                if(angular.element('#bu-revenue-ebitda-ytd-container').length)
                    Highcharts.chart('bu-revenue-ebitda-ytd-container', commonUtils.activityChart(financialPerformance.bu_revenue_ebitda.ytd.graphInfo));    
            }

            if(data && data.bcc_operational_performance){
                var operationalPerformance = data.bcc_operational_performance;

                vm.waitTimeMonth = operationalPerformance.wait_time.month[0];
                vm.waitTimeYTD   = operationalPerformance.wait_time.ytd[0];

                vm.utilizationMonth = operationalPerformance.utilization.month[0];
                vm.utilizationYTD   = operationalPerformance.utilization.ytd[0];
      
                vm.ballastDaysMonth = operationalPerformance.ballast_days.month[0];
                vm.ballastDaysYTD   = operationalPerformance.ballast_days.ytd[0];

                vm.openPositionMonth = operationalPerformance.open_position.month[0];
                vm.openPositionYTD   = operationalPerformance.open_position.ytd[0];

                if(angular.element('#volume-carried-month-container').length)
                    Highcharts.chart('volume-carried-month-container', operationalPerformance.volume_carried.month.graphInfo);
                if(angular.element('#volume-carried-ytd-container').length)
                    Highcharts.chart('volume-carried-ytd-container', operationalPerformance.volume_carried.ytd.graphInfo);
            }
        }

        function reInitializeGraphs(){
            $timeout(function () {
                overview(vm.overviewInfo);
            },500);
        }

        function getServices(){
            vm.loadingProgress = true;
            apisUtils.getBahriChemicalOverview()
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