(function ()
{
    'use strict';

    angular
        .module('app.components.permissions.groups')
        .controller('EditGroupController', EditGroupController);

    function EditGroupController(fuseTheming,$mdSidenav,$timeout,$location,$q,$stateParams,$scope,commonUtils,groupsApi,usersApi)
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

        var groupId = $stateParams.id;

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

            vm.basicForm.group_id  = groupId;
            vm.basicForm.groups   = vm.selectedGroups;
            vm.basicForm.modules  = vm.modules;
            
            if(commonUtils.isModuleAssigned(vm.basicForm.modules)){
              $scope.basicForm.$invalid = true;
              groupsApi.editGroup(vm.basicForm)
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
            if(vm.basicForm.name != undefined && vm.basicForm.name != vm.currentGroupName){
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
            } else {
                $scope.basicForm.name.$invalid = false;
            }
        }

        function getService(){
          vm.loadingProgress = true;
          groupsApi.getGroupDetails(groupId)
              .then(function(response) {
                  if(vm.currentUrl == $location.absUrl()){
                    if(response.status == 200){
                        vm.basicForm = response.data;
                        vm.modules = commonUtils.formatModule(response.data.modules);
                        vm.loadingProgress = false;
                        vm.showModules = true;
                        vm.currentGroupName = vm.basicForm.name;
                    } else if(response.status == 500) {
                        $location.path("/components/groups/list");
                       commonUtils.showToast(response.message,'error');
                    }
                  }
              }, function(error) {
          });
        }
    }

})();