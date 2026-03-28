import { Resend } from "resend";
import { render } from "@react-email/components";
import LeadOwnerEmail from "@/emails/lead-owner";
import LeadConfirmationEmail from "@/emails/lead-confirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface LeadNotificationData {
  // Datos del lead
  leadName: string;
  leadPhone: string;
  leadEmail?: string;
  leadMessage?: string;
  // Datos del vehículo
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  vehiclePrice?: number;
  vehicleCoverUrl?: string;
  vehicleSlug: string;
  // Datos del negocio (desde site_config)
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  businessAddress?: string;
  ownerEmail: string;
  siteUrl: string;
}

export async function sendLeadNotification(
  data: LeadNotificationData
): Promise<void> {
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const vehicleTitle = `${data.vehicleBrand} ${data.vehicleModel} ${data.vehicleYear}`;
  const adminUrl = data.siteUrl;

  // ── 1. Email al dueño ────────────────────────────────
try {
  const ownerHtml = await render(
    LeadOwnerEmail({
      leadName: data.leadName,
      leadPhone: data.leadPhone,
      leadEmail: data.leadEmail,
      leadMessage: data.leadMessage,
      vehicleBrand: data.vehicleBrand,
      vehicleModel: data.vehicleModel,
      vehicleYear: data.vehicleYear,
      vehiclePrice: data.vehiclePrice,
      vehicleCoverUrl: data.vehicleCoverUrl,
      vehicleSlug: data.vehicleSlug,
      adminUrl,
      whatsappPhone: data.businessPhone,
    })
  );

 
  const result = await resend.emails.send({
    from: `${data.businessName} <${fromEmail}>`,
    to: data.ownerEmail,
    subject: `Nueva consulta — ${vehicleTitle}`,
    html: ownerHtml,
  });


} catch (err) {
  console.error("[sendLeadNotification] Error enviando email al dueño:", err);
}
  // ── 2. Email al interesado (solo si dio email) ───────
  if (data.leadEmail) {
    try {
      const confirmationHtml = await render(
        LeadConfirmationEmail({
          leadName: data.leadName,
          vehicleBrand: data.vehicleBrand,
          vehicleModel: data.vehicleModel,
          vehicleYear: data.vehicleYear,
          vehiclePrice: data.vehiclePrice,
          vehicleCoverUrl: data.vehicleCoverUrl,
          businessName: data.businessName,
          businessPhone: data.businessPhone,
          businessEmail: data.businessEmail,
          businessAddress: data.businessAddress,
          siteUrl: data.siteUrl,
        })
      );

      await resend.emails.send({
        from: `${data.businessName} <${fromEmail}>`,
        to: data.leadEmail,
        subject: `Recibimos tu consulta — ${vehicleTitle}`,
        html: confirmationHtml,
      });
    } catch (err) {
      console.error(
        "[sendLeadNotification] Error enviando confirmación al interesado:",
        err
      );
    }
  }
}