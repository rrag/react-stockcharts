The only change is enabling `zoom` and `pan`

checkout the [source](https://gist.github.com/rrag/a8465abe0061df1b7976), [block](http://bl.ocks.org/rrag/a8465abe0061df1b7976), [plunker](http://plnkr.co/edit/gist:a8465abe0061df1b7976?p=preview) of this example

```html
<EventCapture mouseMove={true} zoom={true} pan={true} mainChart={1} defaultFocus={false} />
```
other than enabling `zoom` and `pan`, `defaultFocus` of `true` means mouse scroll over the chart, triggers zoom action if zoom is enabled. If `defaultFocus` is `false`, you have to click on the chart to get focus and then all scroll events are zoom events if `zoom` is enabled

You could set the focus programatically by adding a ref to the `EventCapture`

```html
<EventCapture ref="eventCapture" mouseMove={true} zoom={true} pan={true} mainChart={1} defaultFocus={false} />
```

```js
this.refs.eventCapture.toggleFocus(); // to toggle focus so scroll events over the chart will either simulate zoom or perform the default action

this.refs.eventCapture.setFocus(false); // set the focus 
```