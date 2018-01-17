(function ()
{
    'use strict';

    angular
        .module('app.components.msml.technical', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_msml_technical', {
            url  : '/components/msml/technical-performance',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/msml/technical/technical.html',
                    controller : 'MsmlTechnicalPerformanceController as vm'
                }
            },
            /*resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_msml_technical');
                }]
            }*/
        });
    }

})();