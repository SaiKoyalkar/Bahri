(function ()
{
    'use strict';

    angular
        .module('app.components.bdb.financial', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_bdb_financial', {
            url  : '/components/bdb/financial',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/bdb/financial/financial.html',
                    controller : 'BdbFinancialController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_bdb_financial');
                }]
            }
        });

    }

})();