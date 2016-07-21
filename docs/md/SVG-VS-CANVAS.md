#### SVG vs Canvas
When deciding on a web technology for charts - not just any charts, the ones which are highly responsive to interactions -  representing many many data points, the decision of performance is bound to come up, and HTML5 presents options.

I am not going to debate between the pros and cons between SVG and Canvas. They are discussed at great length [here](http://stackoverflow.com/questions/12310024/fast-and-responsive-interactive-charts-graphs-svg-canvas-other) and [here](http://stackoverflow.com/questions/5882716/html5-canvas-vs-svg-vs-div). Needless to say they are both very powerful and for charting, there really is no right answer.

Using `svg` is very convenient from a developer standpoint. Easy to debug, even easier to style. Using css to style a chart is just too cool to pass. However there comes a point where performance & memory become a bottleneck, especially in tablets/mobile (well in desktops too). Pan actions lag behind and not so responsive. and when looking at a lot of data points like the chart below, there are approx 300 DOM elements. and on pan action all these are updated to different `x`, `y`, `height` & `width`. The time taken to calculate the new values on pan is negligible (<10 ms) but when rendering them, you can see for yourself.

Here is where `canvas` shines. Given this dilemma react-stockcharts provides 2 options. 

- svg only
- svg and canvas

Except the tooltip everything else, including the crosshair, axes, the chart series are all drawn on canvas. The tooltip I am retaining it in `svg` because of the ability to attach mouse hover and click event to the `svg` DOM. If there are better suggestions to use `canvas` for tooltip and also support click events and mouse hover state please share them.

The SVG approach is best for server side rendering, while for browser side I recommend using the hybrid mode for improved responsiveness to pan actions.

#### DOM Manipulation

All SVG components use ReactJS, to create the svg elements, there is no DOM manipulation. For dealing with Canvas, since canvas is a DOM object, it has to be done via a `componentDidMount` / `componentDidUpdate`

---
Below you can see the improvements in responsiveness to pan actions when using the svg + canvas option
