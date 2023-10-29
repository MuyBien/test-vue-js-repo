export const BONUSES = {
  none: {
    name: "Aucun bonus",
    value: "none",
    icon: "/img/bonus-images/none.png",
    description: "N'a aucun effet sur le match.",
  },
  removeGoal: {
    name: "La valise à Nanard",
    value: "removeGoal",
    icon: "/img/bonus-images/valise-nanard.png",
    description: "Retire un but réel ou MPG à un joueur adverse.",
  },
  blockTacticalSubs: {
    name: "Tonton Pat",
    value: "blockTacticalSubs",
    icon: "/img/bonus-images/tonton-pat.png",
    description: "Aucun remplacement TACTIQUE adverse possible.",
  },
  removeRandomPlayer: {
    name: "Chapron Rouge",
    value: "removeRandomPlayer",
    icon: "/img/bonus-images/chapron-rouge.png",
    description: "Remplace un joueur de champ final (après les remplacements) par un Rotaldo.",
  },
  boostAllPlayers: {
    name: "Zahia",
    value: "boostAllPlayers",
    icon: "/img/bonus-images/zahia.png",
    description: "Ajoute un bonus de 0.5 à tous les joueurs titulaires (pas les remplaçants).",
  },
  fourStrikers: {
    name: "4 - Decat'",
    value: "fourStrikers",
    icon: "/img/bonus-images/4-decat.png",
    description: "Passe en 4-2-4 et aligne 4 attaquants.",
  },
  nerfGoalkeeper: {
    name: "Suarez",
    value: "nerfGoalkeeper",
    icon: "/img/bonus-images/suarez.png",
    description: "-1pt pour le gardien adverse.",
  },
  boostOnePlayer: {
    name: "UberEats",
    value: "boostOnePlayer",
    icon: "/img/bonus-images/uber-eats.png",
    description: "+1pt sur le joueur de votre choix.",
  },
  mirror: {
    name: "Miroir",
    value: "mirror",
    icon: "/img/bonus-images/mirror.png",
    description: "Le bonus de ton adversaire se retourne contre lui. MPG Calculator pourra bientôt calculer ce bonus selon les bonus restants à l'adversaire",
  },
};