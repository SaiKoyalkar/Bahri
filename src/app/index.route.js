(function ()
{
    'use strict';

    angular
        .module('fuse')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider, $locationProvider)
    {
        $locationProvider.html5Mode(true);

        $urlRouterProvider.when('/', '/pages/auth/login');
        $urlRouterProvider.otherwise('/pages/errors/404');
        //$urlRouterProvider.otherwise('/pages/auth/login');
        //$urlRouterProvider.otherwise('/ui/page-layouts/blank');

        /**
         * Layout Style Switcher
         *
         * This code is here for demonstration purposes.
         * If you don't need to switch between the layout
         * styles like in the demo, you can set one manually by
         * typing the template urls into the `State definitions`
         * area and remove this code
         */
        // Inject $cookies
        var $cookies;

        angular.injector(['ngCookies']).invoke([
            '$cookies', function (_$cookies)
            {
                $cookies = _$cookies;
            }
        ]);

        // Get active layout
        //var layoutStyle = $cookies.get('layoutStyle') || 'verticalNavigation';
        var layoutStyle = 'verticalNavigation';

        var layouts = {
            verticalNavigation  : {
                main      : 'app/core/layouts/vertical-navigation.html',
                //toolbar   : 'app/toolbar/layouts/vertical-navigation/toolbar.html',
                navigation: 'app/navigation/layouts/vertical-navigation/navigation.html'
            }
        };
        // END - Layout Style Switcher

        // State definitions
        $stateProvider
            .state('app', {
                abstract: true,
                views   : {
                    'main@'         : {
                        templateUrl: layouts[layoutStyle].main,
                        controller : 'MainController as vm'
                    },
                    'navigation@app': {
                        templateUrl: layouts[layoutStyle].navigation,
                        controller : 'NavigationController as vm'
                    },
                   /* 'toolbar@app': {
                        templateUrl: layouts[layoutStyle].toolbar,
                        controller : 'ToolbarController as vm'
                    }*/
                }
            });
    }

})();
