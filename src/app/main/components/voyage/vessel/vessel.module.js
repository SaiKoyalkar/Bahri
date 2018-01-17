(function ()
{
    'use strict';

    angular
        .module('app.components.voyage.vessel', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_voyage_vessel', {
            url  : '/components/voyage-economy/vessel/:id',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/voyage/vessel/vessel.html',
                    controller : 'VesselController as vm'
                },
                'tabContent@app.components_voyage_vessel': {
                    templateUrl: 'app/main/components/voyage/tabs/simple.html'
                }
            }
           /* resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_voyage_vessel');
                }]
            }*/
        });

        

    }

})();