import { Utils } from '../../app/Utils/Utils';
import { IncomingMessage } from 'http';

describe('Utils test suite', () => {
	test('getRequestPath valid request', () => {
		const message = {
			url: 'http://localhost:8080/login',
		} as IncomingMessage;
		const resultPath = Utils.getRequestBasePath(message);
		expect(resultPath).toBe('login');
	});
	test('getRequestPath with no path name', () => {
		const message = {
			url: 'http://localhost:8080/',
		} as IncomingMessage;
		const resultPath = Utils.getRequestBasePath(message);
		expect(resultPath).toBeFalsy();
	});
	test('getRequestPath with no url', () => {
		const message = {
			url: '',
		} as IncomingMessage;
		const resultPath = Utils.getRequestBasePath(message);
		expect(resultPath).toBeFalsy();
	});
});
