'use strict'

var application=angular.module('application',['ngRoute', 'ngAnimate']);
var local;
var io=io();
//manejo de clicks en boton
application.factory('Sec', function(){
  return { secondClick: '' };
});




//cambia tipo de grafico
application.controller('navController', function ($scope,$http,$location,Sec){
	//$scope.changechart=changechart($scope,$http,$location);
	$scope.type_chart='ETH';
	$scope.button='OPLC';
	$scope.changechart=function (){
		//console.log($scope.type_chart); 
		//console.log($scope.secondClick);
		var url=$location.absUrl().split('?')[0];
		var type='ETH';
		if(url.split('/').length==5){
			var mt=url.split('/')[4];
			var mt=mt.replace('#','');
			if(mt.length>2 && mt.length<5){
				if(mt=='BTC'||mt=='DASH'){
					type=mt
					if($scope.type_chart!=type){
						$scope.secondClick = false;
						$scope.type_chart=type;
					}
				};
			}
		}
		if(Sec.secondClick==false){
			//console.log('|||');
			generatechart($scope,$http,type,2);
			Sec.secondClick=true;
			$scope.button='Close';	
		}
		else{
			//console.log('qqq');
			//console.log($scope.secondClick);
			generatechart($scope,$http,type,1);
			Sec.secondClick=false;
			$scope.button='OPLC';	
		}
	};

	io.on('update',function(data){
		//console.log(data);
		if(Sec.secondClick==false){
			updatechart($scope,data,1);
		}
		else{
			updatechart($scope,data,2);
		}
	});	
});

//cambio de pestaña
application.controller('chart_controller',function($scope,$http,$location,Sec){
	Sec.secondClick=false;
	var url=$location.absUrl().split('?')[0];
	var type='ETH';
	//console.log($scope.secondClick);
	if(url.split('/').length==5){
		var mt=url.split('/')[4];
		var mt=mt.replace('#','');
		if(mt.length>2 && mt.length<5){
			if(mt=='BTC'||mt=='DASH')
				type=mt;
		}
	}
	angular.element(document.querySelector('#ETH')).removeClass("active");
	angular.element(document.querySelector('#BTC')).removeClass("active");
	angular.element(document.querySelector('#DASH')).removeClass("active");
	angular.element(document.querySelector('#'+type)).addClass("active");
	//console.log('EMiT');
	io.emit('act_type',type);
	$scope.showchart=generatechart($scope,$http,type,1);
	Sec.secondClick=false;
});

//enrutador
application.config(['$routeProvider',function ($routeProvider){
        $routeProvider
        		.when('/',{
                    title: 'Grafico',
                    templateUrl: 'chart.html'
                })
                .otherwise({
                    templateUrl: 'chart.html'
                });
    }]);


//generador de graficos
function generatechart($scope,$http,type,chart_type){
			$http({
				method:'GET',
				url:'/type/'+type
			}).then(function(data){
				if(typeof(data)=='object'){
					$scope.locals=data.data.data;
					var container = angular.element(document.querySelector('#chart'));
					container.empty(); 
	            	anychart.onDocumentReady(function () {
	            		if(chart_type==2){
	            			//console.log(2);
	            			if(typeof chart !== 'undefined' ){
	            				chart.dispose();
								chart = null;
	            			}
					         var dataTable = anychart.data.table();
					         dataTable.addData(data.data.data);
					         var mapping = dataTable.mapAs({'open': 1, 'high': 2,'low': 3,'close':4, 'value': 4});
					         var chart = anychart.stock();
					         var ohlcSeries = chart.plot(0).ohlc(mapping);
					         ohlcSeries.name(type+' Open, Hight, Low, Close');
					         chart.title(data.data.title);
					         chart.padding().left(75);
					         chart.container("chart");
					         chart.draw();
				      	}
				      	if(chart_type==1){
				      		//console.log(1);
	            			if(typeof chart !== 'undefined' ){
	            				chart.dispose();
								chart = null;
	            			}
						    var dataTable = anychart.data.table();
						    dataTable.addData(data.data.data);
						    //console.log(data.data.data);
						    var mapping = dataTable.mapAs({value: 4});
						    var chart = anychart.stock();
						    var series = chart.plot(0).line(mapping);
						    series.name(type+' Close');
						    chart.title(data.data.title);
						    chart.container("chart");
						    chart.draw();
				      	}
	    			});
				}
			},function(err){
				console.log(err);
			});
			
}

//actualizador de grafico
function updatechart($scope,data,chart_type){
	var type=$scope.type_chart;
	if(typeof(data)=='object'){
		$scope.locals=data.data.data;
		var container = angular.element(document.querySelector('#chart'));
		container.empty(); 
    	anychart.onDocumentReady(function () {
    		if(chart_type==2){
    			//console.log(2);
    			if(typeof chart !== 'undefined' ){
    				chart.dispose();
					chart = null;
    			}
		         var dataTable = anychart.data.table();
		         dataTable.addData(data.data);
		         var mapping = dataTable.mapAs({'open': 1, 'high': 2,'low': 3,'close':4, 'value': 4});
		         var chart = anychart.stock();
		         var ohlcSeries = chart.plot(0).ohlc(mapping);
		         ohlcSeries.name(type+' Open, Hight, Low, Close');
		         chart.title(data.title);
		         chart.padding().left(75);
		         chart.container("chart");
		         chart.draw();
	      	}
	      	if(chart_type==1){
	      		//console.log(1);
    			if(typeof chart !== 'undefined' ){
    				chart.dispose();
					chart = null;
    			}
			    var dataTable = anychart.data.table();
			    dataTable.addData(data.data);
			    //console.log(data.data);
			    var mapping = dataTable.mapAs({value: 4});
			    var chart = anychart.stock();
			    var series = chart.plot(0).line(mapping);
			    series.name(type+' Close');
			    chart.title(data.title);
			    chart.container("chart");
			    chart.draw();
	      	}
		});
	}
			
}