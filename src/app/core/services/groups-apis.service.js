(function ()
{
    'use strict';

    angular
        .module('app.core')
        .factory('groupsApi', groupsApi);

    /** @ngInject */
    function groupsApi($http,$q,$rootScope)
    {
        var vm = this;
        
        /* Base URL */
        var baseURL = $rootScope.baseURL;

        /* Fetch All Groups*/
        vm.getGroupsList = function(){
            return $http({
                method: 'POST',
                url: baseURL+'getGroupsList.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        /* Change Group Status */
        vm.manageGroupStatus = function(id,status){
            return $http({
                method: 'POST',
                data: 'group_id='+id+'&group_status='+status,
                url: baseURL+'manageGroupStatus.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.deleteGroup = function(id){
            return $http({
                method: 'POST',
                data: 'group_id='+id,
                url: baseURL+'deleteGroup.json',
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

        vm.getModulesListByGroup = function(id){
            return $http({
                method: 'POST',
                data: 'group_id='+id,
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

        vm.getGroupDetails = function(id){
            return $http({
                method: 'POST',
                data: 'group_id='+id,
                url: baseURL+'getGroupDetails.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.isGroupExist = function(group_name){
            return $http({
                method: 'POST',
                data: 'group_name='+group_name,
                url: baseURL+'isGroupExist.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }


        vm.addGroup = function(form){
            return $http({
                method: 'POST',
                data: form,
                url: baseURL+'addGroup.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        vm.editGroup = function(form){
            return $http({
                method: 'POST',
                data: form,
                url: baseURL+'editGroup.json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(response) {
                return $q.reject(response.data);
            });
        }

        
        return vm;
    }
}());