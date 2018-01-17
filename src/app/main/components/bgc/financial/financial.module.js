(function ()
{
    'use strict';

    angular
        .module('app.components.bgc.financial', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_bgc_financial', {
            url  : '/components/bgc/financial',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/bgc/financial/financial.html',
                    controller : 'BgcFinancialController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_bgc_financial');
                }]
            }
        });

    }

})();