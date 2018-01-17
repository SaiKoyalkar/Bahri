(function ()
{
    'use strict';

    angular
        .module('app.components.msml.financial', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_msml_financial', {
            url  : '/components/msml/financial',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/msml/financial/financial.html',
                    controller : 'FinancialController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_msml_financial');
                }]
            }
        });

    }

})();