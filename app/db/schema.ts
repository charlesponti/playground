import {
  boolean,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const tflCameras = pgTable("tfl_cameras", {
  id: serial("id").primaryKey(),
  tflId: text("tfl_id").notNull().unique(),
  commonName: text("common_name").notNull(),
  available: boolean("available").default(true),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  view: text("view"),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type TflCameraSelect = typeof tflCameras.$inferSelect;
export type TflCameraInsert = typeof tflCameras.$inferInsert;
