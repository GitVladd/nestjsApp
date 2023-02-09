import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from './users/users.module';
import {User} from './users/users.model';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({ envFilePath: '.env' }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User],
            autoLoadModels: true
        }), UsersModule, AuthModule,
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: process.env.MAILER_HOST,
                    secure:false,
                    port:587,
                    auth: {
                        user: process.env.MAILER_USER,
                        pass: process.env.MAILER_PASS,
                    }
                },
                defaults: {
                    from: process.env.MAILER_EMAILADDRESS,
                },
                //   template: {
                //     dir: __dirname + '/templates',
                //     adapter: new PugAdapter(),
                //     options: {
                //       strict: true,
                //     },
                //   },
            }),
        })]
})
export class AppModule { }