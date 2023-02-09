import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, IsEmail } from "class-validator";

export class CreateUserDto{

    @ApiProperty({example:'user@example.com', description:"User`s email"})
    @IsString({message:"Email should be string type"})
    @IsEmail({}, {message:"Incorrect email"})
    readonly email:string;
s  
    @ApiProperty({example:'Qwerty123!', description:"User`s password. Minimum length 8, Maximum length 16"})
    @IsString({message:"Password should be string type"})
    @Length(8, 16, {message:"Minimum length 8, Maximum length 16"})
    readonly password:string;   
}