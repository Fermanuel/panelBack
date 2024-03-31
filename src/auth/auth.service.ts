import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreatUserDto } from './dto/crear-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interface/jwt-paylot.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      }
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
      select: { email: true, password: true, id: true}
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas (email)');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credenciales incorrectas (password)');
    }

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }
  }

  // genero el token
  private getJwtToken( payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    throw new InternalServerErrorException('Error en la base de datos');
  }
}
