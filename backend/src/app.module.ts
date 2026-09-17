import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { LobbyGateway } from './lobby/lobby.gateway.js';
import { UserModule } from './user/user.module.js';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService, LobbyGateway],
})
export class AppModule {}
