angular.module('dalfey.controllers', [])

.controller('LoginCtrl', function($scope, $state, Storage) {
  $scope.user = {};

  $scope.login = function(){
    Storage.set("currUser", $scope.user);
    $state.go('home');
  };
})

.controller('SettingsCtrl', function($scope, $rootScope, $ionicLoading, $timeout, Storage) {
  
  $scope.user = {};
  
  $scope.$on('$ionicView.beforeEnter', function(){
    $scope.hideBackButton = false;
    $scope.user = Storage.get("currUser");
  });

  $scope.$on('$ionicView.beforeLeave', function() {
    Storage.set("currUser", $scope.user);
  });
})

.controller('HomeCtrl', function($scope, $state, $rootScope, $ionicLoading, $timeout, $ionicPopover, Storage) {
  
  $scope.hideBackButton = true;
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

  $scope.sync = function() {
    console.log($scope.worklogs);
  };
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
    $scope.data.puesto = $scope.puestos[0];
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

  var validate = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if (($scope.step1Form.$invalid) && (toState.data.step > fromState.data.step))
      event.preventDefault();
  });

  $scope.$on('$destroy', validate);
})

.controller('Step2Ctrl', function($scope) {
  $scope.step2Submitted = false;

  $scope.submit = function() {
    $scope.step2Submitted = true;
  };
})

.controller('Step2FormCtrl', function($scope, $rootScope, $state, DataService) {

  $scope.choice = { name: "" };
  $scope.TopadorOption = { key: 'Subsolador', value: false };
  $scope.SkidderOption = ['Arado','Herbicida', 'Rolo Faca'];
  $scope.tipos = ['Aserradero','Export','Pulpa','Otros'];

  DataService.getMachines().then(function(machines){
    $scope.machinesCat = machines;
    $scope.machines = $scope.machinesCat[0].maquinas;
  });
  
  $scope.$watch('choice', function(newValue, oldValue) {
    $scope.selectedChoice(newValue);
    $scope.updateMachines(newValue);
    // $scope.machines = $scope.machinesCat[newValue].maquinas;
  });

  $scope.updateMachines = function(newValue) {
    if($scope.machinesCat === undefined) return;
    
    $scope.machinesCat.forEach(function(category) {
      if(category.category === newValue) {
        $scope.machines = category.maquinas;
      }
    });
  };
  
  $scope.selectedChoice = function(tarea) {
    $scope.data.tarea = tarea;
    $scope.data.subtarea = "";
  };

  $scope.updateTopadorValue = function() {
    if($scope.TopadorOption.value) {
      $scope.TopadorOption.key = "Vshear";
      $scope.data.subtarea = "Vshear";
    } else {
      $scope.TopadorOption.key = "Subsolador";
      $scope.data.subtarea = "Subsolador";
    }
  };

  var validate = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if (($scope.step2Form.$invalid) && (toState.data.step > fromState.data.step))
      event.preventDefault();
  });

  $scope.$on('$destroy', validate);
})

.controller('Step3Ctrl', function($scope) {
  $scope.step3Submitted = false;

  $scope.submit = function() {
    $scope.step3Submitted = true;
  };
})

.controller('Step3FormCtrl', function($scope, $rootScope, $timeout, DataService) {
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

  DataService.getMechanics().then(function(mechanics){
    $scope.mechanics = mechanics;
  });

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