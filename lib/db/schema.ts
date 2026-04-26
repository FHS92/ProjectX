import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  real,
  pgEnum,
  uuid,
  primaryKey,
} from 'drizzle-orm/pg-core'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const verticalEnum = pgEnum('vertical', [
  'shotgun',
  'pistol',
  'hunting',
  'fishing',
  'diving',
  'diy',
])

export const viewModeEnum = pgEnum('view_mode', ['by_sport', 'by_bucket'])

export const activityStatusEnum = pgEnum('activity_status', [
  'draft',
  'published',
])

// ─── Auth (NextAuth) ──────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
})

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
)

// ─── User Profile ─────────────────────────────────────────────────────────────

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  username: text('username').unique(),
  bio: text('bio'),
  location: text('location'),
  avatarUrl: text('avatar_url'),
  favoriteVerticals: text('favorite_verticals').array(), // e.g. ['shotgun','fishing']
  viewMode: viewModeEnum('view_mode').default('by_sport'),
  isPremium: boolean('is_premium').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─── Activity Logs ────────────────────────────────────────────────────────────

export const logs = pgTable('logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  vertical: verticalEnum('vertical').notNull(),
  title: text('title').notNull(),
  notes: text('notes'),
  locationName: text('location_name'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  loggedAt: timestamp('logged_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  // Shotgun / Pistol
  score: integer('score'),
  roundsTotal: integer('rounds_total'),
  // Hunting / Fishing
  species: text('species'),
  quantity: integer('quantity'),
  weight: real('weight'),
  // Diving
  depthMeters: real('depth_meters'),
  durationMinutes: integer('duration_minutes'),
  // DIY
  projectName: text('project_name'),
  materialUsed: text('material_used'),
})

// ─── Gear / Equipment ─────────────────────────────────────────────────────────

export const gear = pgTable('gear', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  vertical: verticalEnum('vertical').notNull(),
  name: text('name').notNull(),
  brand: text('brand'),
  model: text('model'),
  notes: text('notes'),
  imageUrl: text('image_url'),
  purchasedAt: timestamp('purchased_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── Saved Items ──────────────────────────────────────────────────────────────

export const savedItems = pgTable('saved_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  itemType: text('item_type').notNull(), // 'article' | 'gear_review' | 'tutorial' | 'spot'
  itemId: text('item_id').notNull(),
  savedAt: timestamp('saved_at').defaultNow().notNull(),
})

// ─── Spots ────────────────────────────────────────────────────────────────────

export const spots = pgTable('spots', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  vertical: verticalEnum('vertical').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  isPrivate: boolean('is_private').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── Community Posts ──────────────────────────────────────────────────────────

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  vertical: verticalEnum('vertical').notNull(),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  status: activityStatusEnum('status').default('published'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
