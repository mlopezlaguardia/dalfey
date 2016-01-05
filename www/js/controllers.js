angular.module('dalfey.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicLoading, $timeout) {
  $scope.hideBackButton = false;
  $scope.data = {
    operator: "",
    puesto: "",
    potrero: "",
    shift: { key: 'Diurno', value: false },
    date: Date.now(),
    maquina: "",
    topskider: "",
    horaInicio: "",
    horaFin: "",
    combInicio: "",
    combFin: "",
    produccion: {},
    TopadorOption: { key: 'Subsolador', value: false },
    SkidderOption: { key: 'Herbicida', value: false },
    
    //tos: false
  };

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if ((toState.name == 'done') || (toState.name == 'labor'))
      $scope.hideBackButton = true;
    else 
      $scope.hideBackButton = false;
  });

})

.controller('Step1Ctrl', function($scope) {

  $scope.step1Submitted = false;

  $scope.submit = function() {
    $scope.step1Submitted = true;
  };
})

.controller('Step1FormCtrl', function($scope, $rootScope, $state, DataService) {

  DataService.getOperators().then(function(operators){
    $scope.operators = operators;
  });

  DataService.getDivisions().then(function(puestos){
    $scope.puestos = puestos;
  });

  DataService.getSubDivisions().then(function(potreros){
    $scope.potreros = potreros;
  });

  var validate = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if (($scope.step1Form.$invalid) && (toState.data.step > fromState.data.step))
      event.preventDefault();
  });

  $scope.updateShiftValue = function(){
    if($scope.data.shift.value) {
      $scope.data.shift.key = "Nocturno";
    } else {
      $scope.data.shift.key = "Diurno";
    }
  };

  $scope.$on('$destroy', validate);
})

.controller('Step2Ctrl', function($scope) {
  $scope.step2Submitted = false;

  $scope.submit = function() {
    $scope.step2Submitted = true;
  };
})

.controller('Step2FormCtrl', function($scope, $rootScope, $state, DataService) {

  $scope.choice = {};

  var validate = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if (($scope.step2Form.$invalid) && (toState.data.step > fromState.data.step))
      event.preventDefault();
  });

  DataService.getMachines().then(function(machines){
    $scope.machines = machines;
  });

  DataService.getTypes().then(function(tipos){
    $scope.tipos = tipos;
  });
  
  $scope.selectedChoice = function(){
    console.log($scope.choice);
  };

  $scope.updateTopadorValue = function(){
    if($scope.data.TopadorOption.value) {
      $scope.data.TopadorOption.key = "Vshear";
    } else {
      $scope.data.TopadorOption.key = "Subsolador";
    }
  };

  $scope.updateSkidderValue = function(){
    if($scope.data.SkidderOption.value) {
      $scope.data.SkidderOption.key = "Arado";
    } else {
      $scope.data.SkidderOption.key = "Herbicida";
    }
  };

  $scope.$on('$destroy', validate);
})

.controller('Step3Ctrl', function($scope) {
  $scope.step3Submitted = false;

  $scope.submit = function() {
    $scope.step3Submitted = true;
  };
})

.controller('Step3FormCtrl', function($scope, $rootScope, $timeout) {
  // $timeout(function() {
  //   $scope.step3Form.tos.$setValidity('agree', $scope.data.tos);
  // });

  // $scope.checkTos = function() {
  //   $scope.step3Form.tos.$setValidity('agree', $scope.data.tos);
  // };

  $scope.inputs = [{ value: null }];

  $scope.addRow = function () {
    $scope.inputs.push({
      value: null
    });
  };

  $scope.removeRow = function (index) {
    $scope.inputs.splice(index, 1);
  };

  var validate = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if (($scope.step3Form.$invalid) && (toState.data.step > fromState.data.step))
      event.preventDefault();
  });

  $scope.$on('$destroy', validate);
})

.controller('DoneCtrl', function($scope, $rootScope, $ionicHistory) {
  $scope.reset = function() {
    angular.copy({
      firstname: '',
      middlename: '',
      lastname: '',
      cell: '',
      email: '',
      comments: '',
      tos: false
    }, $scope.data);
  }

  var validate = $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $ionicHistory.clearHistory();
  });

  $scope.$on('$destroy', validate);

});