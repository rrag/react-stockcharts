'use strict';

var excludeList = ['transformType', 'options', 'children', 'namespace', '_multiInterval'];
var pricingMethod = function (d) { return { high: d.high, low: d.low }; };
var usePrice = function (d) { return { high: d.high, low: d.low }; };
var defaultBoxSize = 0.5;
var defaultReversal = 3;

function createBox(d, dateAccesor, dateMutator) {
	var box = {
		open: d.open
		, fromDate: dateAccesor(d)
		, toDate: dateAccesor(d)
		//, displayDate: d.displayDate
		, startOfYear: d.startOfYear
		, startOfQuarter: d.startOfQuarter
		, startOfMonth: d.startOfMonth
		, startOfWeek: d.startOfWeek
	};
	dateMutator(box, dateAccesor(d));
	return box;
}

function updateColumns(columnData, dateAccesor, dateMutator) {

	columnData.forEach(function (d, i) {
		var lastBox = d.boxes[d.boxes.length - 1];

		d.startOfYear = false;
		d.startOfQuarter = false;
		d.startOfMonth = false;
		d.startOfWeek = false;

		d.boxes.forEach(function(eachBox) {
			if (d.open === undefined) d.open = eachBox.open;
			d.close = eachBox.close;
			d.high = Math.max(d.open, d.close);
			d.low = Math.min(d.open, d.close);

			if (d.fromDate === undefined) d.fromDate = eachBox.fromDate;
			if (d.date === undefined) d.date = eachBox.date;
			// if (d.displayDate === undefined) d.displayDate = eachBox.displayDate;
			d.toDate = eachBox.toDate;

			if (d.startOfYear !== true && eachBox.startOfYear) {
				d.startOfYear = eachBox.startOfYear;
				d.startOfQuarter = eachBox.startOfQuarter;
				d.startOfMonth = eachBox.startOfMonth;
				d.startOfWeek = eachBox.startOfWeek;
				//d.displayDate = eachBox.displayDate;
				dateMutator(d, dateAccesor(eachBox));
			}
			if (d.startOfQuarter !== true && eachBox.startOfQuarter) {
				d.startOfQuarter = eachBox.startOfQuarter;
				d.startOfMonth = eachBox.startOfMonth;
				d.startOfWeek = eachBox.startOfWeek;
				// d.displayDate = eachBox.displayDate;
				dateMutator(d, dateAccesor(eachBox));
			}
			if (d.startOfMonth !== true && eachBox.startOfMonth) {
				d.startOfMonth = eachBox.startOfMonth;
				d.startOfWeek = eachBox.startOfWeek;
				// d.displayDate = eachBox.displayDate;
				dateMutator(d, dateAccesor(eachBox));
			}
			if (d.startOfWeek !== true && eachBox.startOfWeek) {
				d.startOfWeek = eachBox.startOfWeek;
				// d.displayDate = eachBox.displayDate;
				dateMutator(d, dateAccesor(eachBox));
			}
		});

	});

	// console.table(columnData);
	// console.table(rawData);
	return columnData;
};
/**/

