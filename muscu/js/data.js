// Protocole 5 — contenu de l’ebook (exercices, programme, glossaire, références)

export const GROUPS = ['Pectoraux', 'Dos', 'Épaules', 'Trapèzes', 'Biceps', 'Triceps', 'Quadriceps', 'Ischios', 'Fessiers', 'Mollets', 'Abdos'];

// cat : filtre de la bibliothèque · d / i : groupes travaillés en direct / indirect (calcul du volume)
export const EX = {
  squat: {
    nom: 'Squat', cat: 'Jambes', mat: 'Barre + rack', d: ['Quadriceps', 'Fessiers'], i: ['Abdos'],
    pourquoi: 'Le mouvement roi du bas du corps : il charge lourdement les quadriceps et les fessiers dans une grande amplitude.',
    etapes: [
      'Place la barre sur le haut du dos (sur les trapèzes, pas sur la nuque). Mains un peu plus larges que les épaules, coudes sous la barre.',
      'Pieds largeur d’épaules, pointes légèrement ouvertes. Inspire profondément et gaine le ventre comme si on allait te frapper.',
      'Descends en 2 secondes : hanches vers l’arrière, genoux qui suivent l’axe des pieds, jusqu’à ce que le haut des cuisses passe au moins l’horizontale.',
      'Remonte de façon explosive en poussant le sol avec tout le pied. Souffle en fin de montée.',
    ],
    erreurs: ['Genoux qui rentrent vers l’intérieur à la remontée', 'Talons qui décollent du sol', 'Bas du dos qui s’arrondit en bas du mouvement'],
    conseil: 'Descends aussi bas que tu le peux en gardant le dos neutre : c’est en bas, muscles étirés, que le squat est le plus efficace.',
    variantes: ['Presse à cuisses', 'Goblet squat', 'Hack squat'],
  },
  sdt: {
    nom: 'Soulevé de terre jambes tendues aux haltères', court: 'SDT jambes tendues', cat: 'Jambes', mat: 'Haltères', d: ['Ischios', 'Fessiers'], i: ['Dos', 'Abdos'],
    pourquoi: 'Le meilleur exercice pour étirer les ischio-jambiers sous charge, avec les fessiers en renfort.',
    etapes: [
      'Debout, haltères devant les cuisses, pieds largeur de hanches. Genoux très légèrement fléchis… et ils ne bougent plus.',
      'Pousse les hanches loin vers l’arrière en gardant le dos plat. Les haltères glissent le long des jambes.',
      'Descends jusqu’à sentir un fort étirement derrière les cuisses (souvent vers le milieu du tibia).',
      'Remonte en ramenant les hanches vers l’avant et en serrant les fessiers.',
    ],
    erreurs: ['Dos qui s’arrondit pour descendre plus bas', 'Plier les genoux : l’exercice devient un squat', 'Haltères qui s’éloignent des jambes'],
    conseil: 'Pense « charnière de hanche » : ce sont les hanches qui reculent, pas le buste qui plonge.',
    variantes: ['SDT jambes tendues à la barre', 'Hip thrust', 'Hyperextension'],
  },
  dc_barre: {
    nom: 'Développé couché à la barre', court: 'Développé couché', cat: 'Pectoraux', mat: 'Barre + banc', d: ['Pectoraux'], i: ['Triceps', 'Épaules'],
    pourquoi: 'L’exercice de base des pectoraux. À la barre, il sollicite aussi davantage les triceps qu’aux haltères.',
    etapes: [
      'Allongé, yeux sous la barre. Pieds bien ancrés au sol, omoplates serrées et abaissées, léger cambré naturel.',
      'Prise un peu plus large que les épaules. Décroche la barre et place-la au-dessus des épaules, bras tendus.',
      'Descends en 2 secondes vers le bas des pectoraux, coudes à environ 45–60° du buste.',
      'Touche la poitrine sans rebondir, puis pousse de façon explosive en soufflant.',
    ],
    erreurs: ['Coudes écartés à 90° : les épaules souffrent', 'Fessiers qui décollent du banc', 'Rebond de la barre sur la poitrine'],
    conseil: 'Au-dessus de 60 kg, demande à quelqu’un de te parer pour tes dernières séries.',
    variantes: ['Développé couché aux haltères', 'Développé couché à la machine'],
  },
  di_barre: {
    nom: 'Développé incliné à la barre', court: 'Développé incliné', cat: 'Pectoraux', mat: 'Barre + banc incliné', d: ['Pectoraux'], i: ['Épaules', 'Triceps'],
    pourquoi: 'Cible le haut des pectoraux (faisceau claviculaire), souvent en retard.',
    etapes: [
      'Règle le banc entre 30 et 45°. Omoplates serrées, pieds ancrés.',
      'Prise un peu plus large que les épaules, barre au-dessus des épaules.',
      'Descends en 2 secondes vers le haut des pectoraux, juste sous les clavicules.',
      'Pousse vers le haut de façon explosive, la barre revient au-dessus des épaules.',
    ],
    erreurs: ['Banc trop incliné : ce sont les épaules qui travaillent', 'Barre qui descend sur le cou', 'Bas du dos qui se décolle'],
    conseil: 'Un angle de 30° suffit pour bien cibler le haut des pectoraux sans transformer l’exercice en développé épaules.',
    variantes: ['Développé incliné aux haltères', 'Développé incliné à la machine'],
  },
  dips: {
    nom: 'Dips', cat: 'Pectoraux', mat: 'Barres parallèles', d: ['Pectoraux', 'Triceps'], i: ['Épaules'],
    pourquoi: 'Un exercice au poids du corps redoutable pour le bas des pectoraux et les triceps, avec un grand étirement.',
    etapes: [
      'En appui bras tendus sur les barres, épaules basses (loin des oreilles).',
      'Penche légèrement le buste vers l’avant pour cibler davantage les pectoraux.',
      'Descends en 2 secondes jusqu’à ce que les bras passent la parallèle, selon ta mobilité.',
      'Remonte en poussant fort, sans verrouiller brutalement les coudes.',
    ],
    erreurs: ['Épaules qui montent vers les oreilles', 'Descendre trop bas malgré une gêne à l’avant de l’épaule', 'Se balancer avec les jambes'],
    conseil: 'Dès que tu dépasses la fourchette de répétitions au poids du corps, ajoute du lest avec une ceinture.',
    variantes: ['Dips à la machine', 'JM press'],
  },
  dm_machine: {
    nom: 'Développé militaire à la machine', court: 'Développé militaire', cat: 'Épaules', mat: 'Machine', d: ['Épaules'], i: ['Triceps'],
    pourquoi: 'Le développé vertical le plus simple à charger lourd en sécurité pour l’avant et le côté des épaules.',
    etapes: [
      'Règle le siège : les poignées doivent arriver à hauteur d’épaules.',
      'Dos collé au dossier, gaine le ventre.',
      'Pousse vers le haut de façon explosive sans cambrer le bas du dos.',
      'Redescends en 2 secondes jusqu’à hauteur du menton.',
    ],
    erreurs: ['Cambrer fortement pour pousser plus lourd', 'Amplitude coupée en bas', 'Verrouiller brutalement les coudes'],
    conseil: 'Garde les coudes légèrement devant le corps : c’est plus confortable pour les épaules.',
    variantes: ['Développé militaire aux haltères', 'Développé militaire à la barre', 'Développé militaire à la Smith machine'],
  },
  tv_large: {
    nom: 'Tirage vertical prise large', court: 'Tirage vertical large', cat: 'Dos', mat: 'Poulie haute', d: ['Dos'], i: ['Biceps'],
    pourquoi: 'Développe la largeur du dos (grand dorsal) et le haut du dos.',
    etapes: [
      'Cale tes cuisses sous les boudins. Prise large en pronation (paumes vers l’avant).',
      'En haut, laisse les bras s’étirer complètement : le grand dorsal est en étirement.',
      'Tire la barre vers le haut de la poitrine en amenant les coudes vers les hanches, buste légèrement incliné vers l’arrière.',
      'Remonte en 2 secondes en contrôlant jusqu’à l’étirement complet.',
    ],
    erreurs: ['Tirer derrière la nuque', 'Se jeter en arrière pour faire descendre la charge', 'Tirer uniquement avec les bras'],
    conseil: 'Imagine que tes mains sont des crochets : ce sont les coudes qui tirent.',
    variantes: ['Traction', 'Tirage vertical à la machine'],
  },
  tv_neutre_uni: {
    nom: 'Tirage vertical prise neutre unilatéral', court: 'Tirage vertical unilatéral', cat: 'Dos', mat: 'Poulie haute + poignée', d: ['Dos'], i: ['Biceps'],
    pourquoi: 'Travailler un bras à la fois permet un étirement plus grand et corrige les déséquilibres gauche/droite.',
    etapes: [
      'Poignée simple, paume tournée vers l’intérieur. Commence par ton côté le plus faible.',
      'Bras tendu en haut, laisse l’épaule monter un peu pour étirer tout le flanc.',
      'Tire le coude vers la hanche, le long du corps.',
      'Remonte en 2 secondes, puis 30 s de repos avant l’autre bras (voir « Temps de repos »).',
    ],
    erreurs: ['Pivoter tout le buste pour tirer', 'Couper l’étirement en haut', 'Tirer la main vers l’épaule au lieu du coude vers la hanche'],
    conseil: 'Ton côté faible fixe le nombre de répétitions : le côté fort fait le même nombre, pas plus.',
    variantes: ['Traction en supination', 'Tirage vertical à la machine'],
  },
  th_large: {
    nom: 'Tirage horizontal prise large', court: 'Tirage horizontal large', cat: 'Dos', mat: 'Poulie basse + barre', d: ['Dos'], i: ['Biceps', 'Épaules'],
    pourquoi: 'Cible l’épaisseur du haut du dos : rhomboïdes, trapèzes moyens et arrière d’épaule.',
    etapes: [
      'Assis, pieds sur la plateforme, genoux légèrement fléchis. Barre large, paumes vers le bas.',
      'Bras tendus, laisse le buste s’avancer légèrement pour étirer le haut du dos.',
      'Tire la barre vers le bas des pectoraux, coudes écartés à environ 45–60°, en serrant les omoplates.',
      'Reviens en 2 secondes jusqu’à l’étirement complet.',
    ],
    erreurs: ['Se balancer d’avant en arrière', 'Hausser les épaules en tirant', 'Raccourcir l’étirement'],
    conseil: 'Le buste bouge un peu, mais reste maître du mouvement : pas d’élan.',
    variantes: ['Rowing aux haltères', 'Rowing buste penché', 'Rowing T-bar'],
  },
  th_neutre_uni: {
    nom: 'Tirage horizontal prise neutre unilatéral', court: 'Tirage horizontal unilatéral', cat: 'Dos', mat: 'Poulie basse + poignée', d: ['Dos'], i: ['Biceps'],
    pourquoi: 'Coude près du corps : c’est le grand dorsal qui prend le relais, avec un étirement maximal.',
    etapes: [
      'Poignée simple, paume vers l’intérieur. L’autre main sur la cuisse.',
      'Bras tendu, laisse l’épaule avancer et le buste pivoter légèrement : étirement.',
      'Tire le coude vers la hanche en arc de cercle, le buste se redresse.',
      'Reviens en 2 secondes. Commence par ton côté le plus faible.',
    ],
    erreurs: ['Tirer avec le biceps (coude qui reste devant)', 'Rotation excessive du buste', 'Épaule qui monte vers l’oreille'],
    conseil: 'Vise la poche arrière de ton pantalon avec le coude.',
    variantes: ['Rowing haltère coude serré', 'Rowing buste penché coudes serrés'],
  },
  face_pull: {
    nom: 'Face pull', cat: 'Épaules', mat: 'Poulie + corde', d: ['Épaules'], i: ['Dos', 'Biceps'],
    pourquoi: 'Renforce l’arrière des épaules et les rotateurs externes : esthétique et santé des épaules.',
    etapes: [
      'Poulie à hauteur du front, corde en main, pouces vers l’arrière.',
      'Recule d’un pas pour mettre le câble en tension, bras tendus.',
      'Tire la corde vers le visage en écartant les mains, coudes hauts.',
      'Termine les mains à hauteur des oreilles, 1 seconde de contraction, puis reviens en 2 secondes.',
    ],
    erreurs: ['Charge trop lourde : le dos et les bras compensent', 'Coudes qui descendent', 'Se pencher en arrière'],
    conseil: 'Pense « double biceps » en fin de mouvement : c’est la position recherchée.',
    variantes: ['Pec deck inversé', 'Oiseau aux haltères'],
  },
  upright_row: {
    nom: 'Upright row (tirage menton)', court: 'Upright row', cat: 'Épaules', mat: 'Barre ou poulie', d: ['Épaules', 'Trapèzes'], i: ['Biceps'],
    pourquoi: 'Un des rares exercices qui charge lourd le deltoïde latéral et le haut des trapèzes en même temps.',
    etapes: [
      'Barre en pronation, mains un peu plus larges que les épaules.',
      'Monte les coudes vers le haut et l’extérieur, la barre reste proche du corps.',
      'Arrête-toi quand les coudes arrivent à hauteur d’épaules.',
      'Redescends en 2 secondes.',
    ],
    erreurs: ['Prise trop serrée : stress inutile sur l’épaule', 'Monter les coudes au-dessus des épaules si ça pince', 'Donner de l’élan avec les jambes'],
    conseil: 'Si tu ressens une gêne, élargis la prise ou passe à la poulie : le trajet devient plus libre.',
    variantes: ['Élévations latérales aux haltères', 'Élévations latérales à la poulie', 'Élévations latérales à la machine'],
  },
  elev_halteres: {
    nom: 'Élévations latérales aux haltères', court: 'Élévations latérales', cat: 'Épaules', mat: 'Haltères', d: ['Épaules'], i: ['Trapèzes'],
    pourquoi: 'L’exercice de base pour élargir les épaules (deltoïde latéral).',
    etapes: [
      'Debout, buste très légèrement penché vers l’avant, coudes légèrement fléchis.',
      'Monte les bras sur les côtés jusqu’à l’horizontale, en menant avec les coudes.',
      'Garde les épaules basses : ce ne sont pas les trapèzes qui doivent monter.',
      'Redescends en 2 secondes, sans élan.',
    ],
    erreurs: ['Balancer le buste pour lancer les haltères', 'Monter beaucoup plus haut que l’horizontale', 'Charge trop lourde'],
    conseil: 'C’est un petit muscle : prends léger, cherche la brûlure en fin de série.',
    variantes: ['Upright row', 'Élévations latérales à la machine', 'Élévations latérales à la poulie'],
  },
  elev_poulie: {
    nom: 'Élévations latérales à la poulie', court: 'Élévations poulie', cat: 'Épaules', mat: 'Poulie basse + poignée', d: ['Épaules'], i: ['Trapèzes'],
    pourquoi: 'Contrairement aux haltères, la poulie garde le muscle sous tension en bas, quand il est étiré.',
    etapes: [
      'Poulie au plus bas. Place-toi de profil et prends la poignée avec la main opposée à la poulie : le câble passe devant toi.',
      'Tiens-toi au montant avec l’autre main.',
      'Monte le bras sur le côté jusqu’à l’horizontale, coude légèrement fléchi.',
      'Redescends en 2 secondes jusqu’à l’étirement. Commence par ton côté faible.',
    ],
    erreurs: ['Pencher tout le corps pour monter', 'Monter trop haut', 'Laisser la charge retomber'],
    conseil: 'Laisse la main passer devant le bassin en bas : tu gagnes de l’amplitude.',
    variantes: ['Élévations latérales aux haltères', 'Upright row', 'Élévations latérales à la machine'],
  },
  curl_poulie_uni: {
    nom: 'Curl dos à la poulie unilatéral', court: 'Curl dos à la poulie', cat: 'Bras', mat: 'Poulie + poignée', d: ['Biceps'], i: [],
    pourquoi: 'Le bras passe derrière le corps : le biceps travaille en position très étirée, là où il grossit le mieux.',
    etapes: [
      'Dos à la poulie (réglée basse), poignée en main, un pied en avant pour la stabilité.',
      'Laisse le bras partir derrière le corps, tendu : tu sens l’étirement du biceps.',
      'Fléchis le coude jusqu’à la contraction complète sans avancer le coude.',
      'Redescends en 2 secondes jusqu’à l’étirement complet. Commence par ton côté faible.',
    ],
    erreurs: ['Avancer le coude pendant la montée', 'Couper l’étirement en bas', 'Charge trop lourde qui oblige à tricher'],
    conseil: 'Plus tu fais un pas en avant, plus l’étirement est fort.',
    variantes: ['Curl incliné aux haltères', 'Curl barre EZ', 'Curl haltère'],
  },
  curl_marteau: {
    nom: 'Curl haltères prise marteau', court: 'Curl marteau', cat: 'Bras', mat: 'Haltères', d: ['Biceps'], i: [],
    pourquoi: 'La prise neutre recrute fortement le brachial et le brachio-radial : des bras plus épais.',
    etapes: [
      'Debout, haltères le long du corps, paumes face à face.',
      'Coudes collés au corps, monte les haltères sans bouger les coudes.',
      'Contracte en haut une demi-seconde.',
      'Redescends en 2 secondes jusqu’à l’extension complète.',
    ],
    erreurs: ['Balancer le buste', 'Coudes qui avancent', 'Amplitude coupée en bas'],
    conseil: 'Tu peux alterner les bras si tu as du mal à rester strict.',
    variantes: ['Curl marteau à la poulie (corde)', 'Curl marteau au pupitre'],
  },
  curl_pupitre: {
    nom: 'Curl pupitre', cat: 'Bras', mat: 'Pupitre + barre EZ', d: ['Biceps'], i: [],
    pourquoi: 'Le pupitre bloque le bras : impossible de tricher, et le biceps est très chargé en bas, en étirement.',
    etapes: [
      'Aisselles calées en haut du pupitre, arrière des bras à plat sur le coussin.',
      'Prends la barre en supination (paumes vers le haut).',
      'Monte sans décoller les bras du coussin.',
      'Redescends en 2 secondes jusqu’à une extension quasi complète.',
    ],
    erreurs: ['Laisser tomber la barre en bas (risque pour le coude)', 'Décoller les bras du pupitre', 'Hausser les épaules'],
    conseil: 'La partie basse est la plus importante : ne la raccourcis jamais.',
    variantes: ['Curl pupitre à la machine', 'Curl pupitre unilatéral sur banc incliné'],
  },
  ext_nuque: {
    nom: 'Extension triceps à la poulie nuque', court: 'Extension nuque', cat: 'Bras', mat: 'Poulie + corde', d: ['Triceps'], i: [],
    pourquoi: 'Bras au-dessus de la tête, le chef long du triceps est étiré : il se développe nettement plus qu’en bras le long du corps.',
    etapes: [
      'Dos à la poulie, corde derrière la tête, un pied en avant, buste incliné vers l’avant.',
      'Coudes près de la tête, pointés vers l’avant : ils ne bougent plus.',
      'Laisse les mains descendre derrière la tête jusqu’à l’étirement.',
      'Tends complètement les bras vers l’avant, puis reviens en 2 secondes.',
    ],
    erreurs: ['Coudes qui s’écartent', 'Bouger les épaules au lieu des coudes', 'Couper l’étirement derrière la tête'],
    conseil: 'Gaine bien le ventre : c’est lui qui t’empêche de cambrer.',
    variantes: ['Barre au front', 'Barre au front aux haltères'],
  },
  ext_nuque_uni: {
    nom: 'Extension triceps à la poulie nuque unilatéral', court: 'Extension nuque unilatérale', cat: 'Bras', mat: 'Poulie + poignée', d: ['Triceps'], i: [],
    pourquoi: 'La version un bras permet de mieux sentir le triceps et d’aller chercher plus d’étirement.',
    etapes: [
      'Dos à la poulie, poignée en main, buste incliné, un pied devant.',
      'Coude près de la tête, pointé vers l’avant.',
      'Laisse la main descendre derrière la tête, puis tends complètement le bras.',
      'Commence par ton côté faible (30 s de repos entre les deux bras).',
    ],
    erreurs: ['Coude qui part sur le côté', 'Tourner le buste', 'Amplitude partielle'],
    conseil: 'Pose ta main libre sur le coude qui travaille pour le garder fixe.',
    variantes: ['Barre au front', 'Barre au front aux haltères'],
  },
  hyperextension: {
    nom: 'Hyperextension', cat: 'Jambes', mat: 'Banc à 45°', d: ['Fessiers', 'Ischios'], i: ['Dos'],
    pourquoi: 'Renforce toute la chaîne arrière : fessiers, ischios et lombaires.',
    etapes: [
      'Règle le coussin juste sous les hanches (pas sur le ventre) pour pouvoir plier aux hanches.',
      'Bras croisés sur la poitrine, ou un disque contre toi pour lester.',
      'Descends en pliant aux hanches, dos neutre.',
      'Remonte en serrant les fessiers jusqu’à l’alignement du corps, sans hyper-cambrer.',
    ],
    erreurs: ['Coussin trop haut : le mouvement se bloque', 'Hyper-cambrer en haut', 'Descendre en arrondissant fortement le dos'],
    conseil: 'Arrondis très légèrement le haut du dos pour mettre encore plus l’accent sur les fessiers.',
    variantes: ['SDT jambes tendues', 'Hip thrust', 'Leg curl allongé'],
  },
  leg_curl: {
    nom: 'Leg curl assis', cat: 'Jambes', mat: 'Machine', d: ['Ischios'], i: [],
    pourquoi: 'Assis, la hanche est fléchie : les ischios sont plus étirés qu’allongé, et ils grossissent davantage.',
    etapes: [
      'Aligne l’axe de la machine avec tes genoux. Le rouleau se place juste au-dessus des chevilles.',
      'Bloque bien les cuisses avec le coussin supérieur.',
      'Fléchis les genoux au maximum, 1 seconde de contraction.',
      'Remonte en 2 secondes jusqu’à l’extension complète.',
    ],
    erreurs: ['Décoller les fesses du siège', 'Amplitude coupée', 'Revenir trop vite'],
    conseil: 'Si la machine le permet, penche légèrement le buste vers l’avant : encore plus d’étirement.',
    variantes: ['Leg curl allongé'],
  },
  leg_ext: {
    nom: 'Leg extension', cat: 'Jambes', mat: 'Machine', d: ['Quadriceps'], i: [],
    pourquoi: 'Isole les quadriceps, y compris le droit fémoral que le squat travaille peu.',
    etapes: [
      'Aligne l’axe de la machine avec tes genoux, rouleau sur le bas du tibia.',
      'Incline le dossier vers l’arrière si possible : plus d’étirement du droit fémoral.',
      'Tends complètement les jambes, 1 seconde de contraction.',
      'Redescends en 2 secondes en allant chercher l’amplitude complète.',
    ],
    erreurs: ['Donner un coup de rein pour lancer', 'Ne pas tendre complètement', 'Laisser retomber la charge'],
    conseil: 'Tiens fermement les poignées pour rester collé au siège.',
    variantes: ['Sissy squat'],
  },
  mollets: {
    nom: 'Extension mollets jambes tendues', court: 'Mollets debout', cat: 'Jambes', mat: 'Machine ou marche', d: ['Mollets'], i: [],
    pourquoi: 'Jambes tendues, le gastrocnémien (la partie visible du mollet) travaille beaucoup plus qu’assis.',
    etapes: [
      'Avant des pieds sur la marche, talons dans le vide, jambes tendues (genoux non verrouillés).',
      'Descends le plus bas possible et marque 1 à 2 secondes de pause en étirement.',
      'Monte le plus haut possible sur la pointe des pieds.',
      'Pas de rebond : le tendon d’Achille ne doit pas faire le travail.',
    ],
    erreurs: ['Rebondir en bas', 'Plier les genoux', 'Amplitude de quelques centimètres'],
    conseil: 'La pause en bas fait toute la différence : c’est là que le mollet grandit.',
    variantes: ['N’importe quelle extension de mollets jambes tendues : presse, Smith machine, unilatéral sur marche'],
  },
  leves_genoux: {
    nom: 'Levés de genoux', cat: 'Abdos', mat: 'Chaise romaine', d: ['Abdos'], i: [],
    pourquoi: 'Un des exercices qui recrutent le plus le grand droit et les obliques.',
    etapes: [
      'Avant-bras sur les accoudoirs, dos contre le dossier, jambes pendantes.',
      'Monte les genoux vers la poitrine en enroulant le bassin : le bas du dos décolle légèrement.',
      'Contracte 1 seconde en haut.',
      'Redescends en 2 secondes sans te balancer.',
    ],
    erreurs: ['Se balancer pour lancer les jambes', 'Monter les genoux sans enrouler le bassin', 'Descendre trop vite'],
    conseil: 'Quand 20 répétitions deviennent faciles, tends davantage les jambes ou tiens un haltère entre les pieds.',
    variantes: ['Crunch à la poulie'],
  },
  pec_deck: {
    nom: 'Pec deck', cat: 'Pectoraux', mat: 'Machine', d: ['Pectoraux'], i: [],
    pourquoi: 'Isole les pectoraux avec une tension constante, sans fatiguer les triceps.',
    etapes: [
      'Règle le siège pour que les poignées soient à hauteur de poitrine.',
      'Bras ouverts, coudes légèrement fléchis : tu sens l’étirement des pectoraux.',
      'Ramène les bras devant toi en serrant la poitrine.',
      'Reviens en 2 secondes jusqu’à l’étirement.',
    ],
    erreurs: ['Décoller le dos du dossier', 'Plier les coudes en cours de route', 'Couper l’étirement'],
    conseil: 'Pense à rapprocher tes biceps l’un de l’autre, pas tes mains.',
    variantes: ['Écartés poulie vis-à-vis', 'Machine à écartés'],
  },
  pec_deck_inv: {
    nom: 'Pec deck inversé', cat: 'Épaules', mat: 'Machine', d: ['Épaules'], i: ['Dos'],
    pourquoi: 'Le plus simple pour isoler le deltoïde postérieur, souvent sous-développé.',
    etapes: [
      'Face à la machine, poitrine contre le coussin, poignées à hauteur d’épaules.',
      'Bras tendus devant toi, coudes très légèrement fléchis.',
      'Ouvre les bras en arc de cercle vers l’arrière jusqu’à l’alignement avec les épaules.',
      'Reviens en 2 secondes.',
    ],
    erreurs: ['Serrer fort les omoplates (le dos prend le relais)', 'Plier les coudes', 'Aller trop loin en arrière'],
    conseil: 'Pense « écarter » et non « tirer ».',
    variantes: ['Face pull', 'Oiseau aux haltères', 'Oiseau à la poulie'],
  },
  balancier_avant: {
    nom: 'Balancement de jambe avant/arrière', court: 'Balancement avant/arrière', cat: 'Échauffement', mat: 'Un support', d: [], i: [], echauf: true,
    pourquoi: 'Mobilise les hanches et prépare ischios, fessiers et fléchisseurs de hanche.',
    etapes: ['Tiens-toi à un support, debout sur une jambe.', 'Balance l’autre jambe d’avant en arrière, amplitude progressive.', '15 répétitions par jambe.'],
    erreurs: ['Cambrer le bas du dos', 'Amplitude maximale dès la 1re répétition'],
    conseil: 'Reste détendu : c’est un mouvement fluide, pas un étirement forcé.', variantes: [],
  },
  balancier_lateral: {
    nom: 'Balancement latéral de jambe', court: 'Balancement latéral', cat: 'Échauffement', mat: 'Un support', d: [], i: [], echauf: true,
    pourquoi: 'Mobilise les hanches sur le côté : adducteurs et fessiers.',
    etapes: ['Face au support, mains posées dessus.', 'Balance une jambe de gauche à droite devant toi.', '15 répétitions par jambe.'],
    erreurs: ['Tourner le bassin', 'Aller trop vite'],
    conseil: 'Augmente l’amplitude à chaque passage.', variantes: [],
  },
  rot_externe: {
    nom: 'Rotation externe à la poulie ou à l’élastique', court: 'Rotation externe', cat: 'Échauffement', mat: 'Poulie ou élastique', d: [], i: [], echauf: true,
    pourquoi: 'Active la coiffe des rotateurs (infra-épineux) avant les séances du haut du corps.',
    etapes: ['Coude collé au corps, plié à 90°, câble venant du côté opposé.', 'Ouvre l’avant-bras vers l’extérieur sans décoller le coude.', '15 répétitions par côté, charge très légère.'],
    erreurs: ['Décoller le coude', 'Prendre lourd'],
    conseil: 'Un petit coussin ou une serviette entre le coude et le corps aide à rester strict.', variantes: [],
  },
  rot_interne: {
    nom: 'Rotation interne à la poulie ou à l’élastique', court: 'Rotation interne', cat: 'Échauffement', mat: 'Poulie ou élastique', d: [], i: [], echauf: true,
    pourquoi: 'Active le sous-scapulaire et équilibre le travail de la coiffe des rotateurs.',
    etapes: ['Coude collé au corps, plié à 90°, câble venant du côté du bras.', 'Ramène l’avant-bras vers le ventre.', '15 répétitions par côté, charge très légère.'],
    erreurs: ['Pivoter le buste', 'Prendre lourd'],
    conseil: 'Mouvement lent et contrôlé.', variantes: [],
  },
};

