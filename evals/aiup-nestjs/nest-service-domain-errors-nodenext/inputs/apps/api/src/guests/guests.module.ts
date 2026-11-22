import { Module } from '@nestjs/common';
import { GuestsRepository } from './guests.repository.js';

@Module({
  providers: [GuestsRepository],
})
export class GuestsModule {}
