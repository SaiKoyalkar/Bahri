(function ()
{
    'use strict';

    angular
        .module('app.components.bcc.financial', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_bcc_financial', {
            url  : '/components/bcc/financial',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/bcc/financial/financial.html',
                    controller : 'BccFinancialController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_bcc_financial');
                }]
            }
        });

    }

})();