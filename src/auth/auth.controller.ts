import { Controller, Post, Body, Get, UseGuards, SetMetadata} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreatUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/role-protected/get-user.decorator';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interface';
import { Auth } from './decorators/role-protected';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreatUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  LoginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }


  @Get('private')
  @UseGuards(AuthGuard())
  testPrivate(

    @GetUser() user: User

  ) {

    // console.log(user);


    return {
      message: 'This is a private route',
      ok: true,
      user,
    }
  }


  // @SetMetadata('roles', ['admin'])
  
  @Get('private2')
  @UseGuards(AuthGuard(), UserRoleGuard)
  @RoleProtected(ValidRoles.admin, ValidRoles.doctor)
  private2(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user,
    }
  }


  @Get('private3')
  @Auth(ValidRoles.admin)
  private3(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user,
    }
  }
}
