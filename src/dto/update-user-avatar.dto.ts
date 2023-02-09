import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUrl } from "class-validator";

export class UpdateUserAvatarDto{

    @ApiProperty({example:'image.com/avatar1', description:"Avatar URL."})
    @IsString({message:"Url should be string type"})
    @IsUrl(undefined, { message: 'URL is not valid.' })
    readonly avatarURL:string;
}