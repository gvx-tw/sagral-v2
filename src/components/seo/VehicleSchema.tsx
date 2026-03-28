const BASE_URL = "https://www.sagralautomotores.com";

interface VehicleSchemaProps {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  km: number;
  fuelType: string;
  transmission: string;
  condition: string;
  color?: string | null;
  description?: string | null;
  images: { url: string; isCover: boolean }[];
}

export function VehicleSchema({
  id, brand, model, year, price, currency,
  km, fuelType, transmission, condition,
  color, description, images,
}: VehicleSchemaProps) {
  const vehicleUrl = `${BASE_URL}/catalogo/${id}`;
  const vehicleName = `${brand} ${model} ${year}`;
  const coverImage = images.find((img) => img.isCover) ?? images[0];

  const vehicleSchema = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: vehicleName,
    description: description ?? undefined,
    url: vehicleUrl,
    brand: { "@type": "Brand", name: brand },
    model,
    vehicleModelDate: String(year),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: km,
      unitCode: "KMT",
    },
    fuelType,
    vehicleTransmission: transmission,
    itemCondition:
      condition === "nuevo"
        ? "https://schema.org/NewCondition"
        : "https://schema.org/UsedCondition",
    color: color ?? undefined,
    image: coverImage ? [coverImage.url] : undefined,
    offers: {
      "@type": "Offer",
      price: String(price),
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      url: vehicleUrl,
      seller: {
        "@type": "AutoDealer",
        name: "Sagral Automotores",
        url: BASE_URL,
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Catálogo", item: `${BASE_URL}/catalogo` },
      { "@type": "ListItem", position: 3, name: vehicleName, item: vehicleUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