// ───────── Programme 5 jours ─────────
// rir : RIR visé série par série (P = partielles en fin de série) · repos en minutes
export const PROGRAMME = [
  {
    id: 'j1', jour: 'Jour 1', titre: 'Haut du corps · Force', focus: 'Pecs · Dos · Bras', duree: '70 min', echauf: 'haut',
    ex: [
      { id: 'dc_barre', s: 4, reps: '6–8', rir: ['2', '2', '1', '1'], repos: '3 min', ech: true },
      { id: 'tv_large', s: 4, reps: '8–12', rir: ['2', '2', '1', '0'], repos: '2 min', ech: true },
      { id: 'dips', s: 3, reps: '8–12', rir: ['2', '1', '0'], repos: '2 min' },
      { id: 'upright_row', ss: 'A1', s: 3, reps: '12–15', rir: ['2', '1', '0'], repos: '1 min 30' },
      { id: 'face_pull', ss: 'A2', s: 3, reps: '12–15', rir: ['2', '1', '0'], repos: '1 min 30' },
      { id: 'curl_poulie_uni', ss: 'B1', s: 3, reps: '10–15', rir: ['1', '1', '0+P'], repos: '30 s → 1 min' },
      { id: 'ext_nuque', ss: 'B2', s: 3, reps: '10–15', rir: ['1', '1', '0+P'], repos: '1 min 30' },
    ],
  },
  {
    id: 'j2', jour: 'Jour 2', titre: 'Bas du corps · Quadriceps', focus: 'Quadris · Ischios · Mollets · Abdos', duree: '70 min', echauf: 'jambes',
    ex: [
      { id: 'squat', s: 4, reps: '6–10', rir: ['2', '2', '1', '1'], repos: '3 min', ech: true },
      { id: 'sdt', s: 3, reps: '8–12', rir: ['2', '2', '1'], repos: '2 min 30', ech: true },
      { id: 'leg_ext', ss: 'A1', s: 3, reps: '12–15', rir: ['1', '1', '0+P'], repos: '1 min 30' },
      { id: 'leg_curl', ss: 'A2', s: 3, reps: '10–15', rir: ['1', '1', '0+P'], repos: '1 min 30' },
      { id: 'mollets', ss: 'B1', s: 5, reps: '10–15', rir: ['1', '1', '1', '0', '0'], repos: '1 min' },
      { id: 'leves_genoux', ss: 'B2', s: 4, reps: '10–20', rir: ['1', '1', '0', '0'], repos: '1 min' },
    ],
  },
  {
    id: 'j3', jour: 'Jour 3', titre: 'Haut du corps · Dos & épaules', focus: 'Dos · Épaules · Bras', duree: '75 min', echauf: 'haut',
    ex: [
      { id: 'di_barre', s: 4, reps: '6–10', rir: ['2', '2', '1', '1'], repos: '2 min 30', ech: true },
      { id: 'th_large', s: 3, reps: '8–12', rir: ['2', '1', '0'], repos: '2 min', ech: true },
      { id: 'tv_neutre_uni', s: 3, reps: '10–12', rir: ['2', '1', '0'], repos: '30 s → 1 min' },
      { id: 'dm_machine', s: 3, reps: '8–12', rir: ['2', '1', '0'], repos: '2 min' },
      { id: 'elev_poulie', s: 3, reps: '12–20', rir: ['1', '0', '0+P'], repos: '30 s → 1 min' },
      { id: 'curl_pupitre', ss: 'A1', s: 3, reps: '10–12', rir: ['1', '1', '0'], repos: '1 min 30' },
      { id: 'ext_nuque_uni', ss: 'A2', s: 3, reps: '10–15', rir: ['1', '1', '0'], repos: '30 s → 1 min' },
    ],
  },
  {
    id: 'j4', jour: 'Jour 4', titre: 'Bas du corps · Chaîne arrière', focus: 'Ischios · Fessiers · Mollets · Abdos', duree: '70 min', echauf: 'jambes',
    ex: [
      { id: 'sdt', s: 3, reps: '8–10', rir: ['2', '1', '1'], repos: '2 min 30', ech: true },
      { id: 'squat', s: 3, reps: '8–12', rir: ['2', '2', '1'], repos: '2 min 30', ech: true },
      { id: 'leg_curl', ss: 'A1', s: 3, reps: '10–15', rir: ['1', '1', '0+P'], repos: '1 min 30' },
      { id: 'leg_ext', ss: 'A2', s: 2, reps: '12–15', rir: ['1', '0+P'], repos: '1 min 30' },
      { id: 'hyperextension', s: 3, reps: '10–15', rir: ['2', '1', '0'], repos: '1 min 30' },
      { id: 'mollets', ss: 'B1', s: 5, reps: '10–15', rir: ['1', '1', '1', '0', '0'], repos: '1 min' },
      { id: 'leves_genoux', ss: 'B2', s: 4, reps: '10–20', rir: ['1', '1', '0', '0'], repos: '1 min' },
    ],
  },
  {
    id: 'j5', jour: 'Jour 5', titre: 'Haut du corps · Pecs, épaules & bras', focus: 'Pecs · Épaules · Bras', duree: '65 min', echauf: 'haut',
    ex: [
      { id: 'pec_deck', s: 3, reps: '10–15', rir: ['2', '1', '0'], repos: '1 min 30' },
      { id: 'th_neutre_uni', s: 3, reps: '10–12', rir: ['2', '1', '0'], repos: '30 s → 1 min' },
      { id: 'elev_halteres', s: 4, reps: '12–20', rir: ['1', '1', '0', '0+P'], repos: '1 min 30' },
      { id: 'pec_deck_inv', s: 3, reps: '12–20', rir: ['1', '1', '0'], repos: '1 min 30' },
      { id: 'curl_marteau', ss: 'A1', s: 3, reps: '10–12', rir: ['1', '1', '0'], repos: '1 min 30' },
      { id: 'ext_nuque', ss: 'A2', s: 3, reps: '12–15', rir: ['1', '1', '0+P'], repos: '1 min 30' },
    ],
  },
];

