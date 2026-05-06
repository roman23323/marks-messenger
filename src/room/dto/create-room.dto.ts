import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateRoomDto {
    @IsString({ message: 'Название комнаты должно быть строкой' })
    @IsNotEmpty({ message: 'Навание комнаты не должно быть пустым' })
    @MinLength(5, { message: 'Минимальная длина названия комнаты - 5 символов' })
    @MaxLength(50, { message: 'Максимальная длина названия комнаты - 50 символов' })
    name: string;
}