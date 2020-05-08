class RouterModule {
	constructor(defaultPage) {
		this.subscriptions = [];

		this.prepareLinks();

		this.navigate(defaultPage, 'content');
	}

	prepareLinks() {
		var context = this;
		const pageLinks = $('a[data-route]');

		pageLinks.each(function () {
			context.prepareLink(this);
		});
	}

	prepareLink(link) {
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
		if (this.currentPage === page)
			return;

		const sectionContainer = $(`section[data-page=${page}]`);

		this.cleanState();

		$('section').hide();
		sectionContainer.show();

		// Emit event
		const subscription = this.subscriptions.find(sub => sub.page === page);
		if (subscription !== undefined) {
			subscription.callback();
		}

		this.currentPage = page;
	}

	subscribe(page, callback) {
		this.subscriptions.push({
			page: page,
			callback: callback
		});
	}

	loginRedirect() {
		this.navigate('game');
	}
}