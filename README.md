# Repositório do projeto App de Delivery!
#### :rocket: Bloco 31 - Aplicação de todos os conceitos aprendidos nos Módulos de Front-end e Back-end do curso de Web Developer da Trybe.

## Contexto
A distribuidora de cervejas da dona Tereza está se informatizando! 🚀 Seu negócio, antes focado em um local específico da cidade, passou a receber uma quantidade massiva de encomendas de outros pontos, expandindo sua atuação, sobretudo via delivery. Isso tudo graças ao excelente preço das bebidas e atendimento da equipe de vendas.

Agora a distribuidora possui alguns pontos de venda na cidade para agilizar no atendimento dessas áreas. Cada ponto de venda, por sua vez, possui uma pessoa vendedora responsável.

Como seu antigo sistema, que era um conjunto de planilhas, já não atende a necessidade do negócio, pois gera muita manutenção, dona Tereza procurou a sua equipe de pessoas desenvolvedoras com uma ideia de aplicativo que pudesse agilizar a vida de sua equipe e das pessoas que compram seus produtos. O aplicativo precisa:
- Ter acesso via login: tanto clientes como pessoas vendedoras, assim como a própria dona Tereza, que administra o sistema, devem ter acesso ao aplicativo via login, porém para funções diferentes: (1) A pessoa cliente, que compra da lista de produtos; (2) A pessoa vendedora, que aprova, prepara e entrega; (3) A pessoa administradora, que gerencia quem usa o aplicativo;

- Fazer a comunicação entre clientes e pessoas vendedoras: a pessoa cliente faz o pedido via "carrinho de compras" e a pessoa vendedora aprova, prepara e envia esse pedido. Quando o produto é recebido por quem comprou, essa pessoa marca o pedido como "recebido". Ambos devem possuir detalhes sobre seus pedidos;

- Funcionar em tempo real: as telas de pedidos/detalhes do pedido devem ser atualizadas em tempo real, à medida que essas interações acontecem. Se a pessoa cliente faz o pedido, o mesmo deve aparecer para a pessoa vendedora em seu dash de pedidos sem que ela precise atualizar a página. A pessoa cliente, por sua vez, deve ter as informações sobre seu pedido também atualizadas em tempo real, ou seja, ter informações se o pedido está sendo preparado ou se já saiu pra entrega;

A ideia da sua equipe já pressupõe alguma escalabilidade, dado que foram estabelecidas algumas entidades genéricas no banco de dados e componentização no front-end, para que, caso o sistema cresça, não seja muito difícil mudar e ampliar essa estrutura.

