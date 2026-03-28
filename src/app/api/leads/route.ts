import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads, vehicles, vehicleImages, siteConfig } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { sendLeadNotification } from "@/lib/emails/send-lead-notification";
import { z } from "zod";

const leadSchema = z.object({
  vehicleId: z.string().uuid(),
  name: z.string().min(2).max(100),
  phone: z.string().min(6).max(30).optional(),
  email: z.string().email().max(255).optional(),
  message: z.string().max(1000).optional(),
  source: z.string().max(50).optional(),
});

async function getSiteConfig(): Promise<Record<string, string>> {
  const rows = await db.select().from(siteConfig);
  return Object.fromEntries(rows.map((r: { key: string; value: string }) => [r.key, r.value]));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { vehicleId, name, phone, email, message, source } = parsed.data;

    const [vehicle] = await db
      .select({
        id: vehicles.id,
        brand: vehicles.brand,
        model: vehicles.model,
        year: vehicles.year,
        price: vehicles.price,
      })
      .from(vehicles)
      .where(eq(vehicles.id, vehicleId))
      .limit(1);

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehículo no encontrado" },
        { status: 404 }
      );
    }

    const [coverImage] = await db
      .select({ url: vehicleImages.url })
      .from(vehicleImages)
      .where(
        and(
          eq(vehicleImages.vehicleId, vehicleId),
          eq(vehicleImages.isCover, true)
        )
      )
      .limit(1);

    const [newLead] = await db
      .insert(leads)
      .values({
        vehicleId,
        name,
        phone: phone ?? null,
        email: email ?? null,
        message: message ?? null,
        source: source ?? "web",
      })
      .returning();

    
    try {
      const config = await getSiteConfig();

      await sendLeadNotification({
        leadName: name,
        leadPhone: phone ?? "",
        leadEmail: email,
        leadMessage: message,
        vehicleBrand: vehicle.brand,
        vehicleModel: vehicle.model,
        vehicleYear: vehicle.year,
        vehiclePrice: vehicle.price,
        vehicleCoverUrl: coverImage?.url,
        vehicleSlug: vehicle.id,
        businessName: config.business_name ?? "Sagral Automotores",
        businessPhone: config.business_phone ?? "",
        businessEmail: config.business_email ?? "",
        businessAddress: config.business_address,
        ownerEmail: config.owner_email ?? "",
        siteUrl: config.site_url ?? process.env.NEXTAUTH_URL ?? "",
      });

      
    } catch (emailErr) {
      console.error("[POST /api/leads] Error en notificación:", emailErr);
    }

    return NextResponse.json({ success: true, lead: newLead }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/leads]", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}