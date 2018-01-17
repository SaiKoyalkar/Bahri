(function ()
{
    'use strict';

    angular
        .module('app.core')
        .factory('usersApi', usersApi);

    /** @ngInject */
    function usersApi($http,$q,$window,$rootScope)
    {
        var vm = this;
        
        /* Base URL */
        var baseURL = $rootScope.baseURL;
        var baseFrontURL = $rootScope.baseFrontURL;
        
        /* Do Login */
        vm.login = function(username,password){
            return $http({
                method: 'POST',
                data: 'username='+username+'&password='+password,
                url: baseURL+'login.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.logout = function(user_id){
            return $http({
                method: 'POST',
                data: 'user_id='+user_id,
                url: baseURL+'logout.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                vm.removeCookies('currentUserData');
            }, function errorCallback(response) {
                vm.removeCookies('currentUserData');
                return $q.reject(response.data);
            });
        }

        /* Fetch All Users*/
        vm.getUsersList = function(){
            return $http({
                method: 'POST',
                url: baseURL+'getUsersList.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        /* Change User Status */
        vm.manageUserStatus = function(id,status){
            return $http({
                method: 'POST',
                data: 'user_id='+id+'&user_status='+status,
                url: baseURL+'manageUserStatus.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        /* Add User */
        vm.addUser = function(form){
            return $http({
                method: 'POST',
                data: form,
                url: baseURL+'addUser.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        /* Edit User */
        vm.editUser = function(form){
            return $http({
                method: 'POST',
                data: form,
                url: baseURL+'editUser.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        /* Get User Details For EDIT */
        vm.getUserDetails = function(id){
            return $http({
                method: 'POST',
                data: 'user_id='+id,
                url: baseURL+'getUserDetails.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        /* Delete User */
        vm.deleteUser = function(id){
            return $http({
                method: 'POST',
                data: 'user_id='+id,
                url: baseURL+'deleteUser.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        /* Fetch All Modules */
        vm.getModulesList = function(){
            return $http({
                method: 'POST',
                url: baseURL+'getAllModules.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getCompanies = function(){
            return $http({
                method: 'POST',
                url: baseURL+'getCompanies.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getModulesListByUser = function(id){
            return $http({
                method: 'POST',
                data: 'user_id='+id,
                url: baseURL+'getAllModules.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        /* Get Groups List */
        vm.getGroupsList = function(){
            return $http({
                method: 'POST',
                url: baseURL+'getAllGroups.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getStoredCookies = function(cookies_name){
            return JSON.parse(localStorage.getItem(cookies_name));
        }

        vm.getCookieUserID = function(){
            var user_id = '';
            if(!JSON.parse(localStorage.getItem('currentUserData')))
            {
                localStorage.removeItem('currentUserData');
                $window.location.href = vm.getBaseURL()+'/pages/auth/login';
            } else {
                var cookieObject = JSON.parse(localStorage.getItem('currentUserData'));
                user_id = cookieObject.user_id;
            }
            return user_id;
        }

        vm.getCookieUserFullName = function(){
            var fullname = '';
            if(!JSON.parse(localStorage.getItem('currentUserData')))
            {
                localStorage.removeItem('currentUserData');
                $window.location.href = vm.getBaseURL()+'/pages/auth/login';
            } else {
                var cookieObject = JSON.parse(localStorage.getItem('currentUserData'));
                fullname = cookieObject.fullname;
            }
            return fullname;
        }

        vm.getCookieVessels = function(){
            var vessels = [];
            if(!JSON.parse(localStorage.getItem('currentUserData')))
            {
                localStorage.removeItem('currentUserData');
                $window.location.href = vm.getBaseURL()+'/pages/auth/login';
            } else {
                var cookieObject = JSON.parse(localStorage.getItem('currentUserData'));
                vessels = cookieObject.vessels;
            }

            return vessels;
        }

        vm.removeCookies = function(cookies_name){
            cookies_name = 'currentUserData';
            localStorage.removeItem(cookies_name);
            $window.location.href = vm.getBaseURL()+'/pages/auth/login';
        }

        vm.isUsernameExist = function(username){
            return $http({
                method: 'POST',
                data: 'username='+username,
                url: baseURL+'isUsernameExist.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.isEmailExist = function(email){
            return $http({
                method: 'POST',
                data: 'email='+email,
                url: baseURL+'isEmailExist.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.getBaseURL = function(){
            return baseFrontURL;
        }

        vm.isUserLoggedIn = function(){
            var isCookiesExist = JSON.parse(localStorage.getItem('currentUserData'));
            if(isCookiesExist){
                $window.location.href = vm.getBaseURL()+'/components/maps';
            }
        }        

        vm.isUserLoggedOut = function(){
            var isCookiesExist = JSON.parse(localStorage.getItem('currentUserData'));
            if(!isCookiesExist){
                $window.location.href = vm.getBaseURL()+'/pages/auth/login';
            }
        }    

        vm.isCheckAcess = function(currentState){
            
            var isCookiesExist = JSON.parse(localStorage.getItem('currentUserData'));
            var parent_small_name = '';
            var child_module_name = '';
            var flag = false;
            
            if(!isCookiesExist){
                localStorage.removeItem('currentUserData');
                $window.location.href = vm.getBaseURL()+'/pages/auth/login';
            } else {
                $.each(isCookiesExist.modules, function (outer_index, outer_value) {
                    $.each(outer_value, function (inner_index, inner_value) {
                        if(inner_value.is_checked == true){
                            if(inner_value.is_parent == true){
                                parent_small_name = inner_value.module_name.toLowerCase();
                            } else {
                                child_module_name = (!inner_value.module_name) ? '' : '_'+inner_value.module_name.toLowerCase();
                            }

                            if(currentState == 'app.components_permissions_user_edit' || currentState == 'app.components_permissions_user_add'){
                                currentState = 'app.components_permissions_users';
                            } else if(currentState == 'app.components_permissions_group_edit' || currentState == 'app.components_permissions_group_add'){
                                currentState = 'app.components_permissions_groups';
                            }

                            if(child_module_name != ''){
                                if(currentState != 'app.components_maps' && currentState != 'app.components_'+parent_small_name+child_module_name+''){
                                    flag = true;
                                    return;
                                } else {
                                    flag = false;
                                    return false; 
                                }

                            }
                                                       
                        }
                    });

                    if(flag == false){
                        return false;
                    }
                });
        
                if(flag == true){
                    localStorage.removeItem('currentUserData');
                    $window.location.href = vm.getBaseURL()+'/pages/errors/403';
                    //$window.location.href = vm.getBaseURL()+'/pages/auth/login';
                }
            }
        }
        
        return vm;
    }
}());