(function ()
{
    'use strict';

    angular
        .module('app.pages.error-404')
        .controller('Error404Controller', Error404Controller);

    /** @ngInject */
    function Error404Controller($location)
    {
        // Data
        var vm = this;
        // Methods

        //////////
        vm.redirectToDashboard = function(){
            $location.path("/components/maps");
        }
    }
})();