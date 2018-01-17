(function ()
{
    'use strict';

    angular
        .module('app.components.bgc.operational', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_bgc_operational', {
            url  : '/components/bgc/operational',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/bgc/operational/operational.html',
                    controller : 'BgcOperationalController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_bgc_operational');
                }]
            }
        });
    }

})();