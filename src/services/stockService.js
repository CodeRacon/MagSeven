import axios from 'axios';

/**
 * The Google Sheets API ID and API key used to fetch stock data.
 * @constant
 * @type {string}
 */
const SHEET_ID = '1t1ik8tsW02LwyLhD7er6zPQyT1FAH5ELo0pppzf95EE';
const API_KEY = 'AIzaSyDNRVNz-2--OLPjUTuntGFd6eUOkveBKYM';

/**
 * An array of stock symbols and their corresponding company names.
 * This array is used to fetch and process stock data for the supported companies.
 * @constant
 * @type {Array<{ name: string, symbol: string }>}
 */
const stockSymbols = [
	{ name: 'Apple', symbol: 'AAPL' },
	{ name: 'Amazon', symbol: 'AMZN' },
	{ name: 'Alphabet', symbol: 'GOOG' },
	{ name: 'Meta', symbol: 'META' },
	{ name: 'Microsoft', symbol: 'MSFT' },
	{ name: 'Nvidia', symbol: 'NVDA' },
	{ name: 'Tesla', symbol: 'TSLA' },
];

/**
 * An object that maps stock symbols to the indices of relevant data in the stock data array.
 * The indices correspond to the position of the data in the values array returned from the Google Sheets API.
 * @constant
 * @type {Object<string, { recordedQuarters: number, revenue: number, netIncome: number, grossMargin: number }>}
 */
const dataIndexes = {
	AAPL: { recordedQuarters: 2, revenue: 8, netIncome: 35, grossMargin: 22 },
	AMZN: { recordedQuarters: 2, revenue: 8, netIncome: 40, grossMargin: 14 },
	GOOG: { recordedQuarters: 2, revenue: 4, netIncome: 40, grossMargin: 24 },
	META: { recordedQuarters: 2, revenue: 4, netIncome: 26, grossMargin: 10 },
	MSFT: { recordedQuarters: 2, revenue: 8, netIncome: 29, grossMargin: 14 },
	NVDA: { recordedQuarters: 2, revenue: 4, netIncome: 28, grossMargin: 10 },
	TSLA: { recordedQuarters: 2, revenue: 12, netIncome: 43, grossMargin: 25 },
};

/**
 * Fetches stock data from the Google Sheets API and returns an object containing the data for each stock symbol.
 * @returns {Promise<Object<string, { values: string[] }>>} An object where the keys are stock symbols and the values are the corresponding stock data from the Google Sheets API.
 * @throws {Error} If there is an error fetching the stock data.
 */
export const fetchStockData = async () => {
	try {
		const stockData = {};
		for (const stock of stockSymbols) {
			const response = await axios.get(
				`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/$${stock.symbol}!A1:BE47?key=${API_KEY}`
			);
			stockData[stock.symbol] = response.data;
		}
		return stockData;
	} catch (error) {
		console.error('Error fetching stock data:', error);
		throw error;
	}
};

/**
 * Prepares an object containing tile data for each stock symbol.
 * The tile data includes the current revenue, quarter, absolute change, and relative change in revenue.
 * @param {Object<string, { values: string[] }>} data - An object containing the stock data for each symbol.
 * @returns {Object<string, { name: string, symbol: string, currentRevenue: string, quarter: string, absoluteChange: string, relativeChange: string }>} - An object containing the tile data for each stock symbol.
 */
export const prepareStockTileData = (data) => {
	const tileData = {};
	for (const stock of stockSymbols) {
		tileData[stock.name] = calculateTileData(data[stock.symbol], stock.symbol);
		tileData[stock.name].name = stock.name;
		tileData[stock.name].symbol = stock.symbol;
	}
	return tileData;
};

/**
 * Prepares the data for a revenue chart, including the labels and datasets.
 *
 * @param {Object<string, { values: string[] }>} data - An object containing the stock data for each symbol.
 * @returns {Object} An object containing the chart data, including labels and datasets.
 */
