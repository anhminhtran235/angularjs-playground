/// <reference path="library/angular.min.js" />

const app = angular.module('emailTrackerApp', []);


app.controller('mainController', [
    '$scope',
    '$http',
    '$interval',
    function ($scope, $http, $interval) {
        const socket = io.connect('http://localhost:3000');
        $scope.messages = [];

        $scope.uploadImage = () => {
            var f = document.getElementById('imageUpload').files[0],
            r = new FileReader();

            r.onloadend = function(e) {
                var data = e.target.result;
                console.log(data);
                //send your binary data via $http or $resource or do anything else with it
            }

            r.readAsBinaryString(f);
        }

        $scope.sendMessage = () => {
            const newMessage = {
                type: 'text',
                data: $scope.newMessage,
            }
            $scope.messages.push({...newMessage, from: 'me'});
            socket.emit('message', newMessage);
            $scope.newMessage = '';
        }

        $scope.keypress = (event) => {
            const isEnterKey = event.which === 13;
            if (isEnterKey) {
                $scope.sendMessage();
            }
        }
        
        // Socket listeners
        socket.on('message', (data) => {
            console.log(data);
            data.from = 'other';
            $scope.$apply(() => {
                $scope.messages.push(data);
            })
        })
    
        socket.on('image', data => {
            const imageId = data.imageId;
            const imageUrl = 'http://localhost:3000/image/' + imageId;
            const newImageMessage = {
                type: 'image',
                data: imageUrl,
                from: 'other'
            }
            $scope.$apply(() => {
                $scope.messages.push(newImageMessage);
            })
        })
    },
]);