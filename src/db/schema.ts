import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  uniqueIndex,
  index,
  integer,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

const tenantId = process.env.TENANT_ID ?? "default";

export const users = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    tenantId: text("tenant_id").notNull().default(tenantId),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
  },
  (table) => ({
    uniqueEmailPerTenant: uniqueIndex("user_tenant_id_email_key").on(
      table.tenantId,
      table.email,
    ),
  }),
);

export const accounts = pgTable(
  "account",
  {
    tenantId: text("tenant_id").notNull().default(tenantId),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compositePk: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable(
  "session",
  {
    sessionToken: text("sessionToken").primaryKey(),
    tenantId: text("tenant_id").notNull().default(tenantId),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    userIdIdx: index("session_userId_idx").on(table.userId),
  }),
);

export const verificationTokens = pgTable(
  "verificationToken",
  {
    tenantId: text("tenant_id").notNull().default(tenantId),
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compositePk: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// Required by @auth/drizzle-adapter for type inference
export type { AdapterAccountType };
