(function() {
  var fieldValidation;

  fieldValidation = angular.module('fieldValidation', []);

  fieldValidation.directive('fieldValidation', [
    function() {
      return {
        require: '^form',
        scope: {
          errorTexts: '='
        },
        link: function($scope, element, attrs, formCtrl) {
          var defaultTexts, getErrors, input, inputCtrl, label, notificationElt, texts;
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
          getErrors = function(ctrl) {
            var errors;
            errors = [];
            _.each(ctrl.$error, function(value, key) {
              if (value) {
                return errors.push(texts[key]);
              }
            });
            return errors.join(', ');
          };
          texts = _.extend(defaultTexts, $scope.errorTexts);
          input = $(element).find('input, textarea, select');
          inputCtrl = formCtrl[input.attr('name')];
          label = $(element).find('label');
          $(element).append(notificationElt);
          input.on('focusin', function(ev) {
            return $(element).addClass('has-focus');
          });
          input.on('focusout', function(ev) {
            return $(element).removeClass('has-focus');
          });
          return input.on('change keyup blur', function(ev) {
            $(element).toggleClass('pristine', inputCtrl.$pristine);
            $(element).toggleClass('dirty', inputCtrl.$dirty);
            $(element).toggleClass('invalid', inputCtrl.$invalid);
            $(element).toggleClass('valid', inputCtrl.$valid);
            return notificationElt.text(getErrors(inputCtrl));
          });
        }
      };
    }
  ]);

}).call(this);
