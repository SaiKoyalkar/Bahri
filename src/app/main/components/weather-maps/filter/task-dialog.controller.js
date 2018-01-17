(function ()
{
    'use strict';

    angular
        .module('app.components.maps')
        .controller('WeatherFilterDialogController', WeatherFilterDialogController);

    /** @ngInject */
    function WeatherFilterDialogController($mdDialog,$timeout,$q,$filter,$mdDateLocale,apisUtils)
    {
        var vm = this;

        vm.items = [];
        vm.selected = [];
        vm.filterForm = {};
        vm.filterForm.categories = [];
        vm.date = '';

        $mdDateLocale.formatDate = function(date) {
            return $filter('date')(vm.date, "dd-MM-yyyy");
        };

        getAisCategories();

        vm.submit = function(){
            var result = {};
            result.fleet_code = formatFleetCodes(vm.filterForm.categories);
            result.port_name = (!vm.port_name) ? '' : vm.port_name.display;
            result.eta = (!vm.date) ? '' : $filter('date')(vm.date, 'yyyy-MM-dd'); 
            $mdDialog.hide(result);
        }

        function formatFleetCodes(codes){
            var fleet_codes = [];
            $.each(codes,function(key,code){    
                fleet_codes.push(code.fleet_code);
            });
            return fleet_codes.join();
        }

        /* Auto Complete Starts */
        vm.port_name  = '';
        vm.searchText    = null;
        vm.querySearch   = querySearch;

        function querySearch (query) {
            return loadAll(query).then(function(response){
                var results = query ? response.filter( createFilterFor(query) ) : response;
                var deferred = $q.defer();
                $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
                return deferred.promise;
            });
        }

        function loadAll(query) {
            var allGroups = [];
            return apisUtils.getAisPortName(query)
                .then(function(response) {
                    allGroups = response.port_data;
                    return allGroups.map( function (group) {
                        return {
                            id: group.port_id,
                            value: group.port_name.toLowerCase(),
                            display: group.port_name
                        };
                    });

                }, function(error) {
            });
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(group) {
                return (group.value.indexOf(lowercaseQuery) === 0);
            };
        }


        /* Auto Complete Ends */

        /* Categories Checkbox starts */
        vm.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
              list.splice(idx, 1);
            }
            else {
              list.push(item);
            }

            vm.filterForm.categories = list;
        };

        vm.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };

        /* Categories Checkbox ends */


        /**
         * Close dialog
         */
        vm.closeDialog = function()
        {
            $mdDialog.hide();
        }

        function getAisCategories(){
            apisUtils.getAisFleetsCategories()
                .then(function(response) {
                    $timeout(function () {
                        vm.loadingProgress = false;
                        vm.items = response.fleets_data;
                    },500);
                }, function(error) {
            });
        }
    }
})();