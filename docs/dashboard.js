'use strict';
/**/
var React = require('react');
var d3 = require('d3');

require('styles/react-stockcharts');
require('stylesheets/re-stock');

var Nav = require('lib/navbar');
var Sidebar = require('lib/sidebar');
var MainContainer = require('lib/main-container');
var MenuGroup = require('lib/menu-group');
var MenuItem = require('lib/menu-item');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');


var ExamplesPage = React.createClass({
	componentDidMount() {
		var topRange      = 200,  // measure from the top of the viewport to X pixels down
			edgeMargin    = 20,   // margin above the top or margin from the end of the page
			animationTime = 400, // time in milliseconds
			contentTop = [];
		// Stop animated scroll if the user does something
		$('html,body').bind('scroll mousedown DOMMouseScroll mousewheel keyup', function(e) {
			if ( e.which > 0 || e.type == 'mousedown' || e.type == 'mousewheel' ) {
				$('html,body').stop();
			}
		});
		//$('div#ContentSection').scrollTop(-50)
		console.log($('html,body').scrollTop());
		// Set up content an array of locations
		$('.nav-sidebar').find('a').each(function(){
			contentTop.push( $( $(this).attr('href') ).offset().top );
		})
		// Animate menu scroll to content
		$('.nav-sidebar').find('a').click(function() {
			var sel = this,
			newTop = Math.min( contentTop[ $('.nav-sidebar a').index( $(this) ) ], $(document).height() - $(window).height() ) - 50; // get content top or top position if at the document bottom
			console.log(newTop)
			$('html,body')
				.stop()
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
		})
		$(window).on('hashchange', function() {
			var top = $('html,body').scrollTop() - 50
			console.log($('html,body').scrollTop(top));
		});
	},
	render() {
		return (
			<body>
				<Nav />
				<MainContainer>
					<Sidebar>
						<MenuGroup>
							<MenuItem label="Overview" active={true} />
							<MenuItem label="AreaChart" />
							<MenuItem label="CandlestickChart" />
							<MenuItem label="LineChart" />
							<MenuItem label="LineChart2" />
							<MenuItem label="LineChart3" />
							<MenuItem label="LineChart4" />
						</MenuGroup>
					</Sidebar>
					<ContentSection title="Title goes here">
						<Row anchor="Overview" title="Home">
							<Section>
							</Section>
							<Section>
							</Section>
						</Row>
						<Row title="AreaChart">
							<Section colspan={2}>
							</Section>
						</Row>
						<Row title="CandlestickChart">
							<Section colspan={2}>
							</Section>
						</Row>
						<Row title="LineChart">
							<Section colspan={2}>
							</Section>
						</Row>
						<Row title="LineChart2">
							<Section colspan={2}>
							</Section>
						</Row>
						<Row title="LineChart3">
							<Section colspan={2}>
							</Section>
						</Row>
						<Row title="LineChart4">
							<Section colspan={2}>
							</Section>
						</Row>
					</ContentSection>
				</MainContainer>
			</body>
		);
	}
});
console.log('herer............')
React.render(<ExamplesPage />, document.body);
// React.render(<ExamplesPage />, document.getElementById("area"));

//module.exports = ExamplesPage;
