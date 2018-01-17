(function ()
{
    'use strict';

    angular
        .module('app.components.permissions.groups', ['vAccordion'])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider.state('app.components_permissions_groups', {
            url  : '/components/groups/list',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/permissions/groups/groups.html',
                    controller : 'GroupsController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_permissions_groups');
                }]
            }
        });

        $stateProvider.state('app.components_permissions_group_add', {
            url  : '/components/groups/add',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/permissions/groups/group.add.html',
                    controller : 'AddGroupController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_permissions_group_add');
                }]
            }
        });

        $stateProvider.state('app.components_permissions_group_edit', {
            url  : '/components/groups/edit/:id',
            views: {
                'content@app': {
                    templateUrl: 'app/main/components/permissions/groups/group.edit.html',
                    controller : 'EditGroupController as vm'
                }
            },
            resolve: {
                access: ["$q", "usersApi", function($q, usersApi) {
                    usersApi.isCheckAcess('app.components_permissions_group_edit');
                }]
            }
        });
    }

})();