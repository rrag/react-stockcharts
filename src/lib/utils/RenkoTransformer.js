'use strict';

var excludeList = ['transformType', 'options', 'children', 'namespace', '_multiInterval'];
var pricingMethod = function (d) { return { high: d.high, low: d.low }; };
// var pricingMethod = function (d) { return { high: d.close, low: d.close }; };
// var usePrice = function (d) { return d.close; };
var defaultBoxSize = 0.5;
var defaultReversal = 3;
var calculateATR = require('./ATRCalculator');

function RenkoTransformer(rawData, options, props) {
	if (options === undefined) options = {};

	var period = options.period || 14;

	calculateATR(rawData.D, period);
	var brickSize = function (d) { return d["atr" + period]}

	var dateAccesor = options.dateAccesor || props._dateAccessor;
	var dateMutator = options.dateMutator || props._dateMutator;
	var indexAccessor = options.indexAccessor || props._indexAccessor;
	var indexMutator = options.indexMutator || props._indexMutator;
	var boxSize = options.boxSize || defaultBoxSize;
	var reversal = options.reversal || defaultReversal;

	var renkoData = new Array();

	var index = 0, prevBrickClose = rawData.D[index].open, prevBrickOpen = rawData.D[index].open;
	var brick = {}, direction = 0;


	rawData.D.forEach( function (d) {
		if (brick.from === undefined) {
			// brick.index = index++;
			// brick.date = d.date;
			// brick.displayDate = d.displayDate;
			// brick.fromDate = d.displayDate;
			// brick.from = d.index;
			brick.high = d.high;
			brick.low = d.low;
			brick.startOfYear = d.startOfYear;
			brick.startOfQuarter = d.startOfQuarter;
			brick.startOfMonth = d.startOfMonth;
			brick.startOfWeek = d.startOfWeek;
			//brick.tempClose = d.close;
			brick.from = indexAccessor(d);
			brick.fromDate = dateAccesor(d);
			indexMutator(brick, index++);
			dateMutator(brick, dateAccesor(d));
		}
		brick.volume = (brick.volume || 0) + d.volume;

		var prevCloseToHigh = (prevBrickClose - pricingMethod(d).high),
			prevCloseToLow = (prevBrickClose - pricingMethod(d).low),
			prevOpenToHigh = (prevBrickOpen - pricingMethod(d).high),
			prevOpenToLow = (prevBrickOpen - pricingMethod(d).low),
			priceMovement = Math.min(
				Math.abs(prevCloseToHigh),
				Math.abs(prevCloseToLow),
				Math.abs(prevOpenToHigh),
				Math.abs(prevOpenToLow));


		brick.high = Math.max(brick.high, d.high);
		brick.low = Math.min(brick.low, d.low);

		if (!brick.startOfYear) {
			brick.startOfYear = d.startOfYear;
			if (brick.startOfYear) {
				dateMutator(brick, dateAccesor(d));
				// brick.displayDate = d.displayDate;
			}
		}

		if (!brick.startOfQuarter) {
			brick.startOfQuarter = d.startOfQuarter;
			if (brick.startOfQuarter && !brick.startOfYear) {
				dateMutator(brick, dateAccesor(d));
				// brick.displayDate = d.displayDate;
			}
		}

		if (!brick.startOfMonth) {
			brick.startOfMonth = d.startOfMonth;
			if (brick.startOfMonth && !brick.startOfQuarter) {
				dateMutator(brick, dateAccesor(d));
				// brick.displayDate = d.displayDate;
			}
		}
		if (!brick.startOfWeek) {
			brick.startOfWeek = d.startOfWeek;
			if (brick.startOfWeek && !brick.startOfMonth) {
				dateMutator(brick, dateAccesor(d));
				// brick.displayDate = d.displayDate;
			}
		}

		//d.brick = JSON.stringify(brick);
		if (brickSize(d)) {
			var noOfBricks = Math.floor(priceMovement / brickSize(d))

			brick.open = (Math.abs(prevCloseToHigh) < Math.abs(prevOpenToHigh)
			 || Math.abs(prevCloseToLow) < Math.abs(prevOpenToLow))
							? prevBrickClose
							: prevBrickOpen;

			if (noOfBricks >= 1) {
				for (var j = 0; j < noOfBricks; j++) {
					brick.close = (brick.open < pricingMethod(d).high)
									// if brick open is less than current price it means it is green/hollow brick
										? brick.open + brickSize(d)
										: brick.open - brickSize(d);
					direction = brick.close > brick.open ? 1 : -1;
					brick.direction = direction;
					brick.to = indexAccessor(d);
					brick.toDate = dateAccesor(d);
					// brick.diff = brick.open - brick.close;
					// brick.atr = d.atr;
					brick.fullyFormed = true;
					renkoData.push(brick);

					prevBrickClose = brick.close;
					prevBrickOpen = brick.open;

					var newBrick = {
						// index : index + j
						// , date : d.date
						// , displayDate : d.displayDate
						//, from : d.index
						high : brick.high
						, low : brick.low
						, open : brick.close
						// , fromDate : d.displayDate
						, startOfYear : false
						, startOfMonth : false
						, startOfQuarter : false
						, startOfWeek : false
					};
					brick = newBrick;
					brick.from = indexAccessor(d);
					brick.fromDate = dateAccesor(d);
					indexMutator(brick, index + j);
					dateMutator(brick, dateAccesor(d));
					brick.volume = (brick.volume || 0) + d.volume;
				}
				index = index + j - 1;
				brick = {};
			} else {
				if (indexAccessor(d) === rawData.D.length - 1) {
					brick.close = direction > 0 ? pricingMethod(d).high : pricingMethod(d).low;
					brick.to = indexAccessor(d);
					brick.toDate = dateAccesor(d);
					dateMutator(brick, dateAccesor(d));

					brick.fullyFormed = false;
					renkoData.push(brick);
				}
			}
		}

	});

	// console.table(renkoData);
	// console.table(data);
	var response = {};
	Object.keys(props)
		.filter((key) => excludeList.indexOf(key) < 0)
		.forEach((key) => response[key] = props[key]);

	response.data = {'D': renkoData};

	return response;
}

module.exports = RenkoTransformer;
