(function() {
  var myApp;

  myApp = angular.module('myApp', ['fieldValidation']);

  myApp.controller('myController', [
    '$scope', function($scope) {
      return $scope.form = {};
    }
  ]);

}).call(this);
