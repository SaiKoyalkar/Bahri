(function ()
{
    'use strict';

    angular
        .module('app.components.corporate.overview', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_corporate_overview', {
            url  : '/components/corporate/overview',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/corporate/overview/overview.html',
                    controller : 'CorporateOverviewController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_corporate_overview');
                }]
            }
        });
    }

})();