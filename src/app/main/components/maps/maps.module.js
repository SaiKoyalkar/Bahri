(function ()
{
    'use strict';

    angular
        .module('app.components.maps', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider
            .state('app.components_maps', {
                url  : '/components/maps',
                views: {
                    'content@app'                   : {
                        templateUrl: 'app/main/components/maps/maps.html',
                        controller : 'MapsController as vm'
                    }
                },resolve: {
                    access: ["$q", "usersApi", function($q, usersApi) {
                        usersApi.isUserLoggedOut();
                    }]
                }
            });
    }

})();