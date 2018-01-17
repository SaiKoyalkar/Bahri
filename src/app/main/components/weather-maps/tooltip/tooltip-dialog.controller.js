(function ()
{
    'use strict';

    angular
        .module('app.components.maps')
        .controller('TooltipDialogController', TooltipDialogController);

    /** @ngInject */
    function TooltipDialogController($mdDialog,$timeout,$location,apisUtils,markerDetails)
    {
        var vm = this;

        vm.items = [];
        vm.selected = [];
        vm.filterForm = {};
        vm.filterForm.categories = [];
        vm.date = '';
        vm.markerDetails = markerDetails;
        vm.aisMarkerDetails = {};
        vm.markerPortCalls = [];
        vm.markerAlerts = [];

        var is_ais_vessel_details = false;
        var is_vessel_port_calls = false;
        var is_vessel_alert_calls = false;

        if(vm.markerDetails.vesselInfo.alert !== undefined && vm.markerDetails.vesselInfo.alert != 1){
            $timeout(function() {
                var alert_tab = angular.element( document.querySelector('.md-tab:nth-child(3)'));  
                alert_tab.css({'background':'#d32f2f','color':'#ffffff'});
            }, 500);
        }
    
        vm.onTabChanges = function(currentIndex){
            switch ( currentIndex )
            {
                case 1:
                    if(!is_ais_vessel_details && vm.markerDetails.vesselInfo.is_ais_vessel == true){
                        getAisVesselDetail(vm.markerDetails.vesselInfo.vessel_id);
                    }
                    break;
                case 2:
                    if(!is_vessel_port_calls && vm.markerDetails.vesselInfo.is_ais_vessel == true){
                        getAisVesselPortCalls(vm.markerDetails.vesselInfo.vessel_id,'ais');
                    }
                    break;
                case 3:
                    if(vm.markerDetails.vesselInfo.alert !== undefined && vm.markerDetails.vesselInfo.alert != 1){
                        var alert_tab = angular.element( document.querySelector('.md-tab:nth-child(3)'));  
                        alert_tab.removeAttr( 'style' );
                    }

                    if(!is_vessel_alert_calls && vm.markerDetails.vesselInfo.is_ais_vessel == false){
                        getVesselAlertCalls(vm.markerDetails.vesselInfo.imo_number);
                    }
                    break;
            }
        }

        vm.navigateToVoyage = function(vessel_id){
            this.closeDialog();
            $location.path("/components/vessel/voyage-economy/"+vessel_id.toLowerCase());
        }

        /**
         * Close dialog
         */
        vm.closeDialog = function()
        {   
            is_ais_vessel_details = false;
            is_vessel_port_calls = false;
            is_vessel_alert_calls = false;

            $mdDialog.hide();
        }

        function getAisVesselDetail(vessel_id){
            vm.loadingProgress = true;
            apisUtils.getAisVesselDetail(vessel_id)
                .then(function(response) {
                    vm.aisMarkerDetails = response.vessel_detail;
                    $timeout(function () {
                        is_ais_vessel_details = true;
                        vm.loadingProgress = false;
                    },500);
                }, function(error) {
            });
        }

        function getVesselAlertCalls(imo_number){
            vm.loadingProgress = true;
            apisUtils.getVesselAlertCalls(imo_number)
                .then(function(response) {
                    if(response != undefined)
                        vm.markerAlerts = response.vessel_alert;
                    $timeout(function () {

                        is_vessel_alert_calls = true;
                        vm.loadingProgress = false;
                    },500);
                }, function(error) {
            });
        }

        function getAisVesselPortCalls(vessel_id,vessel_type){
            vm.loadingProgress = true;
            apisUtils.getAisVesselPortCalls(vessel_id,vessel_type)
                .then(function(response) {
                    if(response.port_calls != undefined)
                        vm.markerDetails.vesselInfo.port_calls = response.port_calls;
                    $timeout(function () {

                        is_vessel_port_calls = true;
                        vm.loadingProgress = false;
                    },500);
                }, function(error) {
            });
        }
    }
})();