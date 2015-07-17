fieldValidation = angular.module 'fieldValidation', []

fieldValidation.directive 'fieldValidation', [ ->
  return {
    require: '^form'
    scope:
      errorTexts: '='
      useDataAttribute: '='
      appendNotificationTo: '='

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

      formatErrors = ->
        errors = []
        _.each inputCtrl.$error, (value, key)->
          if value
            errors.push texts[key]
        errors.join(', ')

      updateValidity = ->
        $(element).toggleClass 'pristine', inputCtrl.$pristine
        $(element).toggleClass 'dirty', inputCtrl.$dirty
        $(element).toggleClass 'invalid', inputCtrl.$invalid
        $(element).toggleClass 'valid', inputCtrl.$valid
        if $scope.useDataAttribute
          notificationContainer.attr 'data-error-text', formatErrors()
        else
          notificationElt.text formatErrors()

      texts = _.extend defaultTexts, $scope.errorTexts

      input = $(element).find 'input, textarea, select'
      inputCtrl = formCtrl[input.attr('name')]
      label = $(element).find 'label'

      if $scope.appendNotificationTo
        notificationContainer = $(element).find($scope.appendNotificationTo)
      else
        notificationContainer = $(element)

      if !$scope.useDataAttribute
        notificationContainer.append notificationElt

      $scope.$on 'VALIDATE_FIELDS', ->
        updateValidity()

      input.on 'focusin', (ev)->
        $(element).addClass 'has-focus'
      input.on 'focusout', (ev)->
        $(element).removeClass 'has-focus'

      input.on 'keyup blur', (ev)->
        updateValidity()

      if input[0].tagName == 'SELECT'
        input.on 'change', (ev)->
          updateValidity()

      if input.attr('type') == 'checkbox'
        input.on 'click', (ev)->
          updateValidity()

  }
]

