# 🎨 AI Paint Advisor

O AI Paint Advisor é um assistente inteligente projetado para ajudar usuários a escolherem a tinta ideal para seus projetos. A solução utiliza Inteligência Artificial para interpretar as necessidades dos usuários, recomendar produtos, gerar simulações visuais e responder a perguntas de forma natural, atuando como um verdadeiro especialista virtual em tintas.

## Sobre o Projeto

A aplicação é composta por dois serviços principais:

- `api-service:` Uma API RESTful responsável pelo CRUD de tintas e usuários, além da autenticação de usuários e RBAC com JWT.
- `ai-service:` Um serviço de IA que utiliza um agente orquestrador colaborativo (LangChain Agents) para responder perguntas sobre tintas e decoração, com base em um catálogo de produtos e prompts especializados. O ai-service é modularizado, com ferramentas e prompts desacoplados para facilitar manutenção e expansão. Também é capaz de gerar imagens realistas de ambientes pintados usando DALL-E.

Ambos os serviços são conteinerizados com Docker para facilitar o desenvolvimento e o deploy.

## Features

- **CRUD de Tintas:** Gerenciamento completo do catálogo de tintas.
- **Gerenciamento de Usuários e Autenticação:** Sistema de criação e autenticação de usuários com JWT e controle de acesso baseado em funções (RBAC).
- **Assistente Inteligente (Chatbot):** Um endpoint de chat que recebe perguntas em linguagem natural e retorna recomendações de tintas, dicas de decoração e simulações visuais de ambientes pintados.
- **Geração de Imagens com DALL-E:** O ai-service pode gerar imagens realistas de ambientes pintados conforme a descrição do usuário, utilizando a ferramenta `image_generator` integrada ao agente LangChain.
- **Agente Orquestrador Colaborativo:** O ai-service utiliza um agente que escolhe dinamicamente entre ferramentas especializadas: uma para perguntas técnicas sobre tintas (RAG), outra para conselhos criativos de decoração e outra para geração de imagens.
- **Busca Semântica com RAG:** Utiliza a técnica de Retrieval-Augmented Generation (RAG) para buscar informações relevantes no catálogo de tintas e fornecer respostas mais precisas.
- **Reindexação Automática:** O ai-service é notificado para reindexar os embeddings das tintas sempre que há uma alteração no catálogo, garantindo que o chatbot tenha sempre as informações mais recentes.
- **Documentação da API com Swagger:** A api-service conta com uma documentação completa e interativa gerada com Swagger (OpenAPI).

## Tecnologias

Este projeto foi construído com as seguintes tecnologias:

API Service (`api-service`):

- Node.js com TypeScript
- Express.js
- Prisma como ORM para interação com o banco de dados
- PostgreSQL como banco de dados relacional
- Zod para validação de schemas
- bcrypt para hashing de senhas
- JWT (JSON Web Token) para autenticação
- Swagger (OpenAPI) para documentação da API

AI Service (`ai-service`):

- Node.js com TypeScript
- Express.js
- LangChain para orquestração do fluxo de IA 
- OpenAI API (gpt-3.5-turbo, text-embedding-3-small, dall-e-2) para o modelo de linguagem, geração de embeddings e imagens
- FAISS (Facebook AI Similarity Search) como Vector Store para a busca de similaridade

Geral:

- Docker e Docker Compose para conteinerização e orquestração dos serviços

## Primeiros Passos

Siga os passos abaixo para executar o projeto em seu ambiente local.

### Pré-requisitos

- Docker
- npm

### Instalação

1. Clone o repositório:

    ```bash
    git clone https://gitlab.com/viniciusmoraesvha/ai-paint-advisor.git
    cd ai-paint-advisor
    ```

2. Configure as variáveis de ambiente:

    Crie o arquivo `.env` dentro de ai-service, api-service e na raiz do projeto, baseando-se nos exemplos abaixo:

    `ai-service/.env`

    ```bash
    # Chave de API da OpenAI (obtenha em https://platform.openai.com/)
    OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

    # Porta padrão do serviço de IA
    PORT=4001

    # URL de conexão com o banco de dados PostgreSQL
    DATABASE_URL=postgresql://postgres:postgres@db:5432/ai-paint-advisor
    ```

    `api-service/.env`

    ```bash
    # URL de conexão com o banco de dados PostgreSQL para ambiente local
    DATABASE_URL=postgresql://postgres:postgres@db:5432/ai-paint-advisor

    # Porta padrão da API
    PORT=4000

    # JWT Secret para autenticação
    # Altere para uma chave secreta, forte e única. Ex.: JWT_SECRET="b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6"
    JWT_SECRET=sua_chave_secreta_access

    # URL do endpoint de reindexação do AI Service (pode incluir host e porta)
    # Exemplo: AI_SERVICE_URL=http://ai-service:4001/reindex
    AI_SERVICE_URL=http://ai:4001/reindex
    ```

    `/.env`
    ```bash
    # URL de conexão com o banco de dados PostgreSQL para ambiente local
    DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai-paint-advisor

    # E-mail e senha do admin para o seed seguro
    ADMIN_EMAIL=admin@exemplo.com
    ADMIN_PASSWORD=Senha@Forte123
    ```

