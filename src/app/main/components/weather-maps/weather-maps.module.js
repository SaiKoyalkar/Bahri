(function ()
{
    'use strict';

    angular
        .module('app.components.weather-maps', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider
            .state('app.components_weathermaps', {
                url  : '/components/weather-maps',
                views: {
                    'content@app'                   : {
                        templateUrl: 'app/main/components/weather-maps/weather-maps.html',
                        controller : 'WeatherMapsController as vm'
                    }
                },resolve: {
                    
                    access: ["$q", "usersApi", function($q, usersApi) {
                        usersApi.isUserLoggedOut();
                    }]

                }
            });
    }

})();