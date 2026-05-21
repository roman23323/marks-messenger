import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() authDto: AuthDto) {
        const { username, password } = authDto;
        await this.authService.createUser(username, password);
        return this.authService.signIn(username, password);
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    signIn(@Body() authDto: AuthDto) {
        const { username, password } = authDto;
        this.logger.log(`Вход в аккаунт пользователя ${authDto.username}`);
        return this.authService.signIn(username, password);
    }
}
