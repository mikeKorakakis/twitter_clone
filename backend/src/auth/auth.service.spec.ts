import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { SignupDto } from './dtos/signup.dto';
import { SigninDto } from './dtos/signin.dto';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  ...jest.requireActual('bcrypt'),
  compare: mockBcrypt.compare,
}));

const mockUserService = {
  findByEmail: jest.fn(),
  createUser: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockBcrypt = {
  compare: jest.fn(),
};

const validUser = {
  id: 1,
  email: 'test@example.com',
  password: 'hashed-password',
  role: 'user',
};

mockUserService.findByEmail.mockImplementation(async (email) => {
  if (email === validUser.email) {
    return { ...validUser };
  } else {
    return null;
  }
});

mockBcrypt.compare.mockImplementation(async (password, hashedPassword) => {
  return (
    password === 'correct-password' && hashedPassword === validUser.password
  );
});

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    it('should throw an error if a user with the same email already exists', async () => {
      mockUserService.findByEmail.mockResolvedValue(true);

      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'testpassword',
      };

      await expect(authService.signup(signupDto)).rejects.toThrow(
        'User with this email already exists.'
      );
    });

    it('should return a success message if the user is created', async () => {
      mockUserService.findByEmail.mockResolvedValue(false);
      mockUserService.createUser.mockResolvedValue(true);

      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'testpassword',
      };

      const result = await authService.signup(signupDto);
      expect(result).toEqual('User successfully registered.');
    });
  });

  describe('signin', () => {
    it('should throw an UnauthorizedException if the user is not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      const signinDto: SigninDto = {
        email: 'test@example.com',
        password: 'testpassword',
      };

      await expect(authService.signin(signinDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should return an AuthPayload if the user is found and the password matches', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password:
          '$2b$10$Yh6fDEmg7P9HgT6RNmV6UeZ6U1cavUu0qYqVbzDgCXa0s24sMj8E.', // bcrypt hash of 'testpassword'
        role: 'user',
      };

      mockUserService.findByEmail.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('test-access-token');

      const signinDto: SigninDto = {
        email: 'test@example.com',
        password: 'testpassword',
      };

      const result = await authService.signin(signinDto);
      expect(result.access_token).toEqual('test-access-token');
    });
  });

  describe('refreshToken', () => {
    it('should throw an UnauthorizedException if the refresh token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const refreshToken = 'invalid-refresh-token';
      await expect(authService.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should return a new AuthPayload if the refresh token is valid', async () => {
      const decodedRefreshToken = {
        email: 'test@example.com',
        sub: 1,
        role: 'user',
      };

      const user = {
        id: 1,
        email: 'test@example.com',
        role: 'user',
      };

      mockJwtService.verify.mockReturnValue(decodedRefreshToken);
      mockUserService.findByEmail.mockReturnValue(user);
      mockJwtService.sign.mockReturnValue('new-access-token');

      const refreshToken = 'valid-refresh-token';
      const result = await authService.refreshToken(refreshToken);

      expect(result.access_token).toEqual('new-access-token');
    });
  });
});
