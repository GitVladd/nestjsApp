import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail} from "class-validator";

export class UpdateUserEmailDto{

    @ApiProperty({example:'user@example.com', description:"New user`s email"})
    @IsString({message:"Email should be string type"})
    @IsEmail({}, {message:"Incorrect email"})
    readonly email:string;
}