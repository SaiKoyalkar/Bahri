(function ()
{
    'use strict';

    angular
        .module('app.components.maps')
        .controller('SearchFleetDialogController', SearchFleetDialogController);

    /** @ngInject */
    function SearchFleetDialogController($mdDialog,$timeout,$location,$q,$filter,$mdDateLocale,apisVessel,commonUtils)
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

        /* Auto Complete Starts */
        vm.vessel_name  = '';
        function loadAll() {
            vm.loadingProgress = true;
            vm.units = commonUtils.businessUnits();
            vm.loadingProgress = false;
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