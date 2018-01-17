(function ()
{
    'use strict';

    angular
        .module('app.components.msml.overview', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_msml_overview', {
            url  : '/components/msml/overview',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/msml/overview/overview.html',
                    controller : 'MsmlOverviewController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_msml_overview');
                }]
            }
        });
    }

})();