export const SEMAINE = [
  { j: 'Lun', s: 'j1' }, { j: 'Mar', s: 'j2' }, { j: 'Mer', s: 'j3' }, { j: 'Jeu', s: null },
  { j: 'Ven', s: 'j4' }, { j: 'Sam', s: 'j5' }, { j: 'Dim', s: null },
];

export const ECHAUFFEMENT = {
  jambes: [
    { ex: 'Cardio à intensité faible à modérée', series: '—', reps: '5 min', note: 'Vélo de préférence. Vise 100 à 135 battements par minute.' },
    { ex: 'Balancement de jambe avant/arrière', id: 'balancier_avant', series: '1', reps: '15', note: '15 par jambe' },
    { ex: 'Balancement latéral de jambe', id: 'balancier_lateral', series: '1', reps: '15', note: '15 par jambe' },
  ],
  haut: [
    { ex: 'Cardio à intensité faible à modérée', series: '—', reps: '3 min', note: 'Rameur ou vélo. Vise 100 à 135 battements par minute.' },
    { ex: 'Mobilité dynamique', series: '—', reps: '2 min', note: 'Cercles de bras, rotations d’épaules, ouvertures de poitrine.' },
    { ex: 'Rotation externe poulie ou élastique', id: 'rot_externe', series: '1', reps: '15', note: '15 par côté, très léger' },
    { ex: 'Rotation interne poulie ou élastique', id: 'rot_interne', series: '1', reps: '15', note: '15 par côté, très léger' },
  ],
};

