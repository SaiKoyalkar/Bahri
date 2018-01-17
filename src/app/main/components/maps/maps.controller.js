(function ()
{
    'use strict';

    angular
        .module('app.components.maps')
        .controller('MapsController', MapsController);

    /** @ngInject */
    function MapsController(uiGmapGoogleMapApi,$http,$scope,$window,$q,$interval,$mdSidenav,$mdDialog,$timeout,commonUtils,apisUtils,usersApi)
    {
        var vm = this;

        // Data
        vm.markers = [];
        vm.showBOT = [];
        vm.showBCC = [];
        vm.showBDB = [];
        vm.showBGC = [];
        vm.showBDBAIS = [];
        vm.showBCCUACC = [];
        vm.bahri_vessels = [];
        vm.toggleSidenav = toggleSidenav;
        vm.show = false;
        vm.currentMarker = false;
        vm.date = new Date();
        vm.username = usersApi.getCookieUserFullName();
        vm.vessels = usersApi.getCookieVessels();
        vm.vesselInfo = {};
        vm.vesselAISInfo = {};
        vm.current_month = '';
        vm.is_first_time = true;

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

        vm.showAdvanced = function(ev) {
            $mdDialog.show({
                controller         : 'TaskDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/components/maps/filter/task-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                locals:{
                    vessels : vm.vessels,
                    bahri_vessels : vm.bahri_vessels
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
                if(answer != undefined) {
                    getAISVessels(answer);
                    showVessels(answer.bahri_vessels);
                }
            }, function() {
                
            });
        };

        function showTooltip(ev){

            $mdDialog.show({
                controller         : 'TooltipDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/components/maps/tooltip/tooltip-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                locals: {
                    markerDetails: ev
                },
                openFrom : {
                  top: -50,
                  width: 30,
                  height: 80
                },
                closeTo : {
                    bottom: 1500
                }
            }).then(function(answer) {
                $scope.customMarkerMap.center.latitude = 0;
                $scope.customMarkerMap.center.longitude = 0;
                $scope.customMarkerMap.zoom = 2;
            }, function() {
                $scope.customMarkerMap.center.latitude = 0;
                $scope.customMarkerMap.center.longitude = 0;
                $scope.customMarkerMap.zoom = 2;
            });
        }
                
        //////////
        getServices();
        function showAllVessels(vessels){

            vm.is_first_time = false;

            if(vm.vessels.indexOf('BOT') != -1)
            {
                vm.showBOT = vessels.bot;
                vm.bahri_vessels.push('BOT');
            }
            if(vm.vessels.indexOf('BCC') != -1){
                vm.showBCC = vessels.bcc;
                vm.bahri_vessels.push('BCC');
            }
            if(vm.vessels.indexOf('BDB') != -1){
                vm.showBDB = vessels.bdb;
                vm.bahri_vessels.push('BDB');
            }
            if(vm.vessels.indexOf('BGC') != -1){
                vm.showBGC = vessels.bgc;
                vm.bahri_vessels.push('BGC');
            }
            if(vm.vessels.indexOf('BDBAIS') != -1){
                vm.showBDBAIS = vessels.bdb_ais;
                vm.bahri_vessels.push('BDBAIS');
            }
            if(vm.vessels.indexOf('BCCUACC') != -1){
                vm.showBCCUACC = vessels.bcc_uacc;
                vm.bahri_vessels.push('BCCUACC');
            }

            if(vm.showBOT.length != 0 || vm.showBCC.length != 0 || vm.showBDB.length != 0 || vm.showBGC.length != 0 || vm.showBDBAIS.length != 0 || vm.showBCCUACC.length != 0)
            {
                vm.markers = vm.showBOT.concat(vm.showBCC).concat(vm.showBDB).concat(vm.showBGC).concat(vm.showBDBAIS).concat(vm.showBCCUACC);
                setVessels(vm.markers);
                vm.searchVessel = loadAll(vm.markers);
            }
        }

        function showAllAISVessels(vessels){
            if(vessels.vessel_data.length > 0){
                setVessels(vm.markers.concat(vessels.vessel_data));
                vm.searchVessel = loadAll(vm.markers.concat(vessels.vessel_data));
            } else {
                commonUtils.showToast('No vessels found','error');
            }
        }

        vm.navigateToWeatherMap = function(){
            $window.location.href = usersApi.getBaseURL()+'/components/weather-maps';
        }

        function showVessels(vesselTypes){
            vm.bahri_vessels = [];
            if(!vm.is_first_time) {
                vm.bahri_vessels = vesselTypes;
            }

            if(vesselTypes.indexOf('BOT') != -1){
                vm.showBOT = vm.vesselInfo.bot;                
            } else {
                vm.showBOT = [];
            }

            if(vesselTypes.indexOf('BCC') != -1){
                vm.showBCC = vm.vesselInfo.bcc;
            } else {
                vm.showBCC = [];
            }

            if(vesselTypes.indexOf('BGC') != -1){
                vm.showBGC = vm.vesselInfo.bgc;
            } else {
                vm.showBGC = [];
            }

            if(vesselTypes.indexOf('BDB') != -1){
                vm.showBDB = vm.vesselInfo.bdb;
            } else {
                vm.showBDB = [];
            }

            if(vesselTypes.indexOf('BDBAIS') != -1){
                vm.showBDBAIS = vm.vesselInfo.bdb_ais;
            } else {
                vm.showBDBAIS = [];
            }

            if(vesselTypes.indexOf('BCCUACC') != -1){
                vm.showBCCUACC = vm.vesselInfo.bcc_uacc;
            } else {
                vm.showBCCUACC = [];
            }

            vm.markers = vm.showBOT.concat(vm.showBCC).concat(vm.showBDB).concat(vm.showBDBAIS).concat(vm.showBCCUACC);
            setVessels(vm.markers);
            vm.searchVessel = loadAll(vm.markers);
        }

        vm.toggleBahriVessels = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
              list.splice(idx, 1);
            }
            else {
              list.push(item);
            }

            vm.filterForm.bahri_vessels = list;
        };

        uiGmapGoogleMapApi.then(function (maps){});

        function setVessels(markers){
            uiGmapGoogleMapApi.then(function (maps)
            {
                $scope.customMarkerMap = {
                    center: {
                        latitude : 0,
                        longitude: 0
                    },
                    options: {
                        backgroundColor : '#14224F',
                        mapTypeId: maps.MapTypeId.SATELLITE,
                        minZoom: 2
                    },
                    zoom  : 2,
                    markers: getAllMarkers(markers,maps,2),
                    markersEvents: {
                        click: function(marker, eventName, model) {

                            $scope.customMarkerMap.center.latitude = model.latitude;
                            $scope.customMarkerMap.center.longitude = model.longitude;
                            $scope.customMarkerMap.zoom = 10;
                            showTooltip(model);

                            /*$scope.customMarkerMap.window.model = model;
                            $scope.customMarkerMap.window.show = true;*/
                        },
                    },
                    events:{
                        zoom_changed: function(marker, eventName, args) {
                            if(marker.zoom <= 5)
                                $scope.customMarkerMap.markers = getAllMarkers(markers,maps,2); 
                            else
                                $scope.customMarkerMap.markers = getAllMarkers(markers,maps,5);
                        }
                    },
                    window: {
                        marker: {},
                        show: false,
                        closeClick: function() {
                          this.show = false;
                        },
                        options: {} 
                    }
                };

            });

           /* $scope.$watch('customMarkerMap.zoom', function(newVal, oldVal){
              if(oldVal != newVal){
               console.log("Zoom Changed from: " + $scope.customMarkerMap.zoom);
              }
            }, true);*/
        }

        function getAllMarkers(markers,maps,zoom){
            var vessels = [];
            var vessels_data = [];
            var counter = 0;
            $(markers).each(function (marker_index, marker) {
                
                if(!marker.is_ais_vessel){
                    vessels.push({
                        id : counter, 
                        /*coords : {
                            latitude : marker.latitude,
                            longitude : marker.longitude
                        },*/
                        latitude : marker.latitude,
                        longitude : marker.longitude,
                        animation: google.maps.Animation.DROP,
                        options : {
                            icon : {
                                anchor  : new maps.Point(5, 20),
                                origin  : new maps.Point(0, 0),
                                position: new maps.Point(5, 0),
                                url     : marker.vessel_icon[zoom],
                                //url     : '//google-developers.appspot.com/maps/documentation/javascript/examples/full/images/beachflag.png',
                                //url     : "http://192.168.1.169//bahri_apis//img//vessel-icons//bot//1//1.png",
                            }
                        },
                        vesselInfo : {
                            is_ais_vessel : false,
                            port_calls : (marker.port_calls != undefined) ? marker.port_calls : [],
                            destination_port : marker.destination_port,
                            departure_port : marker.departure_port,
                            eta : marker.eta,
                            status : marker.status,
                            voyagemanager_name : marker.voyagemanager_name,
                            superintendent_name : marker.superintendent_name,
                            imo_number : marker.imo_number,
                            vessel_name : marker.vessel_name,
                            vessel_id : marker.vessel_id,
                            vessel_category : marker.vessel_category,
                            vessel_image : (marker.vessel_image != undefined) ? marker.vessel_image : "",
                            vessel_type : marker.vessel_type,
                            alert_type : marker.alert_type,
                            alert : marker.alert,
                            speed : marker.speed,
                            angle : marker.angle,
                            latitude : marker.latitude,
                            longitude : marker.longitude,
                            chartering_specialist : (marker.chartering_specialist != undefined) ? marker.chartering_specialist : undefined,
                            charterer : (marker.charterer != undefined) ? marker.charterer : undefined,
                            cargo : (marker.cargo != undefined) ? marker.cargo : undefined
                        }
                    });
                } else {
                    vessels.push({
                        id : counter, 
                        latitude : marker.latitude,
                        longitude : marker.longitude,
                        options : {
                            icon : {
                                anchor  : new maps.Point(5, 20),
                                path    : google.maps.SymbolPath.CIRCLE,
                                scale   : zoom,
                                strokeWeight: zoom,
                                strokeColor: 'yellow',
                                fillColor: 'yellow',
                                fillOpacity: 1.0
                            }
                        },
                        vesselInfo : {
                            is_ais_vessel : true,
                            vessel_id : marker.vessel_id,
                            speed : marker.speed
                        }
                    });
                }
                counter++;
            });
            return vessels;
        }

        $interval(function () {
            getServices();
        },1800000);

        function getServices(){
            vm.loadingProgress = true;
            apisUtils.getVessels()
                .then(function(response) {
                    vm.date = response.current_date_time;
                    vm.vesselInfo = response;
                    $timeout(function () {
                        vm.loadingProgress = false;
                        showAllVessels(vm.vesselInfo);
                    },500);
                }, function(error) {
            });
        }

        function getAISVessels(request){
            if(request.fleet_code != ''){
                vm.loadingProgress = true;
                vm.vesselAISInfo = {};
                apisUtils.getAisVesselData(request)
                    .then(function(response) {
                        vm.date = response.current_date_time;
                        vm.vesselAISInfo = response;
                        $timeout(function () {
                            vm.loadingProgress = false;
                            showAllAISVessels(vm.vesselAISInfo);
                        },500);
                    }, function(error) {
                        vm.loadingProgress = false;
                        commonUtils.showToast('No vessels found','error');
                });
            }
        }


         /* Auto Complete Starts */
        vm.port_name  = '';
        vm.searchText    = null;
        vm.querySearch   = querySearch;

        function querySearch (query) {
            var results = query ? vm.searchVessel.filter( createFilterFor(query) ) : vm.searchVessel;
            var deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;
        }

        function loadAll(markers) {
            vm.totalMarkers = markers;
            return vm.totalMarkers.map( function (group) {
                return {
                    id: group.imo_number,
                    value: group.vessel_name.toLowerCase(),
                    display: group.vessel_name,
                    latitude : group.latitude,
                    longitude : group.longitude
                };
            });

        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(group) {
                return (group.value.indexOf(lowercaseQuery) === 0);
            };
        }

        vm.selectMarker = function(item){
            $scope.customMarkerMap.center.latitude = item.latitude;
            $scope.customMarkerMap.center.longitude = item.longitude;
            $scope.customMarkerMap.zoom = 10;
        }

        /* Auto Complete Ends */
    }

    

})();