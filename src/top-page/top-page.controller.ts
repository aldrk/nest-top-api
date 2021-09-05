import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post, UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common"
import { TopPageModel } from "./top-page.model"
import { FindTopPageDto } from "./dto/find-top-page.dto"
import { CreateTopPageDto } from "./dto/create-top-page.dto"
import { TopPageService } from "./top-page.service"
import { PAGE_NOT_FOUND_ERROR } from "./top-page.constants"
import { IdValidationPipe } from "../pipes/id-validation.pipe"
import { JwtAuthGuard } from "../auth/guards/jwt.guard"

@Controller("top-page")
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post("create")
  async create(@Body() dto: CreateTopPageDto) {
    return await this.topPageService.create(dto)
  }

  @Get(":id")
  async get(@Param("id", IdValidationPipe) id: string) {
    const page = await this.topPageService.findById(id)

    if (!page) throw new NotFoundException(PAGE_NOT_FOUND_ERROR)

    return page
  }

  @Get("byAlias/:alias")
  async getByAlias(@Param("alias") alias: string) {
    const page = await this.topPageService.findByAlias(alias)

    if (!page) throw new NotFoundException(PAGE_NOT_FOUND_ERROR)

    return page
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(@Param("id", IdValidationPipe) id: string, @Body() dto: TopPageModel) {
    const page = await this.topPageService.update(id, dto)

    if (!page) throw new NotFoundException(PAGE_NOT_FOUND_ERROR)

    return page
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async delete(@Param("id", IdValidationPipe) id: string) {
    const page = await this.topPageService.delete(id)

    if (!page) throw new NotFoundException(PAGE_NOT_FOUND_ERROR)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("find")
  async find(@Body() dto: FindTopPageDto) {
    return await this.topPageService.findByFirstCategory(dto.firstCategory)
  }

  @Get("textSearch/:text")
  async textSearch(@Param('text') text: string) {
    return await this.topPageService.findByText(text)
  }
}