(function ()
{
    'use strict';

    angular
        .module('app.components.bdb.operational', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_bdb_operational', {
            url  : '/components/bdb/operational',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/bdb/operational/operational.html',
                    controller : 'BdbOperationalController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_bdb_operational');
                }]
            }
        });
    }

})();