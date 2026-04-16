import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class SendMessageDto {
    @IsUUID('4', { message: 'Некорректный формат id комнаты' })
    @IsNotEmpty({ message: 'Идентификатор комнаты обязателен'})
    roomId: string;

    @IsString({ message: 'Сообщение должны быть типа string'})
    @MaxLength(100, { message: 'Сообщение не должно быть большее 100 символов'})
    @IsNotEmpty({ message: 'Сообщение не должно быть пустым' })
    text: string;

    @IsUUID('4', { message: 'Некорректный формат id запроса'})
    @IsNotEmpty({ message: 'Идентификатор запроса обязателен' })
    requestId: string;
}