(function ()
{
    'use strict';

    angular
        .module('app.components.bcc.chartering', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_bcc_chartering', {
            url  : '/components/bcc/chartering',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/bcc/chartering/chartering.html',
                    controller : 'BccCharteringController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_bcc_chartering');
                }]
            }
        });

    }

})();