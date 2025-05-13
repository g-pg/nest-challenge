## Projeto

CRUD simples de gerenciamento de posts com tags e metadata. Além disso, a aplicação contém:

- Wrapper para uso interno da ViaCep.
- Wrapper exposto da PokeAPI para busca de Pokemon por nome.

### Funcionamento básico

A utilização dos recursos foi documentada com Swagger (acessível em `<host>/api`).

A aplicação será inicializada com um user `admin` com as credenciais assinaladas nas variáveis de ambiente.
Enviar as credenciais para `/auth/login` retornará um Bearer token, que é necessário para determinadas operações.

Há três níveis de usuários:

- `admin`: podem criar e editar quaisquer posts, bem como criar tags.
- `writer`: podem criar e editar os próprios posts.
- `reader`: podem ler quaisquer posts.

Qualquer usuário pode criar uma conta enviando um POST a `/user`, mas o seu role será automaticamente `reader`.
Um usuário admin pode editar o role de outros usuários.

## Setup

- Instalar as dependências da aplicação:
  ```bash
  $ pnpm install
  ```
- Criar um `.env` na pasta raiz do projeto, conforme o `.env.example`.
- Rodar `docker compose up -d` na raiz do projeto para subir uma imagem do Postgres.
  - Opcional: remover volume do compose para evitar conflito com outros volumes.
- Compilar e rodar o projeto:

  ```bash
  # production
  pnpm build
  pnmp start:prod

  # development
  pnpm start:dev
  ```

## Requisitos com comentários

- [x] Utilizar Nest.JS (https://docs.nestjs.com/)
- [x] Criar uma API (CRUD) completa.
- [x] Implementar relações entre entidades: 1x1, 1xN, NxN.
  - 1x1: Posts x Metadata
  - 1xN: User x Posts
  - NxN: Posts x PostTags
- [x] Realizar o mapeamento e isolamento de Entidades e DTOs.
- [x] Seguir o padrão MVC (ou arquitetura em camadas similar).
- [x] Validação de permissões em middlewares/decorators ou na camada de controller.
- [x] Lógica e regras de negócio nos serviços (Services).
- [x] Conexões e operações com banco de dados na camada de repositórios (Repositories).
- [x] Subir um banco de dados local utilizando Docker e conectar ao backend.
- [x] Fornecer um README.md claro com instruções para iniciar o projeto e o banco de dados, além de quaisquer outros comentários relevantes.
- [x] Documentar a API utilizando Swagger (OpenAPI).
- [x] Implementar gerenciamento de permissões e aplicar validação via middleware/decorators.
- [x] Toda entrada de DTO via API deve ser validada e tratada (atributo a atributo, tanto atributos presentes quanto tipos).
- [x] Nenhuma entidade do banco de dados deve transitar para fora da camada de repositório (ex: para serviços ou controllers).

  - Uma classe <Entity>Repository foi criada para cada entidade como um wrapper ao Repository do TypeORM. Esse repositório retorna
    uma entidade de domínio (não entidades do banco) ou DTOs para os services.
  - As entidades do banco foram chamadas de `schemas` na aplicação e estão isoladas nos repositórios.

- [x] Realizar uma integração externa para consulta de CEP e disponibilizá-la como um serviço interno na API.
- [x] Disponibilizar um serviço de pesquisa à PokeAPI com capacidade de filtros e paginação.

  - Um query param `search` foi aplicado no wrapper da PokeAPI, possibilitando pesquisas por nome e retornando N resultados.
