"use strict";

import Renko from "./Renko";
import updatingDataWrapper from "./updatingDataWrapper";

var RenkoWithUpdatingData = updatingDataWrapper(Renko)

export default RenkoWithUpdatingData;
