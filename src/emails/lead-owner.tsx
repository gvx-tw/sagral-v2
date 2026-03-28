import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface LeadOwnerEmailProps {
  // Datos del interesado
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
  // Config
  adminUrl: string;
  whatsappPhone: string;
}

export default function LeadOwnerEmail({
  leadName,
  leadPhone,
  leadEmail,
  leadMessage,
  vehicleBrand,
  vehicleModel,
  vehicleYear,
  vehiclePrice,
  vehicleCoverUrl,
  vehicleSlug,
  adminUrl,
  whatsappPhone,
}: LeadOwnerEmailProps) {
  const vehicleTitle = `${vehicleBrand} ${vehicleModel} ${vehicleYear}`;
  const priceFormatted = vehiclePrice
    ? new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
      }).format(vehiclePrice)
    : "Consultar precio";

  const whatsappUrl = `https://wa.me/${whatsappPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Hola ${leadName}, te contacto por tu consulta sobre el ${vehicleTitle}`
  )}`;

  return (
    <Html lang="es">
      <Head />
      <Preview>Nueva consulta — {vehicleTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>Sagral Automotores</Heading>
            <Text style={headerSubtitle}>Nueva consulta recibida</Text>
          </Section>

          {/* Vehículo */}
          <Section style={section}>
            <Heading as="h2" style={sectionTitle}>
              Vehículo consultado
            </Heading>
            {vehicleCoverUrl && (
              <Img
                src={vehicleCoverUrl}
                alt={vehicleTitle}
                width="100%"
                style={vehicleImage}
              />
            )}
            <Text style={vehicleTitleStyle}>{vehicleTitle}</Text>
            <Text style={vehiclePriceStyle}>{priceFormatted}</Text>
          </Section>

          <Hr style={divider} />

          {/* Datos del interesado */}
          <Section style={section}>
            <Heading as="h2" style={sectionTitle}>
              Datos del interesado
            </Heading>
            <Text style={dataRow}>
              <strong>Nombre:</strong> {leadName}
            </Text>
            <Text style={dataRow}>
              <strong>Teléfono:</strong> {leadPhone}
            </Text>
            {leadEmail && (
              <Text style={dataRow}>
                <strong>Email:</strong> {leadEmail}
              </Text>
            )}
            {leadMessage && (
              <>
                <Text style={dataRow}>
                  <strong>Mensaje:</strong>
                </Text>
                <Text style={messageBox}>{leadMessage}</Text>
              </>
            )}
          </Section>

          <Hr style={divider} />

          {/* Botones */}
          <Section style={buttonSection}>
            <Button href={`${adminUrl}/admin/leads`} style={primaryButton}>
              Ver en panel admin
            </Button>
            <Button href={whatsappUrl} style={whatsappButton}>
              Responder por WhatsApp
            </Button>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Este email fue generado automáticamente por el sistema de Sagral
              Automotores.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ── Estilos ──────────────────────────────────────────────
const main: React.CSSProperties = {
  backgroundColor: "#f4f4f5",
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

const container: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
};

const header: React.CSSProperties = {
  backgroundColor: "#18181b",
  padding: "32px 40px",
  textAlign: "center",
};

const headerTitle: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0 0 4px",
};

const headerSubtitle: React.CSSProperties = {
  color: "#a1a1aa",
  fontSize: "14px",
  margin: "0",
};

const section: React.CSSProperties = {
  padding: "24px 40px",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#18181b",
  marginBottom: "16px",
};

const vehicleImage: React.CSSProperties = {
  borderRadius: "6px",
  marginBottom: "12px",
  objectFit: "cover",
};

const vehicleTitleStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#18181b",
  margin: "0 0 4px",
};

const vehiclePriceStyle: React.CSSProperties = {
  fontSize: "18px",
  color: "#2563eb",
  fontWeight: "600",
  margin: "0",
};

const dataRow: React.CSSProperties = {
  fontSize: "14px",
  color: "#3f3f46",
  margin: "0 0 8px",
};

const messageBox: React.CSSProperties = {
  backgroundColor: "#f4f4f5",
  borderLeft: "3px solid #2563eb",
  padding: "12px 16px",
  borderRadius: "4px",
  fontSize: "14px",
  color: "#3f3f46",
  margin: "0",
};

const divider: React.CSSProperties = {
  borderColor: "#e4e4e7",
  margin: "0",
};

const buttonSection: React.CSSProperties = {
  padding: "24px 40px",
  display: "flex",
  gap: "12px",
};

const primaryButton: React.CSSProperties = {
  backgroundColor: "#18181b",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  marginRight: "12px",
};

const whatsappButton: React.CSSProperties = {
  backgroundColor: "#16a34a",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
};

const footer: React.CSSProperties = {
  backgroundColor: "#f4f4f5",
  padding: "16px 40px",
};

const footerText: React.CSSProperties = {
  fontSize: "12px",
  color: "#71717a",
  textAlign: "center",
  margin: "0",
};