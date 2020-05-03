class Router {
	constructor(menuContainer) {
		var context = this;

		menuContainer.children('a').each(function () {
			let route = $(this).data('route');
			$(this).attr('href', '#');
			$(this).click(function () {
				context.navigate(route);
			});
		});
	}


	navigate(page) {
		$('section').removeClass('show');
		$(`section[data-page=${page}]`).addClass('show');
	}
}