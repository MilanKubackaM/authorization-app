# Authorization App

Toto je plne funkčná aplikácia, ktorá umožňuje užívateľovi zobraziť tajnú správu. Po kliknutí na tlačidlo **"Reveal Secret"** sa vypíše tajomstvo, ktoré je uložené ako správa v Java kontroléri. Na úspešné zobrazenie tejto správy je však potrebné sa najskôr **zaregistrovať a prihlásiť**.

## Spustenie aplikácie

Aplikácia je rozdelená na **backend (Spring Boot)** a **frontend (Angular 18)**. Celý projekt je nakonfigurovaný pomocou **Docker Compose**, pre jednoduché spustenie.

1. Uisti sa, že sa nachádzaš v hlavnom adresári projektu.
2. Spusti aplikáciu pomocou príkazu:

   ```sh
   docker compose up --build
    ```

   Tento príkaz zabezpečí automatické zostavenie a spustenie všetkých potrebných služieb, vrátane databázy PostgreSQL.
3.	Po úspešnom spustení bude aplikácia dostupná na: http://localhost:4200


## Použité technológie

### Backend (Spring Boot, Java 17)
- Spring Boot - framework na rýchly vývoj backendovej aplikácie.
- Spring Web - umožňuje implementáciu REST API.
- Spring Security - zabezpečuje autentifikáciu a autorizáciu.
- Spring Data JPA - slúži na prácu s databázou PostgreSQL.
- PostgreSQL Driver - JDBC ovládač pre PostgreSQL.
- Lombok - redukcia boilerplate kódu.

### Autentifikácia a bezpečnosť
- JWT tokeny - generovanie kľúča na autentifikáciu používateľov.
- Symetrické šifrovanie HS256 - podpisovanie tokenu pomocou HMAC-SHA256. 
- Token je platný 30 minút - po tejto dobe je potrebné získať nový.
- CORS Policy - riešené pomocou CORS filtra, aby bolo možné komunikovať medzi frontendovou a backendovou aplikáciou.

### Frontend (Angular 18)
- Standalone komponenty - nevyužívame tradičné Angular moduly.
- Angular HTTP Interceptor - na zachytávanie odpovedí z HTTP požiadaviek.
- Bootstrap - použitý na základný vzhľad a štýlovanie aplikácie.
- ngx-toastr - na informovanie používateľa o stavoch aplikácie (napr. úspešné prihlásenie).
- RxJS - využívaná na dynamické spracovanie údajov.
- Token je uložený v Local Storage - aby bol dostupný aj po zatvorení okna prehliadača.

### Test frontendu
- Napísali sme unit testy na overenie funkčnosti aplikácie. Nižšie sa nachádza výsledný report.
![alt text](coverage_report.png)