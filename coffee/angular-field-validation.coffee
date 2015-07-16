fieldValidation = angular.module 'fieldValidation', []

fieldValidation.directive 'fieldValidation', [ ->
  return {
    require: '^form'
    scope:
      errorTexts: '='
    link: ($scope, element, attrs, formCtrl)->

      defaultTexts =
        required:  'This field is required'
        email:     'Enter a valid email address'
        max:       'Should be lower'
        maxlength: 'Too long'
        min:       'Should be higher'
        minlength: 'Too short'
        number:    'Should be numeric'
        pattern:   'Should respect the pattern'
        url:       'Enter a valid url'

      notificationElt = $('<span class="notification">')

      getErrors = (ctrl)->
        errors = []
        _.each ctrl.$error, (value, key)->
          if value
            errors.push texts[key]
        errors.join(', ')

      texts = _.extend defaultTexts, $scope.errorTexts

      input = $(element).find 'input, textarea, select'
      inputCtrl = formCtrl[input.attr('name')]
      label = $(element).find 'label'
      $(element).append notificationElt

      # focus handle
      input.on 'focusin', (ev)->
        $(element).addClass 'has-focus'
      input.on 'focusout', (ev)->
        $(element).removeClass 'has-focus'

      input.on 'change keyup blur', (ev)->
        $(element).toggleClass 'pristine', inputCtrl.$pristine
        $(element).toggleClass 'dirty', inputCtrl.$dirty
        $(element).toggleClass 'invalid', inputCtrl.$invalid
        $(element).toggleClass 'valid', inputCtrl.$valid

        notificationElt.text getErrors(inputCtrl)

  }
]

