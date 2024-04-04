import { Controller, Post, Body, Get} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreatUserDto, LoginUserDto } from './dto';
import { GetUser } from './decorators/role-protected/get-user.decorator';
import { User } from './entities/user.entity';
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


  @Get('check-status-user')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus(user);
  }


  //PRUEBAS DE AUTEHTICACION

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
