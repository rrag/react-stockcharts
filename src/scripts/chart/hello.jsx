'use strict';
var React = require('react');

module.exports = React.createClass({

	displayName: 'HelloReact',

	getInitialState() {
		return {
			inputText: ''
		};
	},
	handleChange(e) {
		this.setState({ inputText: e.currentTarget.value });
	},
	componentDidMount() {
		this.refs.world.getDOMNode().value = '';
	},
	componentDidUpdate() {
	},
	render() {
		var response = (<div>
							<pre>
								<code>
									ddIf you are in watch mode
								</code>
							</pre>
							<pre>
								<code>
									Type something on the text box below
								</code>
							</pre>
							<pre>
								<code>
									open up src/scripts/subfolder/hello.jsx
									and modify the render() function and see the hot reload in action
								</code>
							</pre>
							<pre>
								<code>
									notice how the state is retained !!!
								</code>
							</pre>
							<input type='text' onChange={this.handleChange} ref='world' />
							<ul>
								<li>Hello World</li>
								<li>{'Hello ' + this.state.inputText}</li>
							</ul>
						</div>);
		return response;
	}
});
