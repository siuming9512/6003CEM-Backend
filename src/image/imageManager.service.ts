import { BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createWriteStream, existsSync, rename, renameSync, unlink, unlinkSync } from "fs";
import { join, dirname } from "path";

export class ImageManager {
    #tmpImageFolderPath: string
    #persistenceImageFolderPath: string
    constructor(private configService: ConfigService) {
        const basePath = '/Users/off122/SHAPE/VT6003CEM/pet-shelter-api/images'

        this.#tmpImageFolderPath = `${basePath}/tmp`;
        this.#persistenceImageFolderPath = `${basePath}/persistence`;
    }

    saveTmpImage(fileName: string, buffer: Buffer) {
        const ws = createWriteStream(`${this.#tmpImageFolderPath}/${fileName}`)
        ws.write(buffer)
    }

    persistTmpImage(fileName: string) {
        const tmpFile = `${this.#tmpImageFolderPath}/${fileName}`;
        const fileExisted = existsSync(tmpFile)

        if (!fileExisted) throw new BadRequestException('file not exist.')

        const persistenceFile = `${this.#persistenceImageFolderPath}/${fileName}`
        renameSync(tmpFile, persistenceFile)
    }

    deleteImage(fileName: string) {
        if (fileName == '') return;

        const filePath = `${this.#persistenceImageFolderPath}/${fileName}`
        const fileExisted = existsSync(filePath)

        if (!fileExisted) return;
        unlinkSync(filePath)
    }

    async getImageUrl(fileName: string) {
        const hostUrl = "http://localhost:3000";
        const filePath = `${hostUrl}/persistence/${fileName}`;
        return filePath;
    }
}