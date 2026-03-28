import { MetadataRoute } from "next";
import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";

const BASE_URL = "https://www.sagralautomotores.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // ── Páginas estáticas ──────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/catalogo`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // ── Páginas dinámicas: una entrada por vehículo activo ────────────────────
  try {
    const activeVehicles = await db
      .select({ id: vehicles.id, updatedAt: vehicles.updatedAt })
      .from(vehicles)
      .where(eq(vehicles.isSold, false));

    const vehiclePages: MetadataRoute.Sitemap = activeVehicles.map((v) => ({
      url: `${BASE_URL}/catalogo/${v.id}`,
      lastModified: v.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticPages, ...vehiclePages];
  } catch (error) {
    console.error("[sitemap] Error fetching vehicles:", error);
    return staticPages;
  }
}