## Protótipo e Diagrama de ER
![image](https://user-images.githubusercontent.com/83843532/188521047-8b2a114d-993f-4c11-80e9-94f5b9a7c854.png)

## Habilidades Desenvolvidas
- Manter aderência do código à especificação. O programa deve se comportar como especificado no repositório, no protótipo e no Diagrama de ER;
- Manter a organização do código e a arquitetura geral da aplicação (tanto da API quando do front-end);
- Manter aderência ao padrão REST na API;
- Respeitar a estrutura do banco de dados. A implementação não deve adicionar ou remover tabelas, campos ou relacionamentos e a API deve estar preparada para aproveitar essa estrutura por completo;
- Manter aderência aos princípios SOLID;

## Instruções

1. Clone o repositório
- `git clone git@github.com:matteusfernandes/app-delivery.git`
- Entre na pasta do repositório que você acabou de clonar:
    - `cd app-delivery`

2. Instale as dependências e inicialize o projeto
- ⚠️ IMPORTANTE ⚠️: Para testar o Projeto localmente, é fundamental configurar o arquivo de variáveis de ambiente `.env` (de `environment`) dentro da pasta `./back-end` (ele é o único `.env` no projeto), conforme exemplo em `.env.example`, na mesma pasta. Esse arquivo servirá de referência para o avaliador e caso não exista, o avaliador vai utilizar valores `default` pro processo (O que pode estourar erro no teste local, caso suas configurações não sejam as mesmas).


- Excepcionalmente nesse projeto, também existe a necessidade de manter e subir no repositório o arquivo `jwt.evaluation.key`, que também deve estar em `./back-end`. Esse arquivo deve conter única e exclusivamente **a chave utilizada para criptografia com JWT**. Nesse sentido, esse arquivo pode ser lido por sua aplicação na hora de trabalhar com `tokens`.

- ⚠️ IMPORTANTE ⚠️: Inicie o projeto pela raiz, utilizando o comando `npm i`;
    - Após isso, é possível fazer a instalação de ambos os aplicativos (back e front) através da raiz do projeto, utilizando o comando `npm run dev:prestart` (esse comando também restaurará o banco de dados, caso o `.env` esteja configurado corretamente).
    
- `npm start` (Limpa as portas `3000` e `3001`. Prepara o campo rodando o `Sequelize` para restaurar o banco de dados de testes `(final -test)` e sobe a aplicação com `pm2` em modo `fork` (Uma instância pra cada aplicação). Nesse modo as alterações não são assistidas;)
      - uso (na raiz do projeto);

## Scripts relevantes do `package.json` principal

**São os scripts da raiz do projeto (`./package.json`)** *(e não das aplicações individuais `./front-end/package.json` e `./back-end/package.json`)*:

- `start`: Limpa as portas `3000` e `3001` e simula a inicialização no avaliador. Prepara o campo rodando o `Sequelize` para restaurar o **banco de dados de testes** (final `-test`) e sobe a aplicação com `pm2` em modo `fork` (Uma instância pra cada aplicação). Nesse modo as alterações não são assistidas;
  - *uso (na raiz do projeto): `npm start`*

- `stop`: Para e deleta as aplicações rodando no `pm2`;
  - *uso (na raiz do projeto): `npm stop`*

- `dev`: Limpa as portas `3000` e `3001` e sobe a aplicação com `pm2` em modo `fork` (Uma instância pra cada aplicação), nesse modo, as atualizações são assistidas (modo `watch`);
  - *uso (na raiz do projeto): `npm run dev`*

- `dev:prestart`: A partir da raiz, esse comando faz o processo de instalação de dependências (`npm i`) nos dois projetos (`./front-end` e `./back-end`) e roda o `Sequelize` no `./back-end` (lembrar de configurar o `.env` no mesmo);
  - *uso (na raiz do projeto): `npm run dev:prestart`*

- `db:reset`: Rodas os scripts do `Sequelize` restaurando o **banco de dados de desenvolvimento** (final `-dev`), utilize caso ocorra algum problema no seu banco local;
  - *uso (na raiz do projeto): `npm run db:reset`*

- `db:reset:debug`: Rodas os scripts do `Sequelize` restaurando o **banco de dados de desenvolvimento** (final `-dev`), utilize caso ocorra algum problema no seu banco local; Esse comando também é capaz de retornar informações detalhadas de erros (quando ocorrerem no processo);
  - *uso (na raiz do projeto): `npm run db:reset:debug`*

- `test <nomes-dos-arquivos>`: Roda todos os testes (ou uma parte deles caso `<nomes-dos-arquivos>` seja definido) utilizando o **banco de dados de testes** (final `-test`);
  - *uso (na raiz do projeto): `npm test`, `npm test 01login 02register` ou ainda `npm run test 01 02`*

- `test:dev <nomes-dos-arquivos>`: Roda todos os testes (ou uma parte deles caso `<nomes-dos-arquivos>` seja definido) utilizando o **banco de dados de desenvolvimento** (final `-dev`); 
  - *uso (na raiz do projeto): `npm run test:dev`, `npm run test:dev 01login 02register` ou ainda `npm test:dev 01 02`*;

- `test:dev:open <nomes-dos-arquivos>`: Roda todos os testes (ou uma parte deles caso `<nomes-dos-arquivos>` seja definido) utilizando o **banco de dados de desenvolvimento** (final `-dev`), exemplo `npm test:dev:open 01login 02register` ou ainda `npm test:dev:open 01 02`; Esse teste deve mostrar abrir uma janela mostrando o comportamento das páginas;
  - *uso (na raiz do projeto): `npm run test:dev:open`, `npm run test:dev:open 01login 02register` ou ainda `npm test:dev:open 01 02`*;

- `test:dev:report "<nomes-dos-arquivos>"`: Roda todos os testes (ou uma parte deles caso `"<nomes-dos-arquivos>"` seja definido) utilizando o **banco de dados de desenvolvimento** (final `-dev`); Esse teste devolve um output em texto com o resultado de todos os testes; Os `logs` são gerados em `./__tests__/reports`.
  - *uso (na raiz do projeto): `npm run test:dev:report`, `npm run test:dev:report "01login 02register"` ou ainda `npm run test:dev:report "01 02"`*;

@trybe

## Desenvolvimento do Projeto
Esse projeto foi o mais desafiador do curso! Nessa aplicação, meu time foi responsável por criar e integrar tanto o back-end quanto o front-end!

O projeto em si foi super divertido de ser desenvolvido e serviu para solidificar dos os conhecimentos adquiridos ao longo do curso de Desenvolvimento Web! Como dado no contexto, foi criada uma plataforma de delivery de cerveja. 🍻

Para facilitar o entendimento, a aplicação foi dividada em ** 3 fluxos principais** e uma validação de status entre cliente e pessoa vendedora:

- **Fluxo Comum** que compreende: 
  - (1) Tela de Login; 
  - (2) Tela de Registro.

- **Fluxo do Cliente** que compreende: : 
  - (3) Tela de Produtos; 
  - (4) Tela de Checkout; 
  - (5) Tela de Pedidos; 
  - (6) Tela de Detalhes do Pedido.

- **Fluxo da Pessoa Vendedora** que compreende: 
  - (7) Tela de Pedidos; 
  - (8) Tela de Detalhes/Controle do Pedido.

Para o banco de dados,foi ultilizada a biblioteca ORM `Sequelize`, que fez interface com o `MySQL`!

## Linter

Foi usado o [ESLint](https://eslint.org/) para fazer a análise estática do código.

Este projeto já vem com as dependências relacionadas ao _linter_ configuradas nos arquivos `package.json` nos seguintes caminhos:

- `app-deliveryp/back-end/package.json`
- `app-deliveryp/front-end/package.json`

Para poder rodar os `ESLint` basta executar o comando `npm install` dentro do projeto de forma individual, ou seja, precisa-se executar esse comando dentro da pasta `back-end` e também na pasta `front-end` e depois `npm run lint` dentro de cada uma dessas pastas, assim você verifica as particularidades individualmente. Se a análise do `ESLint` encontrar problemas no seu código, tais problemas serão mostrados no seu terminal. Se não houver problema no seu código, nada será impresso no seu terminal.

Devido ao fato de as configurações das regras do `ESLint` dos projetos de front e back **serem diferentes**, **é preciso executar o `ESLint` em cada projeto**.

Você pode também instalar o plugin do `ESLint` no `VSCode`, bastar ir em extensions e baixar o [plugin `ESLint`](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).
  - **Dica**: Abra separadamente cada pasta do projeto (`back-end` e `front-end` em `VSCode`s separados, para tirar proveito do `ESLint` individual de cada projeto).

Foi ultilizado também o [StyleLint](https://stylelint.io/) para fazer a análise estática do código.

**O Stylelint é aplicável _APENAS_ no frontend**

Para poder rodar o `StyleLint` em um projeto basta executar o comando `npm install` dentro do projeto de front-end e depois `npm run lint:styles`.

## Equipe de desenvolvedores
- Ana Jacomassi

- Paulo Lima

- Thaísa Medeiros Almeida

- Bruna Vottri

- [Matteus Fernandes](https://www.linkedin.com/in/matteusfernandes/)

<a href="https://github.com/Ana-Jacomassi">![avatar](https://images.weserv.nl/?url=avatars.githubusercontent.com/u/74548134?v=4&h=100&w=100&fit=cover&mask=circle&maxage=7d
)</a>
<a href="https://github.com/Paulynho-lima">![avatar](https://images.weserv.nl/?url=avatars.githubusercontent.com/u/79667710?v=4&h=100&w=100&fit=cover&mask=circle&maxage=7d
)</a>
<a href="https://github.com/ThaisaMA">![avatar](https://images.weserv.nl/?url=avatars.githubusercontent.com/u/82241130?v=4&h=100&w=100&fit=cover&mask=circle&maxage=7d
)</a>
<a href="https://github.com/bvottri">![avatar](https://images.weserv.nl/?url=avatars.githubusercontent.com/u/83843006?v=4&h=100&w=100&fit=cover&mask=circle&maxage=7d
)</a>
<a href="https://github.com/matteusfernandes">![avatar](https://images.weserv.nl/?url=avatars.githubusercontent.com/u/83843532?v=4&h=100&w=100&fit=cover&mask=circle&maxage=7d
)</a>

- Para visualizar o **Pull Request** original aberto no repositório da Trybe e tomar nota da avaliação e dos testes, acesse: [Group3](https://github.com/tryber/sd-013-c-project-delivery-app/pull/386)
