// src/db/schema/schema.ts

import { pgTable, serial, text, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('baker').notNull(),
  created_at: timestamp('created_at').default(sql`now()`),
});

export const bakers = pgTable('bakers', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id).notNull().unique(),
  business_type: varchar('business_type', { length: 50 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  baker_name: varchar('baker_name', { length: 255 }).notNull(),
  mobile_number: varchar('mobile_number', { length: 20 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  zip_code: varchar('zip_code', { length: 10 }).notNull(),
  street: varchar('street', { length: 255 }).notNull(),
  created_at: timestamp('created_at').default(sql`now()`),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  baker_id: integer('baker_id').references(() => bakers.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  created_at: timestamp('created_at').default(sql`now()`),
  updated_at: timestamp('updated_at').default(sql`now()`),
});
export const usersRelations = relations(users, ({ one }) => ({
  baker: one(bakers, {
    fields: [users.id],
    references: [bakers.user_id],
  }),
}));

export const bakersRelations = relations(bakers, ({ one, many }) => ({
  user: one(users, {
    fields: [bakers.user_id],
    references: [users.id],
  }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  baker: one(bakers, {
    fields: [products.baker_id],
    references: [bakers.id],
  }),
}));