export const prepareRevenueChartData = (data) => {
	const chartData = {
		labels: [],
		datasets: [],
	};

	const quarters = data[stockSymbols[0].symbol].values[2].slice(-13);
	chartData.labels = quarters.map((quarter) => formatQuarter(quarter));

	stockSymbols.forEach((stock, index) => {
		const companyData =
			data[stock.symbol].values[dataIndexes[stock.symbol].revenue].slice(-13);
		chartData.datasets.push({
			label: stock.name,
			data: companyData.map((value) => parseCommaNumber(value)),
			borderColor: getColor(index),
			fill: false,
		});
	});

	return chartData;
};

/**
 * Calculates the tile data for a given stock symbol, including the current revenue, quarter, absolute change, and relative change in revenue.
 *
 * @param {Object} data - The data object containing the stock information.
 * @param {string} symbol - The stock symbol.
 * @returns {Object} An object containing the tile data for the given stock symbol.
 */
const calculateTileData = (data, symbol) => {
	const indexes = dataIndexes[symbol];
	const revenueData = data.values[indexes.revenue];
	const currentRevenue = parseCommaNumber(revenueData[revenueData.length - 1]);
	const previousRevenue = parseCommaNumber(revenueData[revenueData.length - 2]);
	const quarter = data.values[indexes.recordedQuarters][revenueData.length - 1];

	const absoluteChange = currentRevenue - previousRevenue;
	const relativeChange = (absoluteChange / previousRevenue) * 100;

	return {
		currentRevenue: currentRevenue.toFixed(3),
		quarter,
		absoluteChange: absoluteChange.toFixed(3),
		relativeChange: relativeChange.toFixed(1),
	};
};

/**
 * Calculates the Trailing Twelve Months (TTM) revenue for a set of stock symbols.
 *
 * @param {Object} data - The data object containing the stock information.
 * @returns {Object} An object containing the TTM revenue values and corresponding colors for each stock symbol.
 */
export const calculateTTMRevenue = (data) => {
	const ttmRevenue = {};
	const colors = [];

	stockSymbols.forEach((stock, index) => {
		const revenueData =
			data[stock.symbol].values[dataIndexes[stock.symbol].revenue];
		const lastFourQuarters = revenueData.slice(-4);
		const ttm = lastFourQuarters.reduce(
			(sum, value) => sum + parseCommaNumber(value),
			0
		);
		ttmRevenue[stock.name] = ttm;
		colors.push(getColor(index));
	});

	return { ttmRevenue, colors };
};

/**
 * Prepares the net income TTM (Trailing Twelve Months) data for a set of stock symbols.
 *
 * @param {Object} data - The data object containing the stock information.
 * @returns {Object} An object containing the net income TTM data, including labels and datasets.
 */
export const prepareNetIncomeTTMData = (data) => {
	const netIncomeTTM = {};

	stockSymbols.forEach((stock) => {
		const netIncomeData =
			data[stock.symbol].values[dataIndexes[stock.symbol].netIncome];
		const lastFourQuarters = netIncomeData.slice(-4);
		const ttm = lastFourQuarters.reduce(
			(sum, value) => sum + parseCommaNumber(value),
			0
		);
		netIncomeTTM[stock.name] = parseFloat(ttm.toFixed(2));
	});

	const sortedData = Object.entries(netIncomeTTM)
		.sort(([, a], [, b]) => b - a)
		.reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

	return {
		labels: Object.keys(sortedData),
		datasets: [
			{
				data: Object.values(sortedData),
				backgroundColor: stockSymbols.map((_, index) => getColor(index)),
			},
		],
	};
};

/**
 * Prepares gross margin data for a set of stock symbols.
 *
 * @param {Object} data - The data object containing the stock information.
 * @returns {Object} An object containing the gross margin data, including labels, datasets, and quarters.
 */
