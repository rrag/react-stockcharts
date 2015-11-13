```jsx
<FibonacciRetracement id={0} enabled={true} />
```

inside a `Chart` creates an interactive Fibonacci retracement for that `Chart`

other props of interest

`shouldRemoveLastIndicator` defaults to `(e) => (e.button === 2 && e.ctrlKey)` -- mouse right click **and** holding the ctrl key while click -- to remove the last drawn indicator

