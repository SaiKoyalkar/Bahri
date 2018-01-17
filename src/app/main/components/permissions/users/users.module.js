(function ()
{
    'use strict';

    angular
        .module('app.components.permissions.users', ['vAccordion'])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_permissions_users', {
            url  : '/components/users/list',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/permissions/users/users.html',
                    controller : 'UsersController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_permissions_users');
                }]
            }
        });

        $stateProvider.state('app.components_permissions_user_add', {
            url  : '/components/users/add',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/permissions/users/user.add.html',
                    controller : 'AddUserController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_permissions_user_add');
                }]
            }
        });

        $stateProvider.state('app.components_permissions_user_edit', {
            url  : '/components/users/edit/:id',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/permissions/users/user.edit.html',
                    controller : 'EditUserController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_permissions_user_edit');
                }]
            }
        });
    }

})();