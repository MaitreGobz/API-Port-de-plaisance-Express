# API Port de Plaisance — Projet Express / MongoDB

Application API REST sécurisée permettant la gestion d’un **port de plaisance**.  
Elle offre une interface API et web pour administrer les **catways** (emplacements de bateaux) et leurs **réservations**, avec authentification JWT et documentation Swagger.

---

## Fonctionnalités principales

- Authentification **JWT** (login / register)
- Gestion complète des **Catways** et **Réservations**
- Interface **EJS** (accueil, dashboard, listes)
- **Swagger UI** pour tester l’API depuis le navigateur
- Sécurité : `helmet`, `cors`, `cookie-parser`, `bcryptjs`
- Base de données **MongoDB (Atlas ou locale)**
- Tests automatisés avec **Mocha**, **Chai** et **Supertest**

---

## Technologies utilisées

- **Node.js / Express** : Serveur et routes API
- **MongoDB / Mongoose** : Base de données
- **EJS** : Templates côté serveur
- **Swagger UI Express** : Documentation de l’API
- **JWT + bcryptjs** : Authentification sécurisée
- **Helmet / CORS / Compression** : Sécurité & performance
- **Mocha / Chai / Supertest** : Tests unitaires

---

---

## ⚙️ Installation locale

### Cloner le projet

```bash
git clone https://github.com/MaitreGobz/API-Port-de-plaisance-Express.git
cd API-Port-de-plaisance-Express
```

### Installer les dépendances

```bash
npm ci
```

### Créer ton fichier .env

Copier le fichier d’exemple :

```bash
cp .env.example .env
```

Ouvrir .env et le remplir selon l'environnement :

```bash
NODE_ENV=development
URL_MONGO=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET=<clé-secrète-au-choix>
```

### Lancer le serveur

```bash
npm run dev
```

L’application tourne sur : [http://localhost:3000](http://localhost:3000)

## Importer les données de départ

Des fichiers JSON sont fournis dans le dossier data/ pour pré-remplir la base avec des exemples de catways et de réservations.

Via MongoDB Atlas (interface) :

- Se connecter au cluster Atlas.
- Cliquer sur Collections → Import Data.
- Sélectionner le fichier data/catways.json → Collection catways.
- Répéter l’opération avec data/reservations.json → Collection reservations.

## Tests unitaires

Des tests sont déjà inclus pour vérifier le bon fonctionnement de l’API.

```bash
npm run test
```

## Documentation Swagger

Une documentation interactive est disponible à :
[http://localhost:3000/docs](http://localhost:3000/docs)

## Déploiement

L'API est déployée via [Render](https://render.com) à l'adresse suivante:
[https://api-port-de-plaisance-express.onrender.com](https://api-port-de-plaisance-express.onrender.com)
