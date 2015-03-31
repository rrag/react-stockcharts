`EdgeIndicator`s are inside the `EdgeContainer` and can be of type `first` or `last`, can be located `left` or `right` and orient `left` or `right`. Below you see edges `first` and `last` for all the overlays and also for the `volume` histogram.

The edge values are updated on zoom and pan too

```html
<EdgeContainer>
	<EdgeIndicator className="horizontal" itemType="last" orient="right"
		edgeAt="right" forChart={1} forOverlay={0} />
	<EdgeIndicator className="horizontal" itemType="last" orient="right"
		edgeAt="right" forChart={1} forOverlay={1} />
	<EdgeIndicator className="horizontal" itemType="last" orient="right"
		edgeAt="right" forChart={1} forOverlay={2} />
	<EdgeIndicator className="horizontal" itemType="first" orient="left"
		edgeAt="left" forChart={1} forOverlay={0} />
	<EdgeIndicator className="horizontal" itemType="first" orient="left"
		edgeAt="left" forChart={1} forOverlay={1} />
	<EdgeIndicator className="horizontal" itemType="first" orient="left"
		edgeAt="left" forChart={1} forOverlay={2} />
	<EdgeIndicator className="horizontal" itemType="first" orient="left"
		edgeAt="left" forChart={2} forOverlay={3} displayFormat={d3.format(".4s")} />
	<EdgeIndicator className="horizontal" itemType="last" orient="right"
		edgeAt="right" forChart={2} forOverlay={3} displayFormat={d3.format(".4s")} />
	<EdgeIndicator className="horizontal" itemType="first" orient="left"
		edgeAt="left" forChart={2} displayFormat={d3.format(".4s")} />
	<EdgeIndicator className="horizontal" itemType="last" orient="right"
		edgeAt="right" forChart={2} displayFormat={d3.format(".4s")} />
</EdgeContainer>
```