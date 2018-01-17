(function ()
{
    'use strict';

    angular
        .module('app.core')
        .factory('apisVessel', apisVessel);

    /** @ngInject */
    function apisVessel($http,$q,$rootScope)
    {
        var vm = this;
        
        /* Base URL */
        var baseURL = $rootScope.baseURL;

        /* Vessel Voyage Starts */       

        vm.getVesselComparisonGraph = function(filter_params){
            return $http({
                method: 'POST',
                data: filter_params,
                url: baseURL+'vesselComparisonGraph.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.voyageEconomyVesselPerformanceGraph = function(filter_params){
            return $http({
                method: 'POST',
                data: filter_params,
                url: baseURL+'voyageEconomyVesselPerformanceGraph.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.voyageEconomyVesselPerformance = function(filter_params){
            return $http({
                method: 'POST',
                data: filter_params,
                url: baseURL+'voyageEconomyVesselPerformance.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getVesselName = function(vessel_name){
            //console.log("here")
            return $http({
                method: 'POST',
                data: 'vessel_name='+vessel_name,
                url: baseURL+'getVesselNames.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data.vessel_names;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        } 

        vm.getVesselNamesList = function(vessel_name){
            return $http({
                method: 'GET',
                url: baseURL+'getVesselNamesList.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                console.log(response);
                return response.data.data.vessel_names;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getEconomicSearch = function(){
            return $http({
                method: 'POST',
                //data: 'vessel_name='+vessel_name,
                url: baseURL+'getEconomicSearch.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }
        
        vm.getVoyageEconomicSearchParam = function(){
            return $http({
                method: 'POST',
                //data: 'vessel_name='+vessel_name,
                url: baseURL+'getVoyageEconomicSearchParam.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getVesselTradePatterns = function(result){
            return $http({
                method: 'POST',
                data: 'commodity='+result.commodity+'&vsl_size='+result.vessel_size+'&owner='+result.owner_name,
                url: baseURL+'vesselTradePatterns.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getTradePatternSearchParam = function(){
            return $http({
                method: 'POST',
                url: baseURL+'tradePatternSearchParam.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getVesselOwnerNames = function(owner){
            return $http({
                method: 'POST',
                data: 'owner='+owner,
                url: baseURL+'getOwnerNames.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.voyageEconomyRoutGraph = function(vessel_id,currentDuration){
            return $http({
                method: 'POST',
                data: 'vessel_id='+vessel_id+'&duration='+currentDuration,
                url: baseURL+'voyageEconomyRoutGraph.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }
        vm.voyageDailyPerformanceRoutGraph = function(vessel_id,currentDuration){
            return $http({
                method: 'POST',
                data: 'vessel_id='+vessel_id+'&duration='+currentDuration,
                url: baseURL+'voyageDailyPerformanceRoutGraph.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.voyageDailyPerformanceAnalytics = function(vessel_id,fuelconsumption_type)
        {
            return $http({
                method: 'POST',
                data: 'vessel_id='+vessel_id+'&fuelconsumption_type='+fuelconsumption_type,
                url: baseURL+'voyageDailyPerformanceAnalytics.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }
        vm.voyageDailyPerformanceStatus = function(vessel_id)
        {
            return $http({
                method: 'POST',
                data: 'vessel_id='+vessel_id,
                url: baseURL+'voyageDailyPerformanceStatus.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.voyageEconomyFleetGraph = function(data){
            return $http({
                method: 'POST',
                data: data,
                url: baseURL+'voyageEconomyFleetGraph.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }
        vm.voyageEconomyFleetPerformance = function(data){
            return $http({
                method: 'POST',
                data: data,
                url: baseURL+'voyageEconomyFleetPerformance.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        /* Vessel Voyage Ends */
        return vm;
    }
}());