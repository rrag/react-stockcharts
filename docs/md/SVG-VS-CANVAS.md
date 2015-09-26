The decision between choosing `svg` or `canvas` for a charting library is well discussed and there are no clear winners.

I have described this before and using `svg` is very convenient from a developer standpoint. Easy to debug, even easier to style. Using css to style a chart is just cool.

However there comes a point where performance & memory become a bottleneck, especially in tablets/mobile (well in desktops too).

Pan actions become lag behind and not so responsive. and when looking at a lot of data points like the chart below, there are approx 250 DOM elements. and on pan action all these are updated to different `x`, `y`, `height` & `width`. The time taken to calculate the new values on pan is negligible (<10 ms) but when rendering them, you can see for yourself.

Here is where `canvas` shines. Given this dilema react-stockcharts provides 2 options. 

- svg only
- svg and canvas

Except the tooltip everything else, including the crosshair, axes, the chart series are all drawn on canvas. The tooltip I am retaining it in `svg` because of the ability to attach mouse hover and click event to the `svg` DOM. If there are better suggestions to use `canvas` for tooltip and also support click events and mouse hover state please share them.

Below you can see the improvements in responsiveness to pan actions when using the svg + canvas option