This section describes how to create a new `XXXSeries` yourself.

### Prerequisites:

- good understanding of svg and different shapes
- good understanding of HTML5 canvas api
- Knowledge of d3 scales - the [linear scale](https://github.com/mbostock/d3/wiki/Quantitative-Scales#linear) is used heavily


### Some terminology

#### xAccessor / yAccessor
given a datapoint, `xAccessor(dataPoint)` returns the xValue

#### xScale / yScale
given a xValue `xScale(xValue)` converts that value to a pixel location on the x scale. A scale converts a domain of say `1/1/2010` to `1/1/2015` to a range of say 0 - 500 px. So `xScale(new Date(2010, 1, 1))` would return `0` and any date greater that that would return a value above 0 and a date before 1/1/2010 would result in a -ve number on the scale.

#### plotData
This is an array of data points which have to be drawn on the chart.

#### ctx
This is the HTML5 canvas context, you will have to have a decent understanding of how to use it, teaching that is beyond the scope of this section.

#### indicator
For derived Series like say the MACD or RSI, the indicator passed to the `DataSeries` is available from `props`

#### compareSeries
TODO - Write more on how to use `compareSeries`

---
Now before you begin jumping to write a new series yourself, I suggest you look at the [source of a few Series](https://github.com/rrag/react-stockcharts/tree/master/src/lib/series)

- `Area.jsx`
- `Line.jsx`
- `StraightLine.jsx`

are not series themselves but are building blocks which are used in other Series. See [StochasticSeries.jsx](https://github.com/rrag/react-stockcharts/tree/master/src/lib/series/StochasticSeries.jsx), [RSISeries.jsx](https://github.com/rrag/react-stockcharts/tree/master/src/lib/series/RSISeries.jsx) for some examples of how these building blocks are used to create a more complex Series.

If you build a new Series with just these building blocks, you do not need to handle the drawing of the chart on svg or canvas as these building blocks handle it. But if you are creating a series without these or adding some custom features, the following rules apply

It is necessary that all Series be Pure, meaning, they have no state and given the same set of `props` as input the same output is provided on both canvas and svg depending on what is configured.

~~Since we depend on React 0.14 for the library, we might as well use the [Components as Functions](https://medium.com/@joshblack/stateless-components-in-react-0-14-f9798f8b992d).~~

some boilerplate code below

```jsx
import React from "react";
import ReStock from "react-stockcharts";

import { wrap } from ReStock.series;

class MyNewSeries extends React.Component {
    render() {
        var { props } = this;

        // The following are available from props

        // plotData is an array containing the points to be displayed on the screen. This is not the same as the data
        //      you provided as input. It is most likely smaller in size since it contains a filtered list of items 
        //      which are to be displayed for the domain of xScale

        // The x & y Accessor are used to get the x & y value for each element in the plotData

        // The x & y Scale can be used to get the value in pixels for a x, y value

        var { xAccessor, yAccessor, xScale, yScale, plotData } = props;


        // In the event there is a CompareSeries in that Chart this is available
        // TODO explain more about compare series and why it is special

        var { compareSeries } = props;

        // indicator is available if you have used one on the DataSeries surrounding this Series
        // Read more on how to write an indicator in the "Custom - Create indicator" section

        var { indicator } = props;

        // this is available if there is a stroke / fill defined in the DataSeries surrounding this Series
        //      or the stroke / fill defined in the indicator above

        var { stroke, fill } = props;

        // type is the value you have provided at the ChartCanvas, it can be "svg" or "hybrid"
        // height and width of this Chart

        var { type, height, width } = props;

        // In addition to the above, any props you define when using this component are also available.
        // If say you create a prop called xAccessor, this will override the xAccessor provided by react-stockcharts

        ...
        return svg; /* return an svg element */
    }
}

MyNewSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
    // This is an optional method
    // having this static method on your component will make
    // this method to be called on pan action

    // If you are creating a series based on only the building blocks listed above this method is not needed

    ...
    // var { xAccessor, yAccessor } = props;

    // ctx.beginPath();
    // ctx.strokeStyle = "red";
    // ctx.lineWidth = 3;
    // var first = plotData[0];
    // var last = plotData[plotData.length - 1];
    // ctx.moveTo(xScale(xAccessor(first)), yScale(yAccessor(first)));
    // ctx.lineTo(xScale(xAccessor(last)), yScale(yAccessor(last)));
    // ctx.stroke();
};

// This is very important. You need to wrap your series, so ReStock knows to provide these props
export default wrap(MyNewSeries);
```