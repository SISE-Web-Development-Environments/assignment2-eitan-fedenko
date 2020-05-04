class RouterModule {
	constructor(defaultPage) {
		var context = this;

		const pageLinks = $('a[data-route]');

		pageLinks.each(function () {
			context.processLink(this);
		});

		this.navigate(defaultPage, 'content');
	}

	processLink(link) {
		var context = this;

		let route = $(link).data('route');
		$(link).attr('href', '#');
		$(link).click(function () {
			context.navigate(route);
		});
	}

	cleanState() {
		$('.error').hide();
	}

	navigate(page) {
		const sectionContainer = $(`section[data-page=${page}]`);

		this.cleanState();

		$('section').removeClass('show');
		sectionContainer.addClass('show');
	}
}