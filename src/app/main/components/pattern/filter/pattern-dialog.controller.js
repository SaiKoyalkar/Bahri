(function ()
{
    'use strict';

    angular
        .module('app.components.maps')
        .controller('PatternDialogController', PatternDialogController);

    /** @ngInject */
    function PatternDialogController($mdDialog,$timeout,$q,$filter,$mdDateLocale,apisVessel)
    {
        var vm = this;

        vm.items = [];
        vm.selected = [];
        vm.filterForm = {};
        vm.filterForm.categories = [];
    
        getTradePatternFilterCheckboxes();

        vm.submit = function(){
            var result = {};
            result = formatCmmodity(vm.selected);
            result.owner_name = (!vm.owner_name) ? '' : vm.owner_name.display;
            $mdDialog.hide(result);
        }

        function formatCmmodity(selected){
            var result = [];
            $.each(selected,function(key,value){
                if(typeof selected[key] != 'undefined'){
                    result['commodity'] = vm.items[key].title;
                    result['vessel_size'] = value.join();
                }
            });

            return result;
        }

        function formatFleetCodes(codes){
            var fleet_codes = [];
            $.each(codes,function(key,code){    
                fleet_codes.push(code.fleet_code);
            });
            return fleet_codes.join();
        }

        /* Auto Complete Starts */
        vm.owner_name  = '';
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
            return apisVessel.getVesselOwnerNames(query)
                .then(function(response) {
                    allGroups = response.owner_data;
                    return allGroups.map( function (group) {
                        return {
                            value: group.owner.toLowerCase(),
                            display: group.owner
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
        vm.currentCategory = '';
        vm.toggle = function (item, list , arr) {
            vm.currentCategory = (vm.currentCategory != '') ? vm.currentCategory : arr;
            if(vm.currentCategory != arr && vm.currentCategory != '')
                return false;

            if(typeof list[arr] == 'undefined'){
                list[arr] = [];
            }
            var idx = list[arr].indexOf(item);
            if (idx > -1) {
              list[arr].splice(idx, 1);
            }
            else {
              list[arr].push(item);
            }

            disabled(item, list , arr);
        };

        vm.exists = function (item, list, arr) {
            if(typeof list[arr] == 'undefined') {
                return false;
            }else {
                return list[arr].indexOf(item) > -1;
            }
        };

        function disabled(item, list, arr){

            if(typeof list[arr] == 'undefined'){
                list[arr] = [];
            }

            vm.currentCategory = arr; // 0
            console.log(vm.currentCategory);

            vm.disabledCategories = [];
            $.each(vm.items,function(key,value){
                $.each(value.values,function(inner_key,inner_value){
                    if(vm.currentCategory != key && list[arr].length > 0){
                        vm.disabledCategories[key] = true;
                    } else {
                        vm.disabledCategories[key] = false;
                    }
                });
            });            
        }

        vm.isIndeterminate = function(item_key) {
            if (typeof vm.selected[item_key] != 'undefined'){
                return (vm.selected[item_key].length !== 0 &&
                    vm.selected[item_key].length !== vm.items[item_key].values.length);
            }
        };

        vm.isChecked = function(item_key) {
            if (typeof vm.selected[item_key] != 'undefined'){
                return vm.selected[item_key].length === vm.items[item_key].values.length;
            }
        };

        vm.toggleAll = function(item_key) {

            if(typeof vm.selected[item_key] == 'undefined'){
                vm.selected[item_key] = [];    
            }

            if (vm.selected[item_key].length === vm.items[item_key].values.length && vm.items[item_key].values.length > 0) {
                vm.selected[item_key] = [];  
            } else if (vm.selected[item_key].length === 0 || vm.selected[item_key].length > 0) {
                vm.selected[item_key] = vm.items[item_key].values.slice(0);
            }

        };

        /* Categories Checkbox ends */


        /**
         * Close dialog
         */
        vm.closeDialog = function()
        {
            $mdDialog.hide();
        }

        function getTradePatternFilterCheckboxes(){
            ///console.log("ASd")
            vm.loadingProgress = true;
            apisVessel.getTradePatternSearchParam()
                .then(function(response) {
                    $timeout(function () {
                        formatFilterOptions(response);
                        vm.loadingProgress = false;
                        //vm.items = response;
                        //vm.items = [1,2,3,4,5];
                    },500);
                }, function(error) {
            });
        }

        function formatFilterOptions(response){
            var items_arr = [];
            $.each(response,function(outer_key,outer_value){ 
                var model_value = [];
                if(outer_key != 'current_date_time'){
                    items_arr.push({
                        title : outer_key,
                        values : outer_value
                    });
                }
            });
            
            vm.items = items_arr;
        }
    }
})();