import { Controller, Request, Post, UseGuards, Body, HttpCode, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './entities/user.entity';
import { JwtLoginDto } from './dto/jwt-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ProfileDto } from './dto/profile.dto';

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth('defaultBearerAuth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOkResponse({
    type: JwtLoginDto
  })
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<JwtLoginDto> {
    const jwt = await this.authService.login(loginDto.username, loginDto.password);

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
