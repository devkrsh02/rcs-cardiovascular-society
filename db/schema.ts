import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const members = sqliteTable(
  "members",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull(),
    fullName: text("full_name"),
    role: text("role").notNull().default("member"),
    semesterKey: text("semester_key").notNull(),
    validFrom: text("valid_from").notNull(),
    validUntil: text("valid_until").notNull(),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    authenticatedUserId: text("authenticated_user_id"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    uniqueIndex("uq_members_email_semester").on(
      table.email,
      table.semesterKey,
    ),
    index("idx_members_semester_active").on(table.semesterKey, table.active),
    index("idx_members_authenticated_user_id").on(table.authenticatedUserId),
  ],
);

export const resources = sqliteTable(
  "resources",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    category: text("category").notNull(),
    originalFilename: text("original_filename").notNull(),
    objectKey: text("object_key").notNull(),
    contentType: text("content_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    uploadedByUserId: text("uploaded_by_user_id").notNull(),
    uploadedAt: text("uploaded_at").notNull(),
  },
  (table) => [
    uniqueIndex("uq_resources_object_key").on(table.objectKey),
    index("idx_resources_category_uploaded_at").on(
      table.category,
      table.uploadedAt,
    ),
  ],
);
