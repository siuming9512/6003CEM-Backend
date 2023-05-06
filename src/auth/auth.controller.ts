import { Controller, Request, Post, UseGuards, Body, HttpCode, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './entities/user.entity';
import { JwtLoginDto } from './dto/jwt-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ProfileDto } from './dto/profile.dto';
import { LoginExternalDto } from './dto/login-external.dto';
import { RolesGuard } from './roles.guard';
import { HasRoles } from './roles.decorator';
import { Role } from './role.enum';

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth('defaultBearerAuth')
export class AuthController {
  constructor(private authService: AuthService) { }

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOkResponse({
    type: JwtLoginDto
  })
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<JwtLoginDto> {
    const jwt = await this.authService.login(loginDto.username, loginDto.password);

    return jwt
  }

  @Post('external')
  @ApiOkResponse({
    type: JwtLoginDto
  })
  @HttpCode(200)
  async external(@Body() loginExternalDto: LoginExternalDto): Promise<JwtLoginDto> {
    const jwt = await this.authService.loginExternal(loginExternalDto.token);

    return jwt
  }

  @ApiOkResponse({
    type: ProfileDto
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const profileDto = await this.authService.profile(req.user.username)
    return profileDto;
  }
}