export const GLOSSAIRE = [
  ['Série', 'Un enchaînement de répétitions sans pause. « 3 séries de 10 » = 3 blocs de 10 répétitions.'],
  ['Répétition', 'Un mouvement complet : la descente et la remontée.'],
  ['RIR', 'Repetitions In Reserve : le nombre de répétitions que tu aurais encore pu faire avant l’échec. 2 RIR = tu t’arrêtes 2 répétitions avant de ne plus pouvoir.'],
  ['Échec musculaire', 'Le moment où tu ne peux plus faire une seule répétition avec une technique propre.'],
  ['Concentrique', 'La phase où le muscle se raccourcit pour soulever la charge (pousser la barre au développé couché).'],
  ['Excentrique', 'La phase où le muscle s’allonge en freinant la charge (la barre qui descend). C’est la phase à contrôler en 2 secondes.'],
  ['Tempo', 'La vitesse d’exécution. Dans ce programme : 2 s de descente, pas de pause, montée explosive.'],
  ['Superset (A1/A2)', 'Deux exercices alternés : série de A1, repos, série de A2, repos, et ainsi de suite.'],
  ['Partielles (P)', 'Une fois l’échec atteint, tu continues avec des demi-répétitions dans la partie étirée jusqu’à ne plus pouvoir bouger la charge.'],
  ['Dropset', 'À l’échec, tu baisses le poids d’environ 20 à 30 % et tu continues la série sans repos.'],
  ['Rest-pause', 'À l’échec, tu poses la charge 10 à 15 secondes puis tu reprends avec le même poids pour quelques répétitions de plus.'],
  ['Polyarticulaire', 'Mouvement qui fait bouger plusieurs articulations et donc plusieurs muscles (squat, développé couché, tirage).'],
  ['Monoarticulaire', 'Mouvement qui ne fait bouger qu’une articulation (curl, leg extension, élévations latérales).'],
  ['Volume', 'Le nombre de séries proches de l’échec réalisées par muscle et par semaine.'],
  ['Surcharge progressive', 'Faire un peu plus que la fois précédente : une répétition ou un peu de poids en plus.'],
  ['Deload', 'Une semaine allégée (moins de séries, plus loin de l’échec) pour faire retomber la fatigue.'],
  ['Valsalva', 'Bloquer l’air dans le ventre gonflé pendant l’effort pour rigidifier le tronc sur les mouvements lourds.'],
  ['Maintenance', 'Le nombre de calories qui te fait garder le même poids.'],
  ['Recomposition', 'Perdre du gras et prendre du muscle en même temps.'],
  ['Sèche', 'Perdre du gras en conservant ses muscles.'],
  ['Prise de masse', 'Manger légèrement plus que ta maintenance pour maximiser la prise de muscle.'],
];

