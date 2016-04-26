angular.module('main', [])
    .controller('main-div', function($scope, $http) {
    	$scope.hasLoggedIn = false;
    	var loginName;
    	$scope.messageList = [];

    	$scope.login = function() {
    		if ($scope.loginName) {
    			// Perhaps have some validation so you can't duplicate names
    			loginName = $scope.loginName;
    			console.log($scope.loginName + " has logged in!");
    			$scope.hasLoggedIn = true;

    			// They then have the ability to send off messages once logged in
				// Send the loginName first, If 1st message then sets username
				// Else if not then just stores message
		    	var connection = new WebSocket("ws://"+window.location.hostname+":8081");
		    	// Sending login name first then each message submitted
		    	connection.onopen = function () {
					console.log("Connection opened by: " + $scope.loginName)
					connection.send($scope.loginName);
					$scope.submit = function() {
						var chatMessage = $scope.chatMessage;
				        if (chatMessage) {
							connection.send(chatMessage);
							$scope.chatMessage = '';
				        }
				    };
				}

				// Listener for the server returning message
		    	connection.onmessage = function (event) {
		    		console.log("Got the message here");
		    		$scope.$apply(function() {
						$scope.messageList.push(event.data);
		    		})
					console.log("Pushed");
					console.log($scope.messageList);

					//angular.element('#messageList').append(event.data);
				}

				connection.onclose = function () {
					console.log("Connection closed")
				}
				connection.onerror = function () {
					console.error("Connection error")
				}
		    }
		};
    })