(function ()
{
    'use strict';

    angular
        .module('app.core')
        .factory('apisUtils', apisUtils);

    /** @ngInject */
    function apisUtils($http,$q,$rootScope)
    {
        var vm = this;
        
        /* Base URL */
        var baseURL = $rootScope.baseURL;

        /* Map Starts */
        vm.getVessels = function(){
            return $http({
                method: 'POST',
                url: baseURL+'vesselGraph.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        /* AIS */
        vm.getAisFleetsCategories = function(){
            return $http({
                method: 'GET',
                url: baseURL+'getAisFleetsCategories.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getAisPortName = function(port){
            return $http({
                method: 'POST',
                data: 'port_name='+port,
                url: baseURL+'getAisPortName.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getAisVesselData = function(request){
            return $http({
                method: 'POST',
                data: 'fleet_code='+request.fleet_code+'&port_name='+request.port_name+'&eta='+request.eta,
                url: baseURL+'getAisVesselData.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getAisVesselPortCalls = function(vessel_id,vessel_type){
            return $http({
                method: 'POST',
                data: 'vessel_id='+vessel_id+'&vessel_type='+vessel_type,
                url: baseURL+'getPortCalls.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getAisVesselDetail = function(vessel_id){
            return $http({
                method: 'POST',
                data: 'vessel_id='+vessel_id,
                url: baseURL+'getAisVesselDetail.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getVesselAlertCalls = function(imo_number){
            return $http({
                method: 'POST',
                data: 'imo_number='+imo_number,
                url: baseURL+'getVesselAlertCalls.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        /* AIS */

        /* Map Ends */

        /* Corporate or Bahri Group Starts */

        vm.getBahriGroupOverview = function(){
            return $http({
                method: 'POST',
                url: baseURL+'bahriGroupOverview.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getBahriGroupFinancialPerformance = function(currentDuration){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration,
                url: baseURL+'bahriGroupFinancialPerformance.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getBahriGroupFinancialPerformanceTable = function(currentDuration){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration,
                url: baseURL+'bahriGroupFinancialPerformanceTable.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        /* Corporate or Bahri Group Ends  */

        /* MSML Starts */

        vm.getMideastOverview = function(){
            return $http({
                method: 'POST',
                url: baseURL+'mideastOverview.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getMidEastFinancialPerformance = function(currentDuration){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration,
                url: baseURL+'midEastFinancialPerformance.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getAverageShipRunningExpense = function(currentDuration){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration,
                url: baseURL+'mideastAverageRunningExpenseTable.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
               return $q.reject(response.data); 
            });
        }

        vm.getMidEastOperationalPerformance = function(currentDuration){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration,
                url: baseURL+'midEastOperationalPerformance.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
               return $q.reject(response.data); 
            });
        }

        vm.getMideastTechnicalPerformance = function(filter_params){
            return $http({
                method: 'POST',
                data: filter_params,
                url: baseURL+'mideastTechnicalPerformance.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
               return $q.reject(response.data); 
            });
        }

        /* MSML Ends */

        /* BOT Starts */

        vm.getBahriOilOverview = function(){
            return $http({
                method: 'POST',
                url: baseURL+'botOverview.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data); 
            });
        }

        vm.getBahriOilFinancialPerformanceGraph = function(currentDuration){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration,
                url: baseURL+'botFinancialPerformance.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data); 
            });
        }

        vm.getBahriOilFinancialPerformanceTable = function(currentDuration){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration,
                url: baseURL+'botFinancialPerformanceTable.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data); 
            });
        }

        vm.botOperationalPerformanceGraph = function(currentDuration){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration,
                url: baseURL+'botOperationalPerformance.json',                
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;          
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getBahriOilCharter = function(currentDuration){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration,
                url: baseURL+'botCharter.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data); 
            });
        }

        /* BOT Ends */

        /* BCC Starts */

        vm.getBahriChemicalOverview = function (){
            return $http({
                method: 'POST',
                url: baseURL+'bccOverview.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }
        vm.getBahriChemicalFinancialPerformanceGraph = function(currentDuration){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration,
                url: baseURL+'bccFinancialPerformance.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data); 
            });
        }

        vm.getBahriChemicalFinancialPerformanceTable = function(currentDuration){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration,
                url: baseURL+'bccFinancialPerformanceTable.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data); 
            });
        }

        vm.getBahriChemicalOperationalPerformanceGraph = function(currentDuration){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration,
                url: baseURL+'bccOperationalPerformance.json',                
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }


        vm.getBahriChemicalCharter = function(currentDuration){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration,
                url: baseURL+'bccCharter.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data); 
            });
        }

        /* BCC Ends */

        /* BDB Starts */

        vm.getBahriDryBulkOverview = function(){
            return $http({
                method: 'POST',
                url: baseURL+'bdbOverview.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getBahriDryBulkFinancialPerformanceGraph = function(currentDuration){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration,
                url: baseURL+'bdbFinancialPerformance.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getBahriDryBulkFinancialPerformanceTable = function(currentDuration){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration,
                url: baseURL+'bdbFinancialPerformanceTable.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getBahriDryBulkOperationalPerformanceGraph = function(currentDuration){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration,
                url: baseURL+'bdbOperationalPerformance.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getBahriDryBulkCharter = function(currentDuration){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration,
                url: baseURL + 'bdbCharter.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        /* BDB Ends */

        /* BGC Starts */
        vm.getBahriGeneralCargoOverview = function(){
            return $http({
                method: 'POST',
                url: baseURL+'bgcOverview.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getBahriGeneralCargoFinancialPerformanceGraph = function(currentDuration){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration,
                url: baseURL+'bgcFinancialPerformance.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getBahriGeneralCargoFinancialPerformanceTable = function(currentDuration){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration,
                url: baseURL+'bgcFinancialPerformanceTable.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getBahriGeneralCargoOperationalPerformanceGraph = function(currentDuration){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration,
                url: baseURL+'bgcOperationalPerformance.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getBahriGeneralCargoCharter = function(currentDuration){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration,
                url: baseURL + 'bgcCharter.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        /* BGC Ends */

        /* Commodity Tracker */
        vm.commodityTrackerChartMapview = function(currentDuration,filterParams){
            
            var import_country = (filterParams.import_country != undefined) ? filterParams.import_country : "";
            var export_country = (filterParams.export_country != undefined) ? filterParams.export_country : "";
            var import_port = (filterParams.import_port != undefined) ? filterParams.import_port : "";
            var export_port = (filterParams.export_port != undefined) ? filterParams.export_port : "";
            var period = (filterParams.period != undefined) ? filterParams.period : "";
            var sailing_status = (filterParams.sailing_status != undefined) ? filterParams.sailing_status : "";

            return $http({
                method: 'POST',
                data: 'duration='+currentDuration 
                    + '&import_country=' + import_country 
                    + '&export_country='+ export_country
                    + '&import_port=' + import_port
                    + '&export_port='+ export_port
                    + '&period='+ period
                    + '&sailing_status='+ sailing_status,
                url: baseURL + 'commodityTrackerChartMapview.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.commodityTrackerDraftMethod = function(currentDuration,type){
            return $http({
                method: 'POST',
                data: 'duration='+currentDuration + '&type=' + type,
                url: baseURL + 'commodityTrackerDraftMethod.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.commodityTrackerSearch = function(name,value){
            return $http({
                method: 'POST',
                data: 'name='+name+'&value='+value,
                url: baseURL + 'getCommodityTrackerSearch.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }



      
        
        return vm;
    }
}());