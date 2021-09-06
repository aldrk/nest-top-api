import { Controller, HttpCode, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { JwtAuthGuard } from "../auth/guards/jwt.guard"
import { FileElementResponse } from "./dto/file-element.response"
import { FilesService } from "./files.service"

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {
  }

  @Post("upload")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("files"))
  @HttpCode(200)
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileElementResponse[]> {
    return this.filesService.saveFiles([file])
  }
}