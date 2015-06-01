'use strict';

var excludeList = ['transformType', 'options', 'children', 'namespace', '_multiInterval'];
var pricingMethod = function (d) { return { high: d.high, low: d.low }; };
var usePrice = function (d) { return { high: d.high, low: d.low }; };

var defaultOptions = {
	boxSize: 0.5,
	reversal: 3,
}

function createBox(d, _dateAccessor, dateMutator) {
	var box = {
		open: d.open
		, fromDate: _dateAccessor(d)
		, toDate: _dateAccessor(d)
		//, displayDate: d.displayDate
		, startOfYear: d.startOfYear
		, startOfQuarter: d.startOfQuarter
		, startOfMonth: d.startOfMonth
		, startOfWeek: d.startOfWeek
	};
	dateMutator(box, _dateAccessor(d));
	return box;
}

function updateColumns(columnData, _dateAccessor, dateMutator) {

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

			if (eachBox.startOfYear) {
				d.startOfYear = d.startOfYear || eachBox.startOfYear;
				d.startOfQuarter = eachBox.startOfQuarter;
				d.startOfMonth = eachBox.startOfMonth;
				d.startOfWeek = eachBox.startOfWeek;
				//d.displayDate = eachBox.displayDate;
				dateMutator(d, _dateAccessor(eachBox));
			}
			if (d.startOfQuarter !== true && eachBox.startOfQuarter) {
				d.startOfQuarter = eachBox.startOfQuarter;
				d.startOfMonth = eachBox.startOfMonth;
				d.startOfWeek = eachBox.startOfWeek;
				// d.displayDate = eachBox.displayDate;
				dateMutator(d, _dateAccessor(eachBox));
			}
			if (d.startOfMonth !== true && eachBox.startOfMonth) {
				d.startOfMonth = eachBox.startOfMonth;
				d.startOfWeek = eachBox.startOfWeek;
				// d.displayDate = eachBox.displayDate;
				dateMutator(d, _dateAccessor(eachBox));
			}
			if (d.startOfWeek !== true && eachBox.startOfWeek) {
				d.startOfWeek = eachBox.startOfWeek;
				// d.displayDate = eachBox.displayDate;
				dateMutator(d, _dateAccessor(eachBox));
			}
		});

	});

	// console.table(columnData);
	// console.table(rawData);
	return columnData;
};

