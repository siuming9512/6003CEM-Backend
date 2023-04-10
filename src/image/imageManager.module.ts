import { Module } from "@nestjs/common";
import { ImageManager } from "./imageManager.service";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [ConfigModule],
    providers: [ImageManager]
})
export class ImageManagerModule{}