angular.module('main', [])
    .controller('main-div', function($scope, $http) {
    	console.log("Hello world");
    	$scope.chatMessage = "";
    });