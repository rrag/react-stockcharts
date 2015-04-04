'use strict';
var contentTop = [];

var ScrollMixin = {
	handleWindowResize() {
		contentTop.splice(0);
		// Set up content an array of locations
		$('.nav-sidebar').find('a').each(function(){
			contentTop.push( $( $(this).attr('href') ).offset().top );
		})
	},
	componentWillUnMount() {
		window.removeEventListener("resize", this.handleWindowResize);
	},
	componentDidMount() {
		window.addEventListener("resize", this.handleWindowResize);

		var topRange      = 200,  // measure from the top of the viewport to X pixels down
			edgeMargin    = 20,   // margin above the top or margin from the end of the page
			animationTime = 500; // time in milliseconds
			
		// Stop animated scroll if the user does something
		$('html,body').bind('scroll mousedown DOMMouseScroll mousewheel keyup', function(e) {
			if ( e.which > 0 || e.type == 'mousedown' || e.type == 'mousewheel' ) {
				$('html,body').stop();
			}
		});
		//$('div#ContentSection').scrollTop(-50)
		// console.log($('html,body').scrollTop());
		// Set up content an array of locations
		$('.nav-sidebar').find('a').each(function(){
			contentTop.push( $( $(this).attr('href') ).offset().top );
		})
		// Animate menu scroll to content
		$('.nav-sidebar').find('a').click(function() {
			var sel = this,
				index = $('.nav-sidebar a').index( $(this) ),
				offset = index === contentTop.length - 1 ? 0 : -50,
				newTop = Math.min( contentTop[index], $(document).height() - $(window).height() ) + offset; // get content top or top position if at the document bottom
			// console.log(newTop)
			$('html,body')
				//.stop()
				.animate({
						'scrollTop' : newTop
					},
					animationTime/*,
					function() {
						window.location.hash = $(sel).attr('href');
					}*/);
			return false;
		});

		$(window).scroll(function(e) {
			// console.log(e)
			var winTop = $(window).scrollTop(),
				bodyHt = $(document).height(),
				vpHt = $(window).height() + edgeMargin;  // viewport height + margin

			$.each( contentTop, function(i, loc){
				if ( ( loc > winTop - edgeMargin && ( loc < winTop + topRange || ( winTop + vpHt ) >= bodyHt ) ) ) {
					$('ul.nav-sidebar li')
						.removeClass('active')
						.eq(i).addClass('active');
				}
			})
		});
		$(window).on('hashchange', function() {
			var top = $('html,body').scrollTop() - 50;
			$('html,body').scrollTop(top);
		});/**/
	}
};

module.exports = ScrollMixin;