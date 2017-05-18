var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function ($routeProvider) {

    $routeProvider

        .when('/main', {
            templateUrl: 'pages/main.html',
            controller: 'mainController'
        })


        .when('/main/:page', {
            templateUrl: 'pages/main.html',
            controller: 'mainController'
        })
        .when('/userlist', {
            templateUrl: 'pages/userlist.html',
            controller: 'userlistController'
        })

        .when('/adduser', {
            templateUrl: 'pages/edituser.html',
            controller: 'edituserController'
        })

        .when('/logout', {
            templateUrl: 'pages/login.html',
            controller: 'logoutController'
        })

        .when('/edituser/:num', {
            templateUrl: 'pages/edituser.html',
            controller: 'edituserController'
        })

        .when('/', {
            templateUrl: 'pages/allclassifieds.html',
            controller: 'allclassifiedsController'
        })

        .when('/login', {
            templateUrl: 'pages/login.html',
            controller: 'login'
        })
        .when('/viewclassfied', {
            templateUrl: 'pages/viewclassfied.html',
            controller: 'viewclassfied'
        })

        .when('/viewclassfied/:num', {
            templateUrl: 'pages/viewclassfied.html',
            controller: 'viewController'
        })

        .when('/addclassified', {
            templateUrl: 'pages/addclassified.html',
            controller: 'addController'
        })

        .when('/editclass/:num', {
            templateUrl: 'pages/editclassified.html',
            controller: 'editController'
        })


        .when('/ClassifiedsByCategory/', {
            templateUrl: 'pages/classifiedsbycategory.html',
            controller: 'ClassifiedsByCategoryController'
        })
        .when('/ClassifiedsByCategory/:num', {
            templateUrl: 'pages/classifiedsbycategory.html',
            controller: 'ClassifiedsByCategoryController'
        })

});

myApp.controller('mainController', ['$scope', '$location', '$routeParams', '$rootScope', '$http', function ($scope, $location, $routeParams, $rootScope, $http) {
    if (angular.isUndefined($rootScope.username)) {
        var landingUrl = '/';
        $location.url(landingUrl);
    }
    else {
        $http.get('/VariousClassifiedWeb/api/users')
            .success(function (result) {
                $scope.users = result;
                $scope.UserName = $rootScope.username;
                $http.post('/VariousClassifiedWeb/api/pagecount', { UserName: $scope.UserName })
                    .success(function (result) {
                        $scope.pagecount = [];
                        for (var i = 0; i < parseInt(result, 10); i++) {
                            $scope.pagecount[i] = i;
                        }
                    });
                $http.post('/VariousClassifiedWeb/api/RetieveClassfied', { UserName: $scope.UserName, page: $routeParams.page })
                    .success(function (result) {
                        $scope.classifieds = result;
                        $scope.chunkedData = chunk(result, 4);

                    })
            });
    }

    $scope.MyDestiny = function (UserName) {        
        $http.post('/VariousClassifiedWeb/api/pagecount', { UserName: UserName })
            .success(function (result) {
                $scope.pagecount = [];
                for (var i = 0; i < parseInt(result, 10); i++) {
                    $scope.pagecount[i] = i;
                }
            });
        $http.post('/VariousClassifiedWeb/api/RetieveClassfied', { UserName: UserName, page: 1 })
            .success(function (result) {
                $scope.classifieds = result;
                $scope.chunkedData = chunk(result, 4);

            })

    };
}]);



myApp.controller('userlistController', ['$scope', '$location', '$rootScope', '$http', function ($scope, $location, $rootScope, $http) {
    if (angular.isUndefined($rootScope.username)) {
        var landingUrl = '/';
        $location.url(landingUrl);
    }
    else {
        $http.get('/VariousClassifiedWeb/api/users')
            .success(function (result) {
                $scope.userlist = result;
            });
    }
}]);





myApp.controller('logoutController', ['$scope', '$location', '$rootScope', '$http', function ($scope, $location, $rootScope, $http) {

    delete $rootScope.username;
    var landingUrl = '/login';
    $location.url(landingUrl);
}]);

