import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common"
import { Types } from "mongoose"
import { INCORRECT_ID_ERROR } from "./id-validation.constants"

export class IdValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): any {
    if (metadata.type !== "param") return value

    // @ts-ignore
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(INCORRECT_ID_ERROR)
    }

    return value
  }
}