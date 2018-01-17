(function ()
{
    'use strict';

    angular
        .module('app.components.bcc.overview', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_bcc_overview', {
            url  : '/components/bcc/overview',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/bcc/overview/overview.html',
                    controller : 'BccOverviewController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_bcc_overview');
                }]
            }
        });
    }

})();