# Photos de l'équipe — recadrages

Les trois portraits de `/investors/docs/equipe` superposent deux images par
personne. L'effet ne tient que si les six images partagent la même géométrie :
même hauteur de visage, même ligne des yeux.

## Géométrie cible

Cadre **2:3** (760 × 1140 pour les portraits nets, 620 × 930 pour les découpes
de repos), et dans ce cadre :

| Repère | Valeur |
| --- | --- |
| Distance yeux → menton | 14,5 % de la hauteur du cadre |
| Ligne des yeux | 25 % de la hauteur, depuis le haut |
| Axe du visage | 50 % de la largeur |

## Sources et découpes appliquées

Sources dans `~/Desktop/Media_Web` (hors dépôt — photos brutes du shooting).
Découpes faites avec un utilitaire CoreGraphics : `crop <source> x y w h largeurSortie <destination>`.

### État de repos — `public/brand/team/<id>-rest.jpg`

Tirés de `Team.jpg` (3428 × 2228) : même prise de vue, même lumière, même fond
noir pour les trois. C'est ce qui fait tenir l'effet comme un système. Au repos
les trois visages sont nets ; le flou ne s'applique qu'aux deux portraits non
survolés, avant qu'ils ne s'effacent.

| Personne | x | y | w | h |
| --- | --- | --- | --- | --- |
| Julien | 300 | 29 | 929 | 1393 |
| Coralie | 1242 | 3 | 956 | 1434 |
| Hervé | 2248 | 5 | 975 | 1462 |

### État révélé — `public/brand/team/<id>.jpg`

Portraits studio individuels, recadrés sur la géométrie ci-dessus.

| Personne | Source | x | y | w | h |
| --- | --- | --- | --- | --- | --- |
| Julien | `Julien Gakpé 2 - Minah.jpeg` (3893 × 5839) | 409 | 496 | 3430 | 5145 |
| Coralie | `Coralie Lolliot.JPG` (2880 × 4320) | 352 | 286 | 2175 | 3262 |
| Hervé | `Hervé Gakpé - Minah.jpeg` (3512 × 5268) | 509 | 544 | 2179 | 3269 |

`Julien Gakpé 3 - Minah.jpeg` est la même prise de vue que la 2, sourire franc :
c'est l'alternative directe si on préfère un visage souriant à l'état révélé.

## Photo d'accueil

`public/brand/team.jpg` = `Team.jpg` recadrée `40 0 3348 1850` (1400 px de large).
La hauteur s'arrête à 1850 px pour passer sous le filigrane du photographe.

## Remplacer une photo

Viser les trois repères du tableau « géométrie cible ». Un écart de quelques
pour cent sur la ligne des yeux se voit immédiatement : au fondu-enchaîné, le
visage saute au lieu de se résoudre.
