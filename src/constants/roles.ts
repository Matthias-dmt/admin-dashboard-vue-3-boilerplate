export const ROLES = ['super_admin', 'admin', 'customer'] as const
export type Role = (typeof ROLES)[number]
