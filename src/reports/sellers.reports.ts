import { SellersSchemaSelectType } from '@/models/sellers.model'
import { ClientsSchemaSelectType } from '@/models/clients.model'

import { cellCircleColor, setLogo } from './util'

import ExcelJS from 'exceljs'

export async function xlsx (
    seller: SellersSchemaSelectType,
    clients: ClientsSchemaSelectType[]
): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()

    const worksheet = workbook.addWorksheet(seller.name)

    worksheet.columns = [
        { key: 'code', width: 8 },
        { key: 'name', width: 25 },
        { key: 'radio', width: 8 },
        { key: 'modality', width: 15 }
    ]

    // Table
    worksheet.addTable({
        name: 'Clients',
        ref: 'A3',
        headerRow: true,
        totalsRow: false,
        style: {
            theme: 'TableStyleLight9',
            showRowStripes: false
        },
        columns: [
            { name: 'Código', filterButton: false },
            { name: 'Nombre', filterButton: true },
            { name: 'Radios', filterButton: false },
            { name: 'Modalidad', filterButton: true }
        ],
        rows: clients.map(client => [
            client.code,
            client.name,
            client.radios_count,
            client.modality
        ])
    })

    worksheet.getColumn('D').eachCell(cellCircleColor)

    // Logo
    setLogo(workbook, worksheet)

    // Header
    worksheet.mergeCells('B1:F1')
    worksheet.getCell('B1').value = seller.name
    worksheet.getCell('B1').font = { bold: true, size: 20 }

    const buf = await workbook.xlsx.writeBuffer()

    return buf as Buffer
}

export function csv (
    clients: ClientsSchemaSelectType[]
): Buffer {
    const data = [
        ['Código', 'Nombre', 'Radios', 'Modalidad'],
        ...clients.map(client => [
            client.code,
            client.name,
            client.radios_count,
            client.modality.name
        ])
    ]

    const buf = Buffer.from(data.map(row => row.join(',')).join('\n'))

    return buf
}
