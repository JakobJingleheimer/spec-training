/// <reference path="../../global.d.ts"/>

import 'isomorphic-fetch';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';


const {
	apiKey,
} = CONFIG;

export interface IRatesApiData {
	base: string;
	disclaimer: string,
	license: string,
	rates: {},
	timestamp: number,
}

export const emptyRatesSchema: IRatesApiData = {
	base: '',
	disclaimer: '',
	license: '',
	rates: {},
	timestamp: 0,
};

/**
 * A fetch promise augmented with an AbortController, exposed as an `abort` method.
 * @typedef AbortablePromise
 */
export interface AbortablePromise extends Promise<(IRatesApiData | never)> {
	abort: () => void;
}

/**
 * Retrieve the latest currency exchange rates from the API.
 * This always resolves with the same schema.
 * @return {AbortablePromise} The promise returned by fetch augmented with an AbortController.
 */
export default function rates(): AbortablePromise {
	const controller = new AbortController();

	const call = fetch(`https://localhost:8080/api/latest.json?app_id=${apiKey}`, {
		signal: controller.signal,
	})
		.then((rsp: Response): Promise<IRatesApiData> | never => {
			if (!rsp.ok) throw new Error([
				'[API:Rates]',
				rsp.statusText,
				rsp.url,
			].join(' '));

			return rsp
				.json() // throws SyntaxError when body is empty or not json
				.catch((err) => emptyRatesSchema);
		})
		.catch((err) => {
			if (Notification.permission === 'granted') new Notification('Rates Unavailable', {
				actions: [],
				body: [
					'Unable to retrieve latest rates.',
					'The app will use the last known rates, if available,',
					'and will not automatically check again.',
					'Refresh the page to re-try rates retrieval.',
				].join(' '),
				lang: 'en-UK',
			});

			throw err;
		});

	const abortablePromise: AbortablePromise = Object.defineProperties(call, {
		abort: {
			value: controller.abort,
		}
	});

	return abortablePromise;
}
