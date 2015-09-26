This section describes how to create a new `XXXIndicator` yourself.

### Prerequisites:

- An indicator is plain old javascript, which follows some conventions, so knowledge of javascript is the only prerequisite

--- 

Now before you begin jumping to write a new indicator yourself, I suggest you look at the [source of a few](https://github.com/rrag/react-stockcharts/tree/master/src/lib/indicator)

The simplest one is `SMAIndicator.js`

an indicator has to follow the below structure

```jsx
import objectAssign from "object-assign";

var defaultOptions = {
    // some
    // default options
};

function MyOwnIndicator(options, chartProps, dataSeriesProps) {
    // options - The options provided in DataSeries
    // chartProps - the props object of the Chart surrounding this element
    // dataSeriesProps - the props object of the DataSeries where this indicator is used

    var prefix = `chart_${ chartProps.id }`;
    var key = `overlay_${ dataSeriesProps.id }`;
    var settings = objectAssign({}, defaultOptions, options);

    function indicator() {
    }

    indicator.options = function() {
        return settings;
    };

    indicator.calculate = function(data) {
        // calculate the new values for the data provided
        // use prefix & key above to create any new fields under
        //      data[i][prefix][key] = ...;
        // This is so indicators do not override each other and it is easy to troubleshoot the source of the problem

        return modifiedData;
    };
    indicator.yAccessor = function() {
        // returns a function which is the yAccessor, below is an example
        return (d) => {
            if (d && d[prefix]) return d[prefix][key];
        };
    };
    indicator.stroke = function() {
        // optional method to return the stroke color
        return stroke;
    };
    indicator.domain = function() {
        // optional method if you want to over ride the domain which react-stockcharts calculates, used in RSI
        return [0, 100];
    };
    indicator.yTicks = function() {
        // optinoal method if you want only certain values to be displayed as yTicks, used inRSI
        return [settings.overSold, 50, settings.overBought];
    };
    indicator.foo = function() {
        // if you need add your own functions here
    };
    indicator.bar = function() {
        // if you need add your own functions here
    };
    indicator.isMyOwnIndicator = function() {
        // it is also advisable to create this function returning true
        //      this can be used by your custom Tooltip to format the values appropriately
        return true;
    };
    return indicator;
}

export default MyOwnIndicator;
```