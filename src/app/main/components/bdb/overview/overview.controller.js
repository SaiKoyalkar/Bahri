(function ()
{
    'use strict';

    angular
        .module('app.components.bdb.overview')
        .controller('BdbOverviewController', BdbOverviewController);

    function BdbOverviewController(fuseTheming,$mdSidenav,$timeout,$http,$location,$state,commonUtils,apisUtils,usersApi)
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
            $location.path("/components/bdb/" + module);
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

            if(data && data.bdb_financial_performance){
                var financialPerformance = data.bdb_financial_performance;

                vm.tceMonth = financialPerformance.tce.month[0];
                vm.tceYTD   = financialPerformance.tce.ytd[0];
                
                vm.revenueMonth = financialPerformance.revenue.month[0];
                vm.revenueYTD   = financialPerformance.revenue.ytd[0];

                vm.ebitdaMarginMonth = financialPerformance.ebitda_margin.month[0];
                vm.ebitdaMarginYTD   = financialPerformance.ebitda_margin.ytd[0];

                vm.revenueTimeMonth = financialPerformance.revenue_time.month[0];
                vm.revenueTimeYTD   = financialPerformance.revenue_time.ytd[0];

                if(angular.element('#bu-revenue-ebitda-month-container').length)
                    Highcharts.chart('bu-revenue-ebitda-month-container', commonUtils.activityChart(financialPerformance.bu_revenue_ebitda.month.graphInfo));    
                if(angular.element('#bu-revenue-ebitda-ytd-container').length)
                    Highcharts.chart('bu-revenue-ebitda-ytd-container', commonUtils.activityChart(financialPerformance.bu_revenue_ebitda.ytd.graphInfo));    
            }

            if(data && data.bdb_operational_performance){
                var operationalPerformance = data.bdb_operational_performance;

                vm.volumeMonth = operationalPerformance.volume.month[0];
                vm.volumeYTD   = operationalPerformance.volume.ytd[0];

                vm.voyageDaysMonth = operationalPerformance.voyage_days.month[0];
                vm.voyageDaysYTD   = operationalPerformance.voyage_days.ytd[0];
      
                vm.offhireDaysMonth = operationalPerformance.offhire_days.month[0];
                vm.offhireDaysYTD   = operationalPerformance.offhire_days.ytd[0];

                vm.activeVoyagesMonth = operationalPerformance.active_voyages[0];
                vm.activeVoyagesYTD   = operationalPerformance.active_voyages[0];

                vm.activeVoyagesWeekMonth = operationalPerformance.active_voyages_week[0];
                vm.activeVoyagesWeekYTD   = operationalPerformance.active_voyages_week[0];
            }
        }
    
        function reInitializeGraphs(){
            $timeout(function () {
                overview(vm.overviewInfo);
            },500);
        }
        
        function getServices(){
            vm.loadingProgress = true;
            apisUtils.getBahriDryBulkOverview()
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