import { Controller, UseGuards, UsePipes } from '@nestjs/common';
import { Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Body, Req } from '@nestjs/common/decorators/http/route-params.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { ApiBearerAuth, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger/dist';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserAvatarDto } from '../dto/update-user-avatar.dto';
import { UpdateUserEmailDto } from '../dto/update-user-email.dto';
import { UpdateUserPasswordDto } from '../dto/update-user-password.dto';
import { UsersService } from './users.service';


@ApiTags("User")
@Controller('user')
export class UsersController {

    constructor(private usersService: UsersService) { }

    // @ApiOperation({ summary: "Create new user" })
    // @ApiResponse({ status: 200, type: User })
    // @Post()
    // create(@Body() userDto: CreateUserDto) {
    //     return this.usersService.createUser(userDto);
    // }

    @ApiOperation({ summary: "Update user avatar. Needs valid JWT token" })
    @ApiResponse({ status: 200, type: String })
    @ApiBearerAuth('Authorization')
    @ApiHeader({
        name: 'Authorization',
        description: 'Auth token',
    })
    @UseGuards(JwtAuthGuard)
    @Put("/avatar")
    changeAvatar(@Body() updAvatarDto: UpdateUserAvatarDto, @Req() request) {
        return this.usersService.updateUserAvatar(request.user.id, updAvatarDto)
    }

    //TO DO: Add verification for new email
    // @ApiOperation({ summary: "Update user email. Needs valid JWT token" })
    // @ApiResponse({ status: 200, type: String })
    // @ApiBearerAuth('Authorization')
    // @ApiHeader({
    //     name: 'Authorization',
    //     description: 'Auth token',
    // })
    // @UseGuards(JwtAuthGuard)
    // @Put("/email")
    // changeEmail(@Body() updEmailDto: UpdateUserEmailDto, @Req() request) {
    //     return this.usersService.updateUserEmail(request.user.id, updEmailDto)
    // }

    @ApiOperation({ summary: "Update user password. Needs valid JWT token" })
    @ApiResponse({ status: 200, type: String })
    @ApiBearerAuth('Authorization')
    @ApiHeader({
        name: 'Authorization',
        description: 'Auth token',
    })
    @UseGuards(JwtAuthGuard)
    @Put("/password")
    changePassword(@Body() updPasswordDto: UpdateUserPasswordDto, @Req() request) {
        return this.usersService.updateUserPassword(request.user.id, updPasswordDto)
    }

}

