import { google } from "googleapis"

// ─── Tipos ────────────────────────────────────────────────────────────────────

type SyncAction = "create" | "update" | "delete"

export interface VehicleForSheets {
  id: string
  marca: string
  modelo: string
  anio: number
  precio: number
  estado: string // "Activo" | "VENDIDO"
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

async function getSheetsClient() {
  const keyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!keyRaw) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY no definida")

  const credentials = JSON.parse(keyRaw)

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  const authClient = await auth.getClient()
  return google.sheets({ version: "v4", auth: authClient as any })
}

// ─── Helper: buscar fila por ID en columna A ──────────────────────────────────

async function findRowByVehicleId(
  sheets: Awaited<ReturnType<typeof getSheetsClient>>,
  spreadsheetId: string,
  vehicleId: string
): Promise<number | null> {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "autos!A:A",
  })

  const rows = res.data.values ?? []
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === vehicleId) {
      return i + 1 // número de fila real en Sheets (base 1)
    }
  }
  return null
}

// ─── Helper: construir valores de fila ───────────────────────────────────────

function buildRowValues(vehicle: VehicleForSheets): string[] {
  return [
    vehicle.id,
    vehicle.marca,
    vehicle.modelo,
    String(vehicle.anio),
    String(vehicle.precio),
    vehicle.estado,
    `https://sagralautomotores.com/catalogo/${vehicle.id}`,
    new Date().toISOString(),
  ]
}

// ─── Función principal ────────────────────────────────────────────────────────

export async function syncVehicleToSheets(
  vehicle: VehicleForSheets,
  action: SyncAction
): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  if (!spreadsheetId) throw new Error("GOOGLE_SHEET_ID no definida")

  const sheets = await getSheetsClient()

  if (action === "create") {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "autos!A:H",
      valueInputOption: "RAW",
      requestBody: {
        values: [buildRowValues(vehicle)],
      },
    })
    return
  }

  const rowNumber = await findRowByVehicleId(sheets, spreadsheetId, vehicle.id)

  if (rowNumber === null) {
    // Fila no existe — la creamos como fallback
    if (action === "update") {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "autos!A:H",
        valueInputOption: "RAW",
        requestBody: { values: [buildRowValues(vehicle)] },
      })
    }
    return
  }

  if (action === "update") {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `autos!A${rowNumber}:H${rowNumber}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [buildRowValues(vehicle)],
      },
    })
    return
  }

  if (action === "delete") {
    const meta = await sheets.spreadsheets.get({ spreadsheetId })
    const sheet = meta.data.sheets?.find(
      (s) => s.properties?.title === "autos"
    )
    const sheetId = sheet?.properties?.sheetId ?? 0

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: rowNumber - 1, // base 0
                endIndex: rowNumber,
              },
            },
          },
        ],
      },
    })
  }
}

// ─── Sync inicial (bulk) ──────────────────────────────────────────────────────

export async function syncAllVehiclesToSheets(
  vehicles: VehicleForSheets[]
): Promise<{ synced: number }> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  if (!spreadsheetId) throw new Error("GOOGLE_SHEET_ID no definida")

  const sheets = await getSheetsClient()

  // Limpiar datos existentes manteniendo encabezado (fila 1)
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: "autos!A2:H",
  })

  if (vehicles.length === 0) return { synced: 0 }

  const rows = vehicles.map(buildRowValues)

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "autos!A2",
    valueInputOption: "RAW",
    requestBody: { values: rows },
  })

  return { synced: vehicles.length }
}