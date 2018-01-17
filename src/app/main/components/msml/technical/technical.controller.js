(function ()
{
    'use strict';

    angular
        .module('app.components.msml.technical')
        .controller('MsmlTechnicalPerformanceController', MsmlTechnicalPerformanceController);

    function MsmlTechnicalPerformanceController(fuseTheming,$mdDialog,$mdSidenav,$timeout,$http,$location,commonUtils,apisUtils,usersApi)
    {

        var vm = this;

        // Data

        vm.themes = fuseTheming.themes;
        vm.username = usersApi.getCookieUserFullName();
        vm.date = new Date();
        vm.currentUrl = $location.absUrl();
        vm.graphInfo = {};
        vm.exportGraphOptions = commonUtils.exportOptions();
        vm.currentExportOption = {"": "Export As"};
        vm.dataGraphView = true;

        vm.durations = commonUtils.durations();
        vm.currentDuration = {"month" : "Month"};

        getServices({'currentDuration' : 'month'});

        $(window).resize(function(){
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

        vm.showAdvanced = function(ev){
            $mdDialog.show({
                controller         : 'FilterVesselDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/components/vessel/filter/filter-dialog.html',
                parent: angular.element(document.body),
                //targetEvent: ev,
                clickOutsideToClose: false,
                openFrom : {
                  top: -50,
                  width: 30,
                  height: 80
                },
                closeTo : {
                    left: 1500
                }
            }).then(function(result) {
                if(result != undefined){
                    result.currentDuration = vm.currentDuration;
                    getServices(result);
                }
            }, function() {
                
            });
        }

        vm.changeDuration = function(){
            getServices({'currentDuration' : vm.currentDuration});
        }

        vm.exportData = function(id,title){
            if(vm.currentExportOption != ""){
                commonUtils.exportGraph(id,title,vm.currentExportOption);
                vm.currentExportOption = "";
            }
        }

        vm.logout = function (){
            var user_id = usersApi.getCookieUserID();
            usersApi.logout(user_id);
        }


        function technicalPerformance(data){
            commonUtils.initializeSettings();

            if(data && data.bulk_carrier)
                Highcharts.chart('bulk-carrier-container', data.bulk_carrier.graphInfo);

            if(data && data.chemical_product_tanker)
                Highcharts.chart('chemical-product-tanker-container', data.chemical_product_tanker.graphInfo);

            if(data && data.chemical_tanker)
                Highcharts.chart('chemical-tanker-container', data.chemical_tanker.graphInfo);

            if(data && data.crude_oil_tanker)
                Highcharts.chart('crude-oil-tanker-container', data.crude_oil_tanker.graphInfo);

            if(data && data.product_tanker)
                Highcharts.chart('product-tanker-container', data.product_tanker.graphInfo);

            if(data && data.ro_ro)
                Highcharts.chart('ro-ro-container', data.ro_ro.graphInfo);
        }

        function reInitializeGraphs(){
            $timeout(function () {
                technicalPerformance(vm.graphInfo);
            },500);
        }

        function getServices(filter_params){
            
            vm.loadingProgress = true;
            apisUtils.getMideastTechnicalPerformance(filter_params)
                .then(function(response) {
            
                    if(vm.currentUrl == $location.absUrl()){
                        vm.date = response.current_date_time;
                        vm.graphInfo = response.mideast_technical_performance;
                        $timeout(function () {
                            vm.loadingProgress = false;
                            technicalPerformance(vm.graphInfo);
                        },500);

                        reInitializeGraphs();
                    }
                }, function(error) {
            });      
        }
    }

})();