(function ()
{
    'use strict';

    angular
        .module('app.components.bgc.chartering', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_bgc_chartering', {
            url  : '/components/bgc/chartering',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/bgc/chartering/chartering.html',
                    controller : 'BgcCharteringController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_bgc_chartering');
                }]
            }
        });

    }

})();