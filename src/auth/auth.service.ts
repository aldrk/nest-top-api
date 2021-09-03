import { Injectable } from '@nestjs/common';
import { UserDto } from "./dto/user-dto"
import { InjectModel } from "nestjs-typegoose"
import { UserModel } from "./user.model"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { genSaltSync, hashSync } from "bcryptjs"

@Injectable()
export class AuthService {
  constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>) {
  }

  async createUser(dto: UserDto) {
    const salt = genSaltSync(10)

    const newUser = new this.userModel({
      email: dto.login,
      passwordHash: hashSync(dto.password, salt)
    })

    return newUser.save()
  }

  async findUser(login: string) {
    return this.userModel.findOne(({ login })).exec()
  }
}