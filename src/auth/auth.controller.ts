import { Controller } from '@nestjs/common';
import { Body, Get, Param, Post } from '@nestjs/common/decorators';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { VerifyTokenDto } from 'src/dto/verify-token.dto';
import { AuthService } from './auth.service';

@ApiTags("Authorization")
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){
        
    }

    @ApiOperation({ summary: "Login user" })
    @ApiResponse({ status: 200, type: String, description:"Sends JWT token if user successfully logged in"})
    @Post('/login')
    login(@Body() userDto: CreateUserDto){
        return this.authService.login(userDto);
    }

    @ApiOperation({ summary: "Register new user" })
    @ApiResponse({ status: 200, type: String, description:"Sends JWT token if user successfully registered. Makes user logged in." })
    @Post('/register')
    register(@Body() userDto: CreateUserDto){
        return this.authService.register(userDto);
    }

    @ApiOperation({ summary: "Activate account" })
    @ApiResponse({ status: 200, type: String, description:"Veifies email" })
    @Get('/verify/:token')
    activateAcount(@Param() token : VerifyTokenDto){
        return this.authService.activateAccount(token);
    }
}