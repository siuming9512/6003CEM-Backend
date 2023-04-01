import { INestApplication } from "@nestjs/common";
import { createWriteStream, existsSync, rename, renameSync } from "fs";
import { join } from "path";

export class ImageManager {
    #tmpImageFolderPath: string
    #persistenceImageFolderPath: string
    constructor(private app: INestApplication) {
        const basePath = join(__dirname, 'images')

        this.#tmpImageFolderPath = `${basePath}/tmp`;
        this.#persistenceImageFolderPath = `${basePath}/cat`;
    }

    saveTmpImage(fileId: string, buffer: Blob) {
        const ws = createWriteStream(`${this.#tmpImageFolderPath}/${fileId}`)
        ws.write(buffer)
    }

    persistTmpImage(fileId: string) {
        const tmpFile = `${this.#tmpImageFolderPath}/${fileId}`;
        const fileExisted = existsSync(tmpFile)

        if(!fileExisted) throw 'file not exist.'

        const persistenceFile = `${this.#persistenceImageFolderPath}/${fileId}`
        renameSync(tmpFile, persistenceFile)
    }

    async getImageUrl(fileId: string) {
        const hostUrl = this.app.getUrl();

        return `${hostUrl}/${fileId}`;
    }
}