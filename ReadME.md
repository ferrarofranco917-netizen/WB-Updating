# 💰 BudgetWise 2.0

**BudgetWise** è un'applicazione web progressiva (PWA) per la gestione delle finanze personali “da stipendio a stipendio”. Ti aiuta a monitorare entrate, spese fisse e variabili, a definire obiettivi di risparmio e a visualizzare la tua situazione finanziaria con grafici interattivi, il tutto assistito da un'intelligenza artificiale conversazionale.

![BudgetWise Logo](icon-512.png)

## ✨ Caratteristiche principali

- **Gestione completa delle finanze**
  - Aggiungi e cancella entrate (con data personalizzata)
  - Spese fisse mensili con data di scadenza (es. affitto, bollette)
  - Spese variabili giornaliere, categorizzabili
  - Calcolo automatico del budget giornaliero, della rimanenza e dei giorni rimasti nel periodo

- **Categorie personalizzabili**
  - Categorie predefinite (Alimentari, Trasporti, Svago, Salute, Abbigliamento, Altro)
  - Possibilità di creare, modificare ed eliminare categorie personalizzate
  - Le nuove categorie appaiono automaticamente in tutti i selettori

- **Importazione CSV intelligente**
  - Carica i tuoi estratti conto in formato CSV
  - Finestra di mappatura interattiva: scegli quali colonne corrispondono a data, descrizione, importo e categoria
  - Anteprima delle prime righe per facilitare l'associazione
  - Riconoscimento automatico delle categorie in base alle tue abitudini (apprendimento)

- **Revisione e apprendimento delle categorie**
  - Dopo l'import, puoi rivedere ogni spesa e modificarne la categoria
  - L'app impara dalle tue correzioni e le riutilizzerà negli import successivi

- **Assistente finanziario AI**
  - Chatbot integrato che risponde a domande sul tuo budget
  - Suggerimenti automatici per migliorare il risparmio
  - Riconoscimento vocale (compatibile con browser moderni)

- **Grafici interattivi**
  - Distribuzione delle spese per categoria con Chart.js
  - Sparkline per l'andamento del budget e della rimanenza negli ultimi 7 giorni

- **Temi chiaro/scuro** e supporto multilingua (Italiano/Inglese)

- **PWA (Progressive Web App)**
  - Installabile su dispositivi mobili e desktop
  - Funziona offline grazie al Service Worker
  - Icone e splash screen per un'esperienza nativa

- **Onboarding guidato**
  - La prima volta che apri l'app, una guida interattiva ti mostra le funzionalità principali

- **Backup e ripristino dei dati**
  - Esporta i tuoi dati in formato JSON
  - Ripristina un backup precedente

- **Esportazione in Google Calendar**
  - Genera un file .ics con le tue spese fisse e variabili

## 🚀 Demo live

Puoi provare l'app qui: [https://ferrarofranco917-netizen.github.io/budgetwise-lite-cleanv2/](https://ferrarofranco917-netizen.github.io/budgetwise-lite-cleanv2/)

## 📦 Installazione locale

1. Clona il repository:
   ```bash
   git clone https://github.com/ferrarofranco917-netizen/budgetwise-lite-cleanv2.git