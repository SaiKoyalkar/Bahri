(function ()
{
    'use strict';

    angular
        .module('app.components.msml.overview')
        .controller('MsmlOverviewController', MsmlOverviewController);

    function MsmlOverviewController(fuseTheming,$mdSidenav,$timeout,$http,$location,commonUtils,apisUtils,usersApi)
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
        
        getServices();

        var btnGraph = angular.element( document.querySelector( '#btn-graph' ) );
        var btnTable = angular.element( document.querySelector( '#btn-table' ) );

        /*var element = angular.element( document.querySelector( '.fold-toggle' ) );
        element.on('click', function(e){       
            reInitializeGraphs();
        });*/
        
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
            $location.path("/components/msml/" + module);
        }

        vm.setGraphView = function(e){
            commonUtils.activeBtn(btnGraph,btnTable);
            vm.dataGraphView = true;
        }

        vm.setTableView = function(){
            vm.changedDurationValue = vm.currentDuration;
            commonUtils.activeBtn(btnTable,btnGraph);

            vm.dataGraphView = false;
        }

        function overview(data){
            if(data){
                vm.financialPerformanceMonth    = data.mideast_financial_performance.month;
                vm.operationalPerformanceMonth  = data.mideast_operational_performance.month;

                vm.financialPerformanceYTD      = data.mideast_financial_performance.ytd;
                vm.operationalPerformanceYTD    = data.mideast_operational_performance.ytd;

                if(data.extra_params != undefined)
                    vm.current_month = data.extra_params.current_month;

                if(data.bcc_bunker_prediction)
                    vm.bunkerPrediction = data.bcc_bunker_prediction;
            }
        }

        function getServices(){
            vm.loadingProgress = true;
            apisUtils.getMideastOverview()
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        vm.date = response.current_date_time;
                        vm.overviewInfo = response;

                        $timeout(function () {
                            vm.loadingProgress = false;
                            overview(vm.overviewInfo);
                        },500);
                    }
                }, function(error) {
            });      
        }
    }

})();