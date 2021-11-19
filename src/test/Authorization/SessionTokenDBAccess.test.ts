import { SessionTokenDBAccess } from '../../app/Authorization/SessionTokenDBAccess';
jest.mock('nedb');

describe('SessionTokenDBAccess test suite', () => {
	let sessionTokenDBAccess: SessionTokenDBAccess;
	const nedbMock = {
		insert: jest.fn(),
		find: jest.fn(),
		loadDatabase: jest.fn(),
	};
	const token = {
		accessRights: [],
		expirationTime: new Date(),
		tokenId: '123',
		userName: 'John',
		valid: true,
	};
	beforeEach(() => {
		sessionTokenDBAccess = new SessionTokenDBAccess(nedbMock as any);
		expect(nedbMock.loadDatabase).toBeCalled();
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('store sessionToken without error', async () => {
		nedbMock.insert.mockImplementationOnce((someToken: any, cb: any) => {
			cb();
		});
		await sessionTokenDBAccess.storeSessionToken(token);
		expect(nedbMock.insert).toBeCalledWith(token, expect.any(Function));
	});
	test('store sessionToken with error', async () => {
		nedbMock.insert.mockImplementationOnce((someToken: any, cb: any) => {
			cb(new Error('something went wrong'));
		});
		await expect(sessionTokenDBAccess.storeSessionToken(token)).rejects.toThrow(
			'something went wrong',
		);
		expect(nedbMock.insert).toBeCalledWith(token, expect.any(Function));
	});
});
