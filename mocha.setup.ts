import 'isomorphic-fetch';
import {
	use,
} from 'chai';
import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as sinonChai from 'sinon-chai';

configure({ adapter: new Adapter() });

use(sinonChai);

// @ts-ignore
global.CONFIG = {
	apiKey: 'abc123',
};
