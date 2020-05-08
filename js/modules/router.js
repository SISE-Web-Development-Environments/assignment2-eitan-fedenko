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

		this.invoke(this.currentPage, 'hide');
		$('section').hide();
		sectionContainer.show();

		// Emit event
		this.invoke(page, 'show');

		this.currentPage = page;
	}

	invoke(page, event) {
		if (page === undefined)
			return;

		console.log(`Page ${page} invoked event ${event}`);
		const subscription = this.subscriptions.find(sub => sub.page === page && sub.event === event);
		if (subscription !== undefined) {
			subscription.callback();
		}
	}

	subscribe(page, event, callback) {
		this.subscriptions.push({
			page: page,
			event: event,
			callback: callback
		});
	}

	loginRedirect() {
		this.navigate('game');
	}
}