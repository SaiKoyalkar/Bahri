(function ()
{
    'use strict';

    angular
        .module('app.components.bot.financial', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_bot_financial', {
            url  : '/components/bot/financial',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/bot/financial/financial.html',
                    controller : 'BotFinancialController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_bot_financial');
                }]
            }
        });

    }

})();