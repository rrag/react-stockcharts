
import CandleStickChartWithMACDIndicator from "./CandleStickChartWithMACDIndicator";
import updatingDataWrapper from "./updatingDataWrapper";

const CandleStickChartWithUpdatingData = updatingDataWrapper(CandleStickChartWithMACDIndicator);

export default CandleStickChartWithUpdatingData;
