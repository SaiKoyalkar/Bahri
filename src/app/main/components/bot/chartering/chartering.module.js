(function ()
{
    'use strict';

    angular
        .module('app.components.bot.chartering', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_bot_chartering', {
            url  : '/components/bot/chartering',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/bot/chartering/chartering.html',
                    controller : 'BotCharteringController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_bot_chartering');
                }]
            }
        });

    }

})();