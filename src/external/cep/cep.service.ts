import { Injectable } from '@nestjs/common';
import { ViaCepResponse } from './types/via-cep.types';
import { CepDTO } from './dto/cep.dto';

@Injectable()
export class CepService {
  private readonly viaCepUrl = 'https://viacep.com.br/ws/';

  async getCepInfo(dto: CepDTO): Promise<ViaCepResponse> {
    const response = await fetch(`${this.viaCepUrl}/${dto.cep}/json/`);
    if (!response.ok) {
      throw new Error('Error fetching address');
    }

    const data = await response.json();
    return data;
  }
}
