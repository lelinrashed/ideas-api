import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ideaDto } from './dto/idea.dto';
import { IdeaEntity } from './idea.entity';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private responseObject(idea: IdeaEntity) {
    return { ...idea, author: idea.author.toResponseObject() };
  }

  async showAll() {
    const ideas = await this.ideaRepository.find({ relations: ['author'] });
    return ideas.map((idea) => this.responseObject(idea));
  }

  async create(userId: string, data: ideaDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const idea = this.ideaRepository.create({ ...data, author: user });
    await this.ideaRepository.save(idea);
    return this.responseObject(idea);
  }

  async read(id: string) {
    const idea = await this.ideaRepository.findOne({ where: { id } });
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return idea;
  }

  async update(id: string, data: Partial<ideaDto>) {
    let idea = await this.ideaRepository.findOne({ where: { id } });
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    await this.ideaRepository.update({ id }, data);
    idea = await this.ideaRepository.findOne({ where: { id } });
    return idea;
  }

  async destroy(id: string) {
    const idea = await this.ideaRepository.findOne({ where: { id } });
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    await this.ideaRepository.delete({ id });
    return idea;
  }
}
