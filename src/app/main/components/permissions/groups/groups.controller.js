(function ()
{
    'use strict';

    angular
        .module('app.components.permissions.groups')
        .controller('GroupsController', GroupsController);

    function GroupsController(fuseTheming,$mdSidenav,$timeout,$location,$mdToast,$mdDialog,commonUtils,groupsApi,usersApi)
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

        vm.dtColumns = [
            //DTColumnBuilder.newColumn('add').withTitle('Add Group'),        
        ];
       
        vm.date = new Date();
        vm.showTable = false;

        getAllGroups();
        vm.username = usersApi.getCookieUserFullName();
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

        vm.addGroup = function(){
            $location.path("/components/groups/add");
        }

        vm.editGroup = function(id){
            $location.path("/components/groups/edit/"+id);
        }

        vm.deleteGroup = function(ev,id){
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete this group ?')
                .textContent('All the data and permissions of this group will be flushed')
                .ariaLabel('Delete Group')
                .targetEvent(ev)
                .ok('Please do it!')
                .cancel('Sounds like a scam');

            $mdDialog.show(confirm).then(function() {
                deleteGroup(id);
            }, function() {
                
            });
        }

        vm.changeStatus = function(id,status){
            changeGroupStatus(id,status);
        }

        function reInitializeGraphs(){
            $timeout(function () {
               
            },500);
        }  

        function getAllGroups(){
            vm.loadingProgress = true;
            groupsApi.getGroupsList()
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        vm.groups = response.data;
                        $timeout(function () {
                            vm.loadingProgress = false;
                            vm.showTable = true;
                        });
                    }
                }, function(error) {
            });
        }

        function changeGroupStatus(id,status){
            var user_status = (status == true) ? "active" : "inactive";
            groupsApi.manageGroupStatus(id,user_status)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        if(response.status == 200){
                            commonUtils.showToast(response.message,'success');
                        }
                    }
                }, function(error) {
            });
        }

        function deleteGroup(id){
            groupsApi.deleteGroup(id)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        if(response.status == 200){
                            commonUtils.showToast(response.message,'success');
                            removeRow(id);
                        } else {
                            commonUtils.showToast(response.message,'error');
                        }
                    }
                }, function(error) {
            });
        }

        function removeRow(id){
            var groups = vm.groups;
            vm.groups = [];
            $.each(groups,function(index,value){
                if(value.id != id){
                    vm.groups.push(value);
                }
            });
        }
    }

})();