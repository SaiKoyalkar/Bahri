(function ()
{
    'use strict';

    angular
        .module('app.components.maps')
        .controller('TaskDialogController', TaskDialogController);

    /** @ngInject */
    function TaskDialogController($mdDialog,$timeout,$q,$filter,$mdDateLocale,apisUtils,vessels,bahri_vessels)
    {
        var vm = this;

        vm.items = [];
        vm.selected = [];
        vm.filterForm = {};
        vm.filterForm.categories = [];
        vm.filterForm.bahri_vessels = bahri_vessels;

        vm.date = '';
        vm.vessels = vessels;

        $mdDateLocale.formatDate = function(date) {
            return $filter('date')(vm.date, "dd-MM-yyyy");
        };

        getAisCategories();

        if(vm.filterForm.bahri_vessels.indexOf('BOT') != -1){
            vm.bot = true;
        } else {
            vm.bot = false;
        }

        if(vm.filterForm.bahri_vessels.indexOf('BCC') != -1){
            vm.bcc = true;
        } else {
            vm.bcc = false;
        }

        if(vm.filterForm.bahri_vessels.indexOf('BDB') != -1){
            vm.bdb = true;
        } else {
            vm.bdb = false;
        }

        if(vm.filterForm.bahri_vessels.indexOf('BGC') != -1){
            vm.bgc = true;
        } else {
            vm.bgc = false;
        }

        if(vm.filterForm.bahri_vessels.indexOf('BDBAIS') != -1){
            vm.bdb_ais = true;
        } else {
            vm.bdb_ais = false;
        }

        if(vm.filterForm.bahri_vessels.indexOf('BCCUACC') != -1){
            vm.bcc_uacc = true;
        } else {
            vm.bcc_uacc = false;
        }

        showAllVessels();

        function showAllVessels(){
            if(vm.vessels.indexOf('BOT') != -1){
                vm.showBOTCheckbox = true;
            }
            if(vm.vessels.indexOf('BCC') != -1){
                vm.showBCCCheckbox = true;
            }
            if(vm.vessels.indexOf('BDB') != -1){
                vm.showBDBCheckbox = true;
            }
            if(vm.vessels.indexOf('BGC') != -1){
                vm.showBGCCheckbox = true;
            }
            if(vm.vessels.indexOf('BDBAIS') != -1){
                vm.showBDBAISCheckbox = true;
            }
            if(vm.vessels.indexOf('BCCUACC') != -1){
                vm.showBCCUACCFleetCheckbox = true;
            }
        }

        vm.showVessels = function(vessel,vesselType){
            switch ( vesselType )
            {
                case 'BOT':
                    if(!vessel){
                        this.toggleBahriVessels('BOT',vm.filterForm.bahri_vessels);
                    }else{
                        vm.filterForm.bahri_vessels.push('BOT');
                    }
                    break;

                case 'BCC':
                    if(!vessel){
                        this.toggleBahriVessels('BCC',vm.filterForm.bahri_vessels);
                    }
                    else{
                        vm.filterForm.bahri_vessels.push('BCC');
                    }
                    break;

                case 'BGC':
                    if(!vessel){
                        this.toggleBahriVessels('BGC',vm.filterForm.bahri_vessels);
                    }
                    else{
                        vm.filterForm.bahri_vessels.push('BGC');
                    }
                    break;

                case 'BDB':
                    if(!vessel){
                        this.toggleBahriVessels('BDB',vm.filterForm.bahri_vessels);
                    }
                    else{
                        vm.filterForm.bahri_vessels.push('BDB');
                    }
                    break;
                case 'BDBAIS':
                    if(!vessel){
                        this.toggleBahriVessels('BDBAIS',vm.filterForm.bahri_vessels);
                    }
                    else{
                        vm.filterForm.bahri_vessels.push('BDBAIS');
                    }
                    break;
                case 'BCCUACC':
                    if(!vessel){
                        this.toggleBahriVessels('BCCUACC',vm.filterForm.bahri_vessels);
                    }
                    else{
                        vm.filterForm.bahri_vessels.push('BCCUACC');
                    }
                    break;

                default:
                    var bahri_categories = ['BOT','BCC','BGC','BDB','BDBAIS','BCCUACC'];
                    $.each(bahri_categories,function(bahri_key,bahri_value){
                        var id = vm.vessels.indexOf(bahri_value);
                        if(id != -1)
                            vm.filterForm.bahri_vessels.splice(id,bahri_categories);
                    });
                    break;

            }
        }

        vm.submit = function(){
            var result = {};
            result.bahri_vessels = vm.filterForm.bahri_vessels;
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
        /* Categories Checkbox ends */

        /* Bahri Vessel Categories Checkbox starts */
        vm.toggleBahriVessels = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
              list.splice(idx, 1);
            }

            vm.filterForm.bahri_vessels = list;
        };
        /* Bahri Vessel Categories Checkbox ends */

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