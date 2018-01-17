(function ()
{
    'use strict';

    angular
        .module('app.pages', [
            'app.pages.auth.login',
            'app.pages.error-403',
            'app.pages.error-404',
        ])
        //.config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        // Navigation
    }
})();