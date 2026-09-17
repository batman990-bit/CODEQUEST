import { pgTable, integer, text, timestamp } from 'drizzle-orm/pg-core';

export const userInfo = pgTable('user_info', {
  uid: text('uid')
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userName: text('user_name').notNull().unique(),
  email: text('user_email').notNull().unique(),
  progress: integer('user_progress').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
