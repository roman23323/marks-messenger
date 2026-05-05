import { IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
    @IsString({ message: "Имя пользователя должно быть строкой" })
    @IsNotEmpty({ message: "Имя пользователя не должно быть пустым" })
    username: string;

    @IsString({ message: "Пароль должен быть строкой" })
    @IsNotEmpty({ message: "Пароль не должен быть пустым" })
    password: string;
}