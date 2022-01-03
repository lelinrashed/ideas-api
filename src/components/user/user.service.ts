import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto, UserResponseObject } from './dto/user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  showAll = async (): Promise<UserResponseObject[]> => {
    const users = await this.userRepository.find();
    return users.map((user) => ({
      id: user.id,
      created: user.created,
      username: user.username,
    }));
  };

  async login(data: UserDto): Promise<UserResponseObject> {
    const { username, password } = data;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST,
      );
    }
    const { id, created, username: existingUsername } = user;
    const token = jwt.sign({ id, existingUsername }, process.env.SECRET, {
      expiresIn: '7d',
    });
    return {
      id,
      username,
      created,
      token,
    };
  }

  async register(data: UserDto): Promise<UserResponseObject> {
    const { username, password } = data;
    const user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const savedData = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    const {
      id,
      username: newUsername,
      created,
    } = await this.userRepository.save(savedData);

    const token = jwt.sign({ id, newUsername }, process.env.SECRET, {
      expiresIn: '7d',
    });

    return {
      id: id,
      created: created,
      username: newUsername,
      token: token,
    };
  }
}
