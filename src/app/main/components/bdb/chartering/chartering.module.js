(function ()
{
    'use strict';

    angular
        .module('app.components.bdb.chartering', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_bdb_chartering', {
            url  : '/components/bdb/chartering',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/bdb/chartering/chartering.html',
                    controller : 'BdbCharteringController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_bdb_chartering');
                }]
            }
        });

    }

})();