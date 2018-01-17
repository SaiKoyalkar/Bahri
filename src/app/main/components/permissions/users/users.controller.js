(function ()
{
    'use strict';

    angular
        .module('app.components.permissions.users')
        .controller('UsersController', UsersController);

    function UsersController(fuseTheming,$mdSidenav,$timeout,$location,$mdToast,$mdDialog,commonUtils,usersApi)
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
            //DTColumnBuilder.newColumn('add').withTitle('Add User'),        
        ];
       
        vm.date = new Date();
        vm.showTable = false;
        vm.username = usersApi.getCookieUserFullName();
        getAllUsers();
    
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

        vm.addUser = function(){
            $location.path("/components/users/add");
        }

        vm.editUser = function(id){
            $location.path("/components/users/edit/"+id);
        }

        vm.deleteUser = function(ev,id){
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete this user ?')
                .textContent('All the data of this account will be flushed')
                .ariaLabel('Delete User')
                .targetEvent(ev)
                .ok('Please do it!')
                .cancel('Sounds like a scam');

            $mdDialog.show(confirm).then(function() {
                deleteUser(id);
            }, function() {
                
            });
        }

        vm.changeStatus = function(id,status){
            changeUserStatus(id,status);
        }

        function reInitializeGraphs(){
            $timeout(function () {
               
            },500);
        }  

        function getAllUsers(){
            vm.loadingProgress = true;
            usersApi.getUsersList()
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        vm.users = response;
                        $timeout(function () {
                            vm.loadingProgress = false;
                            vm.showTable = true;
                        });
                    }
                }, function(error) {
            });
        }

        function changeUserStatus(id,status){
            var user_status = (status == true) ? "active" : "inactive";
            usersApi.manageUserStatus(id,user_status)
                .then(function(response) {
                    if(vm.currentUrl == $location.absUrl()){
                        if(response.status == 200){
                            commonUtils.showToast(response.message,'success');
                        }
                    }
                }, function(error) {
            });
        }

        function deleteUser(id){
            usersApi.deleteUser(id)
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
            var users = vm.users;
            vm.users = [];
            $.each(users,function(index,value){
                if(value.id != id){
                    vm.users.push(value);
                }
            });
        }
    }

})();