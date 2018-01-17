(function ()
{
    'use strict';

    angular
        .module('app.components', [
            'app.components.maps',
            'app.components.weather-maps',
            'app.components.msml.overview',
            'app.components.msml.financial',
            'app.components.msml.operational',
            'app.components.msml.technical',
            'app.components.bot.overview',
            'app.components.bot.financial',
            'app.components.bot.operational',
            'app.components.bot.chartering',
            'app.components.bcc.overview',
            'app.components.bcc.financial',
            'app.components.bcc.operational',
            'app.components.bcc.chartering',
            'app.components.bdb.overview',
            'app.components.bdb.financial',
            'app.components.bdb.operational',
            'app.components.bdb.chartering',
            'app.components.bgc.overview',
            'app.components.bgc.financial',
            'app.components.bgc.operational',
            'app.components.bgc.chartering',
            'app.components.corporate.overview',
            'app.components.corporate.financial',
            'app.components.permissions.users',
            'app.components.permissions.groups',
            'app.components.voyage.vessel',
            'app.components.voyage.fleet',
            'app.components.voyage.daily',
            'app.components.pattern',
            'app.components.commodity'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {   
        // Navigation
        msNavigationServiceProvider.saveItem('components', {
            title : '',
            group : true,
            weight: 1
        });
        
        /* Vessel Location */
        msNavigationServiceProvider.saveItem('components.maps', {
            title: 'Vessel Location With Alert',
            icon : 'menu-icons icon-map-img',
            state: 'app.components_maps'
        });

        msNavigationServiceProvider.saveItem('components.pattern', {
            title: 'Vessel Trade Pattern',
            icon : 'menu-icons icon-bgc',
            state: 'app.components_vessel_pattern'
        });

        msNavigationServiceProvider.saveItem('components.commodity', {
            title: 'Commodity Tracker',
            icon : 'menu-icons icon-bgc',
            state: 'app.components_commodity_tracker'
        });

        /* Vessel Voyage */
        msNavigationServiceProvider.saveItem('components.voyage', {
            title: 'Voyage Economy',
            icon : 'menu-icons icon-bgc'
        });

        msNavigationServiceProvider.saveItem('components.voyage.daily', {
            title: 'Daily Performance',
            state: 'app.components_voyage_daily'
        });
        
        msNavigationServiceProvider.saveItem('components.voyage.vessel', {
            title: 'Vessel Performance',
            state: 'app.components_voyage_vessel'
        });

        msNavigationServiceProvider.saveItem('components.voyage.fleet', {
            title: 'Fleet Performance',
            state: 'app.components_voyage_fleet'
        });

       

        //var accesibleModules = (!$cookies.get('currentUserData')) ? {} : angular.fromJson($cookies.get('currentUserData'));
        var accesibleModules = (!JSON.parse(localStorage.getItem('currentUserData'))) ? {} : JSON.parse(localStorage.getItem('currentUserData'));
        var parent_small_name = '';
        
        $.each(accesibleModules.modules, function (outer_index, outer_value) {

            $.each(outer_value, function (inner_index, inner_value) {

                if(inner_value.is_checked == true){
                    if(inner_value.is_parent == true){
                        parent_small_name = inner_value.module_name.toLowerCase();
                        msNavigationServiceProvider.saveItem('components.'+parent_small_name+'', {
                            title: inner_value.title,
                            icon : 'menu-icons icon-'+parent_small_name
                        });    
                    } else {
                        var child_module_name = inner_value.module_name.toLowerCase();
                        msNavigationServiceProvider.saveItem('components.'+parent_small_name+'.'+child_module_name+'', {
                            title: inner_value.title,
                            state: 'app.components_'+parent_small_name+'_'+child_module_name+''
                        });
                    }
                }
            });
        });

        /* Corporate */
        /*msNavigationServiceProvider.saveItem('components.corporate', {
            title: 'Corporate',
            icon : 'menu-icons icon-corporate'
        });

        msNavigationServiceProvider.saveItem('components.corporate.overview', {
            title: 'Corporate Overview',
            state: 'app.components_corporate_overview'
        }); 

        msNavigationServiceProvider.saveItem('components.corporate.financial', {
            title: 'Corporate Financial',
            state: 'app.components_corporate_financial'
        });*/

        /* Bahri Oil Transport */
        /*msNavigationServiceProvider.saveItem('components.bot', {
            title: 'Bahri Oil Transport',
            icon : 'menu-icons icon-bot'
        });

        msNavigationServiceProvider.saveItem('components.bot.overview', {
            title: 'BOT Overview',
            state: 'app.components_bot_overview'
        }); 

        msNavigationServiceProvider.saveItem('components.bot.financial', {
            title: 'BOT Financial',
            state: 'app.components_bot_financial'
        });

        msNavigationServiceProvider.saveItem('components.bot.operational', {
            title: 'BOT Operational',
            state: 'app.components_bot_operational'
        });

        msNavigationServiceProvider.saveItem('components.bot.chartering', {
            title: 'BOT Chartering',
            state: 'app.components_bot_chartering'
        });*/

        /* Mideast */
        /*msNavigationServiceProvider.saveItem('components.msml', {
            title: 'Mideast',
            icon : 'menu-icons icon-msml'
        });

        msNavigationServiceProvider.saveItem('components.msml.overview', {
            title: 'Mideast Overview',
            state: 'app.components_msml_overview'
        });

        msNavigationServiceProvider.saveItem('components.msml.financial', {
            title: 'Mideast Financial',
            state: 'app.components_msml_financial'
        });

        msNavigationServiceProvider.saveItem('components.msml.operational', {
            title: 'Mideast Operational',
            state: 'app.components_msml_operational'
        });*/


        /* Bahri Chemical Carriers */
        /*msNavigationServiceProvider.saveItem('components.bcc', {
            title: 'Bahri Chemical Carriers',
            icon : 'menu-icons icon-bcc'
        });

        msNavigationServiceProvider.saveItem('components.bcc.overview', {
            title: 'BCC Overview',
            state: 'app.components_bcc_overview'
        }); 

        msNavigationServiceProvider.saveItem('components.bcc.financial', {
            title: 'BCC Financial',
            state: 'app.components_bcc_financial'
        }); 

        msNavigationServiceProvider.saveItem('components.bcc.operational', {
            title: 'BCC Operational',
            state: 'app.components_bcc_operational'
        }); 

        msNavigationServiceProvider.saveItem('components.bcc.chartering', {
            title: 'BCC Chartering',
            state: 'app.components_bcc_chartering'
        });*/

        /* Bahri Dry Bulk */
        /*msNavigationServiceProvider.saveItem('components.bdb', {
            title: 'Bahri Dry Bulk',
            icon : 'menu-icons icon-bdb'
        });

        msNavigationServiceProvider.saveItem('components.bdb.overview', {
            title: 'BDB Overview',
            state: 'app.components_bdb_overview'
        }); 

        msNavigationServiceProvider.saveItem('components.bdb.financial', {
            title: 'BDB Financial',
            state: 'app.components_bdb_financial'
        }); 

        msNavigationServiceProvider.saveItem('components.bdb.operational', {
            title: 'BDB Operational',
            state: 'app.components_bdb_operational'
        }); 

        msNavigationServiceProvider.saveItem('components.bdb.chartering', {
            title: 'BDB Chartering',
            state: 'app.components_bdb_chartering'
        });
*/
        /* Bahri General Cargo */
        /*msNavigationServiceProvider.saveItem('components.bgc', {
            title: 'Bahri General Cargo',
            icon : 'menu-icons icon-bgc'
        });

        msNavigationServiceProvider.saveItem('components.bgc.overview', {
            title: 'BGC Overview',
            state: 'app.components_bgc_overview'
        });

        msNavigationServiceProvider.saveItem('components.bgc.financial', {
            title: 'BGC Financial',
            state: 'app.components_bgc_financial'
        });

        msNavigationServiceProvider.saveItem('components.bgc.operational', {
            title: 'BGC Operational',
            state: 'app.components_bgc_operational'
        });

        msNavigationServiceProvider.saveItem('components.bgc.chartering', {
            title: 'BGC Chartering',
            state: 'app.components_bgc_chartering'
        });*/

        /* User Management Starts */
       /* msNavigationServiceProvider.saveItem('components.permissions', {
            title: 'User Management',
            icon : 'menu-icons icon-users'
        });

        msNavigationServiceProvider.saveItem('components.permissions.users', {
            title: 'Users',
            state: 'app.components_permissions_users'
        });

        msNavigationServiceProvider.saveItem('components.permissions.groups', {
            title: 'Groups',
            state: 'app.components_permissions_groups'
        });*/

        /*msNavigationServiceProvider.saveItem('components.bot', {
            title: 'Bahri Oil Transport',
            icon : 'menu-icons icon-corporate'
        });*/

        /*msNavigationServiceProvider.saveItem('components.bot.financial', {
            title: 'BOT Financial',
            state: 'app.components_bot_financial'
        });*/


       /* msNavigationServiceProvider.saveItem('components.charts.nvd3', {
            title: 'nvD3',
            state: 'app.components_charts_nvd3'
        });*/
/*
        msNavigationServiceProvider.saveItem('components.cards', {
            title : 'Cards',
            icon  : 'icon-content-copy',
            state : 'app.components_cards'
        });*/

       /* msNavigationServiceProvider.saveItem('components.price-tables', {
            title: 'Price Tables',
            icon : 'icon-view-carousel',
            state: 'app.components_price-tables'
        });

        msNavigationServiceProvider.saveItem('components.tables', {
            title: 'Tables',
            icon : 'icon-table-large'
        });

        msNavigationServiceProvider.saveItem('components.tables.simple-table', {
            title: 'Simple Table',
            state: 'app.components_tables_simple-table'
        });

        msNavigationServiceProvider.saveItem('components.tables.datatable', {
            title: 'Datatable',
            state: 'app.components_tables_datatable'
        });

        msNavigationServiceProvider.saveItem('components.widgets', {
            title: 'Widgets',
            icon : 'icon-apps',
            state: 'app.components_widgets'
        });*/
    }
})();