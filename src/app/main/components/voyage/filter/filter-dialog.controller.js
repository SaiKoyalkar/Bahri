(function ()
{
    'use strict';

    angular
        .module('app.components.voyage.vessel')
        .controller('FilterVesselDialogController', FilterVesselDialogController);

    /** @ngInject */
    function FilterVesselDialogController($mdDialog,$timeout,$q,$filter,$mdDateLocale,apisVessel,commonUtils,filterValues,$scope)
    {
        var vm = this;
        vm.filterValues = filterValues;
        vm.fleet = [];
        vm.selected = [];
        vm.filterForm = {};
        vm.filter_params = {};
        vm.filterForm.categories = [];
        /*$mdDateLocale.formatDate = function(date) {
            return $filter('date')(vm.startdate, "dd-MM-yyyy");
        };*/
        
        
        function initilizeSliders()
        {
            vm.filterValues.gps_speed_min = (vm.filterValues.gps_speed_min) ? vm.filterValues.gps_speed_min : vm.filter_params.gps_speed.min;
            vm.filterValues.gps_speed_max = (vm.filterValues.gps_speed_max) ? vm.filterValues.gps_speed_max : vm.filter_params.gps_speed.max;
            
            vm.filterValues.log_speed_min = (vm.filterValues.log_speed_min) ? vm.filterValues.log_speed_min : vm.filter_params.log_speed.min;
            vm.filterValues.log_speed_max = (vm.filterValues.log_speed_max) ? vm.filterValues.log_speed_max : vm.filter_params.log_speed.max;
            
            vm.filterValues.avg_speed_min = (vm.filterValues.avg_speed_min) ? vm.filterValues.avg_speed_min : vm.filter_params.avg_speed.min;
            vm.filterValues.avg_speed_max = (vm.filterValues.avg_speed_max) ? vm.filterValues.avg_speed_max : vm.filter_params.avg_speed.max;
            
            vm.filterValues.draft_mean_min = (vm.filterValues.draft_mean_min) ? vm.filterValues.draft_mean_min : vm.filter_params.draft_mean.min;
            vm.filterValues.draft_mean_max = (vm.filterValues.draft_mean_max) ? vm.filterValues.draft_mean_max : vm.filter_params.draft_mean.max;
            
            vm.filterValues.running_hours_min = (vm.filterValues.running_hours_min) ? vm.filterValues.running_hours_min : vm.filter_params.running_hours.min;
            vm.filterValues.running_hours_max = (vm.filterValues.running_hours_max) ? vm.filterValues.running_hours_max : vm.filter_params.running_hours.max;
            
            vm.filterValues.wind_speed_min = (vm.filterValues.wind_speed_min) ? vm.filterValues.wind_speed_min : vm.filter_params.wind_force.min;
            vm.filterValues.wind_speed_max = (vm.filterValues.wind_speed_max) ? vm.filterValues.wind_speed_max : vm.filter_params.wind_force.max;
            
            vm.filterValues.slip_min = (vm.filterValues.slip_min) ? vm.filterValues.slip_min : vm.filter_params.slip.min;
            vm.filterValues.slip_max = (vm.filterValues.slip_max) ? vm.filterValues.slip_max : vm.filter_params.slip.max;
            
            vm.filterValues.sea_state_min = (vm.filterValues.sea_state_min) ? vm.filterValues.sea_state_min : vm.filter_params.sea_state.min;
            vm.filterValues.sea_state_max = (vm.filterValues.sea_state_max) ? vm.filterValues.sea_state_max : vm.filter_params.sea_state.max;
            
            try {
                
                initilizeSlider("#gps-speed",       vm.filter_params.gps_speed.min,     vm.filter_params.gps_speed.max,     vm.filterValues.gps_speed_min,      vm.filterValues.gps_speed_max)
                initilizeSlider("#log-speed",       vm.filter_params.log_speed.min,     vm.filter_params.log_speed.max,     vm.filterValues.log_speed_min,      vm.filterValues.log_speed_max)
                initilizeSlider("#avg-speed",       vm.filter_params.avg_speed.min,     vm.filter_params.avg_speed.max,     vm.filterValues.avg_speed_min,      vm.filterValues.avg_speed_max)
                initilizeSlider("#draft-mean",      vm.filter_params.draft_mean.min,    vm.filter_params.draft_mean.max,    vm.filterValues.draft_mean_min,     vm.filterValues.draft_mean_max)
                initilizeSlider("#running-hours",   vm.filter_params.running_hours.min, vm.filter_params.running_hours.max, vm.filterValues.running_hours_min,  vm.filterValues.running_hours_max)
                initilizeSlider("#wind-speed",      vm.filter_params.wind_force.min,    vm.filter_params.wind_force.max,    vm.filterValues.wind_speed_min,     vm.filterValues.wind_speed_max)
                initilizeSlider("#slip",            vm.filter_params.slip.min,          vm.filter_params.slip.max,          vm.filterValues.slip_min,           vm.filterValues.slip_max)
                initilizeSlider("#sea-state",       vm.filter_params.sea_state.min,     vm.filter_params.sea_state.max,     vm.filterValues.sea_state_min,      vm.filterValues.sea_state_max)
                
            }
            catch (exc) {
                console.log("\n\n\n\n\n\n\n", exc)
            }
            
        }

        function initilizeSlider(element, minRange, maxRange, minValue, maxValue) {
            $(element).ionRangeSlider({
                type: "double",
                grid: true,
                min: minRange,
                max: maxRange,
                from: minValue,
                to: maxValue
            });
        }
      
        vm.vessel_type = (vm.filterValues.vessel_type) ? vm.filterValues.vessel_type : "";
        vm.vessel_class = (vm.filterValues.vessel_class) ? vm.filterValues.vessel_class : "";
        

       
        /* vm.selectedSource="$first";
        if(typeof(vm.filterValues) != "undefined" && vm.filterValues.data_source == "mips"){
            vm.selectedSource="$last";
        } */
            
        vm.dataSources = {
            "marorka" : "Marorka",
            "mips": "MIPS",
            "imos" : "IMOS"
        };
        vm.fuelType = {
            "MEConsumed" : "ME Consumed",
            "AuxConsumed": "AUX Consumed",
            "BoilerConsumed" : "Boiler Consumed",
            "ConsumedTotal" : "Consumed Total"
        };

        vm.selectedSource = (vm.filterValues.data_source) ? vm.filterValues.data_source : "mips";
        vm.selectedFuelType = (vm.filterValues.fuelconsumption_type) ? vm.filterValues.fuelconsumption_type : "";
        vm.startdate = (vm.filterValues.start_date) ? new Date(vm.filterValues.start_date) : $filter('date')('', "dd-MM-yyyy");
        vm.enddate = (vm.filterValues.end_date) ? new Date(vm.filterValues.end_date) : $filter('date')('', "dd-MM-yyyy");
        
        
        /*$mdDateLocale.formatDate = function(date) {
            return $filter('date')(vm.date, "dd-MM-yyyy");
        };*/

        getServices();

        vm.submit = function(){

            var result = {};
            var reports_type = [];
            var sailing_Conditions = [];
            var selectedReports = [];
            var selectedSailingConditions = [];
            result.vessel_class = [];
            result.vessel_name = [];

            //setting Vessel name and class
            result.selectedVesselsInTree = vm.selected;
            for(var i = 0; i<vm.selected.length; i++)
            {
                if(vm.selected[i] != undefined)
                {
                    result.vessel_class.push(vm.fleet[i].title)
                    for(var j=0 ; j < vm.selected[i].length ; j++)
                    {
                        result.vessel_name.push(vm.selected[i][j])
                    }
                }
            }

            //checking for dates error
            if (typeof (vm.startdate) == 'undefined') {
                commonUtils.showToast("Enter Start date !",'error');
                return false;
            }
            else if (typeof (vm.enddate) == 'undefined') {
                commonUtils.showToast("Enter End date !",'error');
                return false;
            }
            else if (vm.startdate > vm.enddate) {
                commonUtils.showToast('Start date must be less than End date !','error');
                return false;
            }

            //fecthing selected Reports
            if(vm.selectedReports.length != 0){
                
                $.each(vm.selectedReports,function(report_type_key,report_type_value){
                    
                    reports_type.push(report_type_value.display);

                     selectedReports.push({
                        id : report_type_value.id,
                        display : report_type_value.display,
                        value : report_type_value.value
                    })
                });
            }

            //Fetching Selected Sailing Conditions
            if(vm.selectedSailingConditions.length != 0){
                
                $.each(vm.selectedSailingConditions,function(report_type_key,report_type_value){
                    
                    sailing_Conditions.push(report_type_value.display);

                    selectedSailingConditions.push({
                        id : report_type_value.id,
                        display : report_type_value.display,
                        value : report_type_value.value
                    })
                });
            }

            //Start Fethcing Slider Values
            var gps_speed = $("#gps-speed").data("ionRangeSlider");
            result.gps_speed_min = gps_speed.old_from;
            result.gps_speed_max = gps_speed.old_to;
            
            var log_speed = $("#log-speed").data("ionRangeSlider");
            result.log_speed_min = log_speed.old_from;
            result.log_speed_max = log_speed.old_to;
            
            var avg_speed = $("#avg-speed").data("ionRangeSlider");
            result.avg_speed_min = avg_speed.old_from;
            result.avg_speed_max = avg_speed.old_to;
            
            var draft_mean = $("#draft-mean").data("ionRangeSlider");
            result.draft_mean_min = draft_mean.old_from;
            result.draft_mean_max = draft_mean.old_to;

            var running_hours = $("#running-hours").data("ionRangeSlider");
            result.running_hours_min = running_hours.old_from;
            result.running_hours_max = running_hours.old_to;
            
            var wind_speed = $("#wind-speed").data("ionRangeSlider");
            result.wind_speed_min = wind_speed.old_from;
            result.wind_speed_max = wind_speed.old_to;
            
            var slip = $("#slip").data("ionRangeSlider");
            result.slip_min = slip.old_from;
            result.slip_max = slip.old_to;
            
            var sea_state = $("#sea-state").data("ionRangeSlider");
            result.sea_state_min = sea_state.old_from;
            result.sea_state_max = sea_state.old_to;
            //End of Fethcing Slider Values
        
            result.start_date       = (vm.startdate)                    ? vm.startdate                  : "";
            result.end_date         = (vm.enddate)                      ? vm.enddate                    : "";
            result.fuelconsumption_type        = (vm.selectedFuelType)             ? vm.selectedFuelType           : "";
            result.vessel_id        = (vm.selectedItem)                 ? vm.selectedItem.id            : "";
            /*result.vessel_condition = (vm.filterForm.vessel_condition)  ? vm.filterForm.vessel_condition: "";*/
            result.vessel_condition = sailing_Conditions;
            result.vessel_type      = (vm.filterForm.vessel_type)       ? vm.filterForm.vessel_type     : "";
            /*result.wind_force       = (vm.filterForm.wind_force)        ? vm.filterForm.wind_force      : "";
            result.steaming_hours   = (vm.filterForm.steaming_hours)    ? vm.filterForm.steaming_hours  : "";
            result.slip             = (vm.filterForm.slip)              ? vm.filterForm.slip            : "";*/
            result.report_type      = reports_type;
            result.data_source      = vm.currentSource;
            result.selectedReports  = selectedReports;
            result.selectedSailingConditions  = selectedSailingConditions;
            $mdDialog.hide(result);
        }
        

       /* function formatFleetCodes(codes){
            var fleet_codes = [];
            $.each(codes,function(key,code){    
                fleet_codes.push(code.fleet_code);
            });
            return fleet_codes.join();
        }*/

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
                            id: group.vessel_id,
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

        /* Chips Starts */

        vm.selectedReport   = null;
        vm.selectedReports  = (vm.filterValues.selectedReports) ? vm.filterValues.selectedReports : [{display:"Noon Report",id:5,value:"noon report"},{display:"FAOP",id:8,value:"faop"},{display:"EOSP",id:7,value:"eosp"}];
        vm.selectedSailingConditions  = (vm.filterValues.selectedSailingConditions) ? vm.filterValues.selectedSailingConditions : [{display:"Loaded",id:6,value:"loaded"}];
        vm.searchReportText = null;
        vm.searchVesselText = null;
        vm.reportSearch     = reportSearch;
        vm.sailingConditionSearch     = sailingConditionSearch;


        function reportSearch(query) {
            var results = query ? vm.reports.filter( createReportFilterFor(query) ) : vm.reports;
            var deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;
        }

        function sailingConditionSearch(query) {
            var results = query ? vm.sailingConditions.filter( createReportFilterFor(query) ) : vm.sailingConditions;
            var deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;
        }

        function loadAllReports(reports) {
            var allReports = [];
            var counter=0;
            $.each(reports,function(report_key,report_value){
                allReports.push({
                    id: counter,
                    value: report_value.toLowerCase(),
                    display: report_value    
                });
                counter++;
            });
            return allReports;
        }

        function createReportFilterFor(query) {
          var lowercaseQuery = angular.lowercase(query);
          return function filterFn(report) {
            return (report.value.indexOf(lowercaseQuery) === 0);
          };
        }

        /* Chips Ends */

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

        function getServices(){
            vm.loadingProgress = true;
            apisVessel.getVoyageEconomicSearchParam()
                .then(function(response) {
                    $timeout(function () {
                        vm.loadingProgress = false;
                        vm.filter_params = response; 
                        
                        formatFilterOptions(response.vessel_data) 
                        
                        vm.reports = loadAllReports(vm.filter_params.report_type); 
                        vm.sailingConditions = loadAllReports(vm.filter_params.vessel_condition);  
                        initilizeSliders()
                    },500);
                }, function(error) {
            });
        }
        vm.fleet={}
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
            vm.fleet = items_arr;
        }
        


        /*SELECT TREE*/
        vm.selected = (vm.filterValues.selectedVesselsInTree) ? vm.filterValues.selectedVesselsInTree : [];
        vm.currentCategory = '';
        vm.toggle = function (item, list,parent) {
            
            if(typeof list[parent] == 'undefined'){
                list[parent] = [];
            }

            var idx = list[parent].indexOf(item);
            if (idx > -1) {
                list[parent].splice(idx, 1);
            }
            else {
                list[parent].push(item);
            }
        };

        vm.exists = function (item, list,parent) {
            if(typeof list[parent] == 'undefined') {
                return false;
            }else {
                return list[parent].indexOf(item) > -1;
            }
        };

        vm.isIndeterminate = function (item_key) {
            if (typeof vm.selected[item_key] != 'undefined'){
                return (vm.selected[item_key].length !== 0 &&
                    vm.selected[item_key].length !== vm.items[item_key].values.length);
            }
        };

        vm.isChecked = function (parent) {
            if (typeof vm.selected[parent] != 'undefined'){
                return vm.selected[parent].length === vm.fleet[parent].values.length;
            }
        };

        vm.toggleAll = function(parent) {
            

            if(typeof vm.selected[parent] == 'undefined'){
                vm.selected[parent] = [];    
            }

            if (vm.selected[parent].length === vm.fleet[parent].values.length && vm.fleet[parent].values.length > 0) {
                vm.selected[parent] = [];  
            } else if (vm.selected[parent].length === 0 || vm.selected[parent].length > 0) {
                vm.selected[parent] = vm.fleet[parent].values.slice(0);
            }

        };


        
        
    }
})();