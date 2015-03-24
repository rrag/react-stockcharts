#### React Stockcharts - Built with [React JS](http://facebook.github.io/react/) and [d3](http://d3js.org/)

The motivation of the React Stockcharts project is to provide flexible library to create charts to represent time series data, easy to learn, ability to customize by means of 

- adding custom chart components
- access the `svg` elements
- styling with CSS

There are many charting libraries available, but I feel there are very few that provide the features and flexibility to create stock charts that compete with the likes of the ones provided by commercial trading systems.

#### SVG vs Canvas
When deciding on a web technology for charts - not just charts, but ones which are interactive too -  representing many many data points, the decision of performance is bound to come up, and HTML5 presents options. React Stockcharts is built on SVG

I am not going to debate between the pros and cons between SVG and Canvas. They are discussed at great length [here](http://stackoverflow.com/questions/12310024/fast-and-responsive-interactive-charts-graphs-svg-canvas-other) and [here](http://stackoverflow.com/questions/5882716/html5-canvas-vs-svg-vs-div). Needless to say they are both very powerful and for charting, there really is no right answer. I have chosen to use SVG for React Stockcharts because,

- you will see very soon the performance is not an issue really, thanks to React JS and the virtual dom
- the flexibility of development and the convinenience of debuging a DOM is hard to beat
- styling with css is something I cannot give up

That said, I do wish to some day create a fork of this on Canvas.

#### DOM Manipulation

The only place where DOM Manipulation is used is in the `XAxis` and `YAxis` components, I will soon migrate to use the native `svg` axes provided by [react-d3](https://github.com/esbullington/react-d3), at which time the entire project will be built with native svg components making server side rendering possible.

Now let us get started with a very simple AreaChart
