import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length} from "class-validator";

export class UpdateUserPasswordDto {

    @ApiProperty({ example: 'Qwerty123!', description: "Old user password. Minimum length 8, Maximum length 16" })
    @IsString({ message: "Password should be string type" })
    @Length(8, 16, { message: "Minimum length 8, Maximum length 16" })
    readonly prevPassword: string;
    
    @ApiProperty({ example: 'Qwerty12345!', description: "New user password. Minimum length 8, Maximum length 16" })
    @IsString({ message: "Password should be string type" })
    @Length(8, 16, { message: "Minimum length 8, Maximum length 16" })
    readonly newPassword1: string;

    @ApiProperty({ example: 'Qwerty12345!', description: "Verify new user password. Minimum length 8, Maximum length 16" })
    @IsString({ message: "Password should be string type" })
    @Length(8, 16, { message: "Minimum length 8, Maximum length 16" })
    readonly newPassword2: string;
}