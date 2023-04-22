import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignupDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dtos/signin.dto';
import { AuthPayload } from './dtos/auth-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signup(signupDto: SignupDto): Promise<string> {
    const { email, password } = signupDto;

    // Check if a user with the same email already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = await this.userService.createUser(
      'user',
      email,
      hashedPassword
    );

    // Return a message or any other data you'd like
    return `User successfully registered.`;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Remove the password field from the returned user object.
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async signin(input: SigninDto): Promise<AuthPayload> {
    const user = await this.validateUser(input.email, input.password);
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthPayload> {
    try {
      const decodedRefreshToken = this.jwtService.verify(refreshToken);

      if (!decodedRefreshToken) {
        throw new UnauthorizedException();
      }
  

      const user = await this.userService.findByEmail(decodedRefreshToken.email);

      if (!user) {
        throw new UnauthorizedException();
      }

      const newPayload = {
        email: user.email,
        sub: user.id,
        role: user.role,
      };

      return {
        access_token: this.jwtService.sign(newPayload),
        refresh_token: this.jwtService.sign(newPayload, { expiresIn: '30d' }),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
