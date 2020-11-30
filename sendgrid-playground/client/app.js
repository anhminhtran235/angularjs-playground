/// <reference path="library/angular.min.js" />

const app = angular.module('emailTrackerApp', []);

app.controller('mainController', ['$scope', '$http', '$interval', function($scope, $http, $interval) {
    $scope.emails = [];
    $scope.sendEmail = (to) => {
        $http.post('http://localhost:3000/email/send', {to})
            .then((err => {
                console.log(err);
            }, res => {
                console.log(res);
                const isGoodRequest = !$scope.is4xxRequest(res.data.code);
                if (isGoodRequest) {
                    const xMessageId = res.data[0].headers['x-message-id'];
                    const newEmail = {xMessageId, to, events: []};
                    $scope.emails.push(newEmail);
                    $scope.emails.sort((email1, email2) => email1.timestamp - email2.timestamp);
                }
            }))
    }

    $scope.is4xxRequest = statusCode => {
        return statusCode / 100 === 4;
    }

    $interval(() => {
        $scope.emails.forEach(email => {
            $http.get('http://localhost:3000/email/tracking/' + email.xMessageId)
                .then(res => {
                    const newEvents = res.data.events;
                    email.events = newEvents;
                }, err => {
                    console.log(err);
                })
        })
    }, 500);

    $scope.getEmailStatus = (email) => {
        if (email.events.length === 0) {
            return 'N/A';
        } else {
            return email.events[email.events.length-1].eventType;
        }
    }

    $scope.getTimeFromNow = (unixTime) => {
        return moment.unix(parseInt(unixTime)).fromNow();
    }

    $scope.getDate = (unixTime) => {
        return moment.unix(parseInt(unixTime)).toDate();
    }
}])