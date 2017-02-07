## v0.7

1. [Envelope](http://www.investopedia.com/terms/e/envelope.asp?optm=sa_v2)
1. [ATR Trailing stop](http://www.incrediblecharts.com/indicators/atr_average_true_range_trailing_stops.php)
1. [Chandelier Exit](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:chandelier_exit)
1. [Parabolic SAR](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:parabolic_sar)
	- With mouse hover highlight
	- right click context menu
	- double click listener
1. Explore refactoring of interactive indicators to use canvas (again)

#### New Interactive components

Do not store any state in the interactive components other than hover & selected
Use onComplete/onDragComplete callback to pass the [] back to owner component
Experiment with a single component and use isHover on that for the entire component
`prevMouseXY` -> move this to ChartCanvas
change the interactive components to axis canvas after drawing
when mouse hover (over 20ms) happens move it to interactive canvas
on blur move it back to axis canvas
when selected keep it on interactive canvas
on unselect move to axis canvas

https://www.metatrader5.com/en/terminal/help/objects

1. Parallel trend lines
1. Fib Circles
1. Fib Arc
1. Fib Fan
1. Show hover tooltip next to interactive components on mouse hover
1. Continious line
1. Andrews Pitch fork
1. Gann square
1. Arbitrary Shapes
	- Rectangle
	- Text
	- Circle
	- Ellipse
	- Arrow

#### New Chart types
1. Line break
1. Better Renko/Mean Renko (Tentative)


## v0.8

Guess this can be `v1.0.0`

1. Explore removal of svg mode & all svg components completely, so this becomes a canvas only library (Tentative)
1. Detailed documentation of each component and its props
1. Explore splitting project into multiple modules, one for each type of indicator, chart type
1. add LineSeries interpolation
1. add AreaSeries gradiant

## Sometime in the future....


#### Features
1. Volume Profile (Tentative)
	- show/hide Point of control
	- show/hide value area
1. Automatic Support & Resistance trendlines (Tentative)
1. Add a playground to see live updates (Tentative)

#### New Indicators (in no particular order or priority)
1. [ADX](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:average_directional_index_adx)
1. [Aroon](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:aroon)
1. [Williams %R](http://stockcharts.com/school/doku.php?id=chart_school%3Atechnical_indicators%3Awilliams_r)
1. [Volume Weighted Average Price ](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:vwap_intraday)
1. [Momentum](http://www.incrediblecharts.com/indicators/momentum.php)
1. [Money flow](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:money_flow_index_mfi)
1. [Ichimoku Clouds](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:ichimoku_cloud)
1. [ZigZag](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:zigzag)

[and more....](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators)


[DONE]: ../images/check-mark.png "Done"
