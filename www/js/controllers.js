angular.module('dalfey.controllers', [])

.controller('HomeCtrl', function($scope, $rootScope, $ionicLoading, $timeout, $ionicPopover,Storage) {

  $scope.worklogs = Storage.get("workItems");
  
  // .fromTemplateUrl() method
  $ionicPopover.fromTemplateUrl('menu-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });



})

.controller('AppCtrl', function($scope, $rootScope, $ionicLoading, $timeout) {
  $scope.hideBackButton = false;
  $scope.data = {
    tarea: "",
    subtarea: "",
    operator: "",
    puesto: "",
    potrero: "",
    turno: "",
    date: "",
    maquina: "",
    horaInicio: "",
    horaFin: "",
    combInicio: "",
    combFin: "",
    produccion: { },
    services: { stops:[] },
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

  $scope.shift = { key: 'Diurno', value: "" };
  $scope.date = "";

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
    if($scope.shift.value) {
      $scope.shift.key = "Nocturno";
      $scope.data.turno  = $scope.shift.key;
    } else {
      $scope.shift.key = "Diurno";
      $scope.data.turno  = $scope.shift.key;
    }
  };

  $scope.updateDate = function(){
    var selectedDate = new Date($scope.date);
    $scope.data.date = selectedDate.toJSON();
    console.log($scope.data.date);
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
  $scope.TopadorOption = { key: 'Subsolador', value: false };
  $scope.SkidderOption = { key: 'Herbicida', value: false };
  
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
    $scope.data.tarea = $scope.choice;
    $scope.data.subtarea = "";
    console.log($scope.choice);
  };

  $scope.updateTopadorValue = function(){
    if($scope.TopadorOption.value) {
      $scope.TopadorOption.key = "Vshear";
      $scope.data.subtarea = "Vshear";
    } else {
      $scope.TopadorOption.key = "Subsolador";
      $scope.data.subtarea = "Subsolador";
    }
  };

  $scope.updateSkidderValue = function(){
    if($scope.SkidderOption.value) {
      $scope.SkidderOption.key = "Arado";
      $scope.data.subtarea = "Arado";
    } else {
      $scope.SkidderOption.key = "Herbicida";
      $scope.data.subtarea = "Herbicida";
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
  $scope.stops = [];
  //TODO: put this in a function
  $scope.inputs = [{ value: 0 }];
  
  var itemsCount = $scope.stops.length;
  
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

.controller('DoneCtrl', function($scope, $rootScope, $ionicHistory, Storage) {

  console.log($scope.data);

  // //need to be moved
  // FirebaseService.$add($scope.data);

  $scope.saveWork = function() {
    
    var newItems = [$scope.data];
    var items = Storage.get("workItems");
    
    if(items) {
        newItems = items.concat(newItems);
    } 
    Storage.set("workItems", newItems);

    console.log(newItems);

    angular.copy({ 
      tarea: "",
      subtarea: "",
      operator: "",
      puesto: "",
      potrero: "",
      turno: "",
      date: "",
      maquina: "",
      horaInicio: "",
      horaFin: "",
      combInicio: "",
      combFin: "",
      produccion: {},
      services: { stops:[] },
    }, $scope.data);

  };

  var validate = $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $ionicHistory.clearHistory();
  });

  $scope.$on('$destroy', validate);
});