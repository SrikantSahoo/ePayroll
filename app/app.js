// 'use strict';

// // Declare app level module which depends on views, and components
// angular.module('ePayroll', [
//   'ngRoute',
//   'ePayroll.view1',
//   'ePayroll.view2',
//   'ePayroll.payslip',
//   'ePayroll.taxtable'
// ]).
// config(['$routeProvider', function($routeProvider) {
//   $routeProvider.otherwise({redirectTo: '/payslip'});
// }]);


(function() {

	"use strict";

	angular
		.module("ePayroll",[
			'ngRoute',
			'lokijs',
			'ngCsvImport',
			'ngSanitize', 
			'ngCsv',
			'ngFileUpload',
			'ePayroll.payslip',
			'ePayroll.taxtable'
		])
		.config(['$routeProvider', function($routeProvider) {
			$routeProvider.otherwise({redirectTo: '/payslip'});
		}])	
		.controller("routeController", function($scope,$location){

			$scope.isActive = function(route) {
		        return route === $location.path();
		    };

		});
})();