# Repositório do projeto App de Delivery!
#### :rocket: Bloco 31 - Aplicação de todos os conceitos aprendidos nos Módulos de Front-end e Back-end do curso de Web Developer da Trybe.

# Contexto
A distribuidora de cervejas da dona Tereza está se informatizando! 🚀 Seu negócio, antes focado em um local específico da cidade, passou a receber uma quantidade massiva de encomendas de outros pontos, expandindo sua atuação, sobretudo via delivery. Isso tudo graças ao excelente preço das bebidas e atendimento da equipe de vendas.

Agora a distribuidora possui alguns pontos de venda na cidade para agilizar no atendimento dessas áreas. Cada ponto de venda, por sua vez, possui uma pessoa vendedora responsável.

Como seu antigo sistema, que era um conjunto de planilhas, já não atende a necessidade do negócio, pois gera muita manutenção, dona Tereza procurou a sua equipe de pessoas desenvolvedoras com uma ideia de aplicativo que pudesse agilizar a vida de sua equipe e das pessoas que compram seus produtos. O aplicativo precisa:
- Ter acesso via login: tanto clientes como pessoas vendedoras, assim como a própria dona Tereza, que administra o sistema, devem ter acesso ao aplicativo via login, porém para funções diferentes: (1) A pessoa cliente, que compra da lista de produtos; (2) A pessoa vendedora, que aprova, prepara e entrega; (3) A pessoa administradora, que gerencia quem usa o aplicativo;

- Fazer a comunicação entre clientes e pessoas vendedoras: a pessoa cliente faz o pedido via "carrinho de compras" e a pessoa vendedora aprova, prepara e envia esse pedido. Quando o produto é recebido por quem comprou, essa pessoa marca o pedido como "recebido". Ambos devem possuir detalhes sobre seus pedidos;

- Funcionar em tempo real: as telas de pedidos/detalhes do pedido devem ser atualizadas em tempo real, à medida que essas interações acontecem. Se a pessoa cliente faz o pedido, o mesmo deve aparecer para a pessoa vendedora em seu dash de pedidos sem que ela precise atualizar a página. A pessoa cliente, por sua vez, deve ter as informações sobre seu pedido também atualizadas em tempo real, ou seja, ter informações se o pedido está sendo preparado ou se já saiu pra entrega;

A ideia da sua equipe já pressupõe alguma escalabilidade, dado que foram estabelecidas algumas entidades genéricas no banco de dados e componentização no front-end, para que, caso o sistema cresça, não seja muito difícil mudar e ampliar essa estrutura.

# Protótipo e Diagrama de ER
![image](https://user-images.githubusercontent.com/83843532/188521047-8b2a114d-993f-4c11-80e9-94f5b9a7c854.png)

# Habilidades Desenvolvidas
- Manter aderência do código à especificação. O programa deve se comportar como especificado no repositório, no protótipo e no Diagrama de ER;
- Manter a organização do código e a arquitetura geral da aplicação (tanto da API quando do front-end);
- Manter aderência ao padrão REST na API;
- Respeitar a estrutura do banco de dados. A implementação não deve adicionar ou remover tabelas, campos ou relacionamentos e a API deve estar preparada para aproveitar essa estrutura por completo;
- Manter aderência aos princípios SOLID;

# Instruções

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

# 🚧 README em construção 🚧
<!-- Olá, Tryber!
Esse é apenas um arquivo inicial para o README do seu projeto.
É essencial que você preencha esse documento por conta própria, ok?
Não deixe de usar nossas dicas de escrita de README de projetos, e deixe sua criatividade brilhar!
⚠️ IMPORTANTE: você precisa deixar nítido:
- quais arquivos/pastas foram desenvolvidos por você; 
- quais arquivos/pastas foram desenvolvidos por outra pessoa estudante;
- quais arquivos/pastas foram desenvolvidos pela Trybe.
-->

# Desenvolvimento do Projeto
Nesse projeto foi desenvolvida uma aplicação em React que usa Redux como ferramenta de manipulação de estado e consome os dados da API do awesomeapi API de Cotações para realizar a busca de câmbio de moedas: `https://economia.awesomeapi.com.br/json/all`.

Através dessa aplicação, é possível realizar as operações básicas de criação e manipulação de um estado de redux.

![image](https://user-images.githubusercontent.com/83843532/188511181-fcf19923-35a6-4834-acaf-047c6d81f395.png)
![image](https://user-images.githubusercontent.com/83843532/188511237-c06ea2fc-71b1-4719-aabf-f6e773f60f56.png)

# Linter
Para garantir a qualidade e legibilidade do código, foi utilizado neste projeto os linters ESLint e StyleLint. Assim o código estará alinhado com as boas práticas de desenvolvimento, sendo mais legível e de fácil manutenção! Para rodá-los localmente no projeto, execute os comandos abaixo:

```
npm run lint

npm run lint:styles
```

# Matteus Fernandes - Dev Full Stack
- Para visualizar o **Pull Request** original aberto no repositório da Trybe e tomar nota da avaliação e dos testes, acesse: [Matteus](https://github.com/tryber/sd-013-b-project-trybewallet/pull/12)
- [LinkedIn](https://www.linkedin.com/in/matteusfernandes/)
