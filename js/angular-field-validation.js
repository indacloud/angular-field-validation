(function() {
  var fieldValidation;

  fieldValidation = angular.module('fieldValidation', []);

  fieldValidation.service('fieldValidationSvc', [
    function() {
      var defaultTexts, notificationElt;
      defaultTexts = {
        required: 'This field is required',
        email: 'Enter a valid email address',
        max: 'Should be lower',
        maxlength: 'Too long',
        min: 'Should be higher',
        minlength: 'Too short',
        number: 'Should be numeric',
        pattern: 'Should respect the pattern',
        url: 'Enter a valid url'
      };
      notificationElt = '<span class="notification">';
      return {
        getTexts: function() {
          return defaultTexts;
        },
        getNotificationElt: function() {
          return $(notificationElt);
        }
      };
    }
  ]);

  fieldValidation.directive('fieldValidation', [
    'fieldValidationSvc', function(fieldValidationSvc) {
      return {
        require: '^form',
        scope: {
          errorTexts: '=',
          useDataAttribute: '=',
          appendNotificationTo: '='
        },
        link: function($scope, element, attrs, formCtrl) {
          var formatErrors, input, inputCtrl, notificationContainer, notificationElt, texts, updateValidity;
          notificationElt = fieldValidationSvc.getNotificationElt();
          formatErrors = function() {
            var errors;
            errors = [];
            angular.forEach(inputCtrl.$error, function(value, key) {
              if (value) {
                return errors.push(texts[key]);
              }
            });
            return errors.join(', ');
          };
          updateValidity = function() {
            if (inputCtrl.$pristine) {
              return;
            }
            $(element).toggleClass('dirty', inputCtrl.$dirty);
            $(element).toggleClass('invalid', inputCtrl.$invalid);
            $(element).toggleClass('valid', inputCtrl.$valid);
            if ($scope.useDataAttribute) {
              return notificationContainer.attr('data-error-text', formatErrors());
            } else {
              return notificationElt.text(formatErrors());
            }
          };
          texts = angular.extend(fieldValidationSvc.getTexts(), $scope.errorTexts);
          input = $(element).find('[ng-model]');
          if (!input.length) {
            throw 'fieldValidation - ngModel required';
          }
          inputCtrl = formCtrl[input.attr('name')];
          if (!inputCtrl) {
            throw 'fieldValidation - name attribute required';
          }
          if ($scope.appendNotificationTo) {
            notificationContainer = $(element).find($scope.appendNotificationTo);
          } else {
            notificationContainer = $(element);
          }
          if (!$scope.useDataAttribute) {
            notificationContainer.append(notificationElt);
          }
          $scope.$on('VALIDATE_FIELDS', function() {
            return updateValidity();
          });
          return $scope.$watch((function() {
            return inputCtrl.$viewValue;
          }), updateValidity);
        }
      };
    }
  ]);

}).call(this);