function PointAndFigureTransformer(rawData, options, props) {
	if (options === undefined) options = {};


	var dateAccesor = options.dateAccesor || props._dateAccessor;
	var dateMutator = options.dateMutator || props._dateMutator;
	var indexAccessor = options.indexAccessor || props._indexAccessor;
	var indexMutator = options.indexMutator || props._indexMutator;
	var boxSize = options.boxSize || defaultBoxSize;
	var reversal = options.reversal || defaultReversal;


	var columnData = new Array();

	var index = 0, direction;
	var column = {
		boxes: [],
		open: rawData.D[0].open
	}, box = createBox(rawData.D[0], dateAccesor, dateMutator);

	indexMutator(column, 0);
	columnData.push(column);

	rawData.D.forEach( function (d) {
		column.volume = column.volume || 0;
		column.volume += d.volume;
		if (!box.startOfYear) {
			box.startOfYear = d.startOfYear;
			if (box.startOfYear) {
				box.date = d.date;
				box.displayDate = d.displayDate;
			}
		}

		if (!box.startOfQuarter) {
			box.startOfQuarter = d.startOfQuarter;
			if (box.startOfQuarter && !box.startOfYear) {
				box.date = d.date;
				box.displayDate = d.displayDate;
			}
		}

		if (!box.startOfMonth) {
			box.startOfMonth = d.startOfMonth;
			if (box.startOfMonth && !box.startOfQuarter) {
				box.date = d.date;
				box.displayDate = d.displayDate;
			}
		}
		if (!box.startOfWeek) {
			box.startOfWeek = d.startOfWeek;
			if (box.startOfWeek && !box.startOfMonth) {
				box.date = d.date;
				box.displayDate = d.displayDate;
			}
		}

		if (columnData.length === 1 && column.boxes.length === 0) {
			var upwardMovement = (Math.max((usePrice(d).high - column.open), 0)) //upward movement
			var downwardMovement = Math.abs(Math.min((column.open - usePrice(d).low), 0)) // downward movement
			column.direction = upwardMovement > downwardMovement ? 1 : -1;
			if (boxSize * reversal < upwardMovement
				|| boxSize * reversal < downwardMovement) {
				// enough movement to trigger a reversal
				box.toDate = dateAccesor(d);
				box.open = column.open;
				var noOfBoxes = column.direction > 0
									? Math.floor(upwardMovement / boxSize)
									: Math.floor(downwardMovement / boxSize);
				for (var i = 0; i < noOfBoxes; i++) {
					box.close = box.open + column.direction * boxSize;
					var prevBoxClose = box.close;
					column.boxes.push(box);
					box = createBox(box, dateAccesor, dateMutator);
					// box = cloneMe(box);
					box.open = prevBoxClose;
				}
				box.fromDate = dateAccesor(d);
				box.date = dateAccesor(d);
			}
		} else {
			// one or more boxes already formed in the current column
			var upwardMovement = (Math.max((usePrice(d).high - box.open), 0)) //upward movement
			var downwardMovement = Math.abs(Math.min((usePrice(d).low - box.open), 0)) // downward movement

			if ((column.direction > 0 && upwardMovement > boxSize) /* rising column AND box can be formed */
					|| (column.direction < 0 && downwardMovement > boxSize) /* falling column AND box can be formed */ ) {
				// form another box
				box.close = box.open + column.direction * boxSize;
				box.toDate = dateAccesor(d);
				var prevBoxClose = box.close;
				column.boxes.push(box);
				box = createBox(d, dateAccesor, dateMutator);
				box.open = prevBoxClose;
				box.fromDate = dateAccesor(d);
				dateMutator(box, dateAccesor(d));
			} else if ((column.direction > 0 && downwardMovement > boxSize * reversal) /* rising column and there is downward movement to trigger a reversal */
					|| (column.direction < 0 && upwardMovement > boxSize * reversal)/* falling column and there is downward movement to trigger a reversal */) {
				// reversal

				box.open = box.open + -1 * column.direction * boxSize;
				box.toDate = dateAccesor(d);
				// box.displayDate = d.displayDate;
				dateMutator(box, dateAccesor(d));
				box.startOfYear = d.startOfYear;
				box.startOfQuarter = d.startOfQuarter;
				box.startOfMonth = d.startOfMonth;
				box.startOfWeek = d.startOfWeek;
				// console.table(column.boxes);
				var idx = indexAccessor(column) + 1;
				column = {
					boxes: [],
					//, index: column.index + 1
					direction: -1 * column.direction
				};
				indexMutator(column, idx);
				var noOfBoxes = column.direction > 0
									? Math.floor(upwardMovement / boxSize)
									: Math.floor(downwardMovement / boxSize);
				for (var i = 0; i < noOfBoxes; i++) {
					box.close = box.open + column.direction * boxSize;
					var prevBoxClose = box.close;
					column.boxes.push(box);
					box = createBox(d, dateAccesor, dateMutator);
					box.open = prevBoxClose;
				}

				columnData.push(column);
			}
		}
	});
	updateColumns(columnData, dateAccesor, dateMutator);

	// console.table(columnData);
	// console.table(data);
	var response = {};
	Object.keys(props)
		.filter((key) => excludeList.indexOf(key) < 0)
		.forEach((key) => response[key] = props[key]);

	response.data = {'D': columnData};

	return response;
}

module.exports = PointAndFigureTransformer;
