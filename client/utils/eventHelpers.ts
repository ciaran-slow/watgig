export function getHeaderForFilter(filter: string): string {
  switch (filter) {
    case 'featured':
      return 'Featured Events'
    case 'week':
      return 'This Week'
    case 'month':
      return 'This Month'
    case 'rock':
      return 'Rock / Indie'
    case 'pop':
      return 'Pop'
    case 'electronic':
      return 'Electronic / DJ'
    case 'hiphop':
      return 'Hip-Hop / Rap'
    case 'acoustic':
      return 'Acoustic'
    case 'jazz':
      return 'Jazz / Blues'
    case 'metal':
      return 'Metal / Punk'
    case 'other':
      return 'Other'
    default:
      return 'All Events'
  }
}