3. Suba os containers com Docker Compose:

    Este comando irá construir as imagens dos serviços e iniciar os containers do `api-service`, `ai-service` e do `banco de dados PostgreSQL`.

    ```bash
    docker compose up --build
    ```
    
    O `api-service` estará disponível em http://localhost:4000 e o `ai-service` em http://localhost:4001.

4. Execute o seed do banco de dados:

    Para popular o banco de dados com os dados iniciais de tintas (carregados a partir do arquivo `Base_de_Dados_de_Tintas_Suvinil.csv`) e com um usuário administrador (definido no `/.env`), execute os seguintes comandos em um novo terminal:

    ```bash
    npm run prisma:generate
    ```

    ```bash
    npm run seed
    ```

    Este comando irá executar o script `prisma/seed` que, por sua vez, utiliza os scripts `api-service/src/seeds/tintaSeed` e `api-service/src/seeds/adminSeed` para popular o banco de dados.

## Uso

### Documentação da API (Swagger)

A api-service possui uma documentação completa e interativa gerada com Swagger. Para acessá-la, visite:

http://localhost:4000/docs

Lá você encontrará todos os endpoints disponíveis, seus parâmetros, schemas e poderá testá-los diretamente.

### Endpoints da API

Abaixo estão listados os principais endpoints da `api-service` (http://localhost:4000). Para mais detalhes, consulte a documentação do Swagger.

#### Autenticação

- `POST /login`: Realiza o login e retorna um token JWT.

#### Usuários

- `POST /usuarios`: Cria um novo usuário.
- `GET /usuarios`: Lista todos os usuários (requer autenticação de **ADMIN**).
- `GET /usuarios/:id`: Busca um usuário por ID (requer autenticação + ser o usuário com o id especificado).
- `PATCH /usuarios/:id`: Atualiza um usuário (requer autenticação + ser o usuário com o id especificado).
- `DELETE /usuarios/:id`: Remove um usuário (requer autenticação de **ADMIN**).

#### Tintas

- `GET /tintas`: Lista todas as tintas.
- `GET /tintas/:id`: Busca uma tinta por ID.
- `POST /tintas`: Cria uma nova tinta (requer autenticação de **ADMIN**).
- `PATCH /tintas/:id`: Atualiza uma tinta (requer autenticação de **ADMIN**).
- `DELETE /tintas/:id`: Remove uma tinta (requer autenticação de **ADMIN**).

### Exemplos de Requisições

#### Autenticação

Para acessar os endpoints protegidos, você primeiro precisa obter um token de autenticação. Utilize as credenciais de administrador que você configurou no arquivo `api-service/.env`. É necessário ter rodado as **seeds** anteriormente para gerar o usuário **ADMIN**.

#### Request (`http://localhost:4000/login`):

```JSON
{
    "email": "admin@exemplo.com",
    "password": "Senha@Forte123"
}
```

#### Response:

```JSON
{
    "token": "SEU_TOKEN_JWT_AQUI"
}
```

### Chat com o Assistente de IA

Para fazer uma pergunta ao assistente, envie uma requisição POST para o endpoint `/chat` do ai-service.

#### Request (`http://localhost:4001/chat`):

```json
{
    "question": "Quero pintar minha varanda de azul escuro, algo moderno e resistente ao tempo. Qual tinta escolher? Como ficaria?"
}
```

#### Response (exemplo com geração de imagem):

```json
{
    "textAnswer": "Para um azul escuro resistente ao tempo, recomendo a tinta Suvinil Ultra Resistente na cor Azul Oceano. Esta tinta possui alta resistência ao tempo, é lavável e oferece proteção UV, sendo ideal para uso em paredes internas. Além disso, sua fórmula anti-mofo ajuda a manter o ambiente sempre bonito e protegido. Você pode encontrar essa opção na linha Premium da Suvinil. Espero ter ajudado!\n\nAqui está uma simulação de como ficaria a sua varanda pintada com a tinta Suvinil Azul Oceano: [Simulação de varanda com Suvinil Azul Oceano](). Espero que goste da sugestão! Se precisar de mais alguma informação, estou à disposição.",
    "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-RixYHAd2NxNdbjOXR6ZUfng6/user-aA3vNHa8t5fXhybp6Vp0PdMG/img-rze3JT0QI0nmcyWpxfcrcEWm.png?st=2025-06-23T18%3A08%3A22Z&se=2025-06-23T20%3A08%3A22Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=cc612491-d948-4d2e-9821-2683df3719f5&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-23T17%3A25%3A31Z&ske=2025-06-24T17%3A25%3A31Z&sks=b&skv=2024-08-04&sig=8D/BjSW0NiRqnedMIvo1FnRkqO1Od1TTi7otvD%2BuAh0%3D"
}
```

> **Nota:** O campo `imageUrl` será preenchido sempre que o agente identificar um pedido para visualizar ou gerar uma imagem de um ambiente pintado. O link é público e pode ser acessado em qualquer sistema operacional enquanto estiver válido.
