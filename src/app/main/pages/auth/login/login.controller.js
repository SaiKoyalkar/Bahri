(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(fuseTheming,$scope,$location,$mdToast,$cookieStore,$window,usersApi)
    {
        // Data
        var vm = this;
        vm.password = "password";
        // Methods

        //////////
        localStorage.removeItem("currentUserData");
        vm.doLogin = function (loginForm){
            //$scope.loginForm.$invalid = true;

           /* usersApi.login(vm.loginForm.username.toLowerCase(),vm.loginForm.password)
                .then(function(response) {
                    if(response.status == 200){
                        $scope.loginForm.$invalid = false;
                        localStorage.setItem("currentUserData",JSON.stringify(response.data));
                        $window.location.href = usersApi.getBaseURL()+'/components/maps';
                    }
                    else{
                        $scope.loginForm.$invalid = false;
                        vm.loginError = response.message;
                    }
                    
                }, function(error) {
            });*/

            if(vm.loginForm.username == 'admin@briso.com'
                /* || (vm.loginForm.username == 'Mideast.Trial' && vm.loginForm.password == 'Bahri123') */
                || (vm.loginForm.username.toLowerCase() == 'perped@msml.com' && vm.loginForm.password == 'Mideast123')
                || (vm.loginForm.username.toLowerCase() == 'brian.course@bahri.sa' && vm.loginForm.password == 'Bahri123')
                || (vm.loginForm.username.toLowerCase() == 'anwar.siddiqui@bahri.sa' && vm.loginForm.password == 'Bahri123')
                || (vm.loginForm.username.toLowerCase() == 'gulshan.kaur@bahri.sa' && vm.loginForm.password == '12345')
                || (vm.loginForm.username.toLowerCase() == 'sebjornsen@bahri.sa' && vm.loginForm.password == 'Bahri123')
                || (vm.loginForm.username.toLowerCase() == 'gammelgaard@bahri.sa' && vm.loginForm.password == 'Bahri123')
                || (vm.loginForm.username.toLowerCase() == 'ranger@bahri.sa' && vm.loginForm.password == 'Bahri123')
                || (vm.loginForm.username.toLowerCase() == 'ecker@bahri.sa' && vm.loginForm.password == 'Bahri123')
                || (vm.loginForm.username.toLowerCase() == 'najia@bahri.sa' && vm.loginForm.password == 'Bahri123')
                || (vm.loginForm.username.toLowerCase() == 'duda@bahri.sa' && vm.loginForm.password == 'Bahri123')
                || (vm.loginForm.username.toLowerCase() == 'ilgazli@bahri.sa' && vm.loginForm.password == 'Bahri123')
                || (vm.loginForm.username.toLowerCase() == 'banabeela@bahri.sa' && vm.loginForm.password == 'Bahri123')
                || (vm.loginForm.username.toLowerCase() == 'vermaat@bahri.sa' && vm.loginForm.password == 'Bahri123')
            ){
                $scope.loginForm.$invalid = false;
                localStorage.setItem("currentUserData",JSON.stringify(getStaticResponse()));
                $window.location.href = usersApi.getBaseURL()+'/components/maps';
            }
            else{
                $scope.loginForm.$invalid = false;
                vm.loginError = "Invalid username or password";
            }
        }

        vm.togglePassword = function(){
            if(vm.password == "password")
                vm.password = "text";
            else
                vm.password = "password";
        }

        function getStaticResponse(){
            return {
                    "user_id": 4,
                    "username": "briso",
                    "fullname": "Briso Admin",
                    "company": 2,
                    "designation": 2,
                    "department": 3,
                    "modules": [
                        [
                            {
                                "module_name": "Corporate",
                                "title": "Corporate",
                                "is_checked": true,
                                "is_parent": true,
                                "module_id": 1
                            },
                            {
                                "module_name": "Overview",
                                "title": "Corporate Overview",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 2
                            },
                            {
                                "module_name": "Financial",
                                "title": "Corporate Financial",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 3
                            }
                        ],
                        [
                            {
                                "module_name": "BOT",
                                "title": "Bahri Oil Transport",
                                "is_checked": true,
                                "is_parent": true,
                                "module_id": 4
                            },
                            {
                                "module_name": "Overview",
                                "title": "BOT Overview",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 5
                            },
                            {
                                "module_name": "Financial",
                                "title": "BOT Financial",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 6
                            },
                            {
                                "module_name": "Operational",
                                "title": "BOT Operational",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 7
                            },
                            {
                                "module_name": "Chartering",
                                "title": "BOT Chartering",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 8
                            }
                        ],
                        [
                            {
                                "module_name": "MSML",
                                "title": "Mideast",
                                "is_checked": true,
                                "is_parent": true,
                                "module_id": 9
                            },
                            {
                                "module_name": "Overview",
                                "title": "Mideast Overview",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 10
                            },
                            {
                                "module_name": "Financial",
                                "title": "Mideast Financial",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 11
                            },
                            {
                                "module_name": "Operational",
                                "title": "Mideast Operational",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 12
                            },
                            {
                                "module_name": "Technical",
                                "title": "Mideast Technical",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 28
                            }
                        ],
                        [
                            {
                                "module_name": "BCC",
                                "title": "Bahri Chemical Carriers",
                                "is_checked": true,
                                "is_parent": true,
                                "module_id": 13
                            },
                            {
                                "module_name": "Overview",
                                "title": "BCC Overview",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 14
                            },
                            {
                                "module_name": "Financial",
                                "title": "BCC Financial",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 15
                            },
                            {
                                "module_name": "Operational",
                                "title": "BCC Operational",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 16
                            },
                            {
                                "module_name": "Chartering",
                                "title": "BCC Chartering",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 17
                            }
                        ],
                        [
                            {
                                "module_name": "BDB",
                                "title": "Bahri Dry Bulk",
                                "is_checked": true,
                                "is_parent": true,
                                "module_id": 18
                            },
                            {
                                "module_name": "Overview",
                                "title": "BDB Overview",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 19
                            },
                            {
                                "module_name": "Financial",
                                "title": "BDB Financial",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 20
                            },
                            {
                                "module_name": "Operational",
                                "title": "BDB Operational",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 21
                            },
                            {
                                "module_name": "Chartering",
                                "title": "BDB Chartering",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 22
                            }
                        ],
                        [
                            {
                                "module_name": "BGC",
                                "title": "Bahri General Cargo",
                                "is_checked": true,
                                "is_parent": true,
                                "module_id": 23
                            },
                            {
                                "module_name": "Overview",
                                "title": "BGC Overview",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 24
                            },
                            {
                                "module_name": "Financial",
                                "title": "BGC Financial",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 25
                            },
                            {
                                "module_name": "Operational",
                                "title": "BGC Operational",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 26
                            },
                            {
                                "module_name": "Chartering",
                                "title": "BGC Chartering",
                                "is_checked": true,
                                "is_parent": false,
                                "module_id": 27
                            }
                        ]
                    ],
                    "vessels": [
                        "Corporate",
                        "BOT",
                        "MSML",
                        "BCC",
                        "BDB",
                        "BGC",
                        "BDBAIS",
                        "BCCUACC",
                        "Permissions"
                    ]
                
            };
        }
    }
})();