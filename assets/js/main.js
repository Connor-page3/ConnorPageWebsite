/*
	Spectral by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#page-wrapper'),
		$banner = $('#banner'),
		$header = $('#header'),
		$menu = $('#menu'),
		menuDelay = 500;

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Mobile?
		if (browser.mobile)
			$body.addClass('is-mobile');
		else {

			breakpoints.on('>medium', function() {
				$body.removeClass('is-mobile');
			});

			breakpoints.on('<=medium', function() {
				$body.addClass('is-mobile');
			});

		}

	// Scrolly.
		$('.scrolly').not('#menu .scrolly')
			.scrolly({
				speed: 1500,
				offset: $header.outerHeight()
			});

	// Menu.
		$menu
			.append('<a href="#menu" class="close"></a>')
			.appendTo($body)
			.panel({
				delay: menuDelay,
				hideOnClick: false,
				hideOnSwipe: true,
				resetScroll: true,
				resetForms: true,
				side: 'right',
				target: $body,
				visibleClass: 'is-menu-visible'
			});

		// Close the menu before scrolling to an on-page section. Keeping this
		// separate from Scrolly avoids two animations fighting over the viewport.
		$menu.on('click', 'a[href^="#"]:not(.close)', function(event) {
			var href = $(this).attr('href'),
				$target = $(href);

			if ($target.length === 0)
				return;

			event.preventDefault();
			$body.removeClass('is-menu-visible');

			window.setTimeout(function() {
				var targetTop = Math.max(0, $target.offset().top - $header.outerHeight()),
					reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

				window.history.pushState(null, '', href);
				window.scrollTo({
					top: targetTop,
					behavior: reduceMotion ? 'auto' : 'smooth'
				});
			}, menuDelay);
		});

		// External menu links can navigate normally, but should still dismiss the panel.
		$menu.on('click', 'a:not([href^="#"])', function() {
			$body.removeClass('is-menu-visible');
		});

	// Header.
		if ($banner.length > 0
		&&	$header.hasClass('alt')) {

			$window.on('resize', function() { $window.trigger('scroll'); });

			$banner.scrollex({
				bottom:		$header.outerHeight() + 1,
				terminate:	function() { $header.removeClass('alt'); },
				enter:		function() { $header.addClass('alt'); },
				leave:		function() { $header.removeClass('alt'); }
			});

		}

})(jQuery);