myApp.controller('login', ['$scope', '$location', '$rootScope', '$http', '$timeout', function ($scope, $location, $rootScope, $http, $timeout) {
    $scope.submessage = true;
    $scope.hasError = function (field, validation) {
        if (validation) {
            return ($scope.loginForm[field].$dirty && $scope.loginForm[field].$error[validation]) || ($scope.submitted && $scope.loginForm[field].$error[validation]);
        }
        return ($scope.loginForm[field].$dirty && $scope.loginForm[field].$invalid) || ($scope.submitted && $scope.loginForm[field].$invalid);
    };

    $scope.blurUpdate = function () {
        // add this line 
        if (!$scope.submessage) {
            $scope.submessage = true;
            return;
        }
        //your code
    }


    $scope.login = function () {
        if ($scope.loginForm.$invalid) {          
            $scope.submitted = true;           
            return;            
        }

   
        $http.post('/VariousClassifiedWeb/api/login', { UserName: $scope.UserName, Password: $scope.Password })
            .success(function (result) {
                if ($http.pendingRequests.length > 0) {
                } else {
                    if (result.status == 'success') {
                        $rootScope.username = $scope.UserName;
                        $scope.submessage = false;
                        $scope.message = result.message;
                        $timeout(function () {
                            var landingUrl = '/';
                            $location.url(landingUrl);                           
                        }, 1000);   
                      
                    }
                    else {
                        $scope.submessage = false;
                        $scope.message = result.message + ' Please check the username and password.'; 
                    }

                }
            })


    };
}]);



myApp.controller('edituserController', ['$scope', '$location', '$routeParams', '$http', '$timeout', function ($scope, $location, $routeParams, $http, $timeout) {   
    $scope.UserExistMessage = "";      
    $scope.submitted = false;
        $scope.hasError = function (field, validation) {
        if (validation) {
            return ($scope.edituserForm[field].$dirty && $scope.edituserForm[field].$error[validation]) || ($scope.submitted && $scope.edituserForm[field].$error[validation]);
        }
        return ($scope.edituserForm[field].$dirty && $scope.edituserForm[field].$invalid) || ($scope.submitted && $scope.edituserForm[field].$invalid);
    };
    $scope.passwordmatch = true;
    if ($routeParams.num) {
        $http.get('/VariousClassifiedWeb/api/users', {
            params: { id: $routeParams.num }
        }).success(function (result) {
            $scope.user = result[0];            
        });
    }

    $scope.isUserExist = function () {
        $http.post('/VariousClassifiedWeb/api/isUserExist', { UserName: $scope.user.UserName })
            .success(function (result) {
                if ($http.pendingRequests.length > 0) {
                } else {
                    if (result.status == 'success') {
                        $scope.UserExistMessage = "User name already exists. Please provide a new Username";
                        return true;
                    }                   
                }
            })
        $scope.UserExistMessage = "";       
        return false;
    };

    $scope.matchPassword = function () {
        if ($scope.user.Password != $scope.user.ConfirmPassword) {
            $scope.passwordmatch = false;
            return false;
        }           
        else {
            $scope.passwordmatch = true;
            return true;
        }
           
    }

    $scope.SaveUser = function () {
        if ($scope.edituserForm.$invalid) {
            $scope.submitted = true;
            return;
        }

        if (!$scope.matchPassword()) { 
            $scope.submitted = true;
            return;
        }

         if (angular.isUndefined($scope.user.IsActive)) {
            $scope.user.IsActive = true;
        }

        if ($scope.edituserForm.$invalid) {
            $scope.submitted = true;
            return;
        }

        if (!$scope.user.ID) {
            if ($scope.UserExistMessage!='') {
                $scope.submitted = true;                  
                return;
            }
        }
      
        $http.post('/VariousClassifiedWeb/api/SaveUser', { id: $scope.user.ID, UserName: $scope.user.UserName, Password: $scope.user.Password, EMail: $scope.user.EMail, IsActive: $scope.user.IsActive })
            .success(function (result) {                
                if ($http.pendingRequests.length > 0) {
                } else {                    
                    $scope.message = "User information is saved.";
                    $timeout(function () {
                        var landingUrl = '/';
                        $location.url(landingUrl);
                    }, 1000); 
                }
            })
    };

    $scope.deleteUser = function () {
        if (confirm("Are you sure you want to delete this user")) {
            $http.post('/VariousClassifiedWeb/Api/DeleteUser', { id: $scope.user.ID })
                .success(function (result) {
                    if ($http.pendingRequests.length > 0) {
                    } else {
                        var landingUrl = '/userlist';
                        $location.url(landingUrl);
                    }


                })
        }
    };


}]);


