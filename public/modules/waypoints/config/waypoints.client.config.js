'use strict';

// Configuring the Articles module
angular.module('waypoints').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Waypoints', 'waypoints', 'dropdown', '/waypoints(/create)?');
		Menus.addSubMenuItem('topbar', 'waypoints', 'List Waypoints', 'waypoints');
		Menus.addSubMenuItem('topbar', 'waypoints', 'New Waypoint', 'waypoints/create');
	}
]);