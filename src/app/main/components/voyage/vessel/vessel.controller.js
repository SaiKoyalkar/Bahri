(function ()
{
    'use strict';

    angular
        .module('app.components.voyage.vessel')
        .controller('VesselController', VesselController);

    function VesselController(fuseTheming,uiGmapGoogleMapApi,$mdSidenav,$mdDialog,$timeout,$http,$stateParams,$scope,$location,commonUtils,apisVessel,apisUtils,usersApi)
    {

        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;
        vm.username = usersApi.getCookieUserFullName();
        vm.date = new Date();
        vm.currentUrl = $location.absUrl();
        vm.defaultGraphInfo = {};
        vm.exportGraphOptions = commonUtils.exportOptions();
        vm.currentExportOption = {"": "Export As"};
        vm.dataGraphView = true;
        vm.toggleSidenav = toggleSidenav;
        vm.sisteShips = [];
        vm.portCalls = [];
        vm.vessels = [];
        vm.durations = commonUtils.voyageDurations();
        vm.currentDuration = {"month" : "Month"};
        vm.currentSource = 'mips';
        vm.graphData= {}
        /*$scope.datePicker = {}
        $scope.datePicker.date = { startDate: null, endDate: null };*/


        if(typeof $stateParams.id == 'undefined' || $stateParams.id == ''){
            vm.loadingProgress = true;
            selectVessel();
        }

        $(window).resize(function(){
            console.log("asbdhasb")
           reInitializeGraphs(vm.graphData);
           reInitializeCircularGraphs();
           reInitializeAvgSlipGraphData();
        });

        var element = angular.element( document.querySelector( '.fold-toggle' ) );
            element.on('click', function(e){
            reInitializeGraphs(vm.graphData);
            reInitializeCircularGraphs();
            reInitializeAvgSlipGraphData()
        });

        vm.filterValues = {
            'vessel_id': $stateParams.id.toUpperCase(),
            'currentDuration': vm.currentDuration,
            'data_source': vm.currentSource,
            'report_type' : ['FAOP','EOSP','Noon Report'],
            'vessel_condition' : ['Loaded'],
            'running_hours_min' : 12,
            'wind_speed_min' : 0,
            'wind_speed_max' : 4,
            'sea_state_min' : 0,
            'sea_state_max' : 4,
            'fuelconsumption_type' : 'MEConsumed'
        };

        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }

        function voyageGraphs(graph){
            commonUtils.initializeSettings();
            if(graph && graph.vessel_performance.fuel_consumption && angular.element('#fuel-consumption-container').length){
                if(graph.vessel_performance.fuel_consumption.graphInfo.series.length >0)
                {
                    Highcharts.chart('fuel-consumption-container', commonUtils.getGraphsWithTooltip(graph.vessel_performance.fuel_consumption.graphInfo, 'Date'));
                }
            }

            if(graph && graph.vessel_performance.crew_fuel_consumption && angular.element('#crew-fuel-consumption-container').length){
                if(graph.vessel_performance.crew_fuel_consumption.graphInfo.series.length >0)
                {
                    Highcharts.chart('crew-fuel-consumption-container', commonUtils.getGraphsWithTooltip(graph.vessel_performance.crew_fuel_consumption.graphInfo, 'Avg Speed'));
                }
            }
            if(graph && graph.vessel_performance.fuel_consumption_sister_ship && graph.vessel_performance.fuel_consumption_sister_ship.graphInfo != undefined && angular.element('#fuel-consumption-new-sister-ship-container').length){

                vm.hideSisterShip = false;
                if(graph.vessel_performance.fuel_consumption_sister_ship.graphInfo != undefined && graph.vessel_performance.fuel_consumption_sister_ship.graphInfo.series.length >0)
                {
                    Highcharts.chart('fuel-consumption-new-sister-ship-container', commonUtils.getGraphsWithTooltip(graph.vessel_performance.fuel_consumption_sister_ship.graphInfo, 'Date'));
                }
            }
           else
            {
                vm.hideSisterShip =true;
            }




            /*if(graph && graph.fuel_consumption_sister_ship != undefined){
                vm.sisteShips = graph.fuel_consumption_sister_ship;
                $timeout(function() {
                    $.each(vm.sisteShips,function(key,value){
                        Highcharts.chart('comparision-fleet-container-'+key, commonUtils.customLineChart(value.graph.graphInfo));
                    });
                }, 500);
            }*/
        }
        function voyageCircularGraphs(graph){
            commonUtils.initializeSettings();

            if(graph && graph.vessel_performance.consumption && angular.element('#ytd-consumption').length){
                Highcharts.chart('ytd-consumption', commonUtils.activityChart(graph.vessel_performance.consumption.graphInfo,commonUtils.getNormalToolTip('MT/24h',false)));
            }

            if(graph && graph.vessel_performance.speed && angular.element('#ytd-speed').length){
                Highcharts.chart('ytd-speed', commonUtils.activityChart(graph.vessel_performance.speed.graphInfo,commonUtils.getNormalToolTip('Knots/24h',false)));
            }
            if(graph && graph.vessel_performance.savings && angular.element('#ytd-savings').length){
                Highcharts.chart('ytd-savings', commonUtils.activityChart(graph.vessel_performance.savings.graphInfo,commonUtils.getNormalToolTip('MT',false)));
            }

        }
            //line graph step 3
        function AvgSlipGraphData(graph){
            commonUtils.initializeSettings();
            console.log(graph);

            if(angular.element('#lineGraph').length){
                //TO DO: 
              Highcharts.chart('lineGraph',
              commonUtils.getGraphsWithTooltip
              
              (graph.avg_slip_graph.graphInfo, 'Date'));

            }

        }



        function selectVessel(){
            $mdDialog.show({
                controller         : 'SearchVesselDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/components/voyage/search-vessel/search-vessel-dialog.html',
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
            }).then(function(vessel_id) {
                if(vessel_id != undefined && vessel_id != '') {
                    $location.path("/components/voyage-economy/vessel/"+vessel_id);
                }
            }, function() {

            });
        }

        vm.showAdvanced = function(ev){
            $mdDialog.show({
                controller         : 'FilterVesselDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/components/voyage/filter/filter-dialog.html',
                parent: angular.element(document.body),
                //targetEvent: ev,
                clickOutsideToClose: false,
                locals:{
                    filterValues : vm.filterValues
                },
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

                    result.vessel_id = (result.vessel_id != '') ? result.vessel_id : $stateParams.id.toUpperCase();
                    result.currentDuration = vm.currentDuration;
                    vm.currentSource = result.data_source;
                    vm.filterValues = angular.copy(result);
                    delete result["selectedReports"];
                    delete result["selectedSailingConditions"];
                    getServices(result);
                    getPortCalls(result.vessel_id);
                    voyageEconomyGraph(result.vessel_id,vm.currentDuration);
                }
            }, function() {

            });
        }

        vm.changeDuration = function(){


            vm.filterValues.currentDuration = vm.currentDuration;
            getServices(vm.filterValues);
            getVessels();
            getPortCalls($stateParams.id.toUpperCase());
            voyageEconomyGraph($stateParams.id.toUpperCase(),vm.currentDuration);
        }

        var flag=0;
        vm.changeVessel = function(){
            /*getServices({
                'vessel_id' : vm.currentVessel
            });*/
            if( vm.currentVessel == -1)
            {
                flag++;
            }
            else
            {
                $location.path("/components/voyage-economy/vessel/"+vm.currentVessel.toLowerCase());
            }
           /* $location.path("/components/voyage-economy/vessel/"+vm.currentVessel);
            if(vm.currentVessel != undefined && vm.currentVessel != '') {

            }*/
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


        function reInitializeGraphs(graph){
            $timeout(function () {
                voyageGraphs(graph);
            },500);
        }
        function reInitializeCircularGraphs(graph){
            $timeout(function () {
                voyageCircularGraphs(graph);
            },500);
        }
        function reInitializeAvgSlipGraphData(graph){
            $timeout(function () {
                AvgSlipGraphData(graph);
            },500);
        }



        function getServices(filter_params) {
            vm.circularLoader = true;
            apisVessel.voyageEconomyVesselPerformanceGraph(filter_params)
                .then(function (response) {
                    if (vm.currentUrl == $location.absUrl()) {

                        if (response) {
                            vm.date = response.current_date_time;
                            $timeout(function () {
                                vm.circularLoader = false;
                                vm.graphData = response;
                                voyageGraphs(response);
                            }, 500);

                           // reInitializeGraphs(response.vessel);
                        }
                    }
                }, function (error) {
            });
            //line graph step 1
            apisVessel.voyageEconomyAvgSlipGraph(filter_params)
                .then(function (response) {
                    if (vm.currentUrl == $location.absUrl()) {

                        if (response) {
                            vm.date = response.current_date_time;
                            $timeout(function () {
                                vm.circularLoader = false;
                                vm.AvgSlipGraphData = response;
                                AvgSlipGraphData(response);
                            }, 500);

                           reInitializeAvgSlipGraphData(response);
                        }
                    }
                }, function (error) {
            });

            vm.loadingProgress = true;
            apisVessel.voyageEconomyVesselPerformance(filter_params)
                .then(function (response) {
                    if (vm.currentUrl == $location.absUrl()) {

                        if (response) {
                            vm.date = response.current_date_time;
                            vm.defaultGraphInfo = response.vessel_detail;
                            checkForEmptyData(vm.defaultGraphInfo)
                            $timeout(function () {
                                vm.loadingProgress = false;
                                voyageCircularGraphs(response);
                            }, 500);

                            reInitializeCircularGraphs(response);
                        }
                    }
                }, function (error) {
                });


        }

        function checkForEmptyData()
        {
            vm.defaultGraphInfo.hull_paint_type = (vm.defaultGraphInfo.hull_paint_type && vm.defaultGraphInfo.hull_paint_type != '') ? vm.defaultGraphInfo.hull_paint_type : 'NA';
            vm.defaultGraphInfo.last_dry_dock = (vm.defaultGraphInfo.last_dry_dock && vm.defaultGraphInfo.last_dry_dock != '') ? vm.defaultGraphInfo.last_dry_dock : 'NA';
            vm.defaultGraphInfo.next_dry_dock = (vm.defaultGraphInfo.next_dry_dock && vm.defaultGraphInfo.next_dry_dock != '') ? vm.defaultGraphInfo.next_dry_dock : 'NA';
        }

        function getVessels(){
            apisVessel.getVesselNamesList()
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        $timeout(function () {
                            vm.vessels = response;
                        },500);
                    }
                }, function(error) {
            });
        }

        function getPortCalls(vessel_id){
            apisUtils.getAisVesselPortCalls(vessel_id,'bahri')
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        if(response){
                            vm.portCalls = response.port_calls;
                        }
                    }
                }, function(error) {
            });
        }

        function voyageEconomyGraph(vessel_id,currentDuration){
            apisVessel.voyageEconomyRoutGraph(vessel_id,currentDuration)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        if(response){
                            /*setVessels(response.vessel_path)*/
                            //vm.portCalls = response.port_calls;
                        }
                    }
                }, function(error) {
            });
        }



    }

})();