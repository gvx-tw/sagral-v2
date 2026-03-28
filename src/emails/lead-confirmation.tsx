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

interface LeadConfirmationEmailProps {
  // Datos del interesado
  leadName: string;
  // Datos del vehículo
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  vehiclePrice?: number;
  vehicleCoverUrl?: string;
  // Datos de contacto del negocio (desde site_config)
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  businessAddress?: string;
  siteUrl: string;
}

export default function LeadConfirmationEmail({
  leadName,
  vehicleBrand,
  vehicleModel,
  vehicleYear,
  vehiclePrice,
  vehicleCoverUrl,
  businessName,
  businessPhone,
  businessEmail,
  businessAddress,
  siteUrl,
}: LeadConfirmationEmailProps) {
  const vehicleTitle = `${vehicleBrand} ${vehicleModel} ${vehicleYear}`;
  const priceFormatted = vehiclePrice
    ? new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
      }).format(vehiclePrice)
    : "Consultar precio";

  return (
    <Html lang="es">
      <Head />
      <Preview>Recibimos tu consulta — {vehicleTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>{businessName}</Heading>
            <Text style={headerSubtitle}>Confirmación de consulta</Text>
          </Section>

          {/* Mensaje principal */}
          <Section style={section}>
            <Heading as="h2" style={greeting}>
              ¡Hola, {leadName}!
            </Heading>
            <Text style={bodyText}>
              Recibimos tu consulta correctamente. Nos pondremos en contacto con
              vos a la brevedad para darte más información.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Vehículo consultado */}
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

          {/* Datos de contacto del negocio */}
          <Section style={section}>
            <Heading as="h2" style={sectionTitle}>
              Nuestros datos de contacto
            </Heading>
            <Text style={dataRow}>
              <strong>Teléfono:</strong> {businessPhone}
            </Text>
            <Text style={dataRow}>
              <strong>Email:</strong> {businessEmail}
            </Text>
            {businessAddress && (
              <Text style={dataRow}>
                <strong>Dirección:</strong> {businessAddress}
              </Text>
            )}
          </Section>

          {/* CTA */}
          <Section style={buttonSection}>
            <Button href={siteUrl} style={primaryButton}>
              Ver más vehículos
            </Button>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Este email fue generado automáticamente. Por favor no respondas a
              este mensaje.
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

const greeting: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#18181b",
  marginBottom: "12px",
};

const bodyText: React.CSSProperties = {
  fontSize: "15px",
  color: "#3f3f46",
  lineHeight: "1.6",
  margin: "0",
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

const divider: React.CSSProperties = {
  borderColor: "#e4e4e7",
  margin: "0",
};

const buttonSection: React.CSSProperties = {
  padding: "24px 40px",
};

const primaryButton: React.CSSProperties = {
  backgroundColor: "#18181b",
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