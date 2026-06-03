# Urbanova — Documentazione di Progetto

## 1. Sommario Esecutivo

**Urbanova** è un'applicazione frontend (Single Page Application) per la gestione della mobilità sostenibile all'interno di un ecosistema Smart City. Nella sua configurazione attuale il progetto è realizzato esclusivamente lato client: l'interfaccia è completa e funzionante, mentre i dati provengono da file JSON statici di esempio (mock) inclusi nel repository, in attesa dell'integrazione con un backend reale. Il progetto nasce per rispondere a una criticità concreta delle amministrazioni urbane: la frammentazione degli strumenti di controllo delle flotte di micromobilità condivisa (bike-sharing, monopattini, veicoli elettrici municipali). Urbanova prototipa la centralizzazione di questi flussi in un'unica dashboard operativa.

La visione del progetto è fornire a Comuni e operatori di mobilità un **centro di controllo unico** che unisca tracciamento, gestione della manutenzione e analisi dell'impatto ambientale. L'applicazione offre una mappa interattiva geolocalizzata delle stazioni e dei veicoli, un workflow guidato multi-step per la segnalazione e la presa in carico dei guasti, e una sezione di analytics che rende immediatamente leggibili i dati di utilizzo della flotta e il risparmio di $CO_2$. Trattandosi di una SPA con dati statici, le metriche e gli stati mostrati riflettono il dataset di esempio e non un flusso dati in tempo reale.

Gli obiettivi di business che l'applicazione intende abilitare sono due. **Primo**, ridurre i costi operativi di gestione della flotta attraverso la centralizzazione del monitoraggio e l'ottimizzazione del ciclo di manutenzione. **Secondo**, valorizzare e rendicontare l'impatto ambientale del servizio: l'interfaccia visualizza il risparmio di $CO_2$ (nel dataset di esempio oltre 14.800 kg cumulativi) come metrica utile alla comunicazione istituzionale.

In questa fase il valore atteso è prototipale: dimostrare il modello di interfaccia, i flussi operativi e la visualizzazione delle metriche su cui costruire, in un secondo momento, la piattaforma completa con backend persistente. La separazione netta tra interfaccia e service layer è progettata proprio per consentire la sostituzione dei dati mock con API reali senza riscrivere la UI.

---

## 2. Definizione dell'Ambito (Scope Statement)

### 1. Obiettivi del progetto
- Centralizzare in un'unica dashboard il monitoraggio di stazioni, veicoli e viaggi della flotta di mobilità condivisa.
- Fornire un sistema strutturato di gestione della manutenzione tramite ticket con workflow multi-step.
- Rendere misurabile e visualizzabile l'impatto ambientale (risparmio $CO_2$) e l'utilizzo della flotta.
- Gestire accesso e operatività differenziata per ruolo (Admin, Tecnico, Supporto, Utente).

### 2. Requisiti Funzionali
- **Autenticazione e autorizzazione** con accesso basato su ruolo (route protette via `RequireAuth`).
- **Gestione veicoli**: elenco, filtri (stato, tipo, batteria), dettaglio, creazione/modifica guidata (wizard), azioni bulk.
- **Gestione stazioni**: tabella, pannello filtri, dettaglio su mappa, wizard di creazione.
- **Mappa interattiva** (Leaflet) con marker geolocalizzati di stazioni e veicoli.
- **Gestione ticket di manutenzione**: creazione guidata, assegnazione tecnico, cambio stato, dettaglio.
- **Visualizzazione viaggi** (trips) con tabella e dati di percorrenza/$CO_2$.
- **Gestione utenti** con badge di ruolo.
- **Analytics**: grafici su viaggi per giorno, per tipo veicolo, $CO_2$ per mese, utilizzo per stazione.
- **Impostazioni** applicative.

### 3. Requisiti Non Funzionali
- **Performance**: lazy loading delle pagine, build ottimizzata via Vite.
- **Type safety**: tipizzazione completa TypeScript (cartella `types/` per ogni dominio).
- **Manutenibilità**: architettura Atomic Design (atoms → molecules → organisms → templates) e service layer disaccoppiato.
- **Accessibilità**: enforcement via `eslint-plugin-jsx-a11y`.
- **Responsività**: UI basata su MUI (Material UI v9).
- **Scalabilità dati**: service layer astratto, predisposto alla sostituzione della sorgente dati locale con backend remoto.

