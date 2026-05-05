import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async createUser(username: string, password: string) {
        const passwordHash = await this.hashPassword(password);
        await this.prisma.user.create({
            data: {
                username,
                password: passwordHash,
            }
        });
    }

    async signIn(username: string, password: string) {
        const user = await this.prisma.user.findFirst({ where: { username }});
        if (!user) {
            throw new UnauthorizedException('Неверное имя пользователя или пароль');
        }

        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            throw new UnauthorizedException('Неверное имя пользователя или пароль');
        }

        const payload = { sub: user.id };
        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }

    async hashPassword (password: string) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        return passwordHash
    }
}
