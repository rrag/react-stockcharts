The library has lacked intraday financetimescale support, and thanks to @brobits we now have one.

We now have 2 custom scales `financeEODDiscontinuousScale` and `financeIntradayDiscontinuousScale`

I was in favor of having 2 scales initially, but as I started to create some examples, my view has changed. I prefer a single scale for handling discontinuous input.

I have mentioned this in some other issues, and this issue is a good place to reiterate it.  Do not use custom scales unless you really have to. Make sure that a `d3.time.scale()` will not satisfy your need.

Here is a list of reasons you would want to use a discontinuous scale

1. you are working with discontinuous data, like the equity market, which is closed on weekend and on weekdays is only open during certain hours depending on the exchange
2. want to automatically jump to the next interval when you zoom out. like [here](http://rrag.github.io/react-stockcharts-next/documentation.html#/lots_of_data) as you zoom out the interval changes from 1d to 1w to 1m

### is there no other discontinuous scale available?
There are 2 that I know of
- [d3fc](https://github.com/ScottLogic/d3fc) - [example](https://d3fc.io/components/scale/dateTime.html)
- [techan.js](https://github.com/andredumas/techan.js) - [example](http://bl.ocks.org/andredumas/17be8c0973ac92acd6e5)


d3fc is really simple, I like the fact that you can specify a discontinuity, and it uses d3.time.scale() behind the scenes and just removes a tick if it appears on the discontinuity. Unfortunately this happens.

![image](https://cloud.githubusercontent.com/assets/10691183/15101795/d27524d0-155c-11e6-9f55-041372bcd4b6.png)

techan.js - I did not see this when I started 


I like both for different reasons, but neither of them satisfy what I need.
