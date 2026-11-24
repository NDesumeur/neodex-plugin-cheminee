# Cheminée

Un jeu d'escalade en pixel art : un mineur grimpe une cheminée de volcan en sautant d'une paroi à l'autre, pendant que la lave monte sous ses pieds. Monte le plus haut possible.

*English version: [README.en.md](README.en.md)*


## Parois variées et volcan qui se réveille (nouveau en 1.2.0)

- **Glace bleue** : accroché dessus, on glisse très vite. **Mousse verte** : on ne glisse plus du tout, le temps de bien viser.
- Au-delà de 40 m, un événement toutes les 15 à 25 secondes : la **pluie de cendres** (tout devient noir sauf autour du grimpeur) ou l'**éruption** (la cheminée tremble et la lave monte bien plus vite).

## Commandes

- **Espace**, **↑** ou **clic** : maintiens pour charger le saut, lâche pour sauter vers la paroi d'en face.
- **P** ou **Échap** : pause.
- **Manette** : **A** (ou B, X, Y, RB, RT, croix haut) maintenu pour charger, relâché pour sauter ; **Start** pour la pause.
- **PLEIN ÉCRAN** : la cheminée prend tout l'écran. Sur un grand écran, la zone de jeu grandit avec la fenêtre.

## Comment ça marche

- **Plus tu maintiens, plus le saut monte.** Pendant la charge, une jauge s'affiche au-dessus du mineur et des points blancs montrent la trajectoire, jusqu'à l'endroit où il va atterrir.
- Un **saut bref** monte à peine, puis redescend : pratique pour passer sous une scie ou atterrir sous des pointes.
- Accroché à une paroi, le mineur **glisse** de plus en plus vite : il ne peut pas attendre longtemps.
- Les **crocs** plantés dans les parois sont mortels, à l'atterrissage comme en glissant. Une trace rouge dans la roche les repère. Entre deux groupes de crocs, il reste toujours au moins 4 m libres.
- Les **scies** vont et viennent d'une paroi à l'autre. Plus haut, d'autres montent et descendent le long des parois.
- Les **gemmes** se ramassent en vol.
- La **lave** monte de plus en plus vite avec la hauteur, et ne reste jamais loin.

## Le magasin de gemmes

Les gemmes ramassées s'ajoutent à ton porte-monnaie (celles des parties d'avant y sont déjà). Trois objets, achetés une fois pour toutes :

- **Piolet** (30 gemmes) : une fois par ascension, en pleine chute, appuie pour le planter dans la paroi la plus proche et t'y accrocher.
- **Bottes** (50 gemmes) : les sauts chargés montent 15 % plus haut.
- **Casque** (40 gemmes) : une fois par ascension, un croc ne te tue pas ; le casque vole en éclats et tu as un court instant pour te dégager.

Le piolet et le casque encore prêts sont affichés en haut à gauche, sous la hauteur.

## En montant

La roche volcanique laisse place aux **cristaux** à 100 m, puis à la **sortie du volcan sous les étoiles** à 250 m, avec un bandeau à chaque passage.

## Statistiques

Le panneau Records garde ta **plus grande hauteur**, le nombre de **parties**, les **gemmes** ramassées et le **total grimpé**.

## Données et synchronisation

Ton record et tes totaux sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Cheminée → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
