(function ()
{
    'use strict';

    angular
        .module('app.components.commodity', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider
            .state('app.components_commodity_tracker', {
                url  : '/components/commodity-tracker',
                views: {
                    'content@app'                   : {
                        templateUrl: 'app/main/components/commodity/commodity-tracker.html',
                        controller : 'CommodityController as vm'
                    }
                },resolve: {
                    access: ["$q", "usersApi", function($q, usersApi) {
                        usersApi.isUserLoggedOut();
                    }]
                }
            });
    }

})();