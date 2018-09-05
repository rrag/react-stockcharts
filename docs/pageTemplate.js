function getExternalAssets(mode) {
	switch (mode) {
	case "dev":
	case "watch": {
		return `<script src="react/umd/react.development.js"></script>
		<script src="react-dom/umd/react-dom.development.js"></script>

		<link href="bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
		<link href="prismjs/themes/prism.css" rel="stylesheet">`;
	}
	default:
		return `<script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.1.1/umd/react.production.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.1.1/umd/react-dom.production.min.js"></script>

		<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
		<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/0.0.1/prism.css" rel="stylesheet">
		<script>
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-61247721-1', 'auto');
			ga('send', 'pageview');
		</script>`;
	}
}

function getDevServerJs(mode) {
	if (mode === "watch") {
		return '<script type="text/javascript" src="/webpack-dev-server.js"></script>';
	}
	return "";
}

function getIndexContent() {
	return `<!-- Main jumbotron for a primary marketing message or call to action -->
		<div class="jumbotron">
			<div class="container" id="README.md">
				<div class="row">
					<div class="col-md-8" id="content">
					</div>
					<div class="col-md-4">
						<div class="pull-right top-spacing">
							<a href="https://github.com/rrag/react-stockcharts" class="btn btn-lg button"><small>View project on</small><br/> GitHub</a>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="container light">
			<!-- Example row of columns -->
			<div class="row">
				<div class="col-md-12">
					<a class="btn btn-primary" href="documentation.html" role="button">Documentation</a>
					<h3>Click on the chart, zoom with scroll, pan with drag</h3>
					<div id="chart" class="react-stockchart"></div>
				</div>
			</div>
			<hr>
			<footer>
				<p>MIT license</p>
			</footer>
		</div> <!-- /container -->`;
}

function getDocumentationContent() {
	return `<span id="debug_here">.</span>
		<span id="iconPreload" class="glyphicon glyphicon-arrow-down"></span>
		<div id="chart-goes-here"></div>`;
}

module.exports = function(params) {
	const { mode, page } = params.htmlWebpackPlugin.options;

	const { chunks } = params.htmlWebpackPlugin.files;

	return `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<meta name="description" content="Highly customizable stock charts">
		<meta name="author" content="rrag">
		<!--
			http://www.favicon.cc/?action=icon&file_id=174180 
			License: Creative Commons, no attribution 
		-->
		<link href="data:image/x-icon;base64,AAABAAEAEBAAAAAAAABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAAAAAAACAAIAACQAAAoODgAEAAQAAiQCAAwWCgAEJAQADggIAAQSHgAODhAAAA4AAAwIBAAmJCgAABQIACQkJAAmJCYAKCQoAAAcAAAEHAQABhwGAAgcCAAmJCQAACoAAAQGBAAGBgYAFgIAAAAMCAAKKgoABAYCAAA4AAAEFAQAAjgCAAQ4BAAAAhoAHAICABQUFAAAIgAACgwMAAwGBAAEDAQADg4AAA4GBgAGDAYADDAMACQiJAAmIiYAABoAAAoMCAAAPgAABBoEAAg+CAAABAAAAgQCAAAoAAAACggACigKAAwoDAAEBAIAABIAAAA2AAAKKAgAAAAaAAYgCAAaAAAAAA4cAAogDAASEhIABgoKACgoKAAAIAAAChIIAAQgBAAAAggAAgIKABISEAAENgAAAiAAAAAuAAAMBAQABAoEAAAQCAAKCgoAABgAAAoKCAACGAIAADwAAAIGHAAAAgAAAgICAAAmAAAEAgQAAiYCAAoKAgAANAAAChAKACYmJgAGCAoAAB4AAAAACAAADBoAAgAKAAYICAAoJiYACAgKAAgQBAAMAgQAAiwCAAgICAAADggACggKAAA6AgAMAgIABAgCAAIWAgAMEAQAAjoCAAgWCAAMCAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQ0VgYGBgYGBgYGBgYGBFQ0UkbGxsbGxsbGxsbGwZJEUPREREREREaGFEREREZgNFZyNAQEBAQCkaQEBAQEAjFmAqT09PaidMXXNqDHNwCGAPJlJSUlJCbz8cbl84aApFYDUAAFgAPE5eJQA7HjRZDy5IclpiU2tIIV4BLzw2FBAuBTN0AjF1XzkgFVxGXiwRLgdWYgtGNAAAYhc2U1pVLS4TBRgEE1BbWzIfMihiK2AuTWlUVDBUVFQwRz12EgZFDQkiPj4+Ij4+Pj5kPkFXEGBlY2NJNw5RGxttY2NjSmBFSzo6OnEdcXFxcTo6OktFQ0VgYGBgYBAQEBBgYGBFQwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" rel="icon" type="image/x-icon" />
		<title>React Stockcharts - Home</title>
		${getExternalAssets(mode)}
		<script src="dist/modernizr.js"></script>

		${page === "index" ? `<style type="text/css">
			.dark {
				background: #303030;
			}
			.light {
				color: #FFFFFF;
			}
		</style>` : ""}
	</head>
	<body class="${page === "index" ? "dark" : ""}">

		${page === "index" ? getIndexContent() : getDocumentationContent()}

		<!-- Placed at the end of the document so the pages load faster -->
		${page === "index"
			? `<script type="text/javascript" src="${chunks["react-stockcharts-home"].entry}"></script>`
			: `<script type="text/javascript" src="${chunks["react-stockcharts-documentation"].entry}"></script>`}

		${getDevServerJs(mode)}
	</body>
</html>`;

};