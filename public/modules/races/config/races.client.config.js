'use strict';

// Configuring the Articles module
angular.module('races').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Races', 'races', 'dropdown', '/races(/create)?');
		Menus.addSubMenuItem('topbar', 'races', 'List Races', 'races');
		Menus.addSubMenuItem('topbar', 'races', 'New Race', 'races/create');
	}
]);