# Velo - Aplicativo Móvel (React Native & Expo)

Este é o repositório do aplicativo móvel do **Velo**, uma plataforma moderna de mobilidade urbana e logística baseada em microserviços. Desenvolvido com **React Native**, **Expo (v57.0.0)** e **TypeScript**, o aplicativo serve como a interface principal para passageiros e motoristas interagirem com o ecossistema de serviços da plataforma.

---

## 🚀 Visão Geral

O Velo Mobile conecta-se a um ecossistema de microserviços através de um **API Gateway** unificado, proporcionando fluxos de ponta a ponta que englobam desde o cadastro e autenticação de usuários até a solicitação de viagens, rastreamento em tempo real, pagamentos e avaliações.

---

## 🛠️ Tecnologias Utilizadas

- **Core**: [React Native](https://reactnative.dev/) & [Expo SDK 57](https://expo.dev/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Roteamento & Navegação**: [React Navigation v7](https://reactnavigation.org/)
- **Comunicação HTTP**: [Axios](https://axios-http.com/)
- **Persistência Local**: [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)

---

## 📁 Estrutura de Pastas

A organização de arquivos do projeto segue o padrão moderno de arquitetura React Native:

```text
Velo-mobile-app/
├── assets/                 # Imagens, ícones e fontes do aplicativo
├── src/
│   ├── components/         # Componentes visuais reutilizáveis (ex: Button.tsx)
│   ├── contexts/           # Gerenciamento de estado global (ex: AuthContext.tsx)
│   ├── screens/            # Telas da aplicação (fluxos principais e secundários)
│   │   ├── LoginScreen.tsx       # Autenticação de usuários
│   │   ├── RegisterScreen.tsx    # Cadastro de passageiros e motoristas
│   │   ├── HomeScreen.tsx        # Dashboard principal e status da infraestrutura
│   │   ├── TripMatchingScreen.tsx# Fluxo de solicitação de viagens
│   │   ├── TrackingScreen.tsx    # Rastreamento em tempo real (Telemetry)
│   │   ├── PaymentScreen.tsx     # Processamento e confirmação de pagamentos
│   │   └── ReviewScreen.tsx      # Avaliação de corridas e motoristas
│   └── services/           # Integração com APIs externas (ex: api.ts com Axios)
├── App.tsx                 # Ponto de entrada e configuração do roteador (Stack Navigation)
├── index.js                # Registro do componente raiz do Expo
├── app.json                # Configuração do Expo (metadados do app, ícones, splash screen)
└── tsconfig.json           # Configurações do TypeScript
```

---

## 🔄 Fluxo de Navegação e Funcionalidades

O aplicativo possui dois estados principais de navegação baseados na autenticação do usuário:

### 1. Fluxo Não Autenticado
- **Login (`LoginScreen`)**: Autenticação com e-mail e senha integrados ao serviço de identidade. Conta também com um botão de **"Pular Login"** para fins de teste local e bypass rápido.
- **Cadastro (`RegisterScreen`)**: Registro de novas contas com definição clara de perfil (Passageiro ou Motorista) e número de telefone.

### 2. Fluxo Autenticado
- **Home (`HomeScreen`)**:
  - Verifica dinamicamente o status da infraestrutura do API Gateway.
  - Oferece um painel exclusivo para motoristas simularem a sua própria aprovação cadastral na plataforma.
  - Direciona o usuário para as áreas de serviços integrados.
- **Trip Matching (`TripMatchingScreen`)**: Permite ao passageiro solicitar corridas definindo uma origem e um destino.
- **Rastreamento (`TrackingScreen`)**: Exibe as informações de localização em tempo real retornadas pelo microserviço de telemetria.
- **Pagamentos (`PaymentScreen`)**: Envia transações financeiras para processamento dos valores de corridas.
- **Avaliações (`ReviewScreen`)**: Envio de notas de 1 a 5 estrelas e comentários sobre a experiência da viagem.

---

## 📡 Integração com a API

O aplicativo consome dados por meio de uma instância centralizada do **Axios** localizada em [src/services/api.ts](file:///home/joseph/Documentos/Github/Velo-mobile-app/src/services/api.ts).

### Endereços Base (Base URL)
- **Emulador Android**: `http://10.0.2.2:8001/api/v1` (redireciona para o localhost da máquina hospedeira)
- **iOS / Web / Dispositivo Físico**: `http://localhost:8001/api/v1`

> [!NOTE]  
> A porta padrão configurada para o API Gateway local é a **8001**, mas ela pode ser redefinida conforme a configuração dos seus microserviços.

### Autenticação JWT
O serviço está equipado com um interceptor automático de requisições. Caso um token JWT esteja armazenado no `AsyncStorage`, ele é incluído automaticamente no cabeçalho `Authorization` de todas as chamadas subsequentes:
```javascript
Authorization: Bearer <seu_token_jwt>
```

---

## ⚙️ Instalação e Execução

### Pré-requisitos
- Node.js (versão 18 ou superior recomendada)
- Gerenciador de pacotes npm (ou yarn)
- Expo Go instalado no dispositivo móvel para testes físicos, ou emuladores de Android/iOS configurados.

### 1. Instalar as Dependências
No diretório raiz do projeto, execute:
```bash
npm install
```

### 2. Iniciar o Servidor de Desenvolvimento Expo
Para abrir o painel de controle do Expo e gerar o QR Code:
```bash
npm start
```

### 3. Rodar em Plataformas Específicas
Você também pode iniciar o aplicativo diretamente em emuladores ou na Web usando os scripts configurados no `package.json`:

- **Android**:
  ```bash
  npm run android
  ```
- **iOS**:
  ```bash
  npm run ios
  ```
- **Navegador Web**:
  ```bash
  npm run web
  ```

---

## ⚖️ Licença

Este projeto está licenciado sob os termos da licença MIT. Consulte o arquivo [LICENSE](file:///home/joseph/Documentos/Github/Velo-mobile-app/LICENSE) para obter mais informações.
