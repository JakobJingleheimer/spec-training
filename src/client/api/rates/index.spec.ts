import {
    expect,
} from 'chai';
import * as fetchMock from 'fetch-mock';

import rates from './';
import mock = require('./latest.json');


describe('API: Rates', () => {
    before(() => {
        fetchMock.catch(200);
    });

    afterEach(() => {
        fetchMock.reset();
    });

    after(() => {
        fetchMock.restore();
    });

    context('when the response is empty', () => {
        it('should return an empty schema', async () => {
            fetchMock.mock('path:/api/latest.json', 200);

            expect(await rates())
                .to.be.an('object')
                .with.all.keys([
                    'base',
                    'disclaimer',
                    'license',
                    'rates',
                    'timestamp',
                ]);
        });
    });

    context('when the response is NOT ok', () => {
        before(() => {
            fetchMock.mock('path:/api/latest.json', new Response(null, {
                status: 444,
                statusText: 'Bad',
            }));
        });

        it('should reject with an error', async () => {
            let rsp;
            try {
                rsp = await rates();
            } catch (err) {
                rsp = err;
            }
            expect(rsp).to.be.an('error');
            expect(rsp.toString()).to.contain('[API:Rates]');
        });
    });

    context('when the response is ok', () => {
        before(() => {
            fetchMock.mock('path:/api/latest.json', {
                status: 200,
                body: mock,
            });
        });

        it('should reject with an error', async () => {
            const rsp = await rates()
            expect(rsp).to.deep.equal(mock);
        });
    });
});