// ───────── Références (sélection) ─────────
export const REFS = {
  'Entraînement': [
    ['Plotkin D, et al. Progressive overload without progressing load? The effects of load or repetition progression on muscular adaptations. PeerJ, 2022.', '10.7717/peerj.14142'],
    ['Refalo MC, Helms ER, Trexler ET, Hamilton DL, Fyfe JJ. Influence of Resistance Training Proximity-to-Failure on Skeletal Muscle Hypertrophy: A Systematic Review with Meta-analysis. Sports Med, 2023.', '10.1007/s40279-022-01784-y'],
    ['Grgic J, Schoenfeld BJ, Orazem J, Sabol F. Effects of resistance training performed to repetition failure or non-failure on muscular strength and hypertrophy. J Sport Health Sci, 2022.', '10.1016/j.jshs.2021.01.007'],
    ['Refalo MC, et al. Influence of Resistance Training Proximity-to-Failure, Determined by Repetitions-in-Reserve, on Neuromuscular Fatigue. Sports Med Open, 2023.', '10.1186/s40798-023-00554-y'],
    ['Schoenfeld BJ, Ogborn D, Krieger JW. Dose-response relationship between weekly resistance training volume and increases in muscle mass. J Sports Sci, 2017.', '10.1080/02640414.2016.1210197'],
    ['Baz-Valle E, et al. A Systematic Review of the Effects of Different Resistance Training Volumes on Muscle Hypertrophy. J Hum Kinet, 2022.', '10.2478/hukin-2022-0017'],
    ['Schoenfeld BJ, et al. Resistance Training Volume Enhances Muscle Hypertrophy but Not Strength in Trained Men. Med Sci Sports Exerc, 2019.', '10.1249/MSS.0000000000001764'],
    ['Schoenfeld BJ, et al. Longer Interset Rest Periods Enhance Muscle Strength and Hypertrophy in Resistance-Trained Men. J Strength Cond Res, 2016.', '10.1519/JSC.0000000000001272'],
    ['Lopez P, et al. Resistance Training Load Effects on Muscle Hypertrophy and Strength Gain: Systematic Review and Network Meta-analysis. Med Sci Sports Exerc, 2021.', '10.1249/MSS.0000000000002585'],
    ['Schoenfeld BJ, Ogborn DI, Krieger JW. Effect of repetition duration during resistance training on muscle hypertrophy: a systematic review and meta-analysis. Sports Med, 2015.', '10.1007/s40279-015-0304-0'],
    ['Wilk M, Zajac A, Tufano JJ. The Influence of Movement Tempo During Resistance Training on Muscular Strength and Hypertrophy Responses: A Review. Sports Med, 2021.', '10.1007/s40279-021-01465-2'],
    ['Paz GA, et al. Volume Load and Neuromuscular Fatigue During an Acute Bout of Agonist-Antagonist Paired-Set vs. Traditional-Set Training. J Strength Cond Res, 2017.', '10.1519/JSC.0000000000001059'],
    ['Maeo S, et al. Triceps brachii hypertrophy is substantially greater after elbow extension training performed in the overhead versus neutral arm position. Eur J Sport Sci, 2023.', '10.1080/17461391.2022.2100279'],
    ['Wolf M, et al. Partial Vs Full Range of Motion Resistance Training: A Systematic Review and Meta-Analysis. Int J Strength Cond, 2023.', '10.47206/ijsc.v3i1.182'],
    ['Kassiano W, et al. Which ROMs Lead to Rome? A Systematic Review of the Effects of Range of Motion on Muscle Hypertrophy. J Strength Cond Res, 2023.', '10.1519/JSC.0000000000004415'],
    ['Pedrosa GF, et al. Partial range of motion training elicits favorable improvements in muscular adaptations when carried out at long muscle lengths. Eur J Sport Sci, 2022.', '10.1080/17461391.2021.1927199'],
    ['Haugen ME, et al. Effect of free-weight vs. machine-based strength training on maximal strength, hypertrophy and jump performance. BMC Sports Sci Med Rehabil, 2023.', '10.1186/s13102-023-00713-4'],
    ['Hernández-Belmonte A, et al. Free-Weight and Machine-Based Training Are Equally Effective on Strength and Hypertrophy. Med Sci Sports Exerc, 2023.', '10.1249/MSS.0000000000003271'],
    ['Kinoshita M, et al. Triceps surae muscle hypertrophy is greater after standing versus seated calf-raise training. Front Physiol, 2023.', '10.3389/fphys.2023.1272106'],
    ['Costa BDV, et al. Does Performing Different Resistance Exercises for the Same Muscle Group Induce Non-homogeneous Hypertrophy? Int J Sports Med, 2021.', '10.1055/a-1308-3674'],
    ['Enes A, et al. Rest-pause and drop-set training elicit similar strength and hypertrophy adaptations compared with traditional sets in resistance-trained males. Appl Physiol Nutr Metab, 2021.', '10.1139/apnm-2021-0278'],
    ['Coleman M, et al. Muscular Adaptations in Drop Set vs. Traditional Training: A Meta-analysis. Int J Strength Cond, 2022.', '10.47206/ijsc.v2i1.135'],
    ['Gantois P, et al. Mental Fatigue From Smartphone Use Reduces Volume-Load in Resistance Training. Percept Mot Skills, 2021.', '10.1177/00315125211016233'],
    ['Ogasawara R, et al. Comparison of muscle hypertrophy following 6-month of continuous and periodic strength training. Eur J Appl Physiol, 2013.', '10.1007/s00421-012-2511-9'],
    ['Lörinczi F, et al. Nose vs. mouth breathing — acute effect of different breathing regimens on muscular endurance. BMC Sports Sci Med Rehabil, 2024.', '10.1186/s13102-024-00840-6'],
    ['Racinais S. Different effects of heat exposure upon exercise performance in the morning and afternoon. Scand J Med Sci Sports, 2010.', '10.1111/j.1600-0838.2010.01212.x'],
    ['Warneke K, et al. Foam rolling and stretching do not provide superior acute flexibility and stiffness improvements compared to any other warm-up intervention. J Sport Health Sci, 2024.', '10.1016/j.jshs.2024.01.006'],
    ['Reilly T, Piercy M. The effect of partial sleep deprivation on weight-lifting performance. Ergonomics, 1994.', '10.1080/00140139408963628'],
    ['Dattilo M, et al. Sleep and muscle recovery: endocrinological and molecular basis for a new and promising hypothesis. Med Hypotheses, 2011.', '10.1016/j.mehy.2011.04.017'],
    ['Nedeltcheva AV, et al. Insufficient sleep undermines dietary efforts to reduce adiposity. Ann Intern Med, 2010.', '10.7326/0003-4819-153-7-201010050-00006'],
  ],
  'Nutrition': [
    ['Morton RW, et al. A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults. Br J Sports Med, 2018.', '10.1136/bjsports-2017-097608'],
    ['Nunes EA, et al. Systematic review and meta-analysis of protein intake to support muscle mass and function in healthy adults. J Cachexia Sarcopenia Muscle, 2022.', '10.1002/jcsm.12922'],
    ['Trommelen J, et al. The anabolic response to protein ingestion during recovery from exercise has no upper limit in magnitude and duration in vivo in humans. Cell Rep Med, 2023.', '10.1016/j.xcrm.2023.101324'],
    ['Helms ER, et al. A systematic review of dietary protein during caloric restriction in resistance trained lean athletes: a case for higher intakes. Int J Sport Nutr Exerc Metab, 2014.', '10.1123/ijsnem.2013-0054'],
    ['Longland TM, et al. Higher compared with lower dietary protein during an energy deficit combined with intense exercise promotes greater lean mass gain and fat mass loss. Am J Clin Nutr, 2016.', '10.3945/ajcn.115.119339'],
    ['Ruiz-Castellano C, et al. Achieving an Optimal Fat Loss Phase in Resistance-Trained Athletes: A Narrative Review. Nutrients, 2021.', '10.3390/nu13093255'],
    ['Iraki J, et al. Nutrition Recommendations for Bodybuilders in the Off-Season: A Narrative Review. Sports, 2019.', '10.3390/sports7070154'],
    ['Robinson E, et al. A systematic review and meta-analysis examining the effect of eating rate on energy intake and hunger. Am J Clin Nutr, 2014.', '10.3945/ajcn.113.081745'],
    ['Clark MJ, Slavin JL. The effect of fiber on satiety and food intake: a systematic review. J Am Coll Nutr, 2013.', '10.1080/07315724.2013.791194'],
    ['VanWormer JJ, et al. The impact of regular self-weighing on weight management: a systematic literature review. Int J Behav Nutr Phys Act, 2008.', '10.1186/1479-5868-5-54'],
    ['Ramezani F, et al. Dietary fiber intake and all-cause and cause-specific mortality: an updated systematic review and meta-analysis of prospective cohort studies. Clin Nutr, 2024.', '10.1016/j.clnu.2023.11.005'],
  ],
  'Compléments': [
    ['Lanhers C, et al. Creatine Supplementation and Lower Limb Strength Performance: A Systematic Review and Meta-Analyses. Sports Med, 2015.', '10.1007/s40279-015-0337-4'],
    ['Lanhers C, et al. Creatine Supplementation and Upper Limb Strength Performance: A Systematic Review and Meta-Analysis. Sports Med, 2017.', '10.1007/s40279-016-0571-4'],
    ['Delpino FM, et al. Influence of age, sex, and type of exercise on the efficacy of creatine supplementation on lean body mass. Nutrition, 2022.', '10.1016/j.nut.2022.111791'],
    ['Prokopidis K, et al. Effects of creatine supplementation on memory in healthy individuals: a systematic review and meta-analysis. Nutr Rev, 2023.', '10.1093/nutrit/nuac064'],
    ['Guest NS, et al. International Society of Sports Nutrition position stand: caffeine and exercise performance. J Int Soc Sports Nutr, 2021.', '10.1186/s12970-020-00383-4'],
    ['Grgic J, et al. Wake up and smell the coffee: caffeine supplementation and exercise performance — an umbrella review of 21 published meta-analyses. Br J Sports Med, 2020.', '10.1136/bjsports-2018-100278'],
    ['Owen GN, et al. The combined effects of L-theanine and caffeine on cognitive performance and mood. Nutr Neurosci, 2008.', '10.1179/147683008X301513'],
    ['Haskell CF, et al. The effects of L-theanine, caffeine and their combination on cognition and mood. Biol Psychol, 2008.', '10.1016/j.biopsycho.2007.09.008'],
    ['Vårvik FT, et al. Acute Effect of Citrulline Malate on Repetition Performance During Strength Training: A Systematic Review and Meta-Analysis. Int J Sport Nutr Exerc Metab, 2021.', '10.1123/ijsnem.2020-0295'],
    ['Trexler ET, et al. Acute Effects of Citrulline Supplementation on High-Intensity Strength and Power Performance: A Systematic Review and Meta-Analysis. Sports Med, 2019.', '10.1007/s40279-019-01091-z'],
    ['Lopresti AL, et al. An investigation into the stress-relieving and pharmacological actions of an ashwagandha (Withania somnifera) extract. Medicine, 2019.', '10.1097/MD.0000000000017186'],
    ['Cheah KL, et al. Effect of Ashwagandha (Withania somnifera) extract on sleep: A systematic review and meta-analysis. PLoS One, 2021.', '10.1371/journal.pone.0257843'],
    ['Wankhede S, et al. Examining the effect of Withania somnifera supplementation on muscle strength and recovery: a randomized controlled trial. J Int Soc Sports Nutr, 2015.', '10.1186/s12970-015-0104-9'],
    ['Bonilla DA, et al. Effects of Ashwagandha (Withania somnifera) on Physical Performance: Systematic Review and Bayesian Meta-Analysis. J Funct Morphol Kinesiol, 2021.', '10.3390/jfmk6010020'],
  ],
};

export function nomCourt(id) { const e = EX[id]; return e ? (e.court || e.nom) : id; }

// Volume hebdomadaire calculé à partir du programme
export function volume() {
  const v = Object.fromEntries(GROUPS.map((g) => [g, { d: 0, i: 0 }]));
  for (const day of PROGRAMME) for (const x of day.ex) {
    const e = EX[x.id];
    for (const g of e.d) if (v[g]) v[g].d += x.s;
    for (const g of e.i) if (v[g] && !e.d.includes(g)) v[g].i += x.s;
  }
  return v;
}

export const MUSC = {
  pecs: 'Pectoraux', delts_ant: 'Deltoïde antérieur', delts_lat: 'Deltoïde latéral', delts_post: 'Deltoïde postérieur',
  traps: 'Trapèzes', upperback: 'Haut du dos', lats: 'Grand dorsal', biceps: 'Biceps', triceps: 'Triceps',
  forearms: 'Avant-bras', abs: 'Abdominaux', obliques: 'Obliques', lowerback: 'Lombaires', glutes: 'Fessiers',
  quads: 'Quadriceps', hams: 'Ischio-jambiers', calves: 'Mollets',
};
