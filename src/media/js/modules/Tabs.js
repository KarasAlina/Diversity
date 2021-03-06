function Tabs() {
	this.rebuild();
}

Tabs.prototype = {
	rebuild() {
		let $tabs = $('[data-tabs]');
		let totalTabs = $tabs.length;
		for (let k = 0; k < totalTabs; k++) {
			this._initTabs($tabs.eq(k));
		}

		$tabs.removeAttr('data-tabs');
	},

	_initTabs($container) {
		const urlParams = new URLSearchParams(window.location.search);
		const tabParam = urlParams.get('tab');
		console.log(tabParam);
		let useSlideAnimation = typeof $container.attr('data-tabs-use-slideups') != 'undefined';
		$container.find('.tabs').append("<div class='tabs__sliding-block'></div>");
		let $openers = $container.find('[data-tab-opener]').removeClass('_active-tab');
		let $needOpeners = $('100-percent-no-element');

		let totalOpeners = $openers.length;
		for (let k = 0; k < totalOpeners; k++) {
			let $opener = $openers.eq(k);
			if (
				$opener
					.parents('[data-tabs]')
					.first()
					.is($container)
			) {
				$needOpeners = $needOpeners.add($opener);
			}
		}

		$openers = $needOpeners;

		let $tabs = $container.find('[data-tab]').removeClass('_active-tab');
		let $needTabs = $('100-percent-no-element');
		let totalTabs = $tabs.length;
		for (let k = 0; k < totalTabs; k++) {
			let $tab = $tabs.eq(k);
			if (
				$tab
					.parents('[data-tabs]')
					.first()
					.is($container)
			) {
				$needTabs = $needTabs.add($tab);
			}
		}

		$tabs = $needTabs;
		if (tabParam != null) {
			$openers.filter('[data-tab-opener="' + tabParam + '"]').addClass('_active-tab');
			$tabs.filter('[data-tab="' + tabParam + '"]').addClass('_active-tab');
		} else {
			let $firstTab = $tabs
				.first()
				.addClass('_active-tab')
				.show();
			$openers
				.filter('[data-tab-opener="' + $firstTab.attr('data-tab') + '"]')
				.addClass('_active-tab');
		}

		let $openerEvent;
		if ($openers.parents('.tabs-nav').hasClass('_by-click')) {
			$openerEvent = 'click';
		} else {
			$openerEvent = 'mouseover';
		}
		$openers.on($openerEvent, function(e) {
			e.preventDefault();

			let $this = $(this);
			if ($this.hasClass('_active-tab')) {
				return;
			}

			$openers.removeClass('_active-tab');
			$tabs.removeClass('_active-tab');

			if (useSlideAnimation) {
				$tabs.stop().slideUp();
			} else {
				$tabs.stop().hide();
			}

			$this.addClass('_active-tab');
			$openers
				.filter('[data-tab-opener="' + $this.attr('data-tab-opener') + '"]')
				.not($this)
				.addClass('_active-tab');

			let $tab = $tabs
				.filter('[data-tab="' + $this.attr('data-tab-opener') + '"]')
				.addClass('_active-tab');

			if (useSlideAnimation) {
				$tab.stop().slideDown();
			} else {
				$tab.stop().fadeIn();
			}
		});
	},
};

module.exports = new Tabs();
