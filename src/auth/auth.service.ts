import { Injectable, UnauthorizedException } from "@nestjs/common"
import { UserDto } from "./dto/user-dto"
import { InjectModel } from "nestjs-typegoose"
import { UserModel } from "./user.model"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { compare, genSalt, hash } from "bcryptjs"
import { USER_NOT_FOUND_ERROR, USER_WRONG_AUTH_DATA_ERROR } from "./auth.constants"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
  constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
              private readonly jwtService: JwtService) {
  }

  async createUser(dto: UserDto) {
    const salt = await genSalt(10)

    const newUser = new this.userModel({
      email: dto.email,
      passwordHash: await hash(dto.password, salt),
    })

    return newUser.save()
  }

  async findUser(email: string) {
    return this.userModel.findOne(({ email })).exec()
  }

  async validateUser(email: string, password: string): Promise<Pick<UserModel, "email">> {
    const user = await this.findUser(email)

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR)
    }

    const isCorrectPassword = await compare(password, user.passwordHash)

    if (!isCorrectPassword) {
      throw new UnauthorizedException(USER_WRONG_AUTH_DATA_ERROR)
    }

    return { email: user.email }
  }

  async login(email: string) {
    const payload = { email }

    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }
}