(function ()
{
    'use strict';

    angular
        .module('app.components.permissions.groups')
        .controller('AddGroupController', AddGroupController);

    function AddGroupController(fuseTheming,$mdSidenav,$timeout,$location,$q,$scope,commonUtils,groupsApi,usersApi)
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
       
        vm.date = new Date();
        vm.showModules = false;
        vm.basicForm = {};
        vm.username = usersApi.getCookieUserFullName();
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
            $location.path("/components/groups/list");
        }

        vm.submit = function(){

          vm.basicForm.groups = vm.selectedGroups;
          vm.basicForm.modules = vm.modules;

          if(commonUtils.isModuleAssigned(vm.basicForm.modules)){
            $scope.basicForm.$invalid = true;
            groupsApi.addGroup(vm.basicForm)
              .then(function(response) {
                  if(vm.currentUrl == $location.absUrl()){
                      if(response.status == 200){
                        commonUtils.showToast(response.message,'success');
                        $location.path("/components/groups/list");
                      } else{
                        $scope.basicForm.$invalid = false;
                        commonUtils.showToast(response.message,'error');
                      }
                  }
              }, function(error) {
            });
          } else {
            commonUtils.showToast("Please assign atleast one permission",'error');
          }
        }

        vm.isGroupExist = function(value){
          $scope.basicForm.name.$error.validationError = false;
            if(vm.basicForm.name != undefined){
                groupsApi.isGroupExist(vm.basicForm.name)
                  .then(function(response) {
                      if(vm.currentUrl == $location.absUrl()){
                          if(response.status == 500)
                          { 
                              $timeout(function() {
                                vm.existGroupError = response.message;
                                $scope.basicForm.name.$error.validationError = true;
                                $scope.basicForm.name.$dirty = true;
                                $scope.basicForm.$invalid = true;
                              },10);
                          } else {
                              $scope.basicForm.name.$error.validationError = false;
                              $scope.basicForm.name.$invalid = false;
                              $scope.basicForm.$invalid = false;
                          }
                      }
                  }, function(error) {
              });
            }
        }
        
        function getService(){
          vm.loadingProgress = true;
          groupsApi.getModulesList()
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
        }
    }

})();