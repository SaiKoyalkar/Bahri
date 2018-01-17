(function ()
{
    'use strict';

    angular
        .module('app.components.voyage.daily')
        .controller('DailyController', DailyController);

    function DailyController(fuseTheming,uiGmapGoogleMapApi,$mdSidenav,$mdDialog,$timeout,$http,$stateParams,$scope,$location,commonUtils,apisVessel,apisUtils,usersApi,$state)
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
        vm.currentDuration = {"year" : "Year"};
        vm.currentSource = 'marorka';
        vm.currentVessel='';
        vm.fuelTypeValues=[]

        vm.loadingProgress = true;
        getVessels();
        // Data
        var currentState = $state.current.name;
        
        vm.selectedFuelType='MEConsumed'
        vm.fuelConsumptionType = [{
            'id': "MEConsumed",
            'name': 'Main Engine Consumption'
        },
        {
            'id': "BoilerConsumed",
            'name': 'Boiler Consumption'
        },
        {
            'id': "AuxConsumed",
            'name': 'Auxiliary Consumption'
        },
        {
            'id': "ConsumedTotal",
            'name': 'Total Consumption'
        },
        ];

        
       

        

        if(typeof $stateParams.id == 'undefined' || $stateParams.id == ''){
            vm.loadingProgress = true;
            selectVessel();
        }

        $(window).resize(function(){
           reInitializeGraphs();
        });
        
        var element = angular.element( document.querySelector( '.fold-toggle' ) );
            element.on('click', function(e){       
            reInitializeGraphs();
        });

        vm.filterValues = {
            'vessel_id': $stateParams.id.toUpperCase(),
            'currentDuration': vm.currentDuration,
            'data_source': vm.currentSource
        };

        

        // CHECK SELECTED TAB
        
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
            if(graph && graph.fuel_consumption && angular.element('#fuel-consumption-container').length){
                if(graph.fuel_consumption.graphInfo.series.length >0)
                {
                    Highcharts.chart('fuel-consumption-container', commonUtils.getGraphsWithTooltip(graph.fuel_consumption.graphInfo, 'Date'));
                }
            }
            
            if(graph && graph.crew_fuel_consumption && angular.element('#crew-fuel-consumption-container').length){
                if(graph.crew_fuel_consumption.graphInfo.series.length >0)
                {
                    Highcharts.chart('crew-fuel-consumption-container', commonUtils.getGraphsWithTooltip(graph.crew_fuel_consumption.graphInfo, 'Avg Speed'));
                }
                
            }

            if(graph && graph.fuel_consumption_in_6hours && angular.element('#fuel-hour-container').length){
                if(graph.fuel_consumption_in_6hours.graphInfo.series.length >0)
                {
                    Highcharts.chart('fuel-hour-container',commonUtils.getGraphsWithTooltip(graph.fuel_consumption_in_6hours.graphInfo, 'Date'));
                }
                
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
                    $location.path("/components/voyage-economy/daily/"+vessel_id);
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
                    vm.currentVessel_id = result.vessel_id;
                    
                    vm.filterValues = angular.copy(result);
                    delete result["selectedReports"]
                    delete result["selectedSailingConditions"]

                    
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
                $location.path("/components/voyage-economy/daily/"+vm.currentVessel.toLowerCase());
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


        vm.getFuelConsumption = function()
        {
            vm.circularLoader=true;
            
            apisVessel.voyageDailyPerformanceStatus($stateParams.id.toUpperCase())
                .then(function(response) {

                   
                    /* response.status.forEach(function(element) {
                        console.log(element)
                    }, this); */
                    var i = 0;
                   // var fuelConsumptionDataTable1 
                   vm.circularLoader = false;
                   if(angular.isDefined(response))
                   {
                        if(Object.keys(response.status).length)
                        {
                            for(var date in response.status)
                            {
                                if(i == 0)
                                {
                                    vm.fuelConsumptionDataTable1Date = date;
                                    vm.fuelConsumptionDataTable1 =  response.status[date]
                                }
                                else if(i == 1)
                                {
                                    vm.fuelConsumptionDataTable2Date = date;
                                    vm.fuelConsumptionDataTable2 =  response.status[date]
                                }
                                else{
                                    vm.fuelConsumptionDataTable3Date = date;
                                    vm.fuelConsumptionDataTable3 =  response.status[date]
                                }
                                i++;
                            } 
                            vm.fuelConsumptionData = response.status;
                            vm.fuelConsumptionAlerts = response.status_error;
                           
                            vm.MainEngineErrorTable1 = 0;
                            vm.TotalConsumptionErrorTable1 = 0;
                            vm.GpsSpeedErrorTable1 = 0;
                            vm.LogSpeedErrorTable1 = 0;
                            vm.AvgSpeedErrorTable1 = 0;


                            vm.MainEngineErrorTable2 = 0;
                            vm.TotalConsumptionErrorTable2 = 0;
                            vm.GpsSpeedErrorTable2 = 0;
                            vm.LogSpeedErrorTable2 = 0;
                            vm.AvgSpeedErrorTable2 = 0;


                            vm.MainEngineErrorTable3 = 0;
                            vm.TotalConsumptionErrorTable3 = 0;
                            vm.GpsSpeedErrorTable3 = 0;
                            vm.LogSpeedErrorTable3 = 0;
                            vm.AvgSpeedErrorTable3 = 0;

                            vm.table1data = [];
                            if(angular.isDefined(vm.fuelConsumptionDataTable1))
                            {
                                for(i=0;i<vm.fuelConsumptionDataTable1.length ; i++)
                                {
                                    if(vm.fuelConsumptionDataTable1[i].main_engine_error == 1)
                                        vm.MainEngineErrorTable1 = 1
                                    if(vm.fuelConsumptionDataTable1[i].total_consumption_error == 1)
                                        vm.TotalConsumptionErrorTable1 = 1
                                    if(vm.fuelConsumptionDataTable1[i].gps_speed_error == 1)
                                        vm.GpsSpeedErrorTable1 = 1
                                    if(vm.fuelConsumptionDataTable1[i].log_speed_error == 1)
                                        vm.LogSpeedErrorTable1 = 1
                                    if(vm.fuelConsumptionDataTable1[i].avg_speed_error == 1)
                                        vm.AvgSpeedErrorTable1 = 1


                                    if(vm.fuelConsumptionDataTable1[i].source == "MIPS")
                                        vm.table1data[0] = angular.copy(vm.fuelConsumptionDataTable1[i])
                                    else if(vm.fuelConsumptionDataTable1[i].source == "Marorka")
                                        vm.table1data[1] = angular.copy(vm.fuelConsumptionDataTable1[i])
                                    else if(vm.fuelConsumptionDataTable1[i].source == "IMOS")
                                        vm.table1data[2] = angular.copy(vm.fuelConsumptionDataTable1[i])
                                }
                            }
                            vm.table2data = [];
                            if(angular.isDefined(vm.fuelConsumptionDataTable2))
                            {
                                for(i=0;i<vm.fuelConsumptionDataTable2.length ; i++)
                                {
                                    if(vm.fuelConsumptionDataTable2[i].main_engine_error == 1)
                                        vm.MainEngineErrorTable2 = 1
                                    if(vm.fuelConsumptionDataTable2[i].total_consumption_error == 1)
                                        vm.TotalConsumptionErrorTable2 = 1
                                    if(vm.fuelConsumptionDataTable2[i].gps_speed_error == 1)
                                        vm.GpsSpeedErrorTable2 = 1
                                    if(vm.fuelConsumptionDataTable2[i].log_speed_error == 1)
                                        vm.LogSpeedErrorTable2 = 1
                                    if(vm.fuelConsumptionDataTable2[i].avg_speed_error == 1)
                                        vm.AvgSpeedErrorTable2 = 1

                                    if(vm.fuelConsumptionDataTable2[i].source == "MIPS")
                                        vm.table2data[0] = angular.copy(vm.fuelConsumptionDataTable2[i])
                                    else if(vm.fuelConsumptionDataTable2[i].source == "Marorka")
                                        vm.table2data[1] = angular.copy(vm.fuelConsumptionDataTable2[i])
                                    else if(vm.fuelConsumptionDataTable2[i].source == "IMOS")
                                        vm.table2data[2] = angular.copy(vm.fuelConsumptionDataTable2[i])
                                }
                            }
                            vm.table3data = [];
                            if(angular.isDefined(vm.fuelConsumptionDataTable3))
                            {
                                if(angular.isDefined(vm.fuelConsumptionDataTable3)){
                                    for(i=0;i<vm.fuelConsumptionDataTable3.length ; i++)
                                    {
                                        if(vm.fuelConsumptionDataTable3[i].main_engine_error == 1)
                                            vm.MainEngineErrorTable3 = 1
                                        if(vm.fuelConsumptionDataTable3[i].total_consumption_error == 1)
                                            vm.TotalConsumptionErrorTable3 = 1
                                        if(vm.fuelConsumptionDataTable3[i].gps_speed_error == 1)
                                            vm.GpsSpeedErrorTable3 = 1
                                        if(vm.fuelConsumptionDataTable1[i].log_speed_error == 1)
                                            vm.LogSpeedErrorTable3 = 1
                                        if(vm.fuelConsumptionDataTable1[i].avg_speed_error == 1)
                                            vm.AvgSpeedErrorTable3 = 1

                                        if(vm.fuelConsumptionDataTable3[i].source == "MIPS")
                                            vm.table3data[0] = angular.copy(vm.fuelConsumptionDataTable3[i])
                                        else if(vm.fuelConsumptionDataTable3[i].source == "Marorka")
                                            vm.table3data[1] = angular.copy(vm.fuelConsumptionDataTable3[i])
                                        else if(vm.fuelConsumptionDataTable3[i].source == "IMOS")
                                            vm.table3data[2] = angular.copy(vm.fuelConsumptionDataTable3[i])
                                    }
                                }
                            }
                            //Check for matching Values
                            if(angular.isDefined(vm.fuelConsumptionDataTable1)){
                                if (vm.fuelConsumptionDataTable1[0].main_engine == vm.fuelConsumptionDataTable1[1].main_engine) {
                                    if (vm.fuelConsumptionDataTable1[2].main_engine != vm.fuelConsumptionDataTable1[1].main_engine) {
                                        vm.MainEngineErrorTable1 = 1
                                        response.status_error.push('For Main Engine MIPS, Marorka and IMOS are not matching.')
                                    }
                                }
                                else {
                                    vm.MainEngineErrorTable1 = 1
                                    response.status_error.push('For Main Engine MIPS, Marorka and IMOS are not matching.')
                                }
                                
                                if (vm.fuelConsumptionDataTable1[0].total_consumption == vm.fuelConsumptionDataTable1[1].total_consumption) {
                                    if (vm.fuelConsumptionDataTable1[2].total_consumption != vm.fuelConsumptionDataTable1[1].total_consumption) {
                                        vm.TotalConsumptionErrorTable1 = 1
                                        response.status_error.push('For Total Consumption MIPS, Marorka and IMOS are not matching.')
                                    }
                                }
                                else {
                                    vm.TotalConsumptionErrorTable1 = 1
                                    response.status_error.push('For Total Consumption MIPS, Marorka and IMOS are not matching.')
                                } 
                            }
                            if(angular.isDefined(vm.fuelConsumptionDataTable2)){
                                if (vm.fuelConsumptionDataTable2[0].main_engine == vm.fuelConsumptionDataTable2[1].main_engine) {
                                    if (vm.fuelConsumptionDataTable2[2].main_engine != vm.fuelConsumptionDataTable2[1].main_engine) {
                                        vm.MainEngineErrorTable2 = 1
                                    }
                                }
                                else {
                                    vm.MainEngineErrorTable2 = 1
                                }
                                
                                if (vm.fuelConsumptionDataTable2[0].total_consumption == vm.fuelConsumptionDataTable2[1].total_consumption) {
                                    if (vm.fuelConsumptionDataTable2[2].total_consumption != vm.fuelConsumptionDataTable2[1].total_consumption) {
                                        vm.TotalConsumptionErrorTable2 = 1
                                    }
                                }
                                else {
                                    vm.TotalConsumptionErrorTable2 = 1
                                } 
                            }
                            if(angular.isDefined(vm.fuelConsumptionDataTable3)){
                                if (vm.fuelConsumptionDataTable3[0].main_engine == vm.fuelConsumptionDataTable3[1].main_engine) {
                                    if (vm.fuelConsumptionDataTable3[2].main_engine != vm.fuelConsumptionDataTable3[1].main_engine) {
                                        vm.MainEngineErrorTable3 = 1
                                    }
                                }
                                else {
                                    vm.MainEngineErrorTable3 = 1
                                }
                                
                                if (vm.fuelConsumptionDataTable3[0].total_consumption == vm.fuelConsumptionDataTable3[1].total_consumption) {
                                    if (vm.fuelConsumptionDataTable3[2].total_consumption != vm.fuelConsumptionDataTable3[1].total_consumption) {
                                        vm.TotalConsumptionErrorTable3 = 1
                                    }
                                }
                                else {
                                    vm.TotalConsumptionErrorTable3 = 1
                                } 
                            }


                            
                            //vm.tempTable1[0] = angular.copy(vm.fuelConsumptionDataTable3.indexOf("MIPS"));
                            //console.log(vm.fuelConsumptionDataTable3[0].indexOf("MIPS"))
                        }
                    }
                }, function(error) {
            });
            
        }

        vm.changeFuelType = function(fuelType)
        {
            //console.log("Here",fuelType)
            vm.selectedFuelType = fuelType;
            vm.reInitializeGraphs()
        }

        vm.reInitializeGraphs =function()
        {
            vm.circularLoader=true;
            vm.currentUrl = $location.absUrl();

            var current_fuel=vm.selectedFuelType;
            apisVessel.voyageDailyPerformanceAnalytics($stateParams.id.toUpperCase(),vm.selectedFuelType)
                .then(function(response) {
                    if (current_fuel == vm.selectedFuelType) {
                        vm.circularLoader = false;
                        reInitializeGraphs(response.daily_performance)
                    }
                    
                }, function(error) {
            });
            //reInitializeGraphs(vm.currentVessel);
        }
        
        function reInitializeGraphs(graph){
            voyageGraphs(graph);
            /*$timeout(function () {
                voyageGraphs(graph);
            },500);*/
        }

        

        /*   GOOGLE MAP STARTS   */

        

        uiGmapGoogleMapApi.then(function (maps)
        {

            vm.satelliteMap = {
                center: {
                    latitude : 0,
                    longitude: 0
                },
                options: {
                        backgroundColor : '#14224F',
                        mapTypeId: maps.MapTypeId.SATELLITE,
                        minZoom: 2
                },
                zoom  : 2
            };
            
            vm.satelliteMap.polylines =[];

        });

        function setVessels(tradeInfo){
            uiGmapGoogleMapApi.then(function(maps){
                vm.satelliteMap = {
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

                vm.polylines = setPolylines(tradeInfo);
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

        /*  GOOGLE MAP  ENDS  */

        function getServices(filter_params){
            /*vm.loadingProgress = true;
            apisVessel.getVesselComparisonGraph(filter_params)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        if(response){
                            vm.date = response.current_date_time;
                            vm.defaultGraphInfo = response.vessel_detail;

                            $timeout(function () {
                                vm.loadingProgress = false;
                                vm.currentVessel = response.vessel;
                            },500);

                        }
                    }
                }, function(error) {
            });*/

            
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
            vm.loadingProgress = true;
            apisVessel.voyageDailyPerformanceRoutGraph(vessel_id,currentDuration)
                .then(function(response) {
                    vm.loadingProgress = false;
                    if(vm.currentUrl == $location.absUrl()){
                        if(response){
                            setVessels(response.vessel_path)
                            vm.vesselDetails = response.vessel_detail;
                            vm.voyage_detail = response.voyage_detail;
                            checkForEmptyData()
                            //vm.portCalls = response.port_calls;
                        }
                    }
                }, function(error) {
            });
        }


        function checkForEmptyData()
        {
            //Team Table
            vm.vesselDetails.master = (vm.vesselDetails.master && vm.vesselDetails.master != '') ? vm.vesselDetails.master : 'NA';
            vm.vesselDetails.cheif_engineer = (vm.vesselDetails.cheif_engineer && vm.vesselDetails.cheif_engineer != '') ? vm.vesselDetails.cheif_engineer : 'NA';
            vm.vesselDetails.superintendent = (vm.vesselDetails.superintendent && vm.vesselDetails.superintendent != '') ? vm.vesselDetails.superintendent : 'NA';
            vm.vesselDetails.voyage_manager = (vm.vesselDetails.voyage_manager && vm.vesselDetails.voyage_manager != '') ? vm.vesselDetails.voyage_manager : 'NA';
            
            //Vessel Details : Top Left Table
            vm.vesselDetails.hull_paint_type = (vm.vesselDetails.hull_paint_type && vm.vesselDetails.hull_paint_type != '') ? vm.vesselDetails.hull_paint_type : 'NA';
            vm.vesselDetails.last_dry_dock = (vm.vesselDetails.last_dry_dock && vm.vesselDetails.last_dry_dock != '') ? vm.vesselDetails.last_dry_dock : 'NA';
            vm.vesselDetails.next_dry_dock = (vm.vesselDetails.next_dry_dock && vm.vesselDetails.next_dry_dock != '') ? vm.vesselDetails.next_dry_dock : 'NA';
            
            //Voyage Details : Middle Table
            vm.voyage_detail.voyage_order_speed = (vm.voyage_detail.voyage_order_speed && vm.voyage_detail.voyage_order_speed != '') ? vm.voyage_detail.voyage_order_speed : 'NA';
            vm.voyage_detail.draft = (vm.voyage_detail.draft && vm.voyage_detail.draft != '') ? vm.voyage_detail.draft : 'NA';
            vm.voyage_detail.wind_force = (vm.voyage_detail.wind_force && vm.voyage_detail.wind_force != '') ? vm.voyage_detail.wind_force : 'NA';
            vm.voyage_detail.vessel_state = (vm.voyage_detail.vessel_state && vm.voyage_detail.vessel_state != '') ? vm.voyage_detail.vessel_state : 'NA';
        }
        

        vm.statusTable=[
            {
                vessel_name : "Marorka",
                main_engine : 64.2,
                consumption : 66.5,
                gps_speed : 12.6,
                log_speed : 12.5
            },
            {
                vessel_name : "MIPS",
                main_engine : 72.3,
                consumption : 74.8,
                gps_speed : 12.6,
                log_speed : 12.5
            },
            {
                vessel_name : "IMOS",
                main_engine : 71.4,
                consumption : 75.6,
                gps_speed : 12.6,
                log_speed : 12.5
            }
        ]

        
        switch (currentState) {
            case 'app.components_voyage_daily':
                vm.selectedIndex = 0;
                vm.getFuelConsumption()
                break;

            case 'app.components_voyage_daily.satellite':
                vm.selectedIndex = 1;
                break;

            case 'app.components_voyage_daily.terrain':
                vm.selectedIndex = 2;
                vm.reInitializeGraphs()
                break;



            default:
                vm.selectedIndex = 0;
        }

        //HIDING ALERTS 
        $scope.hideParent = function (event) {
            /*var pEle = event.currentTarget.parentElement;
            pEle.style.visibility = "hidden";*/
            angular.element(event.target).parent().parent().addClass('hidden');
        }
        
    }

})();