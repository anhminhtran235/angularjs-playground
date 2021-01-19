/// <reference path="../library/angular.min.js"/>

const app = angular.module("myApp", []);

app.directive("infiniteScroll", [
  "$document",
  function ($document) {
    return {
      restrict: "A",
      scope: {
        infiniteScrollWrapperDivId: "=",
        infiniteScrollInnerDivId: "=",
        infiniteScrollDistance: "=",
        infiniteScrollDisabled: "=",
        onTouchEnd: "&",
      },
      link: function (scope, elements, attrs) {
          setInterval(() => {
              console.log(scope.infiniteScrollDisabled);
          }, 100);
        if (!scope.infiniteScrollWrapperDivId || scope.infiniteScrollWrapperDivId === '') {
            throw new Error('Must have infiniteScrollWrapperDivId');
        } else if (!scope.infiniteScrollInnerDivId || scope.infiniteScrollInnerDivId === '') {
            throw new Error('Must have infiniteScrollInnerDivId');
        }

        let distance = 50;
        if (scope.infiniteScrollDistance) {
            distance = scope.infiniteScrollDistance * 10;
        }

        const wrapper = document.getElementById(scope.infiniteScrollWrapperDivId);
        const inner = document.getElementById(scope.infiniteScrollInnerDivId);
        const scroller = function () {
            const isTouchingTheEnd = wrapper.scrollTop + wrapper.offsetHeight + distance > inner.offsetHeight;
            if (isTouchingTheEnd) {
                if (scope.infiniteScrollDisabled) {
                    return;
                }
                scope.onTouchEnd();
            }
        };
        wrapper.addEventListener("scroll", scroller);
      }
    };
  }
]);

app.controller("mainController", [
  "$scope",
  "$timeout",
  function ($scope, $timeout) {
      $scope.isScrollLoadOff = false;
    $scope.ajaxCall = () => {
        $scope.$apply(() => {$scope.isScrollLoadOff = true});
        alert('Touch the end');
        $timeout(() => {
            $scope.isScrollLoadOff = false;
        }, 10000)
    }
  }
]);
