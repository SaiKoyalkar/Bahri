(function ()
{
    'use strict';

    angular
        .module('app.components.commodity')
        .controller('CommodityDialogController', CommodityDialogController);

    /** @ngInject */
    function CommodityDialogController($mdDialog,$timeout,$q,$filter,$mdDateLocale,apisUtils)
    {
        var vm = this;

        vm.items = [];
        vm.selected = [];
        vm.filterForm = {};
        vm.filterForm.categories = [];
        
        vm.currentDraftMethod = 'ldm';
        vm.currentPeriod = "7";
        vm.currentUtilization = "";

        
        vm.draftMethods = {
            "ldm" : "Linear",
            "adm" : "Average"
        };


        vm.periods = {
            "7" : "7 Days",
            "14" : "14 Days",
            "30" : "30 Days"
        };


        vm.sailingStatus = {
            "":"All",
            "ballast" : "Ballast",
            "laden" : "Laden"
        };


        vm.submit = function(){
            var result = {};

            result.import_country = (vm.import_country_name.value) ? vm.import_country_name.value : "";
            result.import_port = (vm.import_port.value) ? vm.import_port.value : "";
            result.export_country_name = (vm.export_country_name.value) ? vm.export_country_name.value : "";
            result.export_port = (vm.export_port.value) ? vm.export_port.value : "";
            result.sailing_status = vm.currentUtilization;
            result.period = vm.currentPeriod;
            result.draft_method = vm.currentDraftMethod;
        
            $mdDialog.hide(result);
            //console.log("in Submit")
        }
        /*vm.resetSankeygraph = function(){
            var result={};
            result.import_country =  "";
            result.import_port =  "";
            result.export_country_name =  "";
            result.export_port =  "";
            result.sailing_status = "";
            result.period = "";
            result.draft_method = "";
            console.log("here")
            $mdDialog.hide(result);
        }*/

        /* Auto Complete Starts */
        vm.import_country_name  = '';
        vm.import_port  = '';
        vm.export_country_name  = '';
        vm.export_port  = '';

        vm.searchImportCountryText      = null;
        vm.searchImportPortText         = null;

        vm.queryImportCountrySearch     = querySearch;
        vm.queryImportPortSearch        = querySearch;
        vm.queryExportCountrySearch     = querySearch;
        vm.queryExportPortSearch        = querySearch;

        function querySearch(name,query) {
            return loadAll(name,query).then(function(response){
                var results = query ? response.filter( createFilterFor(query) ) : response;
                var deferred = $q.defer();
                $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
                //console.log("In query Search")
                return deferred.promise;
            });
        }

        function loadAll(name,query) {
            var allGroups = [];
            //console.log("jhadvba")
            return commodityTrackerSearch(name,query)
                .then(function(response) {
                    allGroups = response;
                    //console.log("IN Load all");
                    return allGroups.map( function (group) {
                        return {
                            value: group.value.toLowerCase(),
                            display: group.value
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
            $mdDialog.hide();
        }

        function commodityTrackerSearch(name,search){
            console.log("commodityTrackerSearch")
            return apisUtils.commodityTrackerSearch(name,search)
                .then(function(response) {
                    return response.commodity_search;
                }, function(error) {
            });
        }
    }
})();