myApp.controller('allclassifiedsController', ['$scope', '$location', '$http', function ($scope, $location, $http) {
    $http.get('/VariousClassifiedWeb/api/Categories')
        .success(function (result) {
            $scope.Categories = result;
        });
    $http.get('/VariousClassifiedWeb/api/AllClassifiedsGroupByCategoryID')
        .success(function (result) {
            $scope.classifieds = result;
            $scope.chunkedData = chunk(result, 4);
        });
    $scope.filterMiscellaneousPropertyJobs = function (category) {
        return category.CategoryTitle == 'Miscellaneous' || category.CategoryTitle == 'Property' || category.CategoryTitle == 'Jobs';
    };
    $scope.filterBeautyServicesOther = function (category) {
        return category.CategoryTitle == 'Beauty' || category.CategoryTitle == 'Services' || category.CategoryTitle == 'Other';
    };
}]);


myApp.controller('viewController', ['$scope', '$log', '$routeParams', '$http', function ($scope, $log, $routeParams, $http) {
    $http.get('/VariousClassifiedWeb/api', {
        params: { id: $routeParams.num }
    }).success(function (result) {
        $scope.classified = result;
    });
}]);

myApp.controller('ClassifiedsByCategoryController', ['$scope', '$log', '$routeParams', '$http', function ($scope, $log, $routeParams, $http) {
    $http.get('/VariousClassifiedWeb/api/ClassifiedsByCategoryID', {
        params: { id: $routeParams.num }
    }).success(function (result) {
        if (angular.isUndefined($routeParams.num)) {
            $scope.showall = 1;
        }
        else {
            $scope.showall = 0;
        }

        $scope.classified = result;
        $scope.chunkedData = chunk(result, 2);

    });
}]);


myApp.controller('editController', ['$scope', '$log', '$routeParams', '$rootScope', '$http', '$location', function ($scope, $log, $routeParams, $rootScope, $http, $location) {
    $scope.submitted = false;
    $scope.initDatepicer = function () {
        $(function () {
            $(".datepic").datepicker();
        });
    }

    $scope.hasError = function (field, validation) {

        if (validation) {
            return ($scope.editClassified[field].$dirty && $scope.editClassified[field].$error[validation]) || ($scope.submitted && $scope.editClassified[field].$error[validation]);
        }
        return ($scope.editClassified[field].$dirty && $scope.editClassified[field].$invalid) || ($scope.submitted && $scope.editClassified[field].$invalid);
    };


    $http.get('/VariousClassifiedWeb/api/Categories')
        .success(function (result) {
            $scope.Categories = result;

        });
    $http.get('/VariousClassifiedWeb/api', {
        params: { id: $routeParams.num }
    }).success(function (result) {
        $scope.classified = result[0];       
        $scope.initDatepicer();
    });
    $scope.CategoryID = 0;
    $scope.addRule = function () {
        if (angular.isUndefined($scope.IsActive)) {
            $scope.IsActive = false;
        }

        if ($scope.editClassified.$invalid) {
            $scope.submitted = true;
            return;
        }

        $http.post('/VariousClassifiedWeb/api', { id: $scope.classified.ClassifiedID, ClassifiedTitle: $scope.classified.ClassifiedTitle, ClassifiedDescription: $scope.classified.ClassifiedDescription, CategoryID: $scope.classified.CategoryID, ClassifiedImage: $scope.classified.ClassfiedImage, ContactDetails: $scope.classified.ContactDetails, Notes: $scope.classified.Notes, IsActive: $scope.classified.IsActive, FromDate: $scope.classified.FromDate, ToDate: $scope.classified.ToDate, UserName: $rootScope.username })
            .success(function (result) {
                if ($http.pendingRequests.length > 0) {
                } else {
                    var landingUrl = '/';
                    $location.url(landingUrl);
                }


            })
    };

    $scope.deleteRule = function () {
        $http.post('/VariousClassifiedWeb/Api/Delete', { id: $scope.classified.ClassifiedID })
            .success(function (result) {
                if ($http.pendingRequests.length > 0) {
                } else {
                    var landingUrl = '/';
                    $location.url(landingUrl);
                }


            })
    };

    $scope.showMyImage = function (fileInput) {
        var files = fileInput.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {
                continue;
            }
            var img = document.getElementById("img");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                    document.getElementById("img").value = e.target.result;
                    $scope.classified.ClassfiedImage = e.target.result;
                    $scope.$digest();
                };
            })(img);
            reader.readAsDataURL(file);
        }
    };

}]);

