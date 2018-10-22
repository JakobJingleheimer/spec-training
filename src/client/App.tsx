import * as React from 'react';

import Shell from '@client/Shell';

import '@client/semantic-ui/index.less';
import './app.less';


const App: React.SFC<{}> = (): JSX.Element => (
	<Shell />
);

export {
	App as default,
};
