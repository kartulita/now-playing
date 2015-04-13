(function (angular) {
	'use strict';

	angular.module('battlesnake.now-playing')
		.controller('nowPlayingController', nowPlayingController);

	function nowPlayingController($scope, $timeout, $q) {
		var element;
		var scope = $scope;

		$scope.model = {
			data: null,
			caption: '',
			empty: true
		};

		$scope.methods = {
			openItem: openItem
		};

		var updateTimer;

		this.init = initController;
		return;

		function initController(element_) {
			element = element_;
			resetModel();
			scope.$watch('adapter', adapterChanged);
		}

		function adapterChanged() {
			resetModel();
			if (scope.adapter) {
				poll();
			}
		}

		function resetModel() {
			setEmpty();
			stopTimer();
		}

		function setEmpty() {
			$scope.model.data = null;
			$scope.model.caption = '';
			$scope.model.empty = true;
		}

		function setTimer(delay) {
			stopTimer();
			updateTimer = $timeout(poll, delay);
		}

		function stopTimer() {
			if (updateTimer) {
				$timeout.cancel(updateTimer);
				updateTimer = null;
			}
		}

		function poll() {
			return $q.when(scope.adapter.update())
				.then(updateData)
				.catch(pollFailed);
		}

		function updateData(data) {
			var old = scope.model.caption;
			var value = data.caption;
			scope.model.caption = data.empty ? '' : (value || '');
			scope.model.empty = data.hasOwnProperty('empty') ? data.empty : !scope.model.caption.length;
			scope.model.data = data || {};
			if (data.delay) {
				setTimer(data.delay);
			} else 	if (old === value) {
				setTimer(scope.adapter.delayNoUpdate || 5000);
			} else {
				setTimer(scope.adapter.delayUpdate || 60000);
			}
		}

		function openItem() {
			scope.onOpenItem({ data: scope.model.data });
		}

		function pollFailed() {
			setEmpty();
		}
	}

})(window.angular);
