#### React Stockcharts - Built with [React JS](http://facebook.github.io/react/) and [d3](http://d3js.org/)

React Stockcharts project provides a flexible library to create charts that represent time series data. It is easy to learn and can be customized by 

- adding custom chart components
- access the `svg` elements
- styling with CSS

There are many charting libraries available, but I feel there are very few that provide the features and flexibility to create stock charts that compete with the likes of the ones provided by commercial trading systems.

#### SVG vs Canvas
When deciding on a web technology for charts - not just charts, but ones which are interactive too -  representing many many data points, the decision of performance is bound to come up, and HTML5 presents options.

I am not going to debate between the pros and cons between SVG and Canvas. They are discussed at great length [here](http://stackoverflow.com/questions/12310024/fast-and-responsive-interactive-charts-graphs-svg-canvas-other) and [here](http://stackoverflow.com/questions/5882716/html5-canvas-vs-svg-vs-div). Needless to say they are both very powerful and for charting, there really is no right answer. With React Stockcharts you have the option to go with complete SVG or a hybrid approach of canvas + SVG. in the hybrid approach SVG is used to draw the axes, mouse pointer and edge coordinates, while the actual chart is drawn using canvas.

The SVG approach is best for server side rendering, while for browser side I recommend using the hybrid mode for improved responsiveness to pan actions.

#### DOM Manipulation

All SVG components use ReactJS, to create the svg elements, there is no DOM manipulation. For dealing with Canvas, since canvas is a DOM object, it has to be done via a `componentDidMount` / `componentDidUpdate`

Now let us get started with a very simple AreaChart