### 4. Elementi In Scope
- Frontend React 19 + TypeScript completo (pagine, componenti, routing).
- Service layer con sorgente dati locale (file JSON in `src/data/`).
- Autenticazione lato client basata su `AuthContext`.
- Tutte le viste operative: Home, Mappa, Veicoli, Stazioni, Viaggi, Ticket, Utenti, Analytics, Impostazioni.
- Logica di calcolo e visualizzazione del risparmio $CO_2$.

### 5. Elementi Out of Scope
- Backend di produzione persistente (PostgreSQL/PostGIS, Prisma, Supabase Auth) — **indicato come architettura attesa, non implementato**.
- Real-time effettivo via WebSocket/Supabase Realtime (i dati attuali sono statici/mock).
- App mobile nativa.
- Integrazione hardware con i veicoli fisici (telemetria IoT, GPS live).
- Sistema di pagamento e fatturazione per gli utenti finali.
- Sicurezza di livello produzione: le credenziali utente nei dati di esempio sono in chiaro e **non** rappresentano l'implementazione finale.

---

## 3. Architettura di Sistema

La piattaforma Urbanova adotta un'architettura **frontend-centrica a livelli (layered)**, costruita su React 19 e TypeScript e organizzata secondo il principio dell'**Atomic Design**. Il sistema è attualmente in fase di sviluppo con sorgente dati locale, mantenendo però un disaccoppiamento netto tra interfaccia e logica di accesso ai dati che ne consente la futura migrazione verso un backend remoto.

### Componenti principali
- **Build & Runtime**: Vite come build tool e dev server; output statico in `dist/`.
- **Presentation Layer**: componenti React organizzati in *atoms* (es. `BatteryBar`, `StatusBadge`), *molecules* (es. `VehicleDetailModal`, `StationFilterPanel`), *organisms* (es. `VehicleTable`, `TicketFormWizard`, `MapView`) e *pages* (Home, Map, Vehicles, Analytics…).
- **Routing**: `react-router-dom` v7 con routing centralizzato (`router/routes.ts`), lazy loading delle pagine e route protette tramite il componente `RequireAuth`.
- **State / Auth**: stato di autenticazione gestito via React Context (`AuthContext`).
- **Service Layer**: classi di servizio dedicate per dominio (`VehicleService`, `StationService`, `TripService`, `MaintenanceTicketService`, `AnalyticsService`, `AuthService`, `UserService`), inizializzate al bootstrap (`bootstrap/initializeServices.ts`).
- **Data Layer**: sorgente dati locale in file JSON (`src/data/`) — predisposta alla sostituzione con API REST/backend remoto.
- **UI / Visualizzazione**: Material UI (MUI v9) per i componenti, MUI X-Charts per i grafici analytics, Leaflet + react-leaflet per la mappa geolocalizzata.

### Flusso di lavoro principale (workflow)
1. L'utente accede tramite la pagina di **Login**; `AuthService` valida le credenziali e `AuthContext` memorizza la sessione e il ruolo.
2. `RequireAuth` protegge le route: l'accesso alle viste operative è consentito solo a sessione valida.
3. Le **pagine** richiedono i dati ai rispettivi **service**, che leggono dalla sorgente dati e restituiscono oggetti tipizzati (cartella `types/`).
4. I componenti **organism** (tabelle, mappa, wizard) renderizzano i dati e gestiscono le interazioni (filtri, dettaglio, creazione/modifica).
5. Per la manutenzione, il `TicketFormWizard` guida la segnalazione di un guasto su un veicolo; `MaintenanceTicketService` ne traccia stato e assegnazione al tecnico.
6. La pagina **Analytics** aggrega i dati tramite `AnalyticsService` e li visualizza con MUI X-Charts (viaggi, utilizzo flotta, $CO_2$ risparmiata).

### Misure di sicurezza
- **Controllo degli accessi basato sui ruoli (RBAC)**: ruoli `ADMIN`, `TECHNICIAN`, `SUPPORT`, `USER`; gating delle route via `RequireAuth`.
- **Type safety end-to-end** con TypeScript per ridurre errori a runtime.
- **Validazione dei form** nei wizard prima della persistenza dei dati.

> **Nota di sicurezza:** nella configurazione attuale l'autenticazione è lato client e le credenziali dei dati di esempio sono in chiaro. Per il rilascio in produzione l'architettura attesa prevede autenticazione server-side (Supabase Auth), hashing delle password e persistenza su PostgreSQL/PostGIS via Prisma. Questi elementi non sono ancora implementati.
