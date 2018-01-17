(function ()
{
    'use strict';

    angular
        .module('app.components.corporate.financial', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_corporate_financial', {
            url  : '/components/corporate/financial',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/corporate/financial/financial.html',
                    controller : 'CorporateFinancialController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_corporate_financial');
                }]
            }
        });

    }

})();