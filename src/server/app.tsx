import * as React from 'react';
import {
	renderToNodeStream,
} from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import App from '@client/App';

renderToNodeStream(
	<StaticRouter>
		<App />
	</StaticRouter>
);
