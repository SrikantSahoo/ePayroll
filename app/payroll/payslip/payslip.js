(function() {

	'use strict';

	angular.module('ePayroll.payslip',['ngRoute'])
	.config(['$routeProvider',function($routeProvider){
		$routeProvider.
			when('/payslip',{
				templateUrl: 'payroll/payslip/payslip.html',
				controller: 'payslipController',
				activetab: 'payslip'
			});
	}])

	.controller('payslipController',['$scope', '$http' , '$filter','$parse', '$location', function($scope,$http,$filter,$parse,$location){
		var date = new Date();
		var timevalue = date.getTime();
		$scope.downloadfile = 'Payslip_'+ timevalue +'.csv';
		console.log($scope.downloadfile);
		$scope.title ="Employee Payslip";
		$scope.payslips = [];
		$scope.csverrors = [];
		$scope.taxslabs = [];
		$scope.employee = {};
		$scope.status;
		$scope.payperiods = [ {'id': 0, 'name': "January"}, {'id': 1, 'name':"February"}, {'id': 2, 'name': "March"},{'id': 3, 'name': "April"},{'id': 4, 'name': "May"}, {'id': 5, 'name': "June"},{'id': 6, 'name': "July"},{'id': 7, 'name': "August"}, {'id': 8, 'name': "September"}, {'id': 9, 'name': "October"}, {'id': 10, 'name': "November"}, {'id': 11, 'name': "December"} ];


		$scope.generatePayslip = function() {
			if ($scope.employeeForm.$valid) {
                // console.log('Form looks good.');
            }
			var payslip, annual_salary, taxamount,taxsuper, taxslab, month_id,month_name, last_date, taxlist;
			payslip = {};
			$scope.payslips = [];
			annual_salary = $scope.employee.annualsalary;
			taxsuper = $scope.employee.superrate;

			if (taxsuper > 50){
				return $scope.employeeForm.$invalid;
			}


			$http.get('data/taxslabs.json').success(function(data){
				$scope.slabs = data;
				var taxslab;
				angular.forEach($scope.slabs, function(slab) {
					if (annual_salary > 180001) {
						taxslab=(slab);
					} else if (annual_salary >= slab.fromamount && annual_salary <= slab.toamount) {
					    taxslab=(slab);
					}
					return taxslab;
				});

				month_id = $scope.employee.paymentstartdate.id; 
				month_name = $scope.employee.paymentstartdate.name; 
				last_date = new Date(2013, parseInt(month_id) + 1, 0);
				payslip.name = $scope.employee.firstname + ' ' + $scope.employee.lastname;
				payslip.payperiod = '01 ' + month_name + ' - '  + last_date.getDate() + ' ' + month_name ;
				payslip.grossincome = Math.round(annual_salary / 12 );
				payslip.incometax = Math.round((taxslab.taxamount + (annual_salary - taxslab.taxover) * taxslab.taxperdollor) / 12 );
				payslip.netincome = Math.round(payslip.grossincome - payslip.incometax);
				payslip.super = Math.round((payslip.grossincome * taxsuper) / 100) ;
				$scope.payslips.push(payslip);
				$scope.downloadfile = $scope.employee.firstname + $scope.employee.lastname +'_payslip.csv';
				$scope.employee = {};
				$scope.employeeForm.$setPristine();
					
			});

		
			
		};

		// CSV Import

		$scope.clear = function () {
		    angular.element("input[type='file']").val(null);
		};

		function getMonth(monthStr){
		    return new Date(monthStr+'-1-01').getMonth()
		}

		function genPlayslips (employee) {

			var csverror,errmsg, employee, firstname, lastname, payslip, annual_salary, taxamount,taxsuper, taxslab, month_id,month_name, last_date;
			payslip = {};
			csverror = {};
			


			annual_salary = parseInt(employee.annualsalary);
			taxsuper = parseInt(employee.superrate);
			firstname = employee.firstname;
			lastname = employee.lastname;
			month_name = employee.paymentstartdate;
			month_id = getMonth(month_name);

			var isValidMonth = $.grep($scope.payperiods, function(e){ return (e.name).toLowerCase() == month_name.toLowerCase(); });

			// console.log("first name: " + firstname);
			// console.log("last name: " + lastname);
			// console.log("annual salary: " + annual_salary);
			// console.log("super rate: " + taxsuper);
			// console.log("paymentstartdate: " + month_name);
			errmsg = "";
			//validation
			if( !(firstname) )
		    { 
		        errmsg = "First Name value is : " +  (firstname ? firstname : 'null');

		    }
		    if( !(lastname) )
		    { 
		        if (errmsg){
					errmsg = errmsg + ',' + "Last Name value is : " +  (lastname ? lastname : 'null');
		        } else {
		        	errmsg = "Last Name value is : " +  (lastname ? lastname : 'null');
		        }
		        
		    }

			if( annual_salary < 0 || !(annual_salary) )
		    { 
		        if (errmsg){
					errmsg = errmsg + ',' + "Annual salary value is : " +  (annual_salary ? annual_salary : 'null');
		        } else {
		        	errmsg = "Annual salary value is : " +  (annual_salary ? annual_salary : 'null');
		        }
		    }

		    if( taxsuper < 0  || !(taxsuper) || taxsuper > 50 )
		    { 
		        if (errmsg){
					errmsg = errmsg + ',' + "Super Rate value is : " +  (taxsuper ? taxsuper : 'null');
		        } else {
		        	errmsg = "Super Rate value is : " +  (taxsuper ? taxsuper : 'null');
		        }
		    }

		    if( !(month_name) || isValidMonth.length == 0 )
		    { 
		        if (errmsg){
					errmsg = errmsg + ',' + "Payment Start Date value is : " +  (month_name ? month_name : 'null');
		        } else {
		        	errmsg = "Payment Start Date value is : " +  (month_name ? month_name : 'null');
		        }
		    }
		    // console.log("CSV Error: "+ errmsg);
		    if (errmsg) { 
		    	csverror.msg = errmsg;
		    	csverror.requestdata = employee;
		        $scope.csverrors.push(csverror);

		    } else {

				// CSV Request
				$http.get('data/taxslabs.json').success(function(data){
					$scope.slabs = data;
					var taxslab;
					angular.forEach($scope.slabs, function(slab) {
						if (annual_salary > 180001) {
							taxslab=(slab);
						} else if (annual_salary >= slab.fromamount && annual_salary <= slab.toamount) {
						    taxslab=(slab);
						}
						return taxslab;
					});
 
					last_date = new Date(2013, parseInt(month_id) + 1, 0);
					payslip.name = firstname + ' ' + lastname;
					payslip.payperiod = '01 ' + month_name + ' - '  + last_date.getDate() + ' ' + month_name ;
					payslip.grossincome = Math.round(annual_salary / 12 );
					payslip.incometax = Math.round((taxslab.taxamount + (annual_salary - taxslab.taxover) * taxslab.taxperdollor) / 12 );
					payslip.netincome = Math.round(payslip.grossincome - payslip.incometax);
					payslip.super = Math.round((payslip.grossincome * taxsuper) / 100) ;
					$scope.payslips.push(payslip);
					$scope.employee = {};
						
				});


			}
		};

		
 
	     $scope.csv = {
	    	content: null,
	    	header: true,
	    	headerVisible: false,
	    	separator: ',',
	    	separatorVisible: false,
	    	result: null,
	    	encoding: 'ISO-8859-1',
	    	encodingVisible: false,
	    };

	    var _lastGoodResult = '';
	    $scope.employees = [];
	    $scope.toPrettyJSON = function (json, tabWidth) {
				var objStr = JSON.stringify(json);
				var obj = null;
				try {
					obj = $parse(objStr)({});
				} catch(e){
					// eat $parse error
					return _lastGoodResult;
				}

				var result = JSON.stringify(obj, null, Number(tabWidth));
				_lastGoodResult = result;
				$scope.payslips = [];
				$scope.csverrors = [];
				angular.forEach(obj, function(employee) {
					genPlayslips(employee);
				});



				// return result;
	    };



	}])

    .factory('dataFactory', ['$http', function($http) {

	    var dataFactory = {};

	    dataFactory.getTaxSlabs = function () {
	        return $http.get('data/taxslabs.json');
	    };
	    return dataFactory;
	}])

	
	.directive('numbersOnly', function () {
	    return {
	        require: 'ngModel',
	        link: function (scope, element, attr, ngModelCtrl) {
	            function fromUser(text) {
	                if (text) {
	                    var transformedInput = text.replace(/[^0-9]/g, '');

	                    if (transformedInput !== text) {
	                        ngModelCtrl.$setViewValue(transformedInput);
	                        ngModelCtrl.$render();
	                    }
	                    return transformedInput;
	                }
	                return undefined;
	            }            
	            ngModelCtrl.$parsers.push(fromUser);
	        }
	    };
	});

})();