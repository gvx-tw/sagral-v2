import {
    pgTable,
    pgEnum,
    text,
    timestamp,
    serial,
    uuid,
    varchar,
    integer,
    boolean,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─────────────────────────────────────────────────────────────────────────────
// TABLAS DE AUTH (existentes — no modificar)
// ─────────────────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    email: text('email').notNull().unique(),
    password: text('password'),
    role: text('role').notNull().default('admin'),
    emailVerified: timestamp('email_verified', { mode: 'date' }),
    image: text('image'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
})

export const sessions = pgTable('sessions', {
    sessionToken: text('session_token').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const accounts = pgTable('accounts', {
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: serial('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
})

export const verificationTokens = pgTable('verification_tokens', {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
})

// ─────────────────────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────────────────────

export const fuelTypeEnum = pgEnum('fuel_type', [
    'nafta', 'diesel', 'gnc', 'hibrido', 'electrico',
])

export const transmissionEnum = pgEnum('transmission', [
    'manual', 'automatica',
])

export const conditionEnum = pgEnum('condition', [
    'nuevo', 'usado',
])

export const eventTypeEnum = pgEnum('event_type', [
    'view', 'search', 'whatsapp_click',
])

// ─────────────────────────────────────────────────────────────────────────────
// VEHICLES
// ─────────────────────────────────────────────────────────────────────────────

export const vehicles = pgTable('vehicles', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 200 }).notNull(),
    brand: varchar('brand', { length: 100 }).notNull(),
    model: varchar('model', { length: 100 }).notNull(),
    year: integer('year').notNull(),
    price: integer('price').notNull(),
    currency: varchar('currency', { length: 3 }).notNull().default('USD'),
    km: integer('km').notNull().default(0),
    fuelType: fuelTypeEnum('fuel_type').notNull(),
    transmission: transmissionEnum('transmission').notNull(),
    condition: conditionEnum('condition').notNull().default('usado'),
    color: varchar('color', { length: 50 }),
    description: text('description'),
    isFeatured: boolean('is_featured').notNull().default(false),
    isSold: boolean('is_sold').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ─────────────────────────────────────────────────────────────────────────────
// VEHICLE IMAGES
// ─────────────────────────────────────────────────────────────────────────────

export const vehicleImages = pgTable('vehicle_images', {
    id: uuid('id').primaryKey().defaultRandom(),
    vehicleId: uuid('vehicle_id')
        .notNull()
        .references(() => vehicles.id, { onDelete: 'cascade' }),
    url: varchar('url', { length: 500 }).notNull(),
    publicId: varchar('public_id', { length: 255 }).notNull(),
    order: integer('order').notNull().default(0),
    isCover: boolean('is_cover').notNull().default(false),
})

// ─────────────────────────────────────────────────────────────────────────────
// LEADS
// ─────────────────────────────────────────────────────────────────────────────

export const leads = pgTable('leads', {
    id: uuid('id').primaryKey().defaultRandom(),
    vehicleId: uuid('vehicle_id').references(() => vehicles.id, { onDelete: 'set null' }),
    name: varchar('name', { length: 100 }).notNull(),
    phone: varchar('phone', { length: 30 }),
    email: varchar('email', { length: 255 }),
    message: text('message'),
    source: varchar('source', { length: 50 }),
    isAttended: boolean('is_attended').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────────────────────

export const testimonials = pgTable('testimonials', {
    id: uuid('id').primaryKey().defaultRandom(),
    author: varchar('author', { length: 100 }).notNull(),
    rating: integer('rating').notNull().default(5),
    text: text('text').notNull(),
    isVisible: boolean('is_visible').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─────────────────────────────────────────────────────────────────────────────
// SITE CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export const siteConfig = pgTable('site_config', {
    id: uuid('id').primaryKey().defaultRandom(),
    key: varchar('key', { length: 100 }).notNull().unique(),
    value: text('value').notNull(),
})

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────────────────────────────────────

export const analytics = pgTable('analytics', {
    id: uuid('id').primaryKey().defaultRandom(),
    eventType: eventTypeEnum('event_type').notNull(),
    vehicleId: uuid('vehicle_id').references(() => vehicles.id, { onDelete: 'set null' }),
    searchQuery: varchar('search_query', { length: 200 }),
    ipHash: varchar('ip_hash', { length: 64 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN LOGS
// ─────────────────────────────────────────────────────────────────────────────

export const adminLogs = pgTable('admin_logs', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    action: varchar('action', { length: 50 }).notNull(),
    entity: varchar('entity', { length: 30 }),
    entityId: uuid('entity_id'),
    details: text('details'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─────────────────────────────────────────────────────────────────────────────
// RELATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const vehiclesRelations = relations(vehicles, ({ many }) => ({
    images: many(vehicleImages),
    leads: many(leads),
    analytics: many(analytics),
}))

export const vehicleImagesRelations = relations(vehicleImages, ({ one }) => ({
    vehicle: one(vehicles, {
        fields: [vehicleImages.vehicleId],
        references: [vehicles.id],
    }),
}))

export const leadsRelations = relations(leads, ({ one }) => ({
    vehicle: one(vehicles, {
        fields: [leads.vehicleId],
        references: [vehicles.id],
    }),
}))

export const analyticsRelations = relations(analytics, ({ one }) => ({
    vehicle: one(vehicles, {
        fields: [analytics.vehicleId],
        references: [vehicles.id],
    }),
}))

export const adminLogsRelations = relations(adminLogs, ({ one }) => ({
    user: one(users, {
        fields: [adminLogs.userId],
        references: [users.id],
    }),
}))

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS TYPESCRIPT INFERIDOS
// ─────────────────────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Vehicle = typeof vehicles.$inferSelect
export type NewVehicle = typeof vehicles.$inferInsert

export type VehicleImage = typeof vehicleImages.$inferSelect
export type NewVehicleImage = typeof vehicleImages.$inferInsert

export type Lead = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert

export type Testimonial = typeof testimonials.$inferSelect
export type NewTestimonial = typeof testimonials.$inferInsert

export type SiteConfig = typeof siteConfig.$inferSelect

export type Analytics = typeof analytics.$inferSelect
export type NewAnalytics = typeof analytics.$inferInsert

export type AdminLog = typeof adminLogs.$inferSelect
export type NewAdminLog = typeof adminLogs.$inferInsert