import { Types } from 'mongoose';
import { Deck, Card } from './models';

const DECK_COLORS = [
  'from-indigo-500 to-purple-600',
  'from-rose-500 to-pink-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-cyan-500 to-blue-600',
  'from-fuchsia-500 to-rose-500',
];

const SEEDS: { name: string; description: string; cards: [string, string][] }[] = [
  {
    name: 'Physics · Starter',
    description: 'Core mechanics & electromagnetism',
    cards: [
      ['What is Newton\u2019s first law?', 'An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.'],
      ['Define force in SI units.', 'One newton (N) is the force needed to accelerate 1 kg of mass at 1 m/s\u00b2.'],
      ['What does E=mc\u00b2 mean?', 'Energy and mass are interchangeable; a small amount of mass can convert into a huge amount of energy.'],
      ['How does a motor generate rotation?', 'By reversing current direction through coils in a magnetic field, the torque keeps the rotor spinning.'],
    ],
  },
  {
    name: 'Spanish · Greetings',
    description: 'Everyday phrases to get you started',
    cards: [
      ['Hello / Hi', 'Hola'],
      ['How are you?', '\u00bfC\u00f3mo est\u00e1s?'],
      ['Thank you very much', 'Muchas gracias'],
      ['See you tomorrow', 'Hasta ma\u00f1ana'],
    ],
  },
];

export const DECK_COLOR_PALETTE = DECK_COLORS;

export async function seedUserDecks(userId: Types.ObjectId) {
  for (let i = 0; i < SEEDS.length; i++) {
    const seed = SEEDS[i];
    const deck = await Deck.create({
      userId,
      name: seed.name,
      description: seed.description,
      color: DECK_COLORS[i % DECK_COLORS.length],
    });
    const staggered = seed.cards.map(([front, back], idx) => ({
      deckId: deck._id,
      front,
      back,
      due: Date.now() + idx * 1000,
    }));
    await Card.insertMany(staggered);
  }
}
