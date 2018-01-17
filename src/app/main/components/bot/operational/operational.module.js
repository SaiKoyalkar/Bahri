(function ()
{
    'use strict';

    angular
        .module('app.components.bot.operational', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_bot_operational', {
            url  : '/components/bot/operational',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/bot/operational/operational.html',
                    controller : 'BotOperationalController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_bot_operational');
                }]
            }
        });
    }

})();