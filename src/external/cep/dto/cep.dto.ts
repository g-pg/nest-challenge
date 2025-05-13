import { IsString, Matches } from 'class-validator';

export class CepDTO {
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/, {
    message: 'CEP must be in format 12345678 or 12345-678',
  })
  cep: string;
}
