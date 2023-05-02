import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(
    role: string,
    email: string,
    password: string,
  ): Promise<User> {
    const newUser = this.userRepository.create({ role, email, password });
    return this.userRepository.save(newUser);
  }

  async updateUser(id: string, role: string, email: string): Promise<User> {
    await this.userRepository.update(id, { role, email });
    return this.userRepository.findOneOrFail({ where: { id } });
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }
}
