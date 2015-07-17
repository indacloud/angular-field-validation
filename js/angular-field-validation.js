(function() {
  var fieldValidation;

  fieldValidation = angular.module('fieldValidation', []);

  fieldValidation.directive('fieldValidation', [
    function() {
      return {
        require: '^form',
        scope: {
          errorTexts: '=',
          useDataAttribute: '=',
          appendNotificationTo: '='
        },
        link: function($scope, element, attrs, formCtrl) {
          var defaultTexts, formatErrors, input, inputCtrl, label, notificationContainer, notificationElt, texts, updateValidity;
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
          notificationElt = $('<span class="notification">');
          formatErrors = function() {
            var errors;
            errors = [];
            _.each(inputCtrl.$error, function(value, key) {
              if (value) {
                return errors.push(texts[key]);
              }
            });
            return errors.join(', ');
          };
          updateValidity = function() {
            $(element).toggleClass('pristine', inputCtrl.$pristine);
            $(element).toggleClass('dirty', inputCtrl.$dirty);
            $(element).toggleClass('invalid', inputCtrl.$invalid);
            $(element).toggleClass('valid', inputCtrl.$valid);
            if ($scope.useDataAttribute) {
              return notificationContainer.attr('data-error-text', formatErrors());
            } else {
              return notificationElt.text(formatErrors());
            }
          };
          texts = _.extend(defaultTexts, $scope.errorTexts);
          input = $(element).find('input, textarea, select');
          inputCtrl = formCtrl[input.attr('name')];
          label = $(element).find('label');
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
          input.on('focusin', function(ev) {
            return $(element).addClass('has-focus');
          });
          input.on('focusout', function(ev) {
            return $(element).removeClass('has-focus');
          });
          input.on('keyup blur', function(ev) {
            return updateValidity();
          });
          if (input[0].tagName === 'SELECT') {
            input.on('change', function(ev) {
              return updateValidity();
            });
          }
          if (input.attr('type') === 'checkbox') {
            return input.on('click', function(ev) {
              return updateValidity();
            });
          }
        }
      };
    }
  ]);

}).call(this);
