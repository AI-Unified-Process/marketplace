import { Global, Module } from '@nestjs/common';
import { drizzleProvider } from './drizzle.provider.js';

@Global()
@Module({
  providers: [drizzleProvider],
  exports: [drizzleProvider],
})
export class DatabaseModule {}
