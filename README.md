
# Aircnc - reservas garantidas

Projeto feito para quem deseja facilidade na hora de buscar e cadastrar reservas, em geral.
# Projeto de Reserva de Spots

Este projeto é um sistema de reserva de spots, com versão **Mobile (React Native)** e **Frontend Web (React)**, incluindo validação de formulários usando **Zod**.

---

## Funcionalidades

### Mobile App
- Tela **List**: exibe spots por tecnologia.
- Tela **Book**: permite solicitar reserva para um spot.
  - Input: **data da reserva**.
  - Validação: obrigatório, usando **Zod**.
  - Integração com backend (`/bookings/:id/spots`).

### Frontend Web
- Tela **New**: permite cadastrar um novo spot.
  - Inputs: `thumbnail`, `company`, `techs`, `price`.
  - Validação com **Zod**:
    - `thumbnail` obrigatório
    - `company` obrigatório
    - `techs` obrigatório
    - `price` opcional
  - Envia dados via `FormData` para `/spots`.

---

## Tecnologias

- **React Native** (Mobile)
- **React** (Web)
- **Zod** (Validação de formulários)
- **Axios** (Requisições HTTP)
- **AsyncStorage / localStorage** (Armazenamento de usuário)
- **Socket.io-client** (Notificações em tempo real, Mobile)
- **React Router** (Navegação Web)
- **React Navigation** (Navegação Mobile)

---

## Estrutura do Projeto

/mobile/pages

Book.tsx 
← página de reservas

List.tsx ← lista de spots

Login.tsx ← login

/components
SpotList.tsx ← lista horizontal de spots

/routes.tsx ← rotas do app mobile

/services/api.ts ← configuração do Axios

- - 

/web
/pages/

New/index.jsx ← página de cadastro de spot

/services/api.js ← configuração do Axios

/assets ← imagens e ícones

- -


---

## Instalação

### Mobile
```bash
cd mobile
npm install
npx expo start
--------------------------------------------------------------------------------------------

Web

cd web
npm install
npm run dev

-------------------------------------------------------------------------------------------

Autor

Juan Thales de Almeida Pires