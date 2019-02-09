var app = angular.module('myApp', ['ui.bootstrap']);
app.controller('myCtrl', function($scope,$rootScope,$http,$uibModal) {

  gettodos();
  
  function gettodos() {
    $http.get("/rest/items").then(function(response) {
    $scope.todolist = response.data;
    });
  };	
  
  
  function posttodos(data) {
	vdata = {note :data.note, date: data.date};
    $http.post("/rest/items",JSON.stringify(vdata)).then(function(response) {
		gettodos();
    });
  };	
  
  function deletetodos(id) {
    $http.delete("/rest/items/"+id).then(function(response) {
		gettodos();
    });
  };	
  
  function updatetodos(data) {
	vdata = {note :data.note, date: data.date};
    $http.put("/rest/items/"+$scope._id,JSON.stringify(vdata)).then(function(response) {
		gettodos();
    });
  };	
  
  $scope.openedit2 = function (vid) {
    $http.get("/rest/items/"+vid).then(function(response) {
		$scope.note = response.data.note;
		$scope.date = response.data.notedate;
		$scope._id = vid;
		$scope.openedit(vid);
    });
  };	
  
  
   $scope.openedit = function (vid) {
       console.log("open edit");
	    if (vid) {
			//console.log ('stari');
		} else {
			$scope.note = "";
			$scope.date = "";
			$scope._id = "";

		}	
		
        modalInstance = $uibModal.open({
            controller: 'EditCtrl',
            controllerAs: '$ctrl',
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'editmodal.html' ,
            resolve: {
              note: function () {
                return $scope.note;
              },
			  date: function () {
                return $scope.date;
              }
            }         
        });
  
        modalInstance.result.then(function (data) {
			if ($scope._id === "")
				{posttodos (data)}
			else {
				updatetodos(data);
			}		;
			
			
        }, function () {
            console.log('Modal dismissed');
        });
        
        $rootScope.modalInstance = modalInstance;
    };
	
	
	$scope.confirmdelete = function (id, msg) {
        console.log('confirmdelete modal');
        modalInstance = $uibModal.open({
            controller: 'ConfirmInstanceCtrl',
            controllerAs: 'pc',
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'ConfirmModal.html', 
            backdrop : 'static',
            resolve: {
              text: function () {
                return msg;
              }
            }     
        });
    
        modalInstance.result.then(function (user) {
              deletetodos(id);

    
        }, function () {
            console.log('ConfirmModal dismissed');
        });
        
        $rootScope.modalInstance = modalInstance;
      };

	
}).controller('EditCtrl', function ($uibModalInstance, note, date) {
	var $ctrl = this;
	console.log("ooo"+date);
	$ctrl.note = note;
	$ctrl.date = date;
	
    $ctrl.ok = function(){
      $uibModalInstance.close({note:$ctrl.note, date:$ctrl.date});
    };
    $ctrl.cancel = function(){
      $uibModalInstance.dismiss();
    };
	
/// za datapicker
  $ctrl.today = function() {
    $ctrl.dt = new Date();
  };
  $ctrl.today();

  $ctrl.clear = function() {
    $ctrl.dt = null;
  };

  $ctrl.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $ctrl.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $ctrl.toggleMin = function() {
    $ctrl.inlineOptions.minDate = $ctrl.inlineOptions.minDate ? null : new Date();
    $ctrl.dateOptions.minDate = $ctrl.inlineOptions.minDate;
  };

  $ctrl.toggleMin();

  $ctrl.open1 = function() {
    $ctrl.popup1.opened = true;
  };

  $ctrl.open2 = function() {
    $ctrl.popup2.opened = true;
  };

  $ctrl.setDate = function(year, month, day) {
    $ctrl.date = new Date(year, month, day);
  };

  $ctrl.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $ctrl.format = $ctrl.formats[0];
  $ctrl.altInputFormats = ['M!/d!/yyyy'];

  $ctrl.popup1 = {
    opened: false
  };

  $ctrl.popup2 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $ctrl.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }
})// kontroler za ConfirmMoldal
.controller('ConfirmInstanceCtrl', function ($uibModalInstance,text) {
  this.confirmtext = text
  this.ok = function () {
    $uibModalInstance.close('ok');
  };

this.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});;
;
