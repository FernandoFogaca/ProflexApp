# 📱 ProFlex App

🇧🇷 **Português (BR)**  
O **ProFlex App** é a versão mobile do sistema Proflex, desenvolvido em **React Native (Expo)**.  
Permite a profissionais organizarem **agenda, pacientes, marketing e perfil** de forma prática, com suporte a **Dark Mode** e integração com **WhatsApp**.

🇬🇧 **English (UK)**  
**ProFlex App** is the mobile version of the Proflex system, built with **React Native (Expo)**.  
It helps professionals manage **appointments, patients, marketing campaigns and profile**, with **Dark Mode** and **WhatsApp integration**.

---

## 🔧 Tech Stack
- [Expo](https://expo.dev/)
- React Native
- AsyncStorage (persistência)
- React Navigation (Bottom Tabs + Stack)
- Context API (Theme/Dark Mode)
- Expo Notifications
- Expo Image Picker

---

## 🚀 Features
✅ Login com **email, WhatsApp e senha**  
✅ Cadastro de pacientes com persistência local  
✅ Agenda com horários, lembretes e notificações  
✅ Tela de marketing com campanhas + compartilhamento  
✅ Perfil com foto de avatar, edição e **Dark Mode**  
✅ Navegação por **Bottom Tabs** (Home, Agenda, Pacientes, Marketing, Perfil)  

---

## 📂 Estrutura de Pastas
src
├─ context
│ └─ ThemeContext.js
├─ screens
│ ├─ AgendaScreen.js
│ ├─ CadastroCompleto
│ │ ├─ CadastroCompleto.js
│ │ ├─ DadosBasicos.js
│ │ ├─ FotosPaciente.js
│ │ └─ ...
│ ├─ CompromissosScreen.js
│ ├─ HomeScreen.js
│ ├─ LoginScreen.js
│ ├─ MarketingScreen.js
│ ├─ NewsScreen.js
│ ├─ PacienteScreen.js
│ └─ ProfileScreen.js
└─ App.js

