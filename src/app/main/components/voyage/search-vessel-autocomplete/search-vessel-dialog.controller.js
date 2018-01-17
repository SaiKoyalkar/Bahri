(function ()
{
    'use strict';

    angular
        .module('app.components.maps')
        .controller('SearchVesselDialogController', SearchVesselDialogController);

    /** @ngInject */
    function SearchVesselDialogController($mdDialog,$timeout,$location,$q,$filter,$mdDateLocale,apisVessel)
    {
        var vm = this;

        vm.items = [];
        vm.selected = [];
        vm.filterForm = {};
        vm.date = '';

        vm.submit = function(){
            $mdDialog.hide(vm.vessel_name.id.toLowerCase());
        }


        /* Auto Complete Starts */
        vm.vessel_name  = '';
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
            return apisVessel.getVesselName(query)
                .then(function(response) {
                    allGroups = response;
                    return allGroups.map( function (group) {
                        return {
                            id: group.vessel_id.toLowerCase(),
                            value: group.vessel_name.toLowerCase(),
                            display: group.vessel_name
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

        /**
         * Close dialog
         */
        vm.closeDialog = function()
        {
            $location.path("/components/maps");
            $mdDialog.hide();
        }
    }
})();