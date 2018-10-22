/// <reference path="../currencies.d.ts" />

import {
    expect,
} from 'chai';

import latest = require('../api/rates/latest.json');

import getConversionRate from './getConversionRate';


describe('Util: getConversionRate', () => {
	const { rates } = latest;

	it('EUR → GBP', () => {
		const rate = getConversionRate(rates, SUPPORTED_CURRENCY.EUR, SUPPORTED_CURRENCY.GBP);

		expect(rate).to.equal(0.877551);
	});

	it('EUR → USD', () => {
		const rate = getConversionRate(rates, SUPPORTED_CURRENCY.EUR, SUPPORTED_CURRENCY.USD);

		expect(rate).to.equal(1.150008);
	});

	//

	it('GBP → EUR', () => {
		const rate = getConversionRate(rates, SUPPORTED_CURRENCY.GBP, SUPPORTED_CURRENCY.EUR);

		expect(rate).to.equal(1.139535);
	});

	it('GBP → USD', () => {
		const rate = getConversionRate(rates, SUPPORTED_CURRENCY.GBP, SUPPORTED_CURRENCY.USD);

		expect(rate).to.equal(1.310475);
	});

	//

	it('USD → EUR', () => {
		const rate = getConversionRate(rates, SUPPORTED_CURRENCY.USD, SUPPORTED_CURRENCY.EUR);

		expect(rate).to.equal(0.869559);
	});

	it('USD → GBP', () => {
		const rate = getConversionRate(rates, SUPPORTED_CURRENCY.USD, SUPPORTED_CURRENCY.GBP);

		expect(rate).to.equal(0.763082);
	});

	context('when an amount is provided', () => {
		it('should multiply the rate by the amount', () => {
			const convertedAmount = getConversionRate(
				rates,
				SUPPORTED_CURRENCY.GBP,
				SUPPORTED_CURRENCY.EUR,
				4
			);

			expect(convertedAmount).to.equal(4.558142);
		});
	});
});
