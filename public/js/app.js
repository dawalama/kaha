// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'plexusSelect'])

.run(function($ionicPlatform) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($ionicConfigProvider, $compileProvider, $stateProvider, $urlRouterProvider) {

	if(!ionic.Platform.isIOS())$ionicConfigProvider.scrolling.jsScrolling(false);

	//Disable debug data for PROD
	if (ENV === 'prod') {
		$compileProvider.debugInfoEnabled(false);
	}

	$stateProvider

	.state('app', {
		url: "/app",
		abstract: true,
		template: require('../templates/menu.html'),
		controller: 'AppCtrl'
	})
	.state('app.helpdesk', {
		url: "/helpdesk",
		views: {
			'menuContent': {
				template: require('../templates/helpdesk.html'),
				controller: 'HelpdeskCtrl'
			}
		}

	})

	.state('app.section', {
		url: "/section/:sectionid",
		views: {
			'menuContent': {
				template: require('../templates/section.html'),
				controller: 'SectionCtrl'
			}
		}
	})

	.state('app.item', {
		url: "/item/:uuid",
		views: {
			'menuContent': {
				template: require('../templates/item.html'),
				controller: 'ItemCtrl'
			}
		}
	})
	.state('app.submit', {
		url: "/submit?edit&type&district&channel&datasource",
		views: {
			'menuContent': {
				template: require('../templates/submit.html'),
				controller: 'SubmitCtrl'
			}
		}
	})
	.state('app.about', {
		url: "/about",
		views: {
			'menuContent': {
				template: require('../templates/about.html'),
				controller: 'AboutCtrl'
			}
		}
	})
	.state('app.duplicatelist',{
		url: "/duplicatelist",
		views: {
			'menuContent': {
				template: require('../templates/admin/duplicatelist.html'),
				controller: 'DuplicateListCtrl'
			}
		}
	})
	.state('app.duplicateitem',{
		url: "/duplicateitem/:itemid",
		views: {
			'menuContent': {
				template: require('../templates/admin/duplicateitem.html'),
				controller: 'DuplicateItemCtrl'
			}
		}
	})
	.state('app.edit', {
		url: "/edit",
		views: {
			'menuContent': {
				template: require('../templates/submit.html'),
				controller: 'EditCtrl'
			}
		}
	});
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/helpdesk');
})
.directive('ionSearch', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                getData: '&source',
                model: '=?',
                placeholder: '@',
                search: '=?filter'
            },
            link: function(scope, element, attrs) {
                attrs.minLength = attrs.minLength || 0;
                scope.placeholder = attrs.placeholder || '';
                scope.search = {value: ''};

                if (attrs.class)
                    element.addClass(attrs.class);

                if (attrs.source) {
                    scope.$watch('search.value', function (newValue, oldValue) {
                        if (newValue.length > attrs.minLength) {
                            scope.getData({str: newValue}).then(function (results) {
                                scope.model = results;
                            });
                        } else {
                            scope.model = [];
                        }
                    });
                }

                scope.clearSearch = function() {
                    scope.search.value = '';
                };
            },
            template: '<div class="item-input-wrapper">' +
                        '<i class="icon ion-android-search"></i>' +
                        '<input type="search" placeholder="{{placeholder}}" ng-model="search.value" autofocus>' +
                        '<i ng-if="search.value.length > 0" ng-click="clearSearch()" class="icon ion-close"></i>' +
                      '</div>'
        };
    })
    .filter('search', function($filter) {
        return function(items, searchText){
            if (!searchText || searchText.length === 0) {
                return items;
            }

            var searchTokens= searchText.split(' ');

            searchTokens.forEach(function(term) {
                if (term && term.length) {
                    items = $filter('filter')(items, term);
                }
            });

            return items
        };
    })
    .filter('ucfirst', function() {
        return function(input, scope) {
            if (input!=null)
                input = input.toLowerCase();
            return input.substring(0,1).toUpperCase()+input.substring(1);
        }
    });
