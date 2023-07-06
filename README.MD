1- Cria a pasta e abre no vscode

2- No Console

    npm init -y (criar package.json)

2.1- criar um arquivo .npmrc

      save--exact=true


3- Cria a pasta 'src' e o arquivo 'server.ts'

4- No Console

     npm i typescript @types/node tsx tsup -D 
  
  (tsx pro node entender typescript && tsup pra converter o app pra js em produção)

5- No Console

    npx tsc --init

6- Mudar o target do tsconfig para 'es2020'

7- No Console

    npm i fastify

8- Criar o app.ts (dividir o fastify)

9- No app fazer:

    import fastify from 'fastify'

    export const app = fastify()

10- No server fazer:

    import { app } from './app'

    app.listen({
      host: '0.0.0.0',
      port: 3333,
    }).then(() =>{
      console.log('HTTP Server Running')
    })

  (host é para facilitar e vitar bugs na hora do front consumir a api)

11- Criar o .gitignore e add node_modules e build

12- Criar os scripts para iniciar o server

      "dev": "tsx watch src/server.ts",
      "start": "node build/server.js",
      "build": "tsup src --out-dir build"

13- criar um arquivo .env e .env.example

      NODE_ENV=dev

14- Instalar biblioteca dotenv pra carregar os arquivos no projeto

      npm i dotenv

14.1 instalar biblioteca zod

      npm i zod

15- criar em src uma pasta env e nela criar um index.ts

      import 'dotenv/config'
      import { z } from 'zod'

      // process.env: {NODE_ENV: 'dev, ...}

      const envSchema = z.object({
        NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
        PORT: z.coerce.number().default(3333),
      })

      const _env = envSchema.safeParse(process.env)

      if (_env.success === false) {
        console.error('Invalid environment variables', _env.error.format())

        throw new Error('Invalid environment variables.')
      }

      export const env = _env.data

16- Mudar o server em port para:

      port: env.PORT,

17- configurar o eslint 

      npm i eslint @rocketseat/eslint-config -D

18- parar criar minha config

     npx eslint --init

19- Criar o arquivo .eslintrc.json na raiz

     {
       "extends": [
        "@rocketseat/eslint-config/node"
       ]
     }

20- Criar Alias for imports (simplificar imports - encurtar)

20.1- Remover comentário do "baseUrl e paths"

      "paths": {
        "@/*": ["./src/*"]
      },

21- Instalar prisma 
      
      npm i prisma -D
      npx primsa init

22- No schema.prisma acrescentar

      model User {
            id String @id @default(uuid())
            name String
            email String @unique

            @@map("users")
      }

22.1 - uuid -> gerador de id aleatório e único
      @@map -> renomear a tabela (padrão é o User)

23- No console ... tipar a tabela criada (model User)

      npx prisma generate

24- No Console usar

      npm i @prisma/client

25- Mudar no app.ts

      import fastify from 'fastify'
      import { PrismaClient } from '@prisma/client'

      export const app = fastify()

      const prisma = new PrismaClient()

      prisma.user.create({
        data: {
          name: 'Jhon Doe',
          email: 'jhondoe@gmail.com',
        },
      })

26- Acessar o banco 

      npx prisma migrate dev
      npx prisma studio

27- Criar um app(container) com docker usando bitnami/postgres com usuário e senha e porta padrão

      docker run --name api-pg -e POSTGRESQL_USERNAME=docker -e POSTGRESQL_PASSWORD=docker -e POSTGRESQL_DATABASE=api -p 5432:5432 bitnami/postgresql

28- start e desligar o server do docker

      docker start api-pg
      docker stop api-pg

      docker logs api-pg -f

      docker ps

29- no .env mudar o DATABASE_URL

      DATABASE_URL="postgresql://docker:docker@localhost:5432/api?schema=public"

30- Atualizar o banco de dados com as migrations

      npx prisma migrate dev

31- para ver as tabelas pelo nav

      npx prisma studio

32- 
