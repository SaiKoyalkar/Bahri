(function ()
{
    'use strict';

    angular
        .module('app.components.bcc.operational', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_bcc_operational', {
            url  : '/components/bcc/operational',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/bcc/operational/operational.html',
                    controller : 'BccOperationalController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_bcc_operational');
                }]
            }
        });
    }

})();