(function ()
{
    'use strict';

    angular
        .module('app.components.voyage.fleet', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_voyage_fleet', {
            url  : '/components/voyage-economy/fleet/:id',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/voyage/fleet/fleet.html',
                    controller : 'FleetController as vm'
                },
                'tabContent@app.components_voyage_fleet': {
                    templateUrl: 'app/main/components/voyage/tabs/simple.html'
                }
            },
           /* resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_voyage_fleet');
                }]
            }*/
        });

    }

})();