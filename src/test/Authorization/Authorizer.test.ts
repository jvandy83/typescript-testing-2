import { Authorizer } from '../../app/Authorization/Authorizer';
import { SessionTokenDBAccess } from './../../app/Authorization/SessionTokenDBAccess';

import { UserCredentialsDbAccess } from '../../app/Authorization/UserCredentialsDbAccess';
import { Account, SessionToken } from '../../app/Models/ServerModels';

// mock modules immediately after importing them
jest.mock('../../app/Authorization/SessionTokenDBAccess');
jest.mock('../../app/Authorization/UserCredentialsDbAccess');

describe('Authorizer test suite', () => {
	let authorizer: Authorizer;

	const userCredentialsDbAccessMock = {
		getUserCredential: jest.fn(),
	};
	const sessionTokenDbAccessMock = {
		storeSessionToken: jest.fn(),
	};

	beforeEach(() => {
		authorizer = new Authorizer(
			sessionTokenDbAccessMock as any,
			userCredentialsDbAccessMock as any,
		);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('constructor arguments', () => {
		new Authorizer();
		expect(SessionTokenDBAccess).toBeCalled();
		expect(UserCredentialsDbAccess).toBeCalled();
	});
	const someAccount: Account = {
		username: 'someuser',
		password: 'password',
	};
	test('should return session token for valid credentials', async () => {
		jest.spyOn(global.Math, 'random').mockReturnValueOnce(0);
		jest.spyOn(global.Date, 'now').mockReturnValueOnce(0);
		userCredentialsDbAccessMock.getUserCredential.mockResolvedValueOnce({
			username: 'someuser',
			accessRights: [1, 2, 3],
		});
		const expectedSessionToken: SessionToken = {
			userName: 'someuser',
			accessRights: [1, 2, 3],
			valid: true,
			tokenId: '',
			expirationTime: new Date(60 * 60 * 1000),
		};
		const sessionToken = await authorizer.generateToken(someAccount);
		expect(expectedSessionToken).toEqual(sessionToken);
		expect(sessionTokenDbAccessMock.storeSessionToken).toBeCalledWith(
			sessionToken,
		);
	});
});
