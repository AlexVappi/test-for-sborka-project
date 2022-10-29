module.exports = {
	addAwesome: function (str) {
		return str + ' Awesome!';
	},
	formatNumber: function(number) {
		number = number.toString();
		let result = '';

		for (let k = number.length - 1, c = 0; k >= 0; k--, c++) {
			if (c === 3) {
				c = 0;
				result = number.substr(k, 1) + ' ' + result;
			} else {
				result = number.substr(k, 1) + result;
			}
		}

		return result;
	},
};