myApp.controller('addController', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
    $scope.submitted = false;
    if (angular.isUndefined($rootScope.username)) {
        var landingUrl = '/login';
        $location.url(landingUrl); 
    }
    else {
        $http.get('/VariousClassifiedWeb/api/Categories')
            .success(function (result) {
                $scope.Categories = result;
            });
        $http.get('/VariousClassifiedWeb/api/GetReferenceNo')
            .success(function (result) {
                $scope.Reference = result;
            });
        $scope.ClassifiedTitle = '';
        $scope.ClassifiedDescription = '';
        $scope.CategoryImage = '';
        $scope.uploadedFile = function (element) {
            $scope.$apply(function ($scope) {
                $scope.files = element.files;
            });
        }       
        $scope.hasError = function (field, validation) {
            if (validation) {
                return ($scope.addClassified[field].$dirty && $scope.addClassified[field].$error[validation]) || ($scope.submitted && $scope.addClassified[field].$error[validation]);
            }
            return ($scope.addClassified[field].$dirty && $scope.addClassified[field].$invalid) || ($scope.submitted && $scope.addClassified[field].$invalid);
        };

        $scope.CategoryID = 0;
        $scope.addRule = function () {            
            if ($scope.addClassified.$invalid) {
                $scope.submitted = true;
                return;
            }
            if (angular.isUndefined($scope.IsActive)) {
                $scope.IsActive = false;
            }
            $http.post('/VariousClassifiedWeb/api', { ClassifiedTitle: $scope.ClassifiedTitle, ClassifiedDescription: $scope.ClassifiedDescription, CategoryID: $scope.CategoryID, ClassifiedImage: $scope.ClassfiedImage, IsActive: $scope.IsActive, ContactDetails: $scope.ContactDetails, Notes: $scope.Notes, RefNo: $scope.Reference[0].NextRefNo, FromDate: $scope.FromDate, ToDate: $scope.ToDate, UserName: $rootScope.username })
                .success(function (result) {
                    if ($http.pendingRequests.length > 0) {
                    } else {
                        var landingUrl = '/';
                        $location.url(landingUrl);
                    }
                })
        };
        $scope.showMyImage = function (fileInput) {
            var files = fileInput.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var imageType = /image.*/;
                if (!file.type.match(imageType)) {
                    continue;
                }
                var img = document.getElementById("img");
                img.file = file;
                var reader = new FileReader();
                reader.onload = (function (aImg) {
                    return function (e) {
                        aImg.src = e.target.result;
                        document.getElementById("img").value = e.target.result;
                        $scope.ClassfiedImage = e.target.result;
                        $scope.$digest();
                    };
                })(img);
                reader.readAsDataURL(file);
            }
        };
    }
}]);

function chunk(arr, size) {
    var newArr = [];
    for (var i = 0; i < arr.length; i += size) {
        newArr.push(arr.slice(i, i + size));
    }
    return newArr;
}



