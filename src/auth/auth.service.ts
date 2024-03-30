import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreatUserDto } from './dto/crear-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  
  async create(createUserDto: CreatUserDto) {

    try {

      const { password, ...userDate } = createUserDto;

      const user = this.userRepository.create({
        ...userDate,
        password: bcrypt.hashSync(password,10)
      });

      await this.userRepository.save(user);
      delete user.password;

      return user;
    } 
    catch (error) 
    {
      this.handleDBError(error);
    }
  }


  async login(loginUserDto: any) {
    
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: {email},
      select: { email: true, password: true }
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas (email)');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credenciales incorrectas (password)');
    }

    return user;
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    throw new InternalServerErrorException('Error en la base de datos');
  }
}
