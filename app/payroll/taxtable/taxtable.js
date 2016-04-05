'use strict';

angular.module('ePayroll.taxtable',['ngRoute','lokijs'])
.config(['$routeProvider',function($routeProvider){
	$routeProvider.
		when('/taxtable',{
			templateUrl: 'payroll/taxtable/taxtable.html',
			controller: 'taxtableController',
			activetab: 'taxtable'
		});
}])

.controller('taxtableController',['$scope', 'Loki', function($scope,Loki){

  var idbAdapter = new LokiIndexedAdapter('ePayroll');
  var db = new loki('taxslabs', { persistenceMethod: 'adapter', adapter: myAdapter });
    $scope.taxslabs = {};
    $scope.taxslab = {};

    // -------- Loki database instance ----------
    // db = new Loki('taxtable.json');

    // ------- Chargement collections --------
    db.loadDatabase({}, function() {
      // --- taxslabs collection -----
      $scope.taxslabs = db.getCollection('  ') || db.addCollection('taxslabs');
    });

    // ---------- Scope instance -------------
    $scope.addTaxslab = function() {
      
      $scope.taxslabs.insert({
        min_income: $scope.taxslab.min_income,
        max_income: $scope.taxslab.max_income,
        tax_over: $scope.taxslab.tax_over,
        tax_amount: $scope.taxslab.tax_amount,
        taxplus_perdollor: $scope.taxslab.taxplus_perdollor,
        rate_startyear: $scope.taxslab.rate_startyear,
        rate_endyear: $scope.taxslab.rate_endyear,
        effective_date: $scope.taxslab.effective_date,
        status: $scope.taxslab.status
      });
      $scope.taxslab = {};
      
      db.saveDatabase();


    };

    $scope.collections = db.listCollections();
    console.log($scope.collections);


}]);
