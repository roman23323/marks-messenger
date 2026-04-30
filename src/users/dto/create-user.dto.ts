import { IsString, MaxLength, MinLength } from "class-validator"

export class CreateUserDto {
    @IsString({ message: "Имя пользователя должно быть строкой" })
    @MaxLength(20, { message: "Длина имени пользователя не более 20 символов" })
    @MinLength(3, { message: "Длина имени пользователя не менее 3 символов" })
    userName: string;

    @IsString({ message: "Пароль пользователя должен быть строкой" })
    @MinLength(6, { message: "Длина пароля должна быть не менее 6 символов" })
    @MaxLength(30, { message: "Максимальная длина пароля не более 30 символов"})
    password: string
}