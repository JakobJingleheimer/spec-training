import * as React from 'react';
import Grid from '@suir/collections/Grid';
import Header from '@suir/elements/Header';
import Input from '@suir/elements/Input';
import Icon from '@suir/elements/Icon';
import Message from '@suir/collections/Message';
import Segment from '@suir/elements/Segment';

import ratesApi, {
	AbortablePromise,
} from '@client/api/rates';
import getConversionRate from '@client/utils/getConversionRate';

import AppHeader, {
	delimiter,
} from './Header';


export interface IShellProps {
}
export interface IShellState {
	fromAmount: number;
	fromCurrency: SUPPORTED_CURRENCY;
	rates: { [key: string]: number };
	toCurrency: SUPPORTED_CURRENCY;
}

export default class Shell extends React.PureComponent<IShellProps, {}> {
	/**
	 * Whether to arbitrarily prevent retrieving new rates data.
	 * @property {Boolean}
	 */
	preventRatesRefresh = false;

	/**
	 * The promise returned by fetch, augmented with an abort method.
	 * @property {Promise}
	 */
	ratesApiCall: AbortablePromise;

	/**
	 * The id returned by setInterval (used to retrieve latest rates every n-seconds)
	 * @property {number}
	 */
	ratesRefresherId: NodeJS.Timer;

	state: IShellState = {
		rates: {},
		fromAmount: 1,
		fromCurrency: SUPPORTED_CURRENCY.GBP,
		toCurrency: SUPPORTED_CURRENCY.EUR,
	};

	onCurrencyChange = (
		event: React.SyntheticEvent<HTMLElement>,
		{ value }: { value: string }
	) => {
		const [ fromCurrency, toCurrency ] = value.split(` ${delimiter} `);
		this.setState({ fromCurrency, toCurrency });
	};

	refreshRates = () => {
		if (!this.preventRatesRefresh) {
			// @ts-ignore: TS does not pick up the declared return type of ratesApi
			this.ratesApiCall = ratesApi()
				.then(({ rates }) => {
					this.setState({ rates });
				})
				.catch((err) => {
					this.preventRatesRefresh = true;
					console.error(err);
				});
		}
	}

	syncInputs = (
		event: React.SyntheticEvent<HTMLElement>,
		{ id, value }: { id: string, value: string }
	) => {
		this.setState({ [id]: value });
	};

	componentDidMount() {
		// @ts-ignore: DefinitelyTyped/DefinitelyTyped#21310
		this.ratesRefresherId = setInterval(this.refreshRates, 10000); // 10 seconds
		this.refreshRates();
	}

	componentWillUnmount() {
		this.ratesApiCall.abort && this.ratesApiCall.abort();
		clearInterval(this.ratesRefresherId);
	}

	render() {
		const {
			onCurrencyChange,
			state: {
				rates,
				fromAmount,
				fromCurrency,
				toCurrency,
			},
			syncInputs,
		} = this;
		const toAmount = getConversionRate(rates, fromCurrency, toCurrency, fromAmount);

		return (
			<React.Fragment>
				<AppHeader
					onCurrencyChange={onCurrencyChange}
					rates={rates}
					fromCurrency={fromCurrency}
					toCurrency={toCurrency}
				/>

				<Grid
					centered
					className="view"
					columns="equal"
					padded="horizontally"
					relaxed="very"
					stretched
					verticalAlign="middle"
				>
					<Grid.Row>
						<Grid.Column>
							<Header
								content={fromCurrency}
								size="huge"
							/>
						</Grid.Column>
						<Grid.Column>
							<Input
								autoFocus
								fluid
								focus
								id="fromAmount"
								min={1}
								onChange={syncInputs}
								size="massive"
								transparent
								type="number"
								value={fromAmount}
							/>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column>
							<Header
								content={toCurrency}
								size="huge"
							/>
						</Grid.Column>
						<Grid.Column>
							<Input
								fluid
								readOnly
								size="massive"
								transparent
								type="number"
								value={toAmount || ''}
							/>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</React.Fragment>
		);
	}
}
