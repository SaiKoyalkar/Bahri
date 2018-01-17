(function ()
{
    'use strict';

    angular
        .module('app.components.bgc.overview')
        .controller('BgcOverviewController', BgcOverviewController);

    function BgcOverviewController(fuseTheming,$mdSidenav,$timeout,$http,$location,commonUtils,apisUtils,usersApi)
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

        //console.log(usersApi.getStoredCookies('currentUserData'));

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
            $location.path("/components/bgc/" + module);
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

            if(data && data.bgc_financial_performance){
                var financialPerformance = data.bgc_financial_performance;

                vm.revenueTeuMonth = financialPerformance.revenue_teu.month[0];
                vm.revenueTeuYTD   = financialPerformance.revenue_teu.ytd[0];
                
                vm.revenueLinerMonth = financialPerformance.revenue_liner.month[0];
                vm.revenueLinerYTD   = financialPerformance.revenue_liner.ytd[0];

                vm.revenueSpProjectMonth = financialPerformance.revenue_special_project.month[0];
                vm.revenueSpProjectYTD   = financialPerformance.revenue_special_project.ytd[0];

                vm.runningExpDayMonth = financialPerformance.running_exp_day.month[0];
                vm.runningExpDayYTD   = financialPerformance.running_exp_day.ytd[0];

                if(angular.element('#bu-revenue-ebitda-month-container').length)
                    Highcharts.chart('bu-revenue-ebitda-month-container', commonUtils.activityChart(financialPerformance.bu_revenue_ebitda.month.graphInfo));    
                if(angular.element('#bu-revenue-ebitda-ytd-container').length)
                    Highcharts.chart('bu-revenue-ebitda-ytd-container', commonUtils.activityChart(financialPerformance.bu_revenue_ebitda.ytd.graphInfo));    
            }

            if(data && data.bgc_operational_performance){
                var operationalPerformance = data.bgc_operational_performance;

                vm.utilisationMonth = operationalPerformance.utilisation.month[0];
                vm.utilisationYTD   = operationalPerformance.utilisation.ytd[0];

                vm.portDaysMonth = operationalPerformance.port_days.month[0];
                vm.portDaysYTD   = operationalPerformance.port_days.ytd[0];

                vm.portTurnAroundMonth = operationalPerformance.port_turn_around.month[0];
                vm.portTurnAroundYTD   = operationalPerformance.port_turn_around.ytd[0];

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
            apisUtils.getBahriGeneralCargoOverview()
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