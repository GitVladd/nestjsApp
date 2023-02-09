import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class VerifyTokenDto{

    @ApiProperty({example:'eyJI6IkpXVCJ9.eyJwNTAyOTd9.meFinxYJqwvS0SUA', description:"token"})
    @IsString({message:"Email should be string type"})
    readonly token:string; 
}