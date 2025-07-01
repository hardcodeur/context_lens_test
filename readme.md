# Context Lens

Application de visualisation de graphes de connaissances basée sur les résultats de recherche Tavily.

## Installation et Lancement

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/hardcodeur/context_lens_test.git
   cd context_lens_test
   npm install
   ```

2. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env   # Ajoutez votre clé API Tavily
   ```
   
   > ⚠️ **Important** : Ajoutez votre clé API Tavily dans le fichier `.env`

3. **Lancer l'application avec Docker**
   ```bash
   docker-compose up -d
   ```

4. **Accéder à l'application**
   Ouvrez votre navigateur à l'adresse : [http://localhost:3000](http://localhost:3000)

## Lancer les tests

1. Tests unitaires :

```bash
npm run test
```

2. Tests E2E :

```bash
npm run test:e2e
```

> ⚠️ **Important** : Assurez-vous que l'application est en cours d'exécution

## Développement

### Prérequis

- Node.js 18+
- Docker et Docker Compose
- Clé API Tavily

### Structure du projet

- `/src` - Code source de l'application
- `/public` - Fichiers statiques (HTML, CSS, images)
- `/tests` - Tests automatisés
