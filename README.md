# Desafio para vaga de Desenvolvedor frontend na uncode 2026

## Framework

Para completar esse desafio eu utilizei as stacks Express pro backend e React pro frontend, escolhi react por ser meu framework frontend de maior dominio, podendo desenvolver soluções rapidamentes com maior eficiencia e agilidade.

## Estrutura de pastas do projeto

Utilizei da estrutura de pastas básica pra projetos de pequeno e médio porte, onde a raiz ficam arquivos de configuração, na pasta src/ ficam os arquivos principais do projeto, sendo divididos por funcionalidade, utilizei api para conexões externas, components para armazenar os elementos reactNode que podem ser aproveitados em mais de uma tela, em screens ficam as telas navegaveis do app, e em types ficam os arquivos de para salvar interfaces e tipos de dados.

## Como rodar localmente

Para rodar o projeto deve-se rodar os dois serviços, backend e frontend, iniciando pelo backend, entre na pasta backend, instale as dependencias e rode o comando start.

``` cmd
npm install && npm run start
```

Após iniciar a api, abra um segundo terminal e entre na pasta backend, instale as dependencias configure as varaveis de ambiente em um arquivo .env e rode o comando dev.

Variaveis:

``` .env
MAIN_URL_API={API_BACKEND}
VITE_GOOGLE_API_KEY={TOKEN_GEMINI}
```

Comando:

``` cmd
npm install && npm run dev
```

## Deploy publico

Voce pode acessar o projeto pelo link publico [Uncode deploy](https://uncode-frontend26.vercel.app)

## Decisões técnicas  relevantes

Para desenvolvimento mais fluido, foram utilizados tailwind para estilos e animações e lucid react para icone, além de utilizar o react com typescript para tipagem e melhor comportamento do projeto.
