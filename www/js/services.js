angular.module('dalfey.services', ['firebase'])

.factory('FirebaseService',['$firebaseArray', function($firebaseArray) {
  var workRef =  new Firebase('https://dalfeysa.firebaseio.com/work');
  return $firebaseArray(workRef);
}])

.factory('Storage', [function() {

    var StorageService = {

        clear: function() {
            return localStorage.clear();
        },
        get: function(key) {
            return JSON.parse(localStorage.getItem(key));
        },
        set: function(key, data) {
            return localStorage.setItem(key, JSON.stringify(data));
        },
        delete: function(key) {
            return localStorage.removeItem(key);
        },
        getAll: function() {
            var entries = [];
            var items = Object.keys(localStorage);

            for (var i = 0; i < items.length; i++) {
             entries.push(JSON.parse(localStorage[items[i]]));
            }  
            return entries;
        }
    };

    return StorageService;
}])

.factory('DataService', ['$http', function($http) {
  return { 
    getOperators:getOperators,
    getDivisions:getDivisions,
    getSubDivisions:getSubDivisions, 
    getMachines:getMachines, 
    getTypes:getTypes
  };
  
  function getTypes() {
    return $http.get('js/data.json')
      .then(getTypesCompleted);

    function getTypesCompleted(response){
      return response.data.tipos;
    } 
  }

  function getMachines() {
    return $http.get('js/data.json')
      .then(getMachinesCompleted);

    function getMachinesCompleted(response){
      return response.data.maquinas;
    } 
  }

  function getOperators() {
    return $http.get('js/data.json')
      .then(getOperatorsCompleted);

    function getOperatorsCompleted(response){
      return response.data.operarios;
    } 
  }

  function getDivisions() {
    return $http.get('js/data.json')
      .then(getDivisionsCompleted);

    function getDivisionsCompleted(response){
      return response.data.puestos;
    } 
  }

  function getSubDivisions() {
    return $http.get('js/data.json')
      .then(getSubDivisionsCompleted);

    function getSubDivisionsCompleted(response){
      return response.data.potreros;
    } 
  }
}]);