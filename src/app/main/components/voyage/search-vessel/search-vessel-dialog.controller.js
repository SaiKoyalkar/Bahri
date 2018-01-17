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

        loadAll();

        vm.submit = function(){
            $mdDialog.hide(vm.currentVessel.toLowerCase());
        }

        vm.currentVessel = {
            "vessel_id" : "-1",
            "vessel_name" : "Select Vessel"
        };

        /* Auto Complete Starts */
        vm.vessel_name  = '';        

        function loadAll() {
            vm.loadingProgress = true;
            apisVessel.getVesselNamesList()
                .then(function(response) {
                    vm.loadingProgress = false;
                    vm.vessels = response;
                }, function(error) {
            });
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