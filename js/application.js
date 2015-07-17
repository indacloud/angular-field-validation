(function() {
  var myApp;

  myApp = angular.module('myApp', ['fieldValidation']);

  myApp.controller('myController', [
    '$scope', function($scope) {
      $scope.form = {};
      $scope.emailRequired = true;
      return $scope.onSubmit = function() {
        return $scope.$broadcast('VALIDATE_FIELDS');
      };
    }
  ]);

}).call(this);
