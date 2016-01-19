angular.module('dalfey.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicLoading, $timeout) {
  $scope.hideBackButton = false;
  $scope.data = {
    operator: "",
    puesto: "",
    potrero: "",
    shift: { key: 'Diurno', value: "" },
    date: "",
    maquina: "",
    topskider: "",
    horaInicio: "",
    horaFin: "",
    combInicio: "",
    combFin: "",
    produccion: { },
    aceite: "",
    gasoil: "",
    hidraulico: "",
    radiador: "",
    valvula:"",
    TopadorOption: { key: 'Subsolador', value: false },
    SkidderOption: { key: 'Herbicida', value: false },
    stops: []
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

  //TODO: put this in a function
  $scope.inputs = [{ value: 0 }];
  var itemsCount = $scope.data.stops.length;
  for(i = 1; i<itemsCount; i++)
  {
    $scope.inputs.push({ value: i });
  }
  $scope.idxStops = itemsCount - 1  > 0? itemsCount - 1 : 0;

  $scope.addRow = function () {
    $scope.idxStops += 1;
    $scope.inputs.push({
      value: $scope.idxStops
    });
  };

  $scope.removeRow = function (index, val) {
    $scope.inputs.splice(index, 1);
    $scope.data.stops.splice(val, 1);
    $scope.idxStops -= 1;
    $scope.updateInputsVal();
  };

  $scope.updateInputsVal = function() {
    angular.forEach($scope.inputs, function(input, idx) {
       input.value = key;
    });
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
      operator: "",
      puesto: "",
      potrero: "",
      shift: { key: 'Diurno', value: "" },
      date: "",
      maquina: "",
      topskider: "",
      horaInicio: "",
      horaFin: "",
      combInicio: "",
      combFin: "",
      produccion: { },
      aceite: "",
      gasoil: "",
      hidraulico: "",
      radiador: "",
      valvula:"",
      TopadorOption: { key: 'Subsolador', value: false },
      SkidderOption: { key: 'Herbicida', value: false },
      stops: []
    }, $scope.data);
  };

  var validate = $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $ionicHistory.clearHistory();
  });

  $scope.$on('$destroy', validate);
});