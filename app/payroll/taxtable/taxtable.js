'use strict';

angular.module('ePayroll.taxtable',['ngRoute'])
.config(['$routeProvider',function($routeProvider){
	$routeProvider.
		when('/taxtable',{
			templateUrl: 'payroll/taxtable/taxtable.html',
			controller: 'taxtableController',
			activetab: 'taxtable'
		});
}])

.controller('taxtableController',['$scope', function($scope){

}]);
