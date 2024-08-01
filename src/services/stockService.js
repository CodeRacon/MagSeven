import axios from 'axios';

const SHEET_ID = '1t1ik8tsW02LwyLhD7er6zPQyT1FAH5ELo0pppzf95EE';

const API_KEY = 'AIzaSyDNRVNz-2--OLPjUTuntGFd6eUOkveBKYM';

const stockSymbols = [
	{ name: 'Apple', symbol: 'AAPL' },
	{ name: 'Amazon', symbol: 'AMZN' },
	{ name: 'Alphabet', symbol: 'GOOG' },
	{ name: 'Meta', symbol: 'META' },
	{ name: 'Microsoft', symbol: 'MSFT' },
	{ name: 'Nvidia', symbol: 'NVDA' },
	{ name: 'Tesla', symbol: 'TSLA' },
];

const dataIndexes = {
	AAPL: { recordedQuarters: 2, revenue: 8, netIncome: 35, grossMargin: 22 },
	AMZN: { recordedQuarters: 2, revenue: 8, netIncome: 40, grossMargin: 14 },
	GOOG: { recordedQuarters: 2, revenue: 4, netIncome: 40, grossMargin: 24 },
	META: { recordedQuarters: 2, revenue: 4, netIncome: 26, grossMargin: 10 },
	MSFT: { recordedQuarters: 2, revenue: 8, netIncome: 29, grossMargin: 14 },
	NVDA: { recordedQuarters: 2, revenue: 4, netIncome: 28, grossMargin: 10 },
	TSLA: { recordedQuarters: 2, revenue: 12, netIncome: 43, grossMargin: 25 },
};

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
export const prepareStockTileData = (data) => {
	const tileData = {};
	for (const stock of stockSymbols) {
		tileData[stock.name] = calculateTileData(data[stock.symbol], stock.symbol);
		tileData[stock.name].name = stock.name;
		tileData[stock.name].symbol = stock.symbol;
	}
	return tileData;
};

export const prepareRevenueChartData = (data) => {
	const chartData = {
		labels: [],
		datasets: [],
	};

	const quarters = data[stockSymbols[0].symbol].values[2].slice(-13);
	chartData.labels = quarters.map((quarter) => formatQuarter(quarter));
	console.log(chartData);

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

const parseCommaNumber = (value) => {
	return parseFloat(value.replace(',', '.'));
};

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
