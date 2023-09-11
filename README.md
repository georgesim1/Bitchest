# BitChest : Plateforme de crypto-monnaies

# 🌟 PRÉSENTATION 🌟
**Bienvenue sur le projet BitChest !**

BitChest a une mission simple mais essentielle : permettre aux particuliers d'acheter et de vendre des crypto-monnaies telles que Bitcoin et Ethereum.

# 💼 Contraintes 💼

**Solo Mode** : Travailles en autonomie.

**Technologie** : L'application web doit absolument être développée avec le Framework Laravel côté serveur.

 # 🎨 Libertés 🎨

**Front-End** : Vous pouvez choisir entre React et Vue pour le développement front-end.

**API & Services Tiers** : Libre à vous d'utiliser les API et services tiers nécessaires pour compléter le projet.

# 📋 CAHIER DES CHARGES 📋

**Objectif** : Développer l'interface d'administration pour deux profils utilisateurs Administrateur et Client. Notez que la partie publique du site (inscription, site vitrine) n'est pas à développer.

**Profils Administrateurs** : Ce sont les agents de BitChest. Leur interface leur permet de :

**Gérer leurs données personnelles** :
Gérer les clients (Création, Affichage, Modification, Suppression).
Gérer les droits d'un utilisateur.
Consulter les cours des crypto-monnaies.
Clients : Ils peuvent via leur interface :

**Gérer leurs données personnelles** :
Gérer leur portefeuille.
Vendre une crypto-monnaie.
Consulter les cours et la courbe de progression des crypto-monnaies.
Acheter une quantité de crypto-monnaies au cours actuel.
Détails Fonctionnels
Le portefeuille : Chaque client a un aperçu des crypto-monnaies qu'il possède, les détails des achats et la plus-value actuelle.

**Vente** : La vente est totale. Il est impossible de vendre une quantité spécifique de crypto-monnaies.

**Crypto-monnaies disponibles** : BitChest gérera 10 crypto-monnaies au lancement. Pour tester, utilisez la fonction PHP du document cotation_generator.php pour générer des cotations pour les 30 derniers jours.

**Graphique** : Pour visualiser l'évolution du cours, un graphique est nécessaire. Choisissez la solution JavaScript la plus adaptée.

**Interface d'administration**
Login : Administrateurs et clients se connectent via la même page.

**Interface privée** : L'administration suit un zoning précis avec une colonne A pour les actions et une zone B pour le contenu de chaque page.

## 🛠 Lancement du projet

Pour effectuer des tests, exécutez la commande suivante

**Lancement du serveur back-end**
```bash
  php artisan serve
```

**Lancement du front-end**
```bash
  npm install
```
```bash
  npm run dev
```



