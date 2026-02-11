import type { Enemy, EnemyCategory, Stats } from '@txtrpg/shared';

// ── Stat multipliers per enemy category ──
const CATEGORY_MULTIPLIERS: Record<EnemyCategory, { hp: number; stats: number; xp: number; gold: number }> = {
  weak:     { hp: 0.5,  stats: 0.6,  xp: 0.5,  gold: 0.3 },
  standard: { hp: 1.0,  stats: 1.0,  xp: 1.0,  gold: 1.0 },
  elite:    { hp: 1.8,  stats: 1.4,  xp: 2.0,  gold: 2.5 },
  miniboss: { hp: 3.0,  stats: 1.8,  xp: 4.0,  gold: 5.0 },
  boss:     { hp: 5.0,  stats: 2.2,  xp: 8.0,  gold: 10.0 },
};

// ── Themed enemy pools ──
interface EnemyTemplate {
  name: string;
  description: string;
}

const ENEMY_POOLS: Record<string, Record<EnemyCategory, EnemyTemplate[]>> = {
  medieval: {
    weak: [
      { name: 'Rat Géant', description: 'Un rongeur infesté par la magie noire, aux yeux rouges luisants.' },
      { name: 'Gobelin Éclaireur', description: 'Un petit gobelin vicieux armé d\'un couteau rouillé.' },
      { name: 'Squelette Errant', description: 'Les restes animés d\'un ancien soldat.' },
      { name: 'Loup Affamé', description: 'Un prédateur poussé par la faim hors de la forêt.' },
    ],
    standard: [
      { name: 'Bandit de Grand Chemin', description: 'Un hors-la-loi armé jusqu\'aux dents qui rançonne les voyageurs.' },
      { name: 'Orque Guerrier', description: 'Un combattant brutal à la peau verdâtre et aux crocs acérés.' },
      { name: 'Chevalier Maudit', description: 'Un ancien paladin corrompu par une malédiction ancestrale.' },
      { name: 'Golem de Pierre', description: 'Une construction magique animée pour garder ces lieux.' },
    ],
    elite: [
      { name: 'Général Orc', description: 'Un commandant redoutable à la tête d\'une horde sanguinaire.' },
      { name: 'Liche Mineure', description: 'Un nécromancien ayant défié la mort, entouré d\'une aura glaciale.' },
      { name: 'Manticore', description: 'Une créature mythique au corps de lion et à la queue de scorpion.' },
    ],
    miniboss: [
      { name: 'Dragon Jeune', description: 'Un dragon adolescent dont le souffle peut calciner l\'acier.' },
      { name: 'Seigneur Vampire', description: 'Un aristocrate immortel aux pouvoirs hypnotiques.' },
    ],
    boss: [
      { name: 'Dragon Ancien', description: 'Un dragon millénaire dont la seule présence fait trembler la terre.' },
      { name: 'Roi Démon', description: 'Le souverain des ténèbres, incarnation du mal absolu.' },
      { name: 'Archimage Corrompu', description: 'Un mage autrefois respecté, désormais consumé par une soif de pouvoir infinie.' },
    ],
  },
  'sci-fi': {
    weak: [
      { name: 'Drone de Reconnaissance', description: 'Un petit drone armé d\'un laser de faible puissance.' },
      { name: 'Xénomorphe Larve', description: 'Une créature alien au stade larvaire, rapide et venimeuse.' },
      { name: 'Robot de Maintenance', description: 'Un robot utilitaire dont le programme a été corrompu.' },
    ],
    standard: [
      { name: 'Soldat Clone', description: 'Un combattant produit en série, discipliné et sans pitié.' },
      { name: 'Alien Prédateur', description: 'Un chasseur extraterrestre dont l\'instinct de survie est mortel.' },
      { name: 'Cyborg Renégat', description: 'Un ancien soldat amélioré qui a brisé ses chaînes de commandement.' },
    ],
    elite: [
      { name: 'Mecha Lourd', description: 'Un exosquelette de combat blindé pilotant un arsenal dévastateur.' },
      { name: 'Reine Xenomorphe', description: 'La matriarche d\'une ruche alien, intelligente et impitoyable.' },
    ],
    miniboss: [
      { name: 'IA Tactique', description: 'Une intelligence artificielle militaire contrôlant un réseau de drones.' },
      { name: 'Amiral Pirate', description: 'Le capitaine d\'une flotte pirate interstellaire, rusé et cruel.' },
    ],
    boss: [
      { name: 'Titan Mécanique', description: 'Un colosse mécanique autonome, vestige d\'une civilisation disparue.' },
      { name: 'Entité Cosmique', description: 'Une forme de vie ancienne dont la conscience s\'étend à travers les étoiles.' },
    ],
  },
  steampunk: {
    weak: [
      { name: 'Automate Défectueux', description: 'Un petit automate à vapeur dont les rouages grincent dangereusement.' },
      { name: 'Rat Mécanique', description: 'Une vermine cybernétique infestant les conduits de vapeur.' },
    ],
    standard: [
      { name: 'Gentleman Assassin', description: 'Un tueur à gages élégant armé d\'un pistolet à éther.' },
      { name: 'Golem à Vapeur', description: 'Une machine de guerre alimentée par une chaudière rugissante.' },
      { name: 'Contrebandier Aérien', description: 'Un pirate des airs maniant sabre et pistolet.' },
    ],
    elite: [
      { name: 'Mécaduchesse', description: 'Une aristocrate augmentée de prothèses mécaniques mortelles.' },
      { name: 'Titan d\'Acier', description: 'Un colosse mécanique blindé de plaques rivetées.' },
    ],
    miniboss: [
      { name: 'Ingénieur Fou', description: 'Un inventeur génial mais dément, entouré de ses créations mortelles.' },
    ],
    boss: [
      { name: 'Léviathan à Vapeur', description: 'Un dirigeable-forteresse vivant, fusion de machine et de créature.' },
      { name: 'Lord Mécanique', description: 'Le maître de la guilde des ingénieurs, plus machine qu\'homme.' },
    ],
  },
  cyberpunk: {
    weak: [
      { name: 'Gang Member', description: 'Un voyou des bas-fonds armé d\'un couteau ionique bon marché.' },
      { name: 'Drone de Sécurité', description: 'Un drone corporate équipé d\'un taser non-létal... en théorie.' },
    ],
    standard: [
      { name: 'Netrunner Hostile', description: 'Un hacker de rue dont les implants neuraux crépitent d\'énergie.' },
      { name: 'Enforcer Corporate', description: 'Un agent de sécurité lourdement augmenté et programmé pour tuer.' },
      { name: 'Cyber-Samouraï', description: 'Un mercenaire aux lames rétractables intégrées dans les avant-bras.' },
    ],
    elite: [
      { name: 'Agent Black Ops', description: 'Un opérateur fantôme aux implants militaires classifiés.' },
      { name: 'Borg de Combat', description: 'Un être presque entièrement cybernétique, blindé et surarmé.' },
    ],
    miniboss: [
      { name: 'IA Rebelle', description: 'Une intelligence artificielle ayant pris le contrôle d\'un complexe entier.' },
    ],
    boss: [
      { name: 'PDG Transcendant', description: 'Le dirigeant d\'une mégacorp, fusionné avec le réseau, omniscient dans son domaine.' },
      { name: 'Architecte du Net', description: 'L\'entité qui contrôle le cyberespace, ni humaine ni machine.' },
    ],
  },
  modern: {
    weak: [
      { name: 'Voyou Armé', description: 'Un petit criminel nerveux brandissant un pistolet volé.' },
      { name: 'Chien de Garde', description: 'Un molosse entraîné au combat, grognant et bavant.' },
    ],
    standard: [
      { name: 'Mercenaire', description: 'Un soldat de fortune professionnel, froid et efficace.' },
      { name: 'Agent Double', description: 'Un espion entraîné au combat rapproché et à la manipulation.' },
      { name: 'Dealer Armé', description: 'Un trafiquant prêt à tout pour protéger son territoire.' },
    ],
    elite: [
      { name: 'Opérateur Spécial', description: 'Un membre d\'une unité d\'élite, équipé du meilleur matériel.' },
      { name: 'Chef de Cartel', description: 'Un baron de la drogue entouré de gardes du corps.' },
    ],
    miniboss: [
      { name: 'Général Renégat', description: 'Un officier militaire ayant fait sécession avec son régiment.' },
    ],
    boss: [
      { name: 'Mastermind', description: 'Le cerveau derrière l\'organisation, toujours trois coups d\'avance.' },
      { name: 'L\'Ombre', description: 'Un ennemi dont personne ne connaît le visage, contrôlant les événements depuis les coulisses.' },
    ],
  },
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate an enemy based on theme, chapter progression, player level and category.
 */
export function generateEnemy(
  theme: string,
  chapter: number,
  playerLevel: number,
  category: EnemyCategory,
): Enemy {
  const pool = ENEMY_POOLS[theme] || ENEMY_POOLS['medieval'];
  const templates = pool[category];
  const template = pickRandom(templates);
  const mult = CATEGORY_MULTIPLIERS[category];

  // Enemy level scales with player level and chapter
  const enemyLevel = Math.max(1, playerLevel + Math.floor((chapter - 1) * 0.5));

  // Base stats scale with level
  const baseStat = 4 + enemyLevel;
  const statValue = Math.round(baseStat * mult.stats);
  const stats: Stats = {
    force: statValue,
    dexterity: Math.round(statValue * 0.8),
    intelligence: Math.round(statValue * 0.6),
    spirit: Math.round(statValue * 0.5),
    luck: Math.round(statValue * 0.4),
  };

  // HP scales with level and multiplier
  const baseHp = 40 + (enemyLevel * 15);
  const hp = Math.round(baseHp * mult.hp);

  // Rewards
  const baseXp = 15 + (enemyLevel * 10);
  const baseGold = 5 + (enemyLevel * 3);

  return {
    id: `enemy_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: template.name,
    nameKey: template.name.toLowerCase().replace(/\s+/g, '_'),
    description: template.description,
    category,
    level: enemyLevel,
    hp,
    maxHp: hp,
    stats,
    xpReward: Math.round(baseXp * mult.xp),
    goldReward: Math.round(baseGold * mult.gold),
    lootTable: [],
  };
}

/**
 * Determine enemy category from scene type and chapter.
 */
export function getCategoryForScene(sceneType: string, chapter: number): EnemyCategory {
  if (sceneType === 'boss_intro') return 'boss';

  // Scale difficulty with chapter
  if (chapter <= 1) return pickRandom(['weak', 'standard'] as EnemyCategory[]);
  if (chapter <= 2) return pickRandom(['standard', 'standard', 'elite'] as EnemyCategory[]);
  if (chapter <= 3) return pickRandom(['standard', 'elite', 'elite'] as EnemyCategory[]);
  if (chapter <= 4) return pickRandom(['elite', 'elite', 'miniboss'] as EnemyCategory[]);
  return pickRandom(['elite', 'miniboss', 'miniboss'] as EnemyCategory[]);
}