function PointAndFigureTransformer(rawData, interval, options, other) {

	var newOptions = {};
	Object.keys(defaultOptions).forEach((key) => newOptions[key] = defaultOptions[key]);

	if (options) Object.keys(options).forEach((key) => newOptions[key] = options[key]);

	var { _dateAccessor, _dateMutator, _indexAccessor, _indexMutator, reversal, boxSize } = newOptions;

	var columnData = new Array();

	var index = 0, direction;
	var column = {
		boxes: [],
		open: rawData.D[0].open
	}, box = createBox(rawData.D[0], _dateAccessor, _dateMutator);

	_indexMutator(column, 0);
	columnData.push(column);

	rawData.D.forEach( function (d) {
		column.volume = column.volume || 0;
		column.volume += d.volume;

		if (!box.startOfYear) {
			box.startOfYear = d.startOfYear;
			if (box.startOfYear) {
				_dateMutator(box, _dateAccessor(d));
				// box.displayDate = d.displayDate;
			}
		}

		if (!box.startOfYear && !box.startOfQuarter) {
			box.startOfQuarter = d.startOfQuarter;
			if (box.startOfQuarter && !box.startOfYear) {
				_dateMutator(box, _dateAccessor(d));
				// box.displayDate = d.displayDate;
			}
		}

		if (!box.startOfQuarter && !box.startOfMonth) {
			box.startOfMonth = d.startOfMonth;
			if (box.startOfMonth && !box.startOfQuarter) {
				_dateMutator(box, _dateAccessor(d));
				// box.displayDate = d.displayDate;
			}
		}
		if (!box.startOfMonth && !box.startOfWeek) {
			box.startOfWeek = d.startOfWeek;
			if (box.startOfWeek && !box.startOfMonth) {
				_dateMutator(box, _dateAccessor(d));
				// box.displayDate = d.displayDate;
			}
		}

		if (columnData.length === 1 && column.boxes.length === 0) {
			var upwardMovement = (Math.max((usePrice(d).high - column.open), 0)) //upward movement
			var downwardMovement = Math.abs(Math.min((column.open - usePrice(d).low), 0)) // downward movement
			column.direction = upwardMovement > downwardMovement ? 1 : -1;
			if (boxSize * reversal < upwardMovement
				|| boxSize * reversal < downwardMovement) {
				// enough movement to trigger a reversal
				box.toDate = _dateAccessor(d);
				box.open = column.open;
				var noOfBoxes = column.direction > 0
									? Math.floor(upwardMovement / boxSize)
									: Math.floor(downwardMovement / boxSize);
				for (var i = 0; i < noOfBoxes; i++) {
					box.close = box.open + column.direction * boxSize;
					var prevBoxClose = box.close;
					column.boxes.push(box);
					box = createBox(box, _dateAccessor, _dateMutator);
					// box = cloneMe(box);
					box.open = prevBoxClose;
				}
				box.fromDate = _dateAccessor(d);
				box.date = _dateAccessor(d);
			}
		} else {
			// one or more boxes already formed in the current column
			var upwardMovement = (Math.max((usePrice(d).high - box.open), 0)) //upward movement
			var downwardMovement = Math.abs(Math.min((usePrice(d).low - box.open), 0)) // downward movement

			if ((column.direction > 0 && upwardMovement > boxSize) /* rising column AND box can be formed */
					|| (column.direction < 0 && downwardMovement > boxSize) /* falling column AND box can be formed */ ) {
				// form another box
				box.close = box.open + column.direction * boxSize;
				box.toDate = _dateAccessor(d);
				var prevBoxClose = box.close;
				column.boxes.push(box);
				box = createBox(d, _dateAccessor, _dateMutator);
				box.open = prevBoxClose;
				box.fromDate = _dateAccessor(d);
				_dateMutator(box, _dateAccessor(d));
			} else if ((column.direction > 0 && downwardMovement > boxSize * reversal) /* rising column and there is downward movement to trigger a reversal */
					|| (column.direction < 0 && upwardMovement > boxSize * reversal)/* falling column and there is downward movement to trigger a reversal */) {
				// reversal

				box.open = box.open + -1 * column.direction * boxSize;
				box.toDate = _dateAccessor(d);
				// box.displayDate = d.displayDate;
				_dateMutator(box, _dateAccessor(d));
				// box.startOfYear = d.startOfYear;
				// box.startOfQuarter = d.startOfQuarter;
				// box.startOfMonth = d.startOfMonth;
				// box.startOfWeek = d.startOfWeek;
				// console.table(column.boxes);
				var idx = _indexAccessor(column) + 1;
				column = {
					boxes: [],
					//, index: column.index + 1
					direction: -1 * column.direction
				};
				_indexMutator(column, idx);
				var noOfBoxes = column.direction > 0
									? Math.floor(upwardMovement / boxSize)
									: Math.floor(downwardMovement / boxSize);
				for (var i = 0; i < noOfBoxes; i++) {
					box.close = box.open + column.direction * boxSize;
					var prevBoxClose = box.close;
					column.boxes.push(box);
					box = createBox(d, _dateAccessor, _dateMutator);
					box.open = prevBoxClose;
				}

				columnData.push(column);
			}
		}
	});
	updateColumns(columnData, _dateAccessor, _dateMutator);

	return {
		data: {'D': columnData},
		other: other,
		options: newOptions
	};
}

module.exports = PointAndFigureTransformer;
