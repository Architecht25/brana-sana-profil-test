# Braña Sana · Profil de repos

Petite application web (React + Vite) qui fait passer un court questionnaire pour
dresser le **profil de repos** d'une personne, dans le cadre de Braña Sana (centre
bien-être en Asturies).

Le questionnaire combine :

- **Dalton-Smith** : 7 types de repos (physique, mental, émotionnel, social,
  sensoriel, créatif, spirituel), évalués par des questions à 4 niveaux de réponse
  (« Rarement », « Parfois », « Souvent », « Toujours »).
- **Human Design** : type énergétique (générateur, générateur manifesteur,
  manifesteur, projecteur, réflecteur) choisi dans une liste.

Les réponses restent dans le navigateur : l'application n'appelle aucune API et ne
stocke rien. Le seul appel externe est le chargement de la bibliothèque jsPDF depuis
cdnjs, utilisée pour exporter le profil en PDF.

## Stack

- React 18, Vite 6, `@vitejs/plugin-react`
- Node.js ≥ 20

## Commandes

```bash
npm ci            # installer les dépendances (ou npm install)
npm run dev       # serveur de développement
npm run build     # build de production dans dist/
npm run preview   # prévisualiser le build
```

## Structure

```
index.html          point d'entrée HTML
src/main.jsx        montage React
src/App.jsx         questionnaire, données (questions, types) et restitution
vite.config.js      base de l'URL de déploiement
```

`brana-sana-profil-test.jsx` à la racine est une copie identique de `src/App.jsx`
(restes d'un export précédent) : elle n'est utilisée par aucun build.

## Déploiement

Le workflow [`deploy.yml`](.github/workflows/deploy.yml) build l'application et la
publie sur **GitHub Pages** à chaque push sur `main`. L'URL est définie par
`base: "/brana-sana-profil-test/"` dans `vite.config.js` ; si le dépôt est renommé,
il faut adapter cette valeur.

Le workflow [`ci.yml`](.github/workflows/ci.yml) lance `npm ci` et `npm run build` sur
chaque push et pull request.

## Mise en garde

Ce questionnaire est un outil de réflexion, pas un diagnostic médical ni une
évaluation psychologique.
