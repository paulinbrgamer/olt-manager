# 📡 OLT Manager (Web)

Interface web do projeto **OLT Manager**, desenvolvido para facilitar o acesso e visualização de informações das OLTs (Optical Line Terminals) utilizadas na operação de uma empresa de internet.

## ✨ Visão Geral

Na rotina de provedores de internet, o acesso frequente às OLTs via SSH/CLI é uma tarefa comum, porém repetitiva e trabalhosa, principalmente em ambientes com muitos POPs. Pensando nisso, o **OLT Manager** foi criado para automatizar esse processo.

Este repositório contempla **apenas a interface web** do sistema, que se conecta a uma API desenvolvida em Node.js (não pública por conter dados sensíveis). A interface permite visualizar informações extraídas diretamente das OLTs, facilitando diagnósticos e a identificação de incidentes com mais agilidade.

## 🧰 Tecnologias Utilizadas

- **React** com **Vite** – Estrutura moderna e rápida para desenvolvimento front-end.
- **TypeScript** – Tipagem estática para maior segurança e produtividade.
- **Tailwind CSS** – Estilização rápida e responsiva.
- **Shadcn/UI** – Componentes acessíveis e modernos.
- **Lucide Icons** – Ícones vetoriais simples e elegantes.
- **Context API + Zustand** – Gerenciamento de estado da aplicação.
- **Sonner** – Notificações e toasts elegantes.
- **React Router DOM** – Navegação entre abas e telas.

## 🚀 Funcionalidades Principais

- Visualização de dados em tempo real das OLTs.
- Interface intuitiva para busca de clientes e parâmetros.
- Abas dinâmicas para múltiplas consultas simultâneas.
- Modo demonstração para exploração sem necessidade de conexão com uma API real.

## 🧪 Modo Demonstração

Para testar o sistema sem conexão com uma OLT real:

1. Acesse o sistema localmente.
2. Vá até a aba **"OLT"** na barra de navegação superior.
3. Clique no botão **"Demo"** no canto da tela.
4. Uma aba será aberta com dados simulados de uma OLT fictícia.

## 🔧 Como Rodar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/paulinbrgamer/olt-manager.git
   cd olt-manager
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse `http://localhost:5173` no navegador.

## 📁 Estrutura de Pastas

```
/src
├── components       # Componentes reutilizáveis
├── context          # Contextos de estado (abertura de abas, tema, etc)
├── interfaces       # Tipagens do TypeScript
├── pages            # Telas principais do sistema
├── utils            # Funções auxiliares
├── constants        # Cores, ícones e configurações fixas
```

## 🔒 Observações

> A API que se comunica diretamente com as OLTs **não está disponível publicamente**, pois contém credenciais e configurações internas sensíveis. Apenas a interface web é exposta neste repositório para fins de demonstração e testes.

## 📫 Contato

Desenvolvido por [Paulo Francisco Ávila Neto](https://github.com/paulinbrgamer).  
📧 paulofavila3021@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/paulo-ávila)
