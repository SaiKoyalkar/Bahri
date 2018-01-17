(function ()
{
    'use strict';

    angular
        .module('fuse')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $timeout, $state)
    {
        $rootScope.noteTitle = "NOTES :";
        $rootScope.noteDesctiptionLine1 = "* EBITDA excludes Bunker Subsidy";
        $rootScope.noteDesctiptionLine2 = "* Excludes RSA Adjustments";

        $rootScope.exportExcel = "Export Excel";
        $rootScope.noDataAvailable = "No Data Available";
        $rootScope.noVesselAvailable = "No Vessel Available";

        $rootScope.baseFrontURL = "";
        //$rootScope.baseURL = "http://52.76.126.106/bahri_apis/apis/";

        $rootScope.baseURL = "http://192.168.123.123/briso_git/apis/"

//        $rootScope.baseFrontURL = "https://www.solxcell.com/briso";
         $rootScope.baseURL = "https://www.solxcell.com/bahri_apis/apis/";

//        $rootScope.baseURL = "http://192.168.2.90/briso_git/apis/";


        //$rootScope.baseFrontURL = "http://52.76.126.106/briso";
        //$rootScope.baseFrontURL = "https://www.solxcell.com/briso";
        //$rootScope.baseURL = "https://52.76.5.109/bahri_apis/apis/";
        //$rootScope.baseFrontURL = "http://192.168.2.90/briso";

        //$rootScope.baseURL = "https://www.solxcell.com/bahri_apis/apis/";
        //$rootScope.baseFrontURL = "https://www.solxcell.com/briso1";

        //$rootScope.baseURL = "https://briso.bahri.sa/bahri_apis/apis/";
        //$rootScope.baseURL = "http://bahri.sa/bahri_apis/apis/";



        /*$rootScope.baseURL = "http://52.76.3.59/bahri_apis/apis/";
        $rootScope.baseFrontURL = "http://52.76.3.59/briso";  */

        //$rootScope.baseURL = "http://192.168.1.169/bahri_apis/apis/";
         //$rootScope.baseFrontURL = "http://192.168.1.169/briso";

        // $rootScope.baseURL = "http://192.168.120.45/bahri_apis/apis/";
        // $rootScope.baseFrontURL = "http://192.168.120.45/briso";


        // Activate loading indicator
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function ()
        {
            $rootScope.loadingProgress = true;
        });

        // De-activate loading indicator
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function ()
        {
            $timeout(function ()
            {
                $rootScope.loadingProgress = false;
            });
        });

        // Store state in the root scope for easy access
        $rootScope.state = $state;

        // Cleanup
        $rootScope.$on('$destroy', function ()
        {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
        });
    }
})();
