
import { FamilyMember } from './types';

export const INITIAL_MEMBERS: FamilyMember[] = [
  // GENERATION 0 (Patriarch - Current User) - MUST BE FIRST INDEX
  {
    id: '1',
    firstName: 'Alexander',
    lastName: 'Sterling',
    gender: 'male',
    role: 'Patriarch',
    avatar: 'https://picsum.photos/id/1027/200/200',
    bio: 'The current head of the Sterling legacy. A vision of strength and tradition.',
    isVerified: true,
    connections: [
      { toId: '16', type: 'parent' },
      { toId: '17', type: 'parent' },
      { toId: '2', type: 'spouse' },
      { toId: '3', type: 'child' },
      { toId: '7', type: 'child' },
      { toId: '11', type: 'child' },
      { toId: '12', type: 'sibling' }
    ],
    posts: [],
    x: 500,
    y: 900,
    trees: [
      { id: 't1', name: 'Sterling Family Legacy', code: 'STRL-9921-X', role: 'Founder', memberCount: 46, isPrimary: true },
      { id: 't2', name: 'The Miller Clan', code: 'MLLR-4412-B', role: 'Maternal Elder', memberCount: 18, isPrimary: false }
    ]
  },
  {
    id: '2',
    firstName: 'Eleanor',
    lastName: 'Sterling',
    gender: 'female',
    role: 'Matriarch',
    avatar: 'https://picsum.photos/id/1025/200/200',
    isVerified: true,
    connections: [
      { toId: '1', type: 'spouse' },
      { toId: '3', type: 'child' },
      { toId: '7', type: 'child' },
      { toId: '11', type: 'child' }
    ],
    posts: [],
    x: 700,
    y: 900,
    trees: [{ id: 't1', name: 'Sterling Family Legacy', code: 'STRL-9921-X', role: 'Matriarch', memberCount: 46, isPrimary: true }]
  },
  {
    id: '12',
    firstName: 'Robert',
    lastName: 'Sterling',
    gender: 'male',
    role: 'The Historian',
    avatar: 'https://picsum.photos/id/1011/200/200',
    isVerified: true,
    connections: [
      { toId: '16', type: 'parent' },
      { toId: '17', type: 'parent' },
      { toId: '1', type: 'sibling' },
      { toId: '13', type: 'child' }
    ],
    posts: [],
    x: 200,
    y: 900
  },

  // GENERATION -1 (Parents)
  {
    id: '16',
    firstName: 'Arthur',
    lastName: 'Sterling',
    gender: 'male',
    role: 'Estate Warden',
    avatar: 'https://picsum.photos/id/1074/200/200',
    bio: 'Expanded the Sterling influence across the continent.',
    isVerified: true,
    connections: [
      { toId: '14', type: 'parent' },
      { toId: '15', type: 'parent' },
      { toId: '17', type: 'spouse' },
      { toId: '1', type: 'child' },
      { toId: '12', type: 'child' }
    ],
    posts: [],
    x: 350,
    y: 700
  },
  {
    id: '17',
    firstName: 'Margaret',
    lastName: 'Sterling',
    gender: 'female',
    role: 'Cultural Conservator',
    avatar: 'https://picsum.photos/id/1082/200/200',
    bio: 'A scholar of lineage and heritage who preserved the family crest.',
    isVerified: true,
    connections: [
      { toId: '16', type: 'spouse' },
      { toId: '1', type: 'child' },
      { toId: '12', type: 'child' }
    ],
    posts: [],
    x: 550,
    y: 700
  },

  // GENERATION -2 (Grandparents)
  {
    id: '14',
    firstName: 'William',
    lastName: 'Sterling I',
    gender: 'male',
    role: 'The Architect',
    avatar: 'https://picsum.photos/id/1062/200/200',
    bio: 'The original visionary of the Sterling estate in the late 1800s.',
    isVerified: true,
    connections: [
      { toId: '18', type: 'parent' },
      { toId: '19', type: 'parent' },
      { toId: '15', type: 'spouse' },
      { toId: '16', type: 'child' },
      { toId: '23', type: 'sibling' }
    ],
    posts: [],
    x: 350,
    y: 500
  },
  {
    id: '15',
    firstName: 'Elizabeth',
    lastName: 'Sterling',
    gender: 'female',
    role: 'The Matriarch Emeritus',
    avatar: 'https://picsum.photos/id/1029/200/200',
    bio: 'Keeper of the first family records and oral histories.',
    isVerified: true,
    connections: [
      { toId: '14', type: 'spouse' },
      { toId: '16', type: 'child' }
    ],
    posts: [],
    x: 550,
    y: 500
  },
  {
    id: '23',
    firstName: 'Thomas',
    lastName: 'Sterling',
    gender: 'male',
    role: 'The Voyager',
    avatar: 'https://picsum.photos/id/1069/200/200',
    bio: 'Brother to William, he sailed the seas and mapped new trade routes.',
    isVerified: true,
    connections: [
      { toId: '18', type: 'parent' },
      { toId: '19', type: 'parent' },
      { toId: '14', type: 'sibling' }
    ],
    posts: [],
    x: 150,
    y: 500
  },

  // GENERATION -3 (Great-Grandparents)
  {
    id: '18',
    firstName: 'Henry',
    lastName: 'Sterling',
    gender: 'male',
    role: 'The Industrialist',
    avatar: 'https://picsum.photos/id/1052/200/200',
    bio: 'Transformed the family business during the Industrial Revolution.',
    isVerified: true,
    connections: [
      { toId: '20', type: 'parent' },
      { toId: '21', type: 'parent' },
      { toId: '19', type: 'spouse' },
      { toId: '14', type: 'child' },
      { toId: '23', type: 'child' },
      { toId: '22', type: 'sibling' }
    ],
    posts: [],
    x: 350,
    y: 300
  },
  {
    id: '19',
    firstName: 'Victoria',
    lastName: 'Sterling',
    gender: 'female',
    role: 'The Philanthropist',
    avatar: 'https://picsum.photos/id/1053/200/200',
    bio: 'Founded the Sterling Charity Trust which still operates today.',
    isVerified: true,
    connections: [
      { toId: '18', type: 'spouse' },
      { toId: '14', type: 'child' },
      { toId: '23', type: 'child' }
    ],
    posts: [],
    x: 550,
    y: 300
  },
  {
    id: '22',
    firstName: 'George',
    lastName: 'Sterling',
    gender: 'male',
    role: 'The Soldier',
    avatar: 'https://picsum.photos/id/1003/200/200',
    bio: 'A decorated officer who served in the royal guard.',
    isVerified: true,
    connections: [
      { toId: '20', type: 'parent' },
      { toId: '21', type: 'parent' },
      { toId: '18', type: 'sibling' }
    ],
    posts: [],
    x: 150,
    y: 300
  },

  // GENERATION -4 (Great-Great-Grandparents)
  {
    id: '20',
    firstName: 'Edward',
    lastName: 'Sterling',
    gender: 'male',
    role: 'The Pioneer',
    avatar: 'https://picsum.photos/id/1050/200/200',
    bio: 'Established the first Sterling trading company in the early 19th century.',
    isVerified: true,
    connections: [
      { toId: '21', type: 'spouse' },
      { toId: '18', type: 'child' },
      { toId: '22', type: 'child' }
    ],
    posts: [],
    x: 350,
    y: 100
  },
  {
    id: '21',
    firstName: 'Anne',
    lastName: 'Sterling',
    gender: 'female',
    role: 'The Founding Mother',
    avatar: 'https://picsum.photos/id/1051/200/200',
    bio: 'Her diaries provide the earliest known written records of the family.',
    isVerified: true,
    connections: [
      { toId: '20', type: 'spouse' },
      { toId: '18', type: 'child' },
      { toId: '22', type: 'child' }
    ],
    posts: [],
    x: 550,
    y: 100
  },

  // GENERATION 1 (Children)
  {
    id: '3',
    firstName: 'Julian',
    lastName: 'Sterling',
    gender: 'male',
    role: 'Heir',
    avatar: 'https://picsum.photos/id/1005/200/200',
    isVerified: true,
    connections: [
      { toId: '1', type: 'parent' },
      { toId: '2', type: 'parent' },
      { toId: '4', type: 'spouse' },
      { toId: '5', type: 'child' },
      { toId: '6', type: 'child' }
    ],
    posts: [],
    x: 300,
    y: 1150,
    trees: [{ id: 't1', name: 'Sterling Family Legacy', code: 'STRL-9921-X', role: 'Heir', memberCount: 46, isPrimary: true }]
  },
  {
    id: '4',
    firstName: 'Sarah',
    lastName: 'Sterling',
    gender: 'female',
    role: 'Curator',
    avatar: 'https://picsum.photos/id/1012/200/200',
    isVerified: true,
    connections: [
      { toId: '3', type: 'spouse' },
      { toId: '5', type: 'child' },
      { toId: '6', type: 'child' }
    ],
    posts: [],
    x: 440,
    y: 1150
  },
  {
    id: '7',
    firstName: 'Isabella',
    lastName: 'Sterling-Chen',
    gender: 'female',
    role: 'Diplomat',
    avatar: 'https://picsum.photos/id/1015/200/200',
    isVerified: true,
    connections: [
      { toId: '1', type: 'parent' },
      { toId: '2', type: 'parent' },
      { toId: '8', type: 'spouse' },
      { toId: '9', type: 'child' },
      { toId: '10', type: 'child' }
    ],
    posts: [],
    x: 700,
    y: 1150
  },
  {
    id: '8',
    firstName: 'Marcus',
    lastName: 'Chen',
    gender: 'male',
    role: 'Engineer',
    avatar: 'https://picsum.photos/id/1016/200/200',
    isVerified: true,
    connections: [
      { toId: '7', type: 'spouse' },
      { toId: '9', type: 'child' },
      { toId: '10', type: 'child' }
    ],
    posts: [],
    x: 840,
    y: 1150
  },
  {
    id: '11',
    firstName: 'Beatrice',
    lastName: 'Sterling',
    gender: 'female',
    role: 'The Wanderer',
    avatar: 'https://picsum.photos/id/1020/200/200',
    isVerified: true,
    connections: [
      { toId: '1', type: 'parent' },
      { toId: '2', type: 'parent' }
    ],
    posts: [],
    x: 1000,
    y: 1150
  },
  {
    id: '13',
    firstName: 'Clara',
    lastName: 'Sterling',
    gender: 'female',
    role: 'Designer',
    avatar: 'https://picsum.photos/id/1021/200/200',
    isVerified: true,
    connections: [
      { toId: '12', type: 'parent' }
    ],
    posts: [],
    x: 100,
    y: 1150
  },

  // GENERATION 2 (Grandchildren)
  {
    id: '5',
    firstName: 'Leo',
    lastName: 'Sterling',
    gender: 'male',
    role: 'Innovator',
    avatar: 'https://picsum.photos/id/1006/200/200',
    isVerified: false,
    connections: [{ toId: '3', type: 'parent' }, { toId: '4', type: 'parent' }],
    posts: [],
    x: 250,
    y: 1400
  },
  {
    id: '6',
    firstName: 'Maya',
    lastName: 'Sterling',
    gender: 'female',
    role: 'Scholar',
    avatar: 'https://picsum.photos/id/1013/200/200',
    isVerified: true,
    connections: [{ toId: '3', type: 'parent' }, { toId: '4', type: 'parent' }],
    posts: [],
    x: 350,
    y: 1400
  },
  {
    id: '9',
    firstName: 'Oliver',
    lastName: 'Chen',
    gender: 'male',
    role: 'Athlete',
    avatar: 'https://picsum.photos/id/1018/200/200',
    isVerified: false,
    connections: [{ toId: '7', type: 'parent' }, { toId: '8', type: 'parent' }],
    posts: [],
    x: 700,
    y: 1400
  },
  {
    id: '10',
    firstName: 'Sophie',
    lastName: 'Chen',
    gender: 'female',
    role: 'Artist',
    avatar: 'https://picsum.photos/id/1019/200/200',
    isVerified: true,
    connections: [{ toId: '7', type: 'parent' }, { toId: '8', type: 'parent' }],
    posts: [],
    x: 800,
    y: 1400
  }
];
