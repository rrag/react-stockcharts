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

var ExamplesPage = React.createClass({
	render() {
		return (
			<body>
				<Nav />
				<MainContainer>
					<Sidebar>
						<MenuGroup>
							<MenuItem label="Overview" active={true} />
							<MenuItem label="Overview" />
							<MenuItem label="Overview" />
							<MenuItem label="Overview" />
						</MenuGroup>
					</Sidebar>
				</MainContainer>
			</body>
		);
	}
});

module.exports = ExamplesPage;
