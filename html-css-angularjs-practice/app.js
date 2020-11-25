/// <reference path="../library/angular.min.js" />

const app = angular.module('myApp', []);

app.controller('mainController', [
  '$scope',
  function ($scope) {
    this.$onInit = () => {
      $scope.options = [
        'Option 1',
        'Option 2',
        'Option 3',
        'Option 4',
        'Option 5',
        'Option 6',
        'Option 7',
        'Option 8',
        'Option 9',
        'Option 10',
      ];
      setTimeout(() => {
        initSelectBox();
      }, 200);
    };

    const initSelectBox = () => {
      const selected = document.querySelector('.selected');
      const optionsContainer = document.querySelector('.options-container');

      const optionsList = document.querySelectorAll('.option');

      selected.addEventListener('click', () => {
        optionsContainer.classList.toggle('active');
      });

      optionsList.forEach((o) => {
        o.addEventListener('click', () => {
          selected.innerHTML = o.querySelector('label').innerHTML;
          optionsContainer.classList.remove('active');
        });
      });
    };
  },
]);
