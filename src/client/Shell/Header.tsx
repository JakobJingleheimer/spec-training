import * as React from 'react';
import Dropdown from '@suir/modules/Dropdown';
import Transition from '@suir/modules/Transition';
import Segment from '@suir/elements/Segment';

import getConversionRate from '@client/utils/getConversionRate';
import currencySymbolMap from '@client/utils/currencySymbolMap';


export const delimiter = '⇒';

export const composeXeLabel = (
	rates: IRates,
	from: SUPPORTED_CURRENCY,
	to: SUPPORTED_CURRENCY,
) => (
	`${currencySymbolMap[from]}1 ${delimiter} ${currencySymbolMap[to]}${getConversionRate(
		rates,
		from,
		to
	)}`
);

export const composeFromTo = (from: SUPPORTED_CURRENCY, to: SUPPORTED_CURRENCY) => (
	`${from} ${delimiter} ${to}`
);

export interface IHeaderProps {
	fromCurrency: SUPPORTED_CURRENCY;

	onCurrencyChange: (
		event: React.SyntheticEvent<HTMLElement>,
		data: { [key: string]: any },
	) => void;
	rates: { [key: string]: number };
	toCurrency: SUPPORTED_CURRENCY;
}

const Header: React.SFC<IHeaderProps> = ({
	fromCurrency,
	onCurrencyChange,
	rates,
	toCurrency,
}: IHeaderProps) => {
	const options = [
		{
			key: composeFromTo(SUPPORTED_CURRENCY.EUR, SUPPORTED_CURRENCY.GBP),
			text: composeXeLabel(rates, SUPPORTED_CURRENCY.EUR, SUPPORTED_CURRENCY.GBP),
			value: composeFromTo(SUPPORTED_CURRENCY.EUR, SUPPORTED_CURRENCY.GBP),
		},
		{
			key: composeFromTo(SUPPORTED_CURRENCY.EUR, SUPPORTED_CURRENCY.USD),
			text: composeXeLabel(rates, SUPPORTED_CURRENCY.EUR, SUPPORTED_CURRENCY.USD),
			value: composeFromTo(SUPPORTED_CURRENCY.EUR, SUPPORTED_CURRENCY.USD),
		},
		{
			key: composeFromTo(SUPPORTED_CURRENCY.GBP, SUPPORTED_CURRENCY.EUR),
			text: composeXeLabel(rates, SUPPORTED_CURRENCY.GBP, SUPPORTED_CURRENCY.EUR),
			value: composeFromTo(SUPPORTED_CURRENCY.GBP, SUPPORTED_CURRENCY.EUR),
		},
		{
			key: composeFromTo(SUPPORTED_CURRENCY.GBP, SUPPORTED_CURRENCY.USD),
			text: composeXeLabel(rates, SUPPORTED_CURRENCY.GBP, SUPPORTED_CURRENCY.USD),
			value: composeFromTo(SUPPORTED_CURRENCY.GBP, SUPPORTED_CURRENCY.USD),
		},
		{
			key: composeFromTo(SUPPORTED_CURRENCY.USD, SUPPORTED_CURRENCY.EUR),
			text: composeXeLabel(rates, SUPPORTED_CURRENCY.USD, SUPPORTED_CURRENCY.EUR),
			value: composeFromTo(SUPPORTED_CURRENCY.USD, SUPPORTED_CURRENCY.EUR),
		},
		{
			key: composeFromTo(SUPPORTED_CURRENCY.USD, SUPPORTED_CURRENCY.GBP),
			text: composeXeLabel(rates, SUPPORTED_CURRENCY.USD, SUPPORTED_CURRENCY.GBP),
			value: composeFromTo(SUPPORTED_CURRENCY.USD, SUPPORTED_CURRENCY.GBP),
		},
	];

	return (
		<Segment
			as="header"
			textAlign="center"
		>
			<Transition
				animation="pulse"
				mountOnShow
				transitionOnMount
				visible
			>
				<Dropdown
					defaultValue={composeFromTo(fromCurrency, toCurrency)}
					disabled={!Object.keys(rates).length}
					onChange={onCurrencyChange}
					options={options}
					scrolling
					selection
				/>
			</Transition>
		</Segment>
	);
};

Header.defaultProps = {
	fromCurrency: SUPPORTED_CURRENCY.GBP,
	onCurrencyChange: () => {},
	rates: {},
	toCurrency: SUPPORTED_CURRENCY.EUR,
};

export default Header;
