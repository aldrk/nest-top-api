import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from "@nestjs/common"
import { UserDto } from "./dto/user-dto"
import { AuthService } from "./auth.service"
import { USER_ALREADY_EXISTS } from "./auth.constants"

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @UsePipes(new ValidationPipe())
  @Post("register")
  async register(@Body() dto: UserDto) {
    const oldUser = await this.authService.findUser(dto.login)

    if (oldUser) return new BadRequestException(USER_ALREADY_EXISTS)

    return this.authService.createUser(dto)
  }

  @HttpCode(200)
  @Post("login")
  async login(@Body() dto: UserDto) {

  }
}