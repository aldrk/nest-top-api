import { Injectable } from '@nestjs/common';
import { FileElementResponse } from "./dto/file-element.response"
import { format } from "date-fns"
import { path } from "app-root-path"
import { ensureDir, writeFile } from "fs-extra"
import * as sharp from "sharp"
import { Mfile } from "./mfile.class"

@Injectable()
export class FilesService {
  async saveFiles(files: Mfile[]): Promise<FileElementResponse[]> {
    const dateFolder = format(new Date(), "yyyy-MM-dd")
    const uploadFolder = `${path}/uploads/${dateFolder}`
    const res: FileElementResponse[] = []

    await ensureDir(uploadFolder)

    for (const file of files) {
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer)

      res.push({ url: `${dateFolder}/${file.originalname}`, name: file.originalname })
    }

    return res
  }

  convertToWebp(file: Buffer): Promise<Buffer> {
    return sharp(file)
      .webp()
      .toBuffer()
  }
}