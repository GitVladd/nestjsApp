import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { BadRequestException, HttpException, UnauthorizedException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.model';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifyTokenDto } from 'src/dto/verify-token.dto';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
        private jwtService: JwtService,
        private mailerService: MailerService) { }

    async login(userDto: CreateUserDto) {
        const user = await this.validateUserLogin(userDto);

        const isActivated = await this.userService.isActivated(user);

        if(!isActivated){
            return {result:"You can`t login because your account is not activated. Verification letter was sent on your email when you registered, follow attached link to activate your account"};
        }
        return this.generateToken(user);

    }

    async register(userDto: CreateUserDto) {
        const userExist = await this.userService.getUserByEmail(userDto.email);
        if (userExist) throw new HttpException(`User ${userDto.email} is already exist`, HttpStatus.BAD_REQUEST)

        const hashPassword: string = await bcrypt.hash(String(userDto.password), 5);

        const newUser = await this.userService.createUser({ ...userDto, password: hashPassword });

        const tokenStr = (await this.generateToken(newUser)).token;

        this.sendVerificationEmail(newUser.email, tokenStr);

        //FOR TEST
        const url = `${process.env.SEND_EMAIL_URL_ADDRESS}${tokenStr}`;

        //я использовал бесплатный сервис для smtp, поэтому добавил поля additionalInfo и validationLink в response, т.к. приходилось долго ждать сообщение.
        return { result: "You should receive email with validation link to activate your account. You have 24h to activate it.", 
        additionalInfo: `For testing purpose verification link is attached to this reposnse`,
         validationLink: url};
    }

    public async activateAccount(token:VerifyTokenDto){
        const receivedUser : User = await this.verifyToken(token.token);
        
        const result = await this.userService.activateAccount(receivedUser);

        return result;
    }

    private async generateToken(user: User) {
        const payload = { email: user.email, id: user.id };

        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async verifyToken(token:string) {
        const user = this.jwtService.verify(token);
        return user;
    }

    private async validateUserLogin(userDto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);

        if(user == undefined){
            throw new UnauthorizedException({ message: 'Incorrect email' });
        }

 
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }

        throw new UnauthorizedException({ message: 'Incorrect password' });
    }

    private sendVerificationEmail(email:string, token:string): void {

        const url = `${process.env.SEND_EMAIL_URL_ADDRESS}${token}`;

        const text = `Welcome to the application. To confirm the email address, click here: ${url}`;
        console.log(url);

        this.mailerService
            .sendMail({
                to: `${email}`, // list of receivers
                subject: 'Email Verification', // Subject line
                text: `${text}`, // plaintext body
                html: '<b>welcome</b>', // HTML body content
            })
            .then((res) => { console.log(res) })
            .catch((err) => { console.log(err); throw new BadRequestException({message: `Incorrect email address. Read more details below \n\n ${err}`, }); });
    }


} 