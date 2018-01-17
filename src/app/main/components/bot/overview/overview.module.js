(function ()
{
    'use strict';

    angular
        .module('app.components.bot.overview', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_bot_overview', {
            url  : '/components/bot/overview',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/bot/overview/overview.html',
                    controller : 'BotOverviewController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_bot_overview');
                }]
            }
        });
    }

})();