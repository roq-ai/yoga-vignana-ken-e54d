const mapping: Record<string, string> = {
  courses: 'course',
  'live-classes': 'live_class',
  organizations: 'organization',
  'recorded-classes': 'recorded_class',
  subscriptions: 'subscription',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
