angular
  .module('select2CannedMessagesDirective', [])
  .directive('select2CannedMessages', function () {
    return {
      restrict: 'E',
      scope: {
        currentlyDisplayedMessages: '=',
        templateMessages: '=',
        messageExistsCallback: '&',
        displayedMessagesMaxLimit: '=',
        displayedMessagesExceedCallback: '&',
        maxMessageLength: '=',
      },
      replace: true,
      templateUrl: 'templates/directives/select2CannedMessages.html',
      controller: [
        '$scope',
        function ($scope) {
          const currentlyDisplayedMessages = $scope.currentlyDisplayedMessages;
          const templateMessages = $scope.templateMessages;
          const allMessages = [];

          this.$onInit = function () {
            verifyAttributes();
            $scope.uniqueHtmlId = (Math.random() + '').substring(2);

            addUnique(allMessages, currentlyDisplayedMessages);
            addUnique(allMessages, templateMessages);

            const select2Data = generateSelect2Data(
              currentlyDisplayedMessages,
              allMessages
            );

            $(document).ready(function () {
              const sl2 = $('#' + $scope.uniqueHtmlId);
              initSelect2(sl2, select2Data);
              listenToSelect2Events(
                sl2,
                currentlyDisplayedMessages,
                allMessages
              );
            });
          };

          $scope.keyPress = (event) => {
            const isEnterKey = event.which === 13;
            if (isEnterKey) {
              $scope.addNewMessage();
            }
          };

          $scope.addNewMessage = () => {
            const newMessage = $scope.input;
            $scope.input = '';
            if (newMessage === '') {
              return;
            }

            if (
              $scope.displayedMessagesMaxLimit &&
              $scope.displayedMessagesMaxLimit <=
                currentlyDisplayedMessages.length
            ) {
              if ($scope.displayedMessagesExceedCallback) {
                $scope.displayedMessagesExceedCallback();
              }
              return;
            }

            if (currentlyDisplayedMessages.includes(newMessage)) {
              if ($scope.messageExistsCallback) {
                $scope.messageExistsCallback();
              }
              return;
            }

            const sl2 = $('#' + $scope.uniqueHtmlId);
            const messageExistsButUnselected = allMessages.includes(newMessage);
            if (messageExistsButUnselected) {
              sl2.val(newMessage).trigger('change');
            } else {
              const newSelect2Option = new Option(
                newMessage,
                newMessage,
                true,
                true
              );
              sl2.append(newSelect2Option).trigger('change');
            }
          };

          const verifyAttributes = () => {
            if (!currentlyDisplayedMessages) {
              throw new Error(
                'Must have currentlyDisplayedMessages. Pass in an empty list if there is none'
              );
            }
            if (!templateMessages) {
              throw new Error(
                'Must have templateMessages. Pass in an empty list if there is none'
              );
            }
          };

          const addUnique = function (toArray, fromArray) {
            fromArray.forEach((el) => {
              if (!toArray.includes(el)) {
                toArray.push(el);
              }
            });
          };

          const generateSelect2Data = (
            currentlyDisplayedMessages,
            allMessages
          ) => {
            const select2Data = allMessages.map((message) => {
              const isSelected = currentlyDisplayedMessages.includes(message);
              return {
                id: message,
                text: message,
                selected: isSelected,
              };
            });
            return select2Data;
          };

          const initSelect2 = (sl2, select2Data) => {
            sl2.select2({
              data: select2Data,
            });
          };

          const listenToSelect2Events = (
            sl2,
            currentlyDisplayedMessages,
            allMessages
          ) => {
            sl2.on('change', () => {
              clearArray(currentlyDisplayedMessages); // clear arr but keep the reference
              const updatedValues = sl2.val();
              updatedValues.forEach((message) => {
                currentlyDisplayedMessages.push(message);
                if (!allMessages.includes(message)) {
                  allMessages.push(message);
                }
              });
            });
          };

          const clearArray = (arr) => {
            arr.length = 0;
          };
        },
      ],
    };
  });
