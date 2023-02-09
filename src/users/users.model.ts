import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table } from "sequelize-typescript";

interface UserCreationAttributes{
    email:string;
    password:string;
}


@Table({ tableName: 'users' })
export class User extends Model<User,UserCreationAttributes>{
    @ApiProperty({example:'1', description:"Unique ID"})
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({example:'user@example.com', description:"User`s email"})
    @Column({ type: DataType.STRING, unique: true, allowNull:false})
    email: string;

    @ApiProperty({example:'false', description:"Is email verified"})
    @Column({ type: DataType.BOOLEAN,  defaultValue: false})
    isEmailConfirmed: boolean;

    @ApiProperty({example:'3875034e17855bac03a3cc9e107b1d28a9b44313d381c3335588525b4e70b55b', description:"User`s  hashed password"})
    @Column({ type: DataType.STRING, allowNull:false})
    password: string;

    @ApiProperty({example:'null', description:"User`s avatar URL. Initially empty (null)"})
    @Column({ type: DataType.STRING})
    avatarURL:string;
}

/*
Many-to-many
ex.
@BelongsToMany(() => Role, () => UserRoles)
roles:Role[];

*/