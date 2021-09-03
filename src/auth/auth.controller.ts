import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from "@nestjs/common"
import { UserDto } from "./dto/user-dto"
import { AuthService } from "./auth.service"
import { USER_ALREADY_EXISTS_ERROR } from "./auth.constants"

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @UsePipes(new ValidationPipe())
  @Post("register")
  async register(@Body() dto: UserDto) {
    const oldUser = await this.authService.findUser(dto.email)

    if (oldUser) return new BadRequestException(USER_ALREADY_EXISTS_ERROR)

    return this.authService.createUser(dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("login")
  async login(@Body() { email, password }: UserDto) {
    const user = await this.authService.validateUser(email, password)

    return this.authService.login(user.email)
  }

}