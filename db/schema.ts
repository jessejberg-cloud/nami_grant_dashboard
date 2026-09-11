import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const records=sqliteTable('records',{id:text('id').primaryKey(),kind:text('kind').notNull(),payload:text('payload').notNull(),updated:text('updated').notNull()});
export const activity=sqliteTable('activity',{id:text('id').primaryKey(),action:text('action').notNull(),title:text('title').notNull(),at:text('at').notNull()});
