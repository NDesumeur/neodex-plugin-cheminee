# Cheminée

Un jeu d'escalade en pixel art : un mineur grimpe une cheminée de volcan en sautant d'une paroi à l'autre, pendant que la lave monte sous ses pieds. Monte le plus haut possible.

*English version: [README.en.md](README.en.md)*

## Commandes

- **Espace**, **↑** ou **clic** : maintiens pour charger le saut, lâche pour sauter vers la paroi d'en face.
- **P** ou **Échap** : pause.

## Comment ça marche

- **Plus tu maintiens, plus le saut monte.** Pendant la charge, une jauge s'affiche au-dessus du mineur et des points blancs montrent la trajectoire, jusqu'à l'endroit où il va atterrir.
- Un **saut bref** monte à peine, puis redescend : pratique pour passer sous une scie ou atterrir sous des pointes.
- Accroché à une paroi, le mineur **glisse** de plus en plus vite : il ne peut pas attendre longtemps.
- Les **crocs** plantés dans les parois sont mortels, à l'atterrissage comme en glissant. Une trace rouge dans la roche les repère. Entre deux groupes de crocs, il reste toujours au moins 4 m libres.
- Les **scies** vont et viennent d'une paroi à l'autre. Plus haut, d'autres montent et descendent le long des parois.
- Les **gemmes** se ramassent en vol.
- La **lave** monte de plus en plus vite avec la hauteur, et ne reste jamais loin.

## Statistiques

Le panneau Records garde ta **plus grande hauteur**, le nombre de **parties**, les **gemmes** ramassées et le **total grimpé**.

## Données et synchronisation

Ton record et tes totaux sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Cheminée → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
