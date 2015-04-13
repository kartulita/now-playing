(function (angular) {
	'use strict';

	angular.module('battlesnake.now-playing')
		.directive('nowPlaying', nowPlayingDirective);

	function nowPlayingDirective() {
		return {
			restrict: 'A',
			require: 'nowPlaying',
			scope: {
				adapter: '=nowPlaying',
				onOpenItem: '&nowPlayingOpenItem'
			},
			templateUrl: 'now-playing-template.html',
			controller: 'nowPlayingController',
			link: link
		};

		function link(scope, element, attrs, controller) {
			controller.init(element);
		}
	}

})(window.angular);
