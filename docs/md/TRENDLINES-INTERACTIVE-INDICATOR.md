```jsx
<TrendLine id={0} enabled={true} snap={true} snapTo={d => [d.open, d.high, d.low, d.close]} />
```

inside a `Chart` creates an interactive trendline for that `Chart`

other props of interest

`shouldDisableSnap` defaults to `(e) => (e.button === 2 || e.shiftKey)` -- mouse right click **or** holding the shift key while click -- 
to temporarily disable snap (if it is enabled already)

`shouldRemoveLastIndicator` defaults to `(e) => (e.button === 2 && e.ctrlKey)` -- mouse right click **and** holding the ctrl key while click --
to remove the last drawn indicator

These defaults can be changed to your convenience