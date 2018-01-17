(function ()
{
    'use strict';

    angular
        .module('app.components.msml.operational', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_msml_operational', {
            url  : '/components/msml/operational',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/msml/operational/operational.html',
                    controller : 'OperationalController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_msml_operational');
                }]
            }
        });
    }

})();