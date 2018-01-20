(function ()
{
    'use strict';

    angular
        .module('app.components.voyage.fleet')
        .controller('FleetController', FleetController);

    function FleetController(fuseTheming,uiGmapGoogleMapApi,$mdSidenav,$mdDialog,$timeout,$http,$stateParams,$scope,$location,commonUtils,apisVessel,apisUtils,usersApi)
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
        vm.durations = commonUtils.durations();
        vm.currentDuration = {"month" : "Month"};
        vm.currentSource = 'mips';




        if(typeof $stateParams.id == 'undefined' || $stateParams.id == ''){
            vm.loadingProgress = true;
            selectFleet();
        }

        $(window).resize(function(){
           reInitializeGraphs();
        });

        var element = angular.element( document.querySelector( '.fold-toggle' ) );
            element.on('click', function(e){
            reInitializeGraphs();
        });

        //vm.filterValues={}
        vm.filterValues = {
                'business_unit' : $stateParams.id.toLowerCase(),
                'data_source' : vm.currentSource,
                'duration' : "month",
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

        /*function fleetGraphs(graph){
            commonUtils.initializeSettings();
            if(graph && graph.fuel_consumption && angular.element('#fuel-consumption-container').length){
                if(graph.fuel_consumption.graphInfo.series.length >0)
                {
                    Highcharts.chart('fuel-consumption-container', graph.fuel_consumption.graphInfo);
                }
            }

            if(graph && graph.average_speed && angular.element('#average-speed-container').length){
                if(graph.average_speed.graphInfo.series.length >0)
                {
                    Highcharts.chart('average-speed-container', graph.average_speed.graphInfo);
                }
            }
        }*/
        function fleetPerformanceGraphs(graph){
            commonUtils.initializeSettings();


            if(graph && graph.vessel_fleet.fuel_consumption && angular.element('#fuel-consumption-container').length){
                if(graph.vessel_fleet.fuel_consumption.graphInfo.series.length >0)
                {
                    Highcharts.chart('fuel-consumption-container'/*,
                    graph.vessel_fleet.fuel_consumption.graphInfo*/,commonUtils.getFleetPerformanceGraphsWithTooltip(graph.vessel_fleet.fuel_consumption.graphInfo));
                }
            }
            if(graph && graph.vessel_fleet.average_speed && angular.element('#average-speed-container').length){
                if(graph.vessel_fleet.average_speed.graphInfo.series.length >0)
                {
                    Highcharts.chart('average-speed-container'/*,
                    graph.vessel_fleet.average_speed.graphInfo*/,commonUtils.getFleetPerformanceGraphsWithTooltip(graph.vessel_fleet.average_speed.graphInfo));
                }
            }

            if(graph /*&& graph.bu_revenue*/ && angular.element('#ytd-consumption').length){
                Highcharts.chart('ytd-consumption', commonUtils.activityChart(graph.vessel_fleet.consumption.graphInfo,commonUtils.getNormalToolTip('MT/24h',false)));
            }

            if(graph /*&& graph.bu_revenue*/ && angular.element('#ytd-speed').length){
                Highcharts.chart('ytd-speed', commonUtils.activityChart(graph.vessel_fleet.speed.graphInfo,commonUtils.getNormalToolTip('Knots/24h',false)));
            }
            if(graph /*&& graph.bu_revenue*/ && angular.element('#ytd-savings').length){
                Highcharts.chart('ytd-savings', commonUtils.activityChart(graph.vessel_fleet.savings.graphInfo,commonUtils.getNormalToolTip('MT',false)));
            }

        }
        //grouped graph

        function engineAndTotalConsumptionSavingsGraph(graph){
          if(graph /*&& graph.bu_revenue*/ && angular.element('#groupedbargraph').length){
              Highcharts.chart('groupedbargraph', commonUtils.groupedColumnChart(graph.graphInfo.graphInfo));
          }

        }

        function selectFleet(){
            $mdDialog.show({
                controller         : 'SearchFleetDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/components/voyage/search-fleet/search-fleet-dialog.html',
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
            }).then(function(business_unit) {
                if(business_unit != undefined && business_unit != '') {
                    $location.path("/components/voyage-economy/fleet/"+business_unit);
                }
            }, function() {

            });
        }

        vm.showAdvanced = function(ev){
            $mdDialog.show({
                controller         : 'FilterFleetVesselDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/components/voyage/filter-fleet/filter-fleet-dialog.html',
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
            }).then(function(answer) {
                if(answer != undefined){
                    var result = answer;
                    //console.log(result)
                    result.business_unit = (result.business_unit != '') ? result.business_unit : $stateParams.id.toLowerCase();
                    result.duration = vm.currentDuration;
                    vm.currentSource = result.data_source;

                    vm.filterValues = angular.copy(result);
                    delete result["selectedReports"]
                    delete result["selectedSailingConditions"]

                    getServices(result);
                    vm.currentBusinessUnit = commonUtils.buNames()[$stateParams.id.toLowerCase()];
                }
            }, function() {

            });
        }

        vm.changeDuration = function(){
            /*getServices({
                'business_unit' : $stateParams.id.toLowerCase(),
                'data_source' : vm.currentSource,
                'duration' : vm.currentDuration,
            });*/

            vm.filterValues.currentDuration = vm.currentDuration;
            console.log(vm.filterValues)
            getServices(vm.filterValues);
            vm.currentBusinessUnit = commonUtils.buNames()[$stateParams.id.toLowerCase()];
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
                fleetPerformanceGraphs(graph);
            },500);
        }

        uiGmapGoogleMapApi.then(function(maps){
            $scope.map = {
                center: {
                    latitude: 0,
                    longitude: 0
                },
                options: {
                    backgroundColor : '#14224F',
                    mapTypeId: maps.MapTypeId.SATELLITE,
                    minZoom: 2
                },
                zoom: 2
            };

            $scope.polylines = [];
        });

        function setFleets(tradeInfo){
            uiGmapGoogleMapApi.then(function(maps){
                $scope.map = {
                    center: {
                        latitude: 0,
                        longitude: 0
                    },
                    options: {
                        backgroundColor : '#14224F',
                        mapTypeId: maps.MapTypeId.SATELLITE,
                        minZoom: 2
                    },
                    zoom: 2
                };

                $scope.polylines = setPolylines(tradeInfo);
            });
        }

        function setPolylines(tradeInfo){
            var polylines_arr = [];

            $.each(tradeInfo,function(trade_key,trade_value){

                var path_arr = [];
                $.each(trade_value,function(inner_trade_key,inner_trade_value){
                    path_arr.push({
                        latitude: inner_trade_value.latitude,
                        longitude: inner_trade_value.longitude
                    });

                });

                polylines_arr.push({
                    id: trade_key+1,
                    stroke: {
                        color: '#ff6600',
                        weight: 2
                    },
                    editable: true,
                    draggable: true,
                    geodesic: true,
                    visible: true,
                    icons: [{
                        icon: {
                            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW
                        },
                        offset: '25px',
                        repeat: '50px'
                    }],
                    path : path_arr
                });

            });

            return polylines_arr;
        }

        function getServices(filter_params){
            //console.log(filter_params)
            /*vm.circularLoader = true;
            apisVessel.voyageEconomyFleetGraph(filter_params)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        if(response){
                            vm.date = response.current_date_time;
                            fleetGraphs(response.voyage_economy);
                            vm.circularLoader = false;
                        }
                    }
                }, function(error) {
            });*/
            vm.loadingProgress = true;
            apisVessel.voyageEconomyFleetPerformance(filter_params)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        if(response){
                            vm.date = response.current_date_time;
                            fleetPerformanceGraphs(response);
                            vm.loadingProgress = false;
                        }
                    }
                }, function(error) {
            });
            //grouped graph
            apisVessel.engineAndTotalConsumptionSavingsGraph(filter_params)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        if(response){
                            vm.date = response.current_date_time;
                            engineAndTotalConsumptionSavingsGraph(response);
                            vm.loadingProgress = false;
                        }
                    }
                }, function(error) {
            });
        }
    }




})();