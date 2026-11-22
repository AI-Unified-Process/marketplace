import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { GuestsModule } from './guests/guests.module.js';

@Module({
  imports: [DatabaseModule, GuestsModule],
})
export class AppModule {}