export const prepareGrossMarginData = (data) => {
	const grossMarginData = {};

	stockSymbols.forEach((stock) => {
		const grossMarginValues =
			data[stock.symbol].values[dataIndexes[stock.symbol].grossMargin];
		const lastQuarterGrossMargin = parseFloat(
			grossMarginValues[grossMarginValues.length - 1]
		);
		const lastQuarter =
			data[stock.symbol].values[dataIndexes[stock.symbol].recordedQuarters][
				grossMarginValues.length - 1
			];
		grossMarginData[stock.name] = {
			value: lastQuarterGrossMargin,
			quarter: lastQuarter,
		};
	});

	const sortedData = Object.entries(grossMarginData)
		.sort(([, a], [, b]) => b.value - a.value)
		.reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

	return {
		labels: Object.keys(sortedData),
		datasets: [
			{
				data: Object.values(sortedData).map((item) => item.value),
				backgroundColor: stockSymbols.map((_, index) => getColor(index)),
			},
		],
		quarters: Object.values(sortedData).map((item) => item.quarter),
	};
};

/**
 * Prepares revenue growth data for a set of stock symbols.
 *
 * @param {Object} data - The data object containing the stock information.
 * @returns {Object} An object containing the revenue growth data, including labels and datasets.
 */
export const prepareRevenueGrowthData = (data) => {
	const revenueGrowthData = {};
	const quarters = [];

	stockSymbols.forEach((stock) => {
		const revenueData =
			data[stock.symbol].values[dataIndexes[stock.symbol].revenue];
		const growthRates = [];

		for (let i = revenueData.length - 1; i >= revenueData.length - 4; i--) {
			const currentRevenue = parseCommaNumber(revenueData[i]);
			const previousYearRevenue = parseCommaNumber(revenueData[i - 4]);
			const growthRate =
				((currentRevenue - previousYearRevenue) / previousYearRevenue) * 100;
			growthRates.unshift(parseFloat(growthRate.toFixed(2)));

			if (quarters.length < 4) {
				quarters.unshift(
					formatQuarter(
						data[stock.symbol].values[
							dataIndexes[stock.symbol].recordedQuarters
						][i]
					)
				);
			}
		}

		revenueGrowthData[stock.name] = growthRates;
	});

	return {
		labels: stockSymbols.map((stock) => stock.name),
		datasets: quarters.map((quarter, index) => ({
			label: quarter,
			data: Object.values(revenueGrowthData).map((rates) => rates[index]),
			backgroundColor: compareColors(index),
		})),
	};
};

/**
 * Parses a string value with a comma as the decimal separator and returns a floating-point number.
 *
 * @param {string} value - The string value to parse.
 * @returns {number} The parsed floating-point number.
 */
const parseCommaNumber = (value) => {
	return parseFloat(value.replace(',', '.'));
};

/**
 * Formats a quarter string in the format "Q#" followed by the year.
 *
 * @param {string} quarter - The quarter string to format, in the format "Q#" or "YYYY Q#".
 * @returns {string} The formatted quarter string in the format "Q# YYYY".
 */
export const formatQuarter = (quarter) => {
	const parts = quarter.replace('-', ' ').split(/\s+/);
	let q, year;

	if (parts.length === 2) {
		if (parts[0].startsWith('Q')) {
			[q, year] = parts;
		} else {
			[year, q] = parts;
		}
	} else {
		q = parts[0].slice(-2);
		year = parts[0].slice(0, -2);
	}

	year = year.length === 2 ? '20' + year : year;
	q = q.startsWith('Q') ? q : 'Q' + q;

	return `${q} ${year}`;
};

/**
 * Generates a color based on the provided index.
 * The colors are chosen from a predefined palette and cycled through as the index increases.
 *
 * @param {number} index - The index to use for selecting the color.
 * @returns {string} - The hex color code.
 */
const getColor = (index) => {
	const colors = [
		'#ff7d7d',
		'#ff7dbf',
		'#b67dff',
		'#8b7dff',
		'#7da1ff',
		'#7dd0ff',
		'#7dffef',
	];
	return colors[index % colors.length];
};

/**
 * Generates a color based on the provided index.
 * The colors are chosen from a predefined palette and cycled through as the index increases.
 *
 * @param {number} index - The index to use for selecting the color.
 * @returns {string} - The hex color code.
 */
const compareColors = (index) => {
	const colors = ['#5390d9', '#4ea8de', '#48bfe3', '#56cfe1'];
	return colors[index % colors.length];
};
