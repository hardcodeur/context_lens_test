# Context Lens

Application de visualisation de graphes de connaissances basée sur les résultats de recherche Tavily.

## Installation et Lancement

1. **Cloner le dépôt**
   ```bash
   git clone <votre-repo>
   cd <nom-du-dossier>
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

## 🧪 Exécuter les tests

Pour lancer les tests E2E (assurez-vous que l'application est en cours d'exécution) :

```bash
npm run e2e
```

## 🛠️ Développement

### Prérequis

- Node.js 18+
- Docker et Docker Compose
- Clé API Tavily

### Structure du projet

- `/src` - Code source de l'application
- `/public` - Fichiers statiques (HTML, CSS, images)
- `/tests` - Tests automatisés
