import { IsDateString, IsInt, IsString } from 'class-validator';

export class InvoiceDto {
  @IsInt()
  id: number;

  @IsDateString()
  issue_date: string;

  @IsDateString()
  purchase_date: string;

  @IsString()
  supplier: string;

  @IsString()
  customer: string;

  @IsString({ each: true })
  products: string;

  @IsInt()
  net_price: number;

  @IsInt()
  tax: number;

  @IsInt()
  total_price: number;
}
