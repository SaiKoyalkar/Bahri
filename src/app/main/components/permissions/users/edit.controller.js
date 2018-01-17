(function ()
{
    'use strict';

    angular
        .module('app.components.permissions.users')
        .controller('EditUserController', EditUserController);

    function EditUserController(fuseTheming,$mdSidenav,$timeout,$location,$q,$stateParams,$scope,commonUtils,usersApi)
    {

        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;
        vm.currentUrl = $location.absUrl();
        vm.dtOptions = {
            dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple',
            autoWidth : false,
            responsive: true
        };
       
        vm.basicForm = {};
        vm.date = new Date();
        vm.showModules = false;
        vm.username = usersApi.getCookieUserFullName();

        var userId = $stateParams.id;

        getService();
    
        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }

        vm.logout = function (){
            var user_id = usersApi.getCookieUserID();
            usersApi.logout(user_id);
        }

        vm.btnCancel = function(){
            $location.path("/components/users/list");
        }

        function reInitializeGraphs(){
            $timeout(function () {
                financialGraphs(vm.graphInfo);
                financialTables(vm.graphInfo);
            },500);
        }  

        vm.submit = function(){

            vm.basicForm.user_id  = userId;
            vm.basicForm.groups   = vm.selectedGroups;
            vm.basicForm.modules  = vm.modules;
            
            if(commonUtils.isGroupAssigned(vm.basicForm.groups) || commonUtils.isModuleAssigned(vm.basicForm.modules)){
                $scope.basicForm.$invalid = true;
                usersApi.editUser(vm.basicForm)
                  .then(function(response) {
                      if(vm.currentUrl == $location.absUrl()){
                          if(response.status == 200){
                            commonUtils.showToast(response.message,'success');
                            $location.path("/components/users/list");
                          } else{
                            $scope.basicForm.$invalid = false;
                            commonUtils.showToast(response.message,'error');
                          }
                      }
                  }, function(error) {
                });
            } else {
                commonUtils.showToast('Please assign atleast one group or module permission','error');
            }
        }

        vm.isUserExist = function(value,type){

            $scope.basicForm.username.$error.validationError = false;
            $scope.basicForm.email.$error.validationError = false;

            if(type == 'username'){
                if(vm.basicForm.username != undefined && vm.basicForm.username != vm.currentUsername){
                  usersApi.isUsernameExist(vm.basicForm.username)
                    .then(function(response) {
                        if(vm.currentUrl == $location.absUrl()){
                            if(response.status == 500)
                            {
                              $timeout(function() {
                                vm.existUsernameError = response.message;
                                $scope.basicForm.username.$error.validationError = true;
                                $scope.basicForm.$invalid = true;
                              },10);
                            } else {
                              $scope.basicForm.username.$error.validationError = false;
                              $scope.basicForm.username.$invalid = false;
                              $scope.basicForm.$invalid = false;
                            }
                        }
                    }, function(error) {
                  });
                } else {
                  $scope.basicForm.name.$invalid = false;
                }

            } else if(type == 'email'){
                if(vm.basicForm.email != undefined && vm.basicForm.email != vm.currentEmail){
                  usersApi.isEmailExist(vm.basicForm.email)
                    .then(function(response) {
                        if(vm.currentUrl == $location.absUrl()){
                            if(response.status == 500)
                            {
                                $timeout(function() {
                                  vm.existEmailError = response.message;
                                  $scope.basicForm.email.$error.validationError = true;
                                  $scope.basicForm.$invalid = true;
                                },10);
                            } else {
                                $scope.basicForm.email.$error.validationError = false;
                                $scope.basicForm.email.$invalid = false;
                                $scope.basicForm.$invalid = false;
                            }
                        }
                    }, function(error) {
                  });
                } else {
                    $scope.basicForm.name.$invalid = false;
                }
            }
        } 

        function getService(){
          vm.loadingProgress = true;
          usersApi.getCompanies()
              .then(function(response) {
                  if(vm.currentUrl == $location.absUrl()){
                    vm.companies = response.data.companies;
                    vm.designations = response.data.designations;
                    vm.departments = response.data.departments;
                  }
              }, function(error) {
          });
              
          usersApi.getModulesListByUser(userId)
              .then(function(response) {
                  if(vm.currentUrl == $location.absUrl()){
                      vm.modules = commonUtils.formatModule(response.data);
                      $timeout(function () {
                          vm.loadingProgress = false;
                          vm.showModules = true;
                      });
                  }
              }, function(error) {
          });

          usersApi.getUserDetails(userId)
              .then(function(response) {
                  if(vm.currentUrl == $location.absUrl()){
                    if(response.status == 200){
                        vm.basicForm = response.data;
                        vm.currentUsername = vm.basicForm.username;
                        vm.currentEmail = vm.basicForm.email;
                        vm.selectedGroups = response.data.groups;

                        vm.showModules = true;
                    } else if(response.status == 500) {
                        $location.path("/components/users/list");
                        commonUtils.showToast(response.message,'error');
                    }
                  }
              }, function(error) {
          });
        }

        /* Auto Complete Starts */
        vm.groups        = loadAll();
        vm.selectedItem  = null;
        vm.selectedGroups= [];
        vm.searchText    = null;
        vm.querySearch   = querySearch;

        function querySearch (query) {
          var results = query ? vm.groups.$$state.value.filter( createFilterFor(query) ) : vm.groups.$$state.value;
          var deferred = $q.defer();
          $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
          return deferred.promise;
        }

        function loadAll() {
          var allGroups = [];
          return usersApi.getGroupsList()
              .then(function(response) {
                allGroups = response.data;

                return allGroups.map( function (group) {
                  return {
                    id: group.id,
                    value: group.name.toLowerCase(),
                    display: group.name
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
    }

})();