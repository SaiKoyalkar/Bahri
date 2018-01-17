(function ()
{
    'use strict';

    angular
        .module('app.components.bdb.overview', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_bdb_overview', {
            url  : '/components/bdb/overview',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/bdb/overview/overview.html',
                    controller : 'BdbOverviewController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_bdb_overview');
                }]
            }
        });
    }

})();