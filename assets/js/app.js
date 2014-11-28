
angular.module('topface', [  'ui.router', 'topface.controllers', 'topface.directives'])


    .config(function($stateProvider, $urlRouterProvider ) {



        $stateProvider
      .state('main', {
          url: '/'//,
    //      templateUrl: 'templates/m_authorize.html',
      //    controller: 'calcCtrl'
      })




  $urlRouterProvider.otherwise('/');

});

