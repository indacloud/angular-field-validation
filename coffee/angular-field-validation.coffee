fieldValidation = angular.module 'fieldValidation', []

fieldValidation.service 'fieldValidationSvc', [ ->
  messages =
    required:  'This field is required'
    email:     'Enter a valid email address'
    max:       'Should be lower'
    maxlength: 'Too long'
    min:       'Should be higher'
    minlength: 'Too short'
    number:    'Should be numeric'
    pattern:   'Should respect the pattern'
    url:       'Enter a valid url'

  notificationElt = '<span class="notification">'

  return{
    getMessages: ->
      messages

    setMessages: (newMessages)->
      messages = angular.extend messages, newMessages

    getNotificationElt: ->
      $(notificationElt)

    setNotificationElt: (elt)->
      notificationElt = elt

  }
]

fieldValidation.directive 'fieldValidation', ['fieldValidationSvc', (fieldValidationSvc) ->
  return {
    require: '^form'
    scope:
      errorTexts: '='
      useDataAttribute: '='
      appendNotificationTo: '='

    link: ($scope, element, attrs, formCtrl)->

      notificationElt = fieldValidationSvc.getNotificationElt()

      formatErrors = ->
        errors = []
        angular.forEach inputCtrl.$error, (value, key)->
          if value
            errors.push texts[key]
        errors.join(', ')

      updateValidity = ->
        return if inputCtrl.$pristine
        $(element).toggleClass 'dirty', inputCtrl.$dirty
        $(element).toggleClass 'invalid', inputCtrl.$invalid
        $(element).toggleClass 'valid', inputCtrl.$valid
        if $scope.useDataAttribute
          notificationContainer.attr 'data-error-text', formatErrors()
        else
          notificationElt.text formatErrors()

      texts = angular.extend fieldValidationSvc.getMessages(), $scope.errorTexts

      input = $(element).find '[ng-model]'
      throw 'fieldValidation - ngModel required' unless input.length
      inputCtrl = formCtrl[input.attr('name')]
      throw 'fieldValidation - name attribute required' unless inputCtrl

      if $scope.appendNotificationTo
        notificationContainer = $(element).find($scope.appendNotificationTo)
      else
        notificationContainer = $(element)

      if !$scope.useDataAttribute
        notificationContainer.append notificationElt

      $scope.$on 'VALIDATE_FIELDS', ->
        updateValidity()

      $scope.$watch (-> inputCtrl.$viewValue), updateValidity

      input.on 'focusin', (ev)->
        $(element).addClass 'has-focus'
      input.on 'focusout', (ev)->
        $(element).removeClass 'has-focus'

  }
]

