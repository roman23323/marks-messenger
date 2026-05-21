import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() authDto: AuthDto) {
        const { username, password } = authDto;
        await this.authService.createUser(username, password);
        console.log("Запрос на обработан на экземпляре с ID:", process.env.HOSTNAME);
        return this.authService.signIn(username, password);
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    signIn(@Body() authDto: AuthDto) {
        const { username, password } = authDto;
        return this.authService.signIn(username, password);
    }
}
