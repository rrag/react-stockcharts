The real test in performance is showing a chart with a lot of data points and more than a few indicators.  As an example, let us work with MSFT from 1986-03-13 till 2015-06-05

That is more than 7000 one day periods, how can all that fit into one screen? Although technically it can be done there are a few problems

1. Every time you zoom/pan a chart with that many data points it just does not work. Browsers do not have the power to recalculate the scales for the new domain and appear responsive.
1. Even with cross hair and tool tip you could see the lag

Fortunately seeing end of day data over 30 years on a single chart is not really useful. React stockcharts has sane defaults to show 2 data point per pixel width. 

Let us see all this in action for MSFT 1986-03-13 till 2015-03-26