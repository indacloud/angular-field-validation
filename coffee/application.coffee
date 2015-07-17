myApp = angular.module 'myApp', ['fieldValidation']

myApp.controller 'myController', ['$scope', ($scope)->

  $scope.form = {}

  $scope.emailRequired = true

  $scope.onSubmit = ->
    $scope.$broadcast 'VALIDATE_FIELDS'

]