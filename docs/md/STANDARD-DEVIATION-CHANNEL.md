> Standard Deviation Channel is built on base of Linear Regression Trend representing a usual trendline built between two points on the price chart using the method of least squares. As a result, this line proves to be the exact median line of the changing price. It can be considered as an equilibrium price line, and any deflection up or down indicates the superactivity of buyers or sellers respectively.

from https://www.metatrader5.com/en/terminal/help/objects/channels/stddev_channel

And the formula for linear regression is from http://www.metastock.com/Customer/Resources/TAAZ/?p=65

- create a channel - click, mousemove, click
- Once a channel is drawn it gets out of draw mode automatically. To get back into draw mode again - Press D
- Get out of draw mode - Press ESC
- Delete the last drawn channel - Press DEL
- When not in draw mode
	- move mouse over to hover state
	- click the middle line to select
	- move the edge circles
	- Click outside to unselect

[source](https://github.com/rrag/react-stockcharts/blob/master/docs/lib/charts/CandleStickChartWithStandardDeviationChannel.js), [codesandbox](https://codesandbox.io/s/github/rrag/react-stockcharts-examples2/tree/master/examples/CandleStickChartWithStandardDeviationChannel)

