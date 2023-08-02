import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController, UserController } from './controllers';
import { AuthService, UserService } from './services';
import { JwtStrategy } from './strategies';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User } from './entities';

@Module({
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService, JwtStrategy, CloudinaryService],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: () => (
        {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: process.env.JWT_EXPIRESIN
          }
        }
      )
    })
  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule { }
