(function ()
{
    'use strict';

    angular
        .module('app.components.commodity')
        .controller('CommodityController', CommodityController);

    /** @ngInject */
    function CommodityController(uiGmapGoogleMapApi,$http,$scope,$interval,$location,$mdSidenav,$mdDialog,$timeout,commonUtils,apisUtils,usersApi)
    {
        var vm = this;

        // Data
        vm.toggleSidenav = toggleSidenav;
        vm.date = new Date();
        vm.username = usersApi.getCookieUserFullName();
        vm.current_month = '';
        vm.currentUrl = $location.absUrl();
        vm.exportGraphOptions = commonUtils.exportOptions();
        vm.currentExportOption = {"": "Export As"};
        vm.dataGraphView = true;
        vm.toggleSidenav = toggleSidenav;
        vm.sisteShips = [];
        vm.portCalls = [];
        vm.durations = commonUtils.durations();
        vm.currentDuration = {"month" : "Month"};
        vm.type = 'ldm';

        vm.filterParams = {};

        var element = angular.element( document.querySelector( '.fold-toggle' ) );
        element.on('click', function(e){       
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

       

        var btnGraph = angular.element( document.querySelector( '#btn-graph' ) );
        var btnTable = angular.element( document.querySelector( '#btn-table' ) );

        //intializeMap();


        vm.setGraphView = function(){
            commonUtils.activeBtn(btnGraph,btnTable);
            if(vm.changedDurationValue != vm.currentDuration) {
                reInitializeGraphs();
            }

            vm.type = 'ldm';
            getServices(vm.currentDuration,vm.type);

        }

        vm.setTableView = function(){
            vm.changedDurationValue = vm.currentDuration;
            commonUtils.activeBtn(btnTable,btnGraph);
            vm.type = 'adm';
            getServices(vm.currentDuration,vm.type);
        }

        vm.exportData = function(id,title){
            
            if(vm.currentExportOption != ""){
                commonUtils.exportGraph(id,title,vm.currentExportOption);
                vm.currentExportOption = "";
            }
        }

        vm.showAdvanced = function(ev) {
            $mdDialog.show({
                controller         : 'CommodityDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/components/commodity/dialog/commodity-dialog.html',
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
            }).then(function(result) {
                if(result != undefined) {
                    vm.filterParams = result;
                    commodityTrackerChartMapview(vm.currentDuration,vm.filterParams);
                }
            }, function() {
                
            });
        };


        //////////
        getServices('month',vm.type);
        commodityTrackerChartMapview('month',vm.filterParams);

        function commodityTrackerGraphs(data){
            commonUtils.initializeSettings();

            if(data && data.crude_imports && angular.element('#crude-imports').length){
                Highcharts.chart('crude-imports', data.crude_imports.graphInfo);
            }
            if(data && data.crude_exports && angular.element('#crude-exporters').length){
                Highcharts.chart('crude-exporters', data.crude_exports.graphInfo);
            }
            if(data && data.crude_imports_trand_patterns && angular.element('#crude-imports-trand-patterns').length){
                Highcharts.chart('crude-imports-trand-patterns', data.crude_imports_trand_patterns);
            }
        }

        function commodityTrackerMapChart(data){

            commonUtils.initializeSettings();

            if(data && data.country_port_volume && angular.element('#sankey-chart').length){    
                Highcharts.chart('sankey-chart', commonUtils.sankeyChart(data.country_port_volume));
            }
        }

        vm.changeDuration = function(){
            getServices(vm.currentDuration,vm.type);
            commodityTrackerChartMapview(vm.currentDuration,vm.filterParams);
        }

        function intializeMap(){
            
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

        function reInitializeGraphs(){
            $timeout(function () {
                commodityTrackerGraphs(vm.commodityInfo);
            },500);
        }

        function getServices(currentDuration,type){
            vm.loadingLDMProgress = true;
            apisUtils.commodityTrackerDraftMethod(currentDuration,type)
                .then(function(response) {
                    vm.date = response.current_date_time;
                    vm.commodityInfo = response;
                    $timeout(function () {
                        vm.loadingLDMProgress = false;
                        commodityTrackerGraphs(vm.commodityInfo);
                    },500);

                    reInitializeGraphs();

                }, function(error) {
            });
        }

        function commodityTrackerChartMapview(currentDuration,filterParams){
            vm.circularLoader = true;
            apisUtils.commodityTrackerChartMapview(currentDuration,filterParams)
                .then(function(response) {
                    vm.date = response.current_date_time;
                    vm.sankeyInfo = response;
                    $timeout(function () {
                        vm.circularLoader = false;
                        commodityTrackerMapChart(vm.sankeyInfo);
                    },500);

                    reInitializeGraphs();

                }, function(error) {
            });
        }
        vm.resetSankeygraph = function(){
            var result={};
            result.import_country =  "";
            result.import_port =  "";
            result.export_country_name =  "";
            result.export_port =  "";
            result.sailing_status = "";
            result.period = "";
            result.draft_method = "";
            //console.log("here")
            //$mdDialog.hide(result);
            vm.filterParams=result;
            commodityTrackerChartMapview(vm.currentDuration,vm.filterParams)
        }
    }

    

})();