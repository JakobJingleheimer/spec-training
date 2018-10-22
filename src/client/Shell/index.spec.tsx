import {
	expect,
	use,
} from 'chai';
import {
	shallow,
	ShallowWrapper,
} from 'enzyme';
import * as React from 'react';
import {
	createSandbox,
} from 'sinon';

import * as ratesApi from '@client/api/rates';
import { AbortablePromise } from '@client/api/rates';

import Shell, {
	IShellProps,
} from './';


describe('Component: Shell', () => {
	const sandbox = createSandbox();
	const ss: Partial<{
		clearInterval: sinon.SinonSpy; // sinonjs/lolex#224
		clock: sinon.SinonFakeTimers;
		ratesApi: sinon.SinonStub;
	}> = {};

	before(() => {
		ss.ratesApi = sandbox.stub(ratesApi, 'default')
			.named('ratesApi')
			.callsFake((): AbortablePromise => {
				let reject;
				const call = new Promise((resolve, rej) => {
					reject = rej;
				});
				const abortablePromise: AbortablePromise = Object.defineProperties(call, {
					abort: {
						value: reject,
					},
				});
				return abortablePromise;
			});
		ss.clock = sandbox.useFakeTimers({
			// @ts-ignore: @types/sinon is missing most of the config props sinonjs/lolex#220
			loopLimit: 50,
		});
		ss.clearInterval = sandbox.spy(ss.clock, 'clearInterval'); // sinonjs/lolex#224
	});

	afterEach(() => {
		sandbox.resetHistory();
	});

	after(() => {
		sandbox.restore();
	});

	it('should initially call the rates API on mount', () => {
		shallow(<Shell />);

		expect(ss.ratesApi).to.have.been.calledOnce;
	});

	it('should cache the interval timer ID', () => {
		const shell: ShallowWrapper<IShellProps, any, Shell> = shallow(<Shell />);

		expect(shell.instance().ratesRefresherId).to.be.ok;
	});

	it('should subsequently call the rates API every few seconds', () => {
		shallow(<Shell />);

		ss.clock.next();
		expect(ss.ratesApi).to.have.been.calledTwice;

		ss.clock.next();
		expect(ss.ratesApi).to.have.been.calledThrice;
	});

	it('should stop calling the rates API after unmount', () => {
		const shell: ShallowWrapper<IShellProps, any, Shell> = shallow(<Shell />);

		shell.unmount();

		// ss.clock.runAll();
		// expect(ss.ratesApi).to.have.been.calledOnce;
		// The above is the correct way to assert the desired behaviour; however,
		// it does not work in the spec due to sinonjs/lolex#224
		// Instead, assert the next-best:
		expect(ss.clearInterval).to.have.been.calledOnce;
	});
});
