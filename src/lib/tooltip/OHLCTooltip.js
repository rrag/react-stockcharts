import React, { Component } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import displayValuesFor from "./displayValuesFor";
import GenericChartComponent from "../GenericChartComponent";

import { isDefined, functor } from "../utils";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

class OHLCTooltip extends Component {
  constructor(props) {
    super(props);
    this.renderSVG = this.renderSVG.bind(this);
  }
  renderSVG(moreProps) {
    const { displayValuesFor } = this.props;
    const {
      xDisplayFormat,
      accessor,
      volumeFormat,
      ohlcFormat,
      percentFormat,
      displayTexts,
      onChange,
      visible,
    } = this.props;

    const {
      chartConfig: { width, height },
    } = moreProps;
    const { displayXAccessor } = moreProps;

    const currentItem = displayValuesFor(this.props, moreProps);

    let displayDate, open, high, low, close, volume, percentChange;
    displayDate = open = high = low = close = volume = percentChange =
      displayTexts.na;

    if (isDefined(currentItem) && isDefined(accessor(currentItem))) {
      const item = accessor(currentItem);

      volume = isDefined(item.volume)
        ? volumeFormat(item.volume)
        : displayTexts.na;

      displayDate = xDisplayFormat(displayXAccessor(item));
      open = ohlcFormat(item.open);
      high = ohlcFormat(item.high);
      low = ohlcFormat(item.low);
      close = ohlcFormat(item.close);
      percentChange = percentFormat((item.close - item.open) / item.open);
      if (onChange) {
        onChange({ displayDate, open, high, low, close, volume, percentChange })
      }
    }

    const { origin: originProp } = this.props;
    const origin = functor(originProp);
    const [x, y] = origin(width, height);

    const itemsToDisplay = {
      displayDate,
      open,
      high,
      low,
      close,
      percentChange,
      volume,
      x,
      y,
    };
    return this.props.children(this.props, moreProps, itemsToDisplay);
  }
  render() {
    return (
      <GenericChartComponent
        clip={false}
        svgDraw={this.renderSVG}
        drawOn={["mousemove"]}
      />
    );
  }
}

OHLCTooltip.propTypes = {
  className: PropTypes.string,
  accessor: PropTypes.func,
  xDisplayFormat: PropTypes.func,
  children: PropTypes.func,
  volumeFormat: PropTypes.func,
  percentFormat: PropTypes.func,
  ohlcFormat: PropTypes.func,
  origin: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  fontFamily: PropTypes.string,
  fontSize: PropTypes.number,
  onClick: PropTypes.func,
  displayValuesFor: PropTypes.func,
  textFill: PropTypes.string,
  labelFill: PropTypes.string,
  displayTexts: PropTypes.object,
  onChange: PropTypes.func,
  visible: PropTypes.bool,
};

const displayTextsDefault = {
  d: "Date: ",
  o: " O: ",
  h: " H: ",
  l: " L: ",
  c: " C: ",
  v: " Vol: ",
  p: " P: ",
  na: "n/a",
};

OHLCTooltip.defaultProps = {
  accessor: (d) => {
    return {
      date: d.date,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume,
    };
  },
  xDisplayFormat: timeFormat("%Y-%m-%d"),
  volumeFormat: format(".4s"),
  percentFormat: format(".2%"),
  ohlcFormat: format(".2f"),
  displayValuesFor: displayValuesFor,
  origin: [0, 0],
  children: defaultDisplay,
  displayTexts: displayTextsDefault,
};

function defaultDisplay(props, moreProps, itemsToDisplay) {
  /* eslint-disable */
  const {
    className,
    textFill,
    labelFill,
    onClick,
    fontFamily,
    fontSize,
    displayTexts,
    visible,
  } = props;
  /* eslint-enable */

  const {
    displayDate,
    open,
    high,
    low,
    close,
    percentChange,
    volume,
    x,
    y,
  } = itemsToDisplay;
  // if (!visible) return null
  return (
    <g>
      <rect width="100%" height="20px" fill="black" transform={`translate(${x}, ${y})`}
      ></rect>
      <g
        className={`react-stockcharts-tooltip-hover ${className}`}
        transform={`translate(${x + 60}, ${y + 8})`}
        onClick={onClick}
        fill="white"
      >
        <ToolTipText
          x={0}
          y={0}
          fontFamily={fontFamily}
          fontSize={fontSize}
        >
          <ToolTipTSpanLabel fill="white"
            key="label" x={0} dy="5">
            {displayTexts.d}
          </ToolTipTSpanLabel>
          <tspan key="value" fill="white"
          >
            {displayDate} |
          </tspan>
          <ToolTipTSpanLabel fill="white"
            key="label_O">
            {displayTexts.o}
          </ToolTipTSpanLabel>
          <tspan key="value_O" fill="white"
          >
            {open} |
          </tspan>
          <ToolTipTSpanLabel fill="white"
            key="label_H">
            {displayTexts.h}
          </ToolTipTSpanLabel>
          <tspan key="value_H" fill="white"
          >
            {high} |
          </tspan>
          <ToolTipTSpanLabel fill="white"
            key="label_L">
            {displayTexts.l}
          </ToolTipTSpanLabel>
          <tspan key="value_L" fill="white"
          >
            {low} |
          </tspan>
          <ToolTipTSpanLabel fill="white"
            key="label_C">
            {displayTexts.c}
          </ToolTipTSpanLabel>
          <tspan key="value_C" fill="white"
          >
            {close} |
          </tspan>
          <ToolTipTSpanLabel fill="white"
            key="label_Vol">
            {displayTexts.v}
          </ToolTipTSpanLabel>
          <tspan key="value_Vol" fill="white"
          >
            {volume} |
          </tspan>
          <ToolTipTSpanLabel fill="white"
            key="label_P">
            {displayTexts.p}
          </ToolTipTSpanLabel>
          <tspan key="value_P" fill="white"
          >
            {percentChange} |
          </tspan>
        </ToolTipText>
      </g>
    </g>
  );
}

export default OHLCTooltip;
