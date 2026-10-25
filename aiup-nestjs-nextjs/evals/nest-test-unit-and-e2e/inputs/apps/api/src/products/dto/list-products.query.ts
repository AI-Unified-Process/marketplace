import { IsOptional, IsString } from 'class-validator';

export class ListProductsQuery {
  @IsOptional()
  @IsString()
  category?: string;
}
