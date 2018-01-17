(function ()
{
    'use strict';

    angular
        .module('app.components.bgc.overview', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_bgc_overview', {
            url  : '/components/bgc/overview',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/bgc/overview/overview.html',
                    controller : 'BgcOverviewController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_bgc_overview');
                }]
            }
        });
    }

})();