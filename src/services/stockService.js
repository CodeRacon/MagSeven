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
			stockData[stock.name] = {
				...calculateTileData(response.data, stock.symbol),
				name: stock.name,
				symbol: stock.symbol,
			};
		}
		return stockData;
	} catch (error) {
		console.error('Error fetching stock data:', error);
		throw error;
	}
};

const parseCommaNumber = (value) => {
	return parseFloat(value.replace(',', '.'));
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
		currentRevenue: currentRevenue.toFixed(2),
		quarter,
		absoluteChange: absoluteChange.toFixed(2),
		relativeChange: relativeChange.toFixed(2),
	};
};
