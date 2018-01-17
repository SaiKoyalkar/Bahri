(function ()
{
    'use strict';

    angular
        .module('app.components.pattern', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider
            .state('app.components_vessel_pattern', {
                url  : '/components/vessel-pattern',
                views: {
                    'content@app'                   : {
                        templateUrl: 'app/main/components/pattern/vessel-pattern.html',
                        controller : 'VesselPatternController as vm'
                    },
                    'tabContent@app.components_vessel_pattern': {
                        templateUrl: 'app/main/components/pattern/tabs/simple.html'
                    }
                },resolve: {
                    access: ["$q", "usersApi", function($q, usersApi) {
                        usersApi.isUserLoggedOut();
                    }]
                }
            });
    }

})();