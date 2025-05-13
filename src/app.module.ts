import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { PostTagModule } from './post-tag/post-tag.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { CepModule } from './external/cep/cep.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UserModule,
    PostModule,
    AuthModule,
    PostTagModule,
    PokemonModule,
    CepModule,
  ],
})
export class AppModule {}
