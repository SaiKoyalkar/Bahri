(function ()
{
    'use strict';


    angular
        .module('app.components.weather-maps')
        .controller('WeatherMapsController', WeatherMapsController);

   

    /** @ngInject */
    function WeatherMapsController($http,$rootScope,$window,$scope,$interval,$mdSidenav,$mdDialog,$timeout,commonUtils,apisUtils,usersApi)
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
        vm.toggleSidenav = toggleSidenav;
        vm.show = false;
        vm.currentMarker = false;
        vm.date = new Date();
        vm.username = usersApi.getCookieUserFullName();
        vm.vessels = usersApi.getCookieVessels();
        vm.vesselInfo = {};
        vm.vesselAISInfo = {};
        vm.current_month = '';
        vm.map = {};
        vm.storeMarkers = [];
        vm.currentOverlay = {"wind" : "wind"};
        vm.currentLevel = {"surface" : "surface"};

        vm.overlays = commonUtils.overlays();
        vm.levels = commonUtils.levels();

        

        setMapContainer();

        $(window).resize(function(){
           setMapContainer();
        });

        var element = angular.element( document.querySelector( '.fold-toggle' ) );
        element.on('click', function(e){       
            setMapContainer();
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

        vm.logout = function (){
            var user_id = usersApi.getCookieUserID();
            usersApi.logout(user_id);
        }

        vm.showAdvanced = function(ev) {
            $mdDialog.show({
                controller         : 'WeatherFilterDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/components/weather-maps/filter/task-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
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
                }
            }, function() {
                
            });
        };

        function showTooltip(ev){

            $mdDialog.show({
                controller         : 'TooltipDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/components/weather-maps/tooltip/tooltip-dialog.html',
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
            }, function() {
            });
        }
                
        //////////
        getServices();

        function showAllVessels(vessels){
            if(vm.vessels.indexOf('BOT') != -1)
            {
                vm.showBOT = vessels.bot;
                vm.showBOTCheckbox = true;
            }
            if(vm.vessels.indexOf('BCC') != -1){
                vm.showBCC = vessels.bcc;
                vm.showBCCCheckbox = true;
            }
            if(vm.vessels.indexOf('BDB') != -1){
                vm.showBDB = vessels.bdb;
                vm.showBDBCheckbox = true;
            }
            if(vm.vessels.indexOf('BGC') != -1){
                vm.showBGC = vessels.bgc;
                vm.showBGCCheckbox = true;
            }
            if(vm.vessels.indexOf('BDBAIS') != -1){
                vm.showBDBAIS = vessels.bdb_ais;
                vm.showBDBAISCheckbox = true;
            }
            if(vm.vessels.indexOf('BCCUACC') != -1){
                vm.showBCCUACC = vessels.bcc_uacc;
                vm.showBCCUACCFleetCheckbox = true;
            }

            if(vm.showBOT.length != 0 || vm.showBCC.length != 0 || vm.showBDB.length != 0 || vm.showBGC.length != 0 || vm.showBDBAIS.length != 0 || vm.showBCCUACC.length != 0)
            {
                vm.markers = vm.showBOT.concat(vm.showBCC).concat(vm.showBDB).concat(vm.showBGC).concat(vm.showBDBAIS).concat(vm.showBCCUACC);
                $scope.xyz(vm.map,vm.markers,2);
                //setVessels(vm.markers);
            }
        }

        function showAllAISVessels(vessels){
            if(vessels.vessel_data.length > 0){
                $scope.xyz(vm.map,vm.markers.concat(vessels.vessel_data),2);
                //setVessels(vm.markers.concat(vessels.vessel_data));
            } else {
                commonUtils.showToast('No vessels found','error');
            }
        }

        vm.showVessels = function(vessel,vesselType){
            switch ( vesselType )
            {
                case 'BOT':
                    if(!vessel)
                        vm.showBOT = [];
                    else
                        vm.showBOT = vm.vesselInfo.bot;
                    break;

                case 'BCC':
                    if(!vessel)
                        vm.showBCC = [];
                    else
                        vm.showBCC = vm.vesselInfo.bcc;
                    break;

                case 'BGC':
                    if(!vessel)
                        vm.showBGC = [];
                    else
                        vm.showBGC = vm.vesselInfo.bgc;
                    break;

                case 'BDB':
                    if(!vessel)
                        vm.showBDB = [];
                    else
                        vm.showBDB = vm.vesselInfo.bdb;
                    break;
                case 'BDBAIS':
                    if(!vessel)
                        vm.showBDBAIS = [];
                    else
                        vm.showBDBAIS = vm.vesselInfo.bdb_ais;
                    break;
                case 'BCCUACC':
                    if(!vessel)
                        vm.showBCCUACC = [];
                    else
                        vm.showBCCUACC = vm.vesselInfo.bcc_uacc;
                    break;

                default:
                    vm.showBOT = [];
                    vm.showBCC = [];
                    vm.showBDB = [];
                    vm.showBGC = [];
                    vm.showBDBAIS = [];
                    vm.showBCCUACC = [];
                    break;

            }

            vm.markers = vm.showBOT.concat(vm.showBCC).concat(vm.showBDB).concat(vm.showBGC).concat(vm.showBDBAIS).concat(vm.showBCCUACC);
            $scope.removeMarkers(vm.map);

            if(!Object.keys(vm.vesselAISInfo).length){
                $scope.xyz(vm.map,vm.markers,2);
            }else{
                $scope.xyz(vm.map,vm.markers.concat(vm.vesselAISInfo.vessel_data),2);
            }

            //setVessels(vm.markers);
        }

        function setVessels(markers){
            //console.log(markers);           
        }

        $scope.xyz = function(map, markers, zoom) {

               //vm.map = map;
            var $body = angular.element(document.body);   // 1
            var $rootScope = $body.scope().$root;   

            //console.log($rootScope.myMap);
            
                $rootScope.$apply(function () {
                    if(Object.keys(map).length) {               // 3
                        $rootScope.myMap = vm.map = map;
                    }else
                    {
                        vm.map = map = $rootScope.myMap;
                    }
                });

           
            var data = [];
            var marker = {};
            var title = '',loc='',lat = '',lng = '',marker = '';


            if (markers != '') {
                $.each(markers, function(marker_key, marker_value) {
                    if(marker_value.vessel_icon != undefined){
                        marker_value.is_ais_vessel = false;
                        data.push({
                            "lat": marker_value.latitude,
                            "lng": marker_value.longitude,
                            "title": marker_value.vessel_name,
                            "icons": marker_value.vessel_icon[zoom],
                            "size" : zoom,
                            "details":marker_value
                        });
                    } else {
                        marker_value.is_ais_vessel = true;
                        data.push({
                            "lat": marker_value.latitude,
                            "lng": marker_value.longitude,
                            "title": marker_value.vessel_name,
                            "icons": '',
                            "size" : zoom,
                            "details":marker_value
                        });
                    }
                });

                for (var i in data) {

                    if(data[i].icons != ''){
                        var Icons = L.icon({
                            iconUrl: data[i].icons
                        });
                        title = data[i].details, //value searched
                        loc = data[i].loc, //position found
                        lat = data[i].lat,
                        lng = data[i].lng,
                        marker = new L.Marker(new L.latLng([lat, lng]), {
                            icon: Icons,
                            vesselInfo: title
                        }).on('click', markerOnClick).addTo(map);

                    } else {
                        title = data[i].details, //value searched
                        loc = data[i].loc, //position found
                        lat = data[i].lat,
                        lng = data[i].lng,
                        marker = new L.circleMarker(new L.latLng([lat, lng]), {
                            radius: data[i].size + zoom,
                            color : 'yellow',
                            fillColor : 'yellow',
                            weight : data[i].size + zoom,
                            fillOpacity : 1.0,
                            vesselInfo:title
                        }).on('click', markerOnClick).addTo(map);

                    }
                    vm.storeMarkers.push(marker);
                } 
            }

           
            
            map.on('zoomend', function() {
                    var currentZoom = map.getZoom();
                    
                    if(currentZoom > 5)
                    {
                        
                        $scope.removeMarkers(map);
                        if(!Object.keys(vm.vesselAISInfo).length){
                            $scope.xyz(vm.map,vm.markers,5);
                        }else{
                            $scope.xyz(vm.map,vm.markers.concat(vm.vesselAISInfo.vessel_data),5);
                        }
                    } else {
                        $scope.removeMarkers(map);

                        if(!Object.keys(vm.vesselAISInfo).length){
                            $scope.xyz(vm.map,vm.markers,2);
                        }else{
                            $scope.xyz(vm.map,vm.markers.concat(vm.vesselAISInfo.vessel_data),2);
                        }
                    }
            });


            

            var 
            overlays = document.getElementById('overlays'),
            levels = document.getElementById('levels'),
            state = document.getElementById('state');

            //Handle change of overlay
            vm.changeOverlays = function(event){
                W.setOverlay(vm.currentOverlay)
            }  

            //Handle change of level
            vm.changeLevels = function(event){
                W.setLevel(vm.currentLevel);
            }

            // Display actual state of a map
            W.on('redrawFinished', function(displayedParams) {
            })

            function markerOnClick(e)
            {
                showTooltip(this.options);
                //map.setZoom(10);
                //showTooltip(model);
                var lat = e.latlng.lat;
                var lng = e.latlng.lng;
                
                var str = '<iframe width="97%" height="220"  id="iframe1" src="https://embed.windy.com/embed2.html?lat='+lat+'&lon='+lng+'&type=forecast&metricWind=kt&metricTemp=%C2%B0C" frameborder="0"></iframe>';
                    //.append($("<style type='text/css'>  .my-class{display:none;}  </style>"));
                document.getElementById("preview").style.display = "block"; 
                document.getElementById("preview").innerHTML = str;
                document.getElementById("forecastid").style.display = "block";
    
            }


        }

        $scope.removeMarkers = function(map) {
            if(vm.storeMarkers.length != 0){
                for (var i in vm.storeMarkers) {
                    map.removeLayer(vm.storeMarkers[i]);
                } 
            }

            return true;
        }

        vm.closeForecast = function(){
            document.getElementById("forecastid").style.display = "none";
            document.getElementById("preview").style.display = "none"; 
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

        function setMapContainer(){
            
            angular.element( document.querySelector( '#windyty' ) ).css('height',$window.innerHeight - 128);
            angular.element( document.querySelector( '#windyty' ) ).css('width',$window.innerWidth);
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

    

})();
