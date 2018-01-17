(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('checkGroupName', isGroupExistDirective);

    /** @ngInject */
    function isGroupExistDirective(groupsApi)
    {
        return {
          restrict: '',
          controller: function(e){
            console.log("print attributes value: " + e );
            }
        };
    }
})();