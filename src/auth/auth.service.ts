import { Injectable } from '@nestjs/common';
import { CreatUserDto } from './dto/crear-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  
  async create(createUserDto: CreatUserDto) {

    try {
      const user = await this.userRepository.create(createUserDto);

      await this.userRepository.save(user);

      return user;
    } 
    catch (error) 
    {
      console.log(error);
    }
  }
}
