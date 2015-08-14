The decision between choosing `svg` or `canvas` for a charting library is well discussed and there are no clear winners.

I have described this before and using `svg` is very convinient from a developer standpoint. Easy to debug, even easier to style. Using css to style a chart is just too cool.

However there comes a point where performance & memory become a bottleneck, especially in tablets/mobile (well in desktops too).

Pan actions become laggy and not so responsive. and when looking at a lot of data points like the chart below, there are approx 250 DOM elements. and on pan action all these are updated to different `x`, `y`, `height` & `width`. The time taken to calculate of these values is negligible (<10 ms) but when rendering them it is as you can see for yourself.

Here is where `canvas` shines. Given this dilema react-stockcharts provides 2 options. 

- svg only
- svg and canvas

It is not pure `canvas` for the second option because there is no performance penality for using svg for certain components. react-stockcharts uses canvas for the places where performance is important.

While the chart themselves are drawn in canvas, the axes & ticks, the tool tip, the mousepointer cross hair, edge coordinates are all SVG.

Below you can see the improvements in responsiveness to pan actions when using the svg + canvas option