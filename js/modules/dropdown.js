class DropdownModule {
	constructor() {
		window.onclick = function (event) {
			if (!event.target.matches('[data-dropdown]') && !(event.target.parentNode && event.target.parentNode.matches('[data-dropdown]'))) {
				$(".dropdown-content").hide();
			}
		}

		const dropdownLinks = $('a[data-dropdown]');
		$.each(dropdownLinks, (index, link) => {
			$(link).attr('href', '#');
			$(link).click((e) => {
				let target = $(e.target).closest('a[data-dropdown]').data('dropdown')
				$('#' + target).toggle();
			});
		});
	}
}