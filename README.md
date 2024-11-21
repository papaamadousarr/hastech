# Projet E-Commerce : Backend Golang et Frontend Angular

## Description du projet

Ce projet est une plateforme de e-commerce avec un backend en Go (Golang) et un frontend en Angular. Il permet :
- Aux clients de parcourir et acheter des pièces détachées.
- Aux vendeurs de gérer leurs produits.
- Une gestion sécurisée des utilisateurs grâce à l'authentification JWT.

---

## Technologies utilisées

### Backend
- **Langage** : Golang
- **Base de données** : MongoDB
- **Framework Web** : Gin

### Frontend
- **Langage** : TypeScript
- **Framework** : Angular
- **Styles** : SCSS

---

## Prérequis

Avant de démarrer, vous devez avoir les éléments suivants installés sur votre machine :
- **Node.js** (16 ou supérieur)
- **Angular CLI** (`npm install -g @angular/cli`)
- **Golang** (1.20 ou supérieur)
- **MongoDB** (local ou via MongoDB Atlas)
- **Git** pour cloner le projet

---

## Installation

### Étape 1 : Cloner le projet

```bash
git clone https://github.com/papaamadousarr/hashtech.git
cd hastech

```
### Étape 2 : Installer le backend


## 1. Accédez au répertoire backend : 
```bash
cd e-commerce
```
## 2. Téléchargez les dépendances Go :

```bash
go mod tidy
```

### Étape 3 : Installer le frontend

## 1. Accédez au répertoire frontend : 
```bash
cd e-commerce-frontend
```
## 2. Installez les dépendances du projet :
```bash
npm install

```

## Lancement du projet

### Backend

```bash
go run main.go
```

### Frontend

```bash
ng serve
```

## Structure du projet
```bash
Hastech/
├── e-commerce/
│   ├── main.go                # Fichier principal
│   ├── controllers/           # Gestion des requêtes
│   ├── models/                # Modèles de données
│   ├── routes/                # Définition des routes
│   └── Database               # Base de données
├── e-commerce-frontend/
│   ├── src/
│   │   ├── app/               # Composants Angular
│   │   ├── assets/            # Images et ressources
│   │   └── environments/      # Configuration Angular
└── README.md                  # Documentation

```

## Fonctionnalités principales

- Authentification et autorisation avec JWT
- Recherche et affichage des produits
- Gestion du panier
- Gestion des commandes
- Interface utilisateur réactive et adaptée aux appareils mobiles


## Auteur

Projet réalisé par [**Papa Amadou SARR**].
