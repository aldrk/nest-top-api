import { INestApplication } from "@nestjs/common"
import { UserDto } from "../src/auth/dto/user-dto"
import { Test, TestingModule } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import * as request from "supertest"
import { disconnect } from "mongoose"
import { USER_WRONG_AUTH_DATA_ERROR } from "../src/auth/auth.constants"

const loginDto: UserDto = {
  email: "test@test.ru",
  password: "12345"
}

describe("AuthController (e2e)", () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it("/auth/login (POST) - success", async () => {
    return request(app.getHttpServer())
      .post("/auth/login")
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined()
      })
  })

  it("/auth/login (POST) - failure, wrong password", async () => {
    return request(app.getHttpServer())
      .post("/auth/login")
      .send({...loginDto, password: "wrong"})
      .expect(401, {
        statusCode: 401,
        message: USER_WRONG_AUTH_DATA_ERROR,
        error: 'Unauthorized'
      })
  })

  it("/auth/login (POST) - failure, wrong email", async () => {
    return request(app.getHttpServer())
      .post("/auth/login")
      .send({...loginDto, email: "wrong"})
      .expect(401, {
        statusCode: 401,
        message: 'User not found',
        error: 'Unauthorized'
      })
  })

  afterAll(() => {
    disconnect()
  })
})