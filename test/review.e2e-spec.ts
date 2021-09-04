import { Test, TestingModule } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import * as request from "supertest"
import { AppModule } from "../src/app.module"
import { CreateReviewDto } from "../src/review/dto/create-review.dto"
import { disconnect, Types } from "mongoose"
import { REVIEW_NOT_FOUND } from "../src/review/review.constants"
import { UserDto } from "../src/auth/dto/user-dto"

const productId = new Types.ObjectId().toHexString()
const fakeProductId = new Types.ObjectId().toHexString()
const loginDto: UserDto = {
  email: "test@test.ru",
  password: "12345"
}

const testDto: CreateReviewDto = {
  name: "Тест",
  title: "Заголовок",
  description: "Описание тестов",
  rating: 5,
  productId,
}

describe("AppController (e2e)", () => {
  let app: INestApplication
  let createdId: string
  let token: string

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    const { body } = await request(app.getHttpServer())
      .post("/auth/login")
      .send(loginDto)

    token = body.access_token
  })

  it("/review/create (POST) - success", async () => {
    return request(app.getHttpServer())
      .post("/review/create")
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id

        expect(createdId).toBeDefined()
      })
  })

  it("/review/create (POST) - success",  () => {
    return request(app.getHttpServer())
      .post("/review/create")
      .send({ ...testDto, rating: 0 })
      .expect(400)
  })

  it("/review/byProduct/:productId (GET) - success", async () => {
    return request(app.getHttpServer())
      .get(`/review/byProduct/${productId}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        const findReviewId = body[0]._id

        expect(body).toHaveLength(1)
        expect(findReviewId).toEqual(createdId)
      })
  })

  it("/review/byProduct/:productId (GET) - failure", async () => {
    return request(app.getHttpServer())
      .get(`/review/byProduct/${fakeProductId}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body).toHaveLength(0)
      })
  })

  it("/review/:id (DELETE) - success", async () => {
    return request(app.getHttpServer())
      .delete(`/review/${createdId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        const deletedTestId = body._id

        expect(deletedTestId).toEqual(createdId)
      })
  })

  it("/review/:id (DELETE) - failure", async () => {
    return request(app.getHttpServer())
      .delete(`/review/${fakeProductId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404, {
        statusCode: 404,
        message: REVIEW_NOT_FOUND
      })
  })

  afterAll(() => {
    disconnect()
  })
})