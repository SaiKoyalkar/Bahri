(function ()
{
    'use strict';

    angular
        .module('app.components.voyage.daily', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_voyage_daily', {
            url  : '/components/voyage-economy/daily/:id',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/voyage/daily/daily.html',
                    controller : 'DailyController as vm'
                },
                'tabContent@app.components_voyage_daily': {
                    templateUrl: 'app/main/components/voyage/daily/tabs/status.html'
                }
            }
           /* resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_voyage_daily');
                }]
            }*/
        })
        .state('app.components_voyage_daily.satellite', {
                url  : '/route',
                views: {
                    'tabContent': {
                        templateUrl: 'app/main/components/voyage/daily/tabs/route.html'
                    }
                }
            })

            .state('app.components_voyage_daily.terrain', {
                url  : '/analytics',
                views: {
                    'tabContent': {
                        templateUrl: 'app/main/components/voyage/daily/tabs/analytics.html'
                    }
                }
            })

            

    }

})();