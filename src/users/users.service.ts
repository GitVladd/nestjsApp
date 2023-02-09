import { Injectable } from '@nestjs/common';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserAvatarDto } from '../dto/update-user-avatar.dto';
import { UpdateUserEmailDto } from '../dto/update-user-email.dto';
import { UpdateUserPasswordDto } from '../dto/update-user-password.dto';
import { User } from './users.model';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User) { }

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto);
        return user;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        return user;
    }

    async updateUserAvatar(userId: number, dto: UpdateUserAvatarDto) {
        const user = await this.userRepository.findByPk(userId);
        user.avatarURL = dto.avatarURL;
        await user.save();
        return { result: `Avatar has been successfully changed. New avatar URL is ${dto.avatarURL}` }
    }

    //TO DO: Add sending verification letter for new email
    // async updateUserEmail(userId: number, dto: UpdateUserEmailDto) {
    //     const user = await this.userRepository.findByPk(userId);
    //     user.email = dto.email;
    //     await user.save();
    //     return { result: `Email has been successfully changed. New email is ${dto.email}` }
        
    // }
    async updateUserPassword(userId: number, dto: UpdateUserPasswordDto) {

        if (dto.newPassword1 !== dto.newPassword2) {
            throw new ForbiddenException({ message: "New Passwords don`t match" })
        }

        const user = await this.userRepository.findByPk(userId);

        const passwordEquals = await bcrypt.compare(dto.prevPassword, user.password);;
        if (!passwordEquals) throw new UnauthorizedException({ message: 'Incorrect old password' });

        const hashPassword: string = await bcrypt.hash(String(dto.newPassword1), 5);

        user.password = hashPassword;
        await user.save();

        return { result: "Password has been successfully changed" }
    }

    async activateAccount(receivedUser : User){
        const user = await this.userRepository.findByPk(receivedUser.id);
        if(user == undefined){
            return {result:"Invalid token. Incorrect user Id"};
        }
        if(user.email != receivedUser.email){
            return {result:"Invalid token. Incorrect email"};
        }

        if(user.isEmailConfirmed){
            return {result:"This account is already activated"};
        }

        user.isEmailConfirmed = true;
        await user.save();

        return {result:"You have successfully activated account. Now you can try to login"};
    }

    async isActivated(receivedUser : User) : Promise<boolean>{
        const user = await this.userRepository.findByPk(receivedUser.id);
        if(user.isEmailConfirmed){
            return true;
        }
        return false;
    }

}
