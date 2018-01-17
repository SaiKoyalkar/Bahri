(function ()
{
    'use strict';

    angular
        .module('app.pages.error-403')
        .controller('Error403Controller', Error403Controller);

    /** @ngInject */
    function Error403Controller($location)
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