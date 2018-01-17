(function ()
{
    'use strict';

    angular
        .module('app.components.pattern')
        .controller('VesselPatternController', VesselPatternController);

    /** @ngInject */
    function VesselPatternController(uiGmapGoogleMapApi,$http,$scope,$interval,$mdSidenav,$mdDialog,$timeout,commonUtils,apisVessel,usersApi)
    {
        var vm = this;

        // Data
        vm.toggleSidenav = toggleSidenav;
        vm.date = new Date();
        vm.username = usersApi.getCookieUserFullName();
        vm.vesselTradeInfo = {};
        vm.current_month = '';


        var element = angular.element( document.querySelector( '.fold-toggle' ) );
            element.on('click', function(e){  
                console.log("re")     
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

        vm.logout = function (){
            var user_id = usersApi.getCookieUserID();
            usersApi.logout(user_id);
        }

        //intializeMap();

        vm.showAdvanced = function(ev) {
            $mdDialog.show({
                controller         : 'PatternDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/components/pattern/filter/pattern-dialog.html',
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
                    getServices(answer);
                }
            }, function() {
                
            });
        };

        //////////
        getServices('');

        function intializeMap(){
            //console.log('test');
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
                    zoom: 2,
                    markers:[],
                };
            });

        }
        
        function setVessels(tradeInfo,markers){
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
                    zoom: 2,
                    markers: getAllMarkers(markers,maps,2),
                    events:{
                        zoom_changed: function(marker, eventName, args) {
                            if(marker.zoom <= 5)
                                $scope.map.markers = getAllMarkers(markers,maps,2); 
                            else
                                $scope.map.markers = getAllMarkers(markers,maps,5);
                        }
                    },
                };

                //$scope.polylines = setStaticPolylines();
                $scope.polylines = setPolylines(tradeInfo);
            });
        }

        function getAllMarkers(markers,maps,zoom){
            return markers.map( function (marker,key) {
                return {
                    id : key, 
                    latitude : marker.latitude,
                    longitude : marker.longitude,
                    options : {
                        icon : {
                            anchor  : new maps.Point(5, 20),
                            path    : google.maps.SymbolPath.CIRCLE,
                            scale   : zoom,
                            strokeWeight: zoom,
                            strokeColor: marker.color,
                            fillColor: marker.color,
                            fillOpacity: 1.0
                        }
                    }
                };
            });
        }

        function setStaticPolylines(){
            return [
                {
                    id: 1,
                    path: [
                        {
                            latitude: 45,
                            longitude: -74
                        },
                        {
                            latitude: 30,
                            longitude: -89
                        },
                        {
                            latitude: 37,
                            longitude: -122
                        },
                        {
                            latitude: 60,
                            longitude: -95
                        }
                    ],
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
                    }]
                },
                {
                    id: 2,
                    path: [
                        {
                            latitude: 47,
                            longitude: -74
                        },
                        {
                            latitude: 32,
                            longitude: -89
                        },
                        {
                            latitude: 39,
                            longitude: -122
                        },
                        {
                            latitude: 62,
                            longitude: -95
                        }
                    ],
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
                    }]
                }
            ];
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
                    editable: false,
                    draggable: false,
                    geodesic: false,
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

        function getServices(result){
            vm.loadingProgress = true;
            apisVessel.getVesselTradePatterns(result)
                .then(function(response) {
                    vm.date = response.current_date_time;
                    vm.marketPrediction = response.oil_tanker;
                    $timeout(function () {
                        vm.loadingProgress = false;
                        setVessels(response.vessel_path,response.vessel_trade_pattern);
                    },500);
                }, function(error) {
            });
        }
    }

    

})();