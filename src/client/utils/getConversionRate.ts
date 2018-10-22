/// <reference path="../currencies.d.ts" />
// ⚠️ omitting the above reference and including the jsdocs causes TS2304


/**
 * Convert from one currency to another, and optionally compute a total.
 * @param  {IRates}             rates  The collection of currency rates.
 * @param  {SUPPORTED_CURRENCY} from   The starting/input currency code to convert.
 * @param  {SUPPORTED_CURRENCY} to     The ending/output currency code to convert.
 * @param  {number}             amount An amount of the starting currency to compute the ending.
 * @return {number}                    Either the rate or the converted amount.
 */
export default function getConversionRate(
	rates: { [key: string]: number },
	from: SUPPORTED_CURRENCY,
	to: SUPPORTED_CURRENCY,
	amount: number = 1,
): number {
	// @ts-ignore: TS incorrectly determines the type of this
	return +(Math.round((rates[to] / rates[from] * amount) + 'e+6') + 'e-6');
}
