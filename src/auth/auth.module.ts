import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { StorageService } from '../storage/storage.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, StorageService],
  exports: [AuthService],
})
export class AuthModule {}
