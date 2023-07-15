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

32- Criar um arquivo na raiz docker-composse.yml

      version: '3'

      services:
            api-pg:
            image: bitnami/postgresql
            ports:
                  - 5432:5432
            environment:
                  - POSTGRESQL_USERNAME=docker
                  - POSTGRESQL_PASSWORD=docker
                  - POSTGRESQL_DATABASE=api 

33 - No console para rodar o docker

      docker composse up -d   (create)
      docker compose down     (delete)

      docker compose stop     (stop)

34- Criar mais tabelas no schema do prisma (models)

      model User {
      id String @id @default(uuid())
        name String
        email String @unique
        password_hash String
        created_at DateTime @default(now())

      @@map("users")
      }

      model CheckIn {
        id String @id @default(uuid())
        created_at DateTime @default(now())
        validated_at DateTime?

      @@map("check_ins")
      }

      model Gym {
        id String @id @default(uuid())
        title String
        description String?
        phone String?
        latitude Decimal
        longitude Decimal

      @@map("gyms")
      }

35- Add relacionamentos entre tabelas no schema

      model User {
        id            String    @id @default(uuid())
        name          String
        email         String    @unique
        password_hash String
        created_at    DateTime  @default(now())

        checkIns      CheckIn[]

        @@map("users")
      }

      model CheckIn {
        id           String    @id @default(uuid())
        created_at   DateTime  @default(now())
        validated_at DateTime?

        user    User   @relation(fields: [user_id], references: [id])
        user_id String

        gym   Gym    @relation(fields: [gym_id], references: [id])
        gym_id String

        @@map("check_ins")
      }

      model Gym {
        id          String    @id @default(uuid())
        title       String
        description String?
        phone       String?
        latitude    Decimal
        longitude   Decimal

        checkIns     CheckIn[]

        @@map("gyms")
      }

36- Criar pasta lib + prisma.ts para separar execução do banco de dados e requisições e habilitar logs do prisma somente em dev

      import { env } from '@/env'
      import { PrismaClient } from '@prisma/client'

      export const prisma = new PrismaClient({
        log: env.NODE_ENV === 'dev' ? ['query'] : [],
      })

37- Criar pasta http + controllers para separar arquivos de requisição e criar register.ts com o código:

      import { FastifyRequest, FastifyReply } from 'fastify'
      import { prisma } from '@/lib/prisma'
      import { z } from 'zod'

      export async function register(req: FastifyRequest, res: FastifyReply) {
        const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
      })

        const { name, email, password } = registerBodySchema.parse(req.body)

        await prisma.user.create({
          data: {
            name,
            email,
            password_hash: password,
          },
        })

        return res.status(201).send()
      }

38- Criar o arquivo routes.ts em http para separar melhor as rotas do app e mudar o app.ts

routes.ts: 

      import { FastifyInstance } from 'fastify'
      import { register } from './register'

      export async function appRoutes(app: FastifyInstance) {
        app.post('/users', register)
      }

app.ts:

      import fastify from 'fastify'
      import { appRoutes } from './http/routes'

      export const app = fastify()

      app.register(appRoutes)

39- Instalar o bcrypt e o @types/bcrypt para criptografar as senhas criadas. O número 6 como segundo parametro indica quantos rounds vão ser executados com a senha (6 é o ideal). Depois adicionar a funcionalidade ao register.ts e deixar só password_hash no await

      npm i bcrypt @types/bcrypt

register.ts: 

      const password_hash = await hash(password, 3)

40- Aproveitar e criar uma verificação se já existe o email na hora de criar o usuário

      const userWithSameEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (userWithSameEmail) {
        return res.status(409).send('This email is already')
      }

41- Criar na pasta src uma pasta use-cases para deixar separado a criação de usuários das requisições http

register.ts (use-case)

      import { prisma } from '@/lib/prisma'
      import { hash } from 'bcryptjs'

      interface RegisterUseCaseRequest {
        name: string
        email: string
        password: string
      }

      export async function registerUseCase({
        name,
        email,
        password,
      }: RegisterUseCaseRequest) {
            const password_hash = await hash(password, 3)

            const userWithSameEmail = await prisma.user.findUnique({
              where: {
                  email,
              },
            })

            if (userWithSameEmail) {
              throw new Error('This email is already.')
            }

            await prisma.user.create({
              data: {
                  name,
                  email,
                  password_hash,
              },
            })
      }

register.ts (controllers)

      try {
        await registerUseCase({
            name,
            email,
            password,
        })
      } catch (err) {
        return res.status(409).send()
      }

42- Separar toda logística do prisma em um arquivo separado, para generalizar o código (Design Patters), se for preciso um dia trocar o ORM do app (Prisma).
Criar pasta repositories em src e o arquivo prisma-users-repository.ts

      import { prisma } from '@/lib/prisma'
      import { Prisma } from '@prisma/client'

      export class PrismaUsersRepository {
        async create(data: Prisma.UserCreateInput) {
          const user = await prisma.user.create({
            data,
          })

          return user
        }
      }

register.ts (controllers) adicionar a instancia do prisma

      const prismaUsersRepository = new PrismaUsersRepository()

      await prismaUsersRepository.create({
        name,
        email,
        password_hash,
      })

43- Instalar o vitest e as configs (ferramenta de testes e o pacotes para entender as importações com @)

      npm i vitest vite-tsconfig-paths -D

44- Começar criar os tests

45- 
