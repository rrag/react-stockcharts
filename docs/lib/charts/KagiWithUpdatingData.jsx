"use strict";

import Kagi from "./Kagi";
import updatingDataWrapper from "./updatingDataWrapper";

var KagiWithUpdatingData = updatingDataWrapper(Kagi)

export default KagiWithUpdatingData;
