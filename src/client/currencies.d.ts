declare const enum SUPPORTED_CURRENCY {
	EUR = 'EUR',
	GBP = 'GBP',
	USD = 'USD',
}

declare interface IRates {
	[key: string]: number;
}
