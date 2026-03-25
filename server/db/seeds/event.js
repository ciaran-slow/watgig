/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('event').del()
  await knex('event').insert([
     {
      id: 1,
      date: '2026-04-05',
      name: 'Midnight Riot',
      description: 'High energy rock show with loud guitars and heavy drums.',
      artists: 'Midnight Riot',
      start_time: '20:00',
      image_url: 'https://picsum.photos/seed/event1/600/400',
      ticket_link: 'https://tickets.com/event1',
      created_by: 'admin',
      featured: true
    },
    {
      id: 2,
      date: '2026-04-07',
      name: 'Neon Pulse',
      description: 'Electronic dance night featuring local DJs.',
      artists: 'DJ Pulse',
      start_time: '21:30',
      image_url: 'https://picsum.photos/seed/event2/600/400',
      ticket_link: 'https://tickets.com/event2',
      created_by: 'admin',
      featured: true
    },
    {
      id: 3,
      date: '2026-04-09',
      name: 'Indie Garden',
      description: 'Relaxed indie night with live bands.',
      artists: 'The Ferns',
      start_time: '19:00',
      image_url: 'https://picsum.photos/seed/event3/600/400',
      ticket_link: 'https://tickets.com/event3',
      created_by: 'admin',
      featured: false
    },
    {
      id: 4,
      date: '2026-04-10',
      name: 'Urban Flow',
      description: 'Hip hop showcase with freestyle sessions.',
      artists: 'MC Nova',
      start_time: '22:00',
      image_url: 'https://picsum.photos/seed/event4/600/400',
      ticket_link: 'https://tickets.com/event4',
      created_by: 'admin',
      featured: false
    },
    {
      id: 5,
      date: '2026-04-11',
      name: 'Blue Note Sessions',
      description: 'Smooth jazz night with live improvisation.',
      artists: 'Blue Note Trio',
      start_time: '18:30',
      image_url: 'https://picsum.photos/seed/event5/600/400',
      ticket_link: 'https://tickets.com/event5',
      created_by: 'admin',
      featured: false
    },
    {
      id: 6,
      date: '2026-04-12',
      name: 'Steel Thunder',
      description: 'Heavy metal gig with powerful riffs.',
      artists: 'Iron Echo',
      start_time: '21:00',
      image_url: 'https://picsum.photos/seed/event6/600/400',
      ticket_link: 'https://tickets.com/event6',
      created_by: 'admin',
      featured: true
    },
    {
      id: 7,
      date: '2026-04-13',
      name: 'Pop Explosion',
      description: 'Energetic pop performances and bright lights.',
      artists: 'Starlight',
      start_time: '20:30',
      image_url: 'https://picsum.photos/seed/event7/600/400',
      ticket_link: 'https://tickets.com/event7',
      created_by: 'admin',
      featured: false
    },
    {
      id: 8,
      date: '2026-04-14',
      name: 'Unplugged Nights',
      description: 'Acoustic set in an intimate setting.',
      artists: 'River Lane',
      start_time: '19:30',
      image_url: 'https://picsum.photos/seed/event8/600/400',
      ticket_link: 'https://tickets.com/event8',
      created_by: 'admin',
      featured: false
    },
    {
      id: 9,
      date: '2026-04-15',
      name: 'Bassline City',
      description: 'Underground electronic dance party.',
      artists: 'DJ Voltage',
      start_time: '23:00',
      image_url: 'https://picsum.photos/seed/event9/600/400',
      ticket_link: 'https://tickets.com/event9',
      created_by: 'admin',
      featured: true
    },
    {
      id: 10,
      date: '2026-04-16',
      name: 'Garage Revival',
      description: 'Raw garage rock performances.',
      artists: 'The Sparks',
      start_time: '20:00',
      image_url: 'https://picsum.photos/seed/event10/600/400',
      ticket_link: 'https://tickets.com/event10',
      created_by: 'admin',
      featured: false
    },
    {
      id: 11,
      date: '2026-04-18',
      name: 'Street Cypher',
      description: 'Live rap battles and DJ sets.',
      artists: 'MC Drift',
      start_time: '21:45',
      image_url: 'https://picsum.photos/seed/event11/600/400',
      ticket_link: 'https://tickets.com/event11',
      created_by: 'admin',
      featured: false
    },
    {
      id: 12,
      date: '2026-04-19',
      name: 'Indie Waves',
      description: 'Dreamy indie rock night.',
      artists: 'Silver Coast',
      start_time: '19:45',
      image_url: 'https://picsum.photos/seed/event12/600/400',
      ticket_link: 'https://tickets.com/event12',
      created_by: 'admin',
      featured: false
    },
    {
      id: 13,
      date: '2026-04-20',
      name: 'Digital Dreams',
      description: 'Late night electronic party.',
      artists: 'DJ Aurora',
      start_time: '22:30',
      image_url: 'https://picsum.photos/seed/event13/600/400',
      ticket_link: 'https://tickets.com/event13',
      created_by: 'admin',
      featured: true
    },
    {
      id: 14,
      date: '2026-04-21',
      name: 'Late Night Jazz',
      description: 'Classic jazz with modern improvisation.',
      artists: 'Moonlight Quartet',
      start_time: '21:00',
      image_url: 'https://picsum.photos/seed/event14/600/400',
      ticket_link: 'https://tickets.com/event14',
      created_by: 'admin',
      featured: false
    },
    {
      id: 15,
      date: '2026-04-22',
      name: 'Dark Forge',
      description: 'Heavy metal madness.',
      artists: 'Crimson Steel',
      start_time: '22:15',
      image_url: 'https://picsum.photos/seed/event15/600/400',
      ticket_link: 'https://tickets.com/event15',
      created_by: 'admin',
      featured: false
    },
    {
      id: 16,
      date: '2026-04-23',
      name: 'Summer Pop Fest',
      description: 'Bright pop anthems and dancing.',
      artists: 'Neon Hearts',
      start_time: '20:30',
      image_url: 'https://picsum.photos/seed/event16/600/400',
      ticket_link: 'https://tickets.com/event16',
      created_by: 'admin',
      featured: true
    },
    {
      id: 17,
      date: '2026-04-24',
      name: 'Campfire Sessions',
      description: 'Warm acoustic melodies.',
      artists: 'Oak & Ember',
      start_time: '18:45',
      image_url: 'https://picsum.photos/seed/event17/600/400',
      ticket_link: 'https://tickets.com/event17',
      created_by: 'admin',
      featured: false
    },
    {
      id: 18,
      date: '2026-04-25',
      name: 'Future Frequency',
      description: 'Experimental electronic sounds.',
      artists: 'DJ Signal',
      start_time: '23:30',
      image_url: 'https://picsum.photos/seed/event18/600/400',
      ticket_link: 'https://tickets.com/event18',
      created_by: 'admin',
      featured: false
    },
    {
      id: 19,
      date: '2026-04-26',
      name: 'Thunder Stage',
      description: 'Big stage rock performance.',
      artists: 'Stormbreak',
      start_time: '21:15',
      image_url: 'https://picsum.photos/seed/event19/600/400',
      ticket_link: 'https://tickets.com/event19',
      created_by: 'admin',
      featured: true
    },
    {
      id: 20,
      date: '2026-04-27',
      name: 'Beat District',
      description: 'Hip hop showcase with rising artists.',
      artists: 'Flow State',
      start_time: '22:00',
      image_url: 'https://picsum.photos/seed/event20/600/400',
      ticket_link: 'https://tickets.com/event20',
      created_by: 'admin',
      featured: false
    }
  ]);
};
