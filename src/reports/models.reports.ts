import { RadiosSchemaSelectType } from '@/models/radios.model'
import { RadiosModelShemaSelectType } from '@/models/radios_model.model'

import { cellCircleColor, setLogo } from './util'

import ExcelJS from 'exceljs'

export async function xlsx (
    model: RadiosModelShemaSelectType,
    radios: RadiosSchemaSelectType[]
): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()

    const worksheet = workbook.addWorksheet(model.name)

    worksheet.columns = [
        { key: 'code', width: 8 },
        { key: 'name', width: 25 },
        { key: 'imei', width: 20 },
        { key: 'sim', width: 15 },
        { key: 'provider', width: 15 }
    ]

    // Table
    worksheet.addTable({
        name: 'Radios',
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
            { name: 'IMEI', filterButton: true },
            { name: 'SIM', filterButton: true },
            { name: 'Proveedor', filterButton: true }
        ],
        rows: radios.map(radio => [
            radio.code,
            radio.name,
            radio.imei,
            radio.sim?.number,
            radio.sim?.provider
        ])
    })

    worksheet.getColumn('E').eachCell(cellCircleColor)

    // Logo
    setLogo(workbook, worksheet)

    // Header
    worksheet.mergeCells('B1:F1')
    worksheet.getCell('B1').value = model.name
    worksheet.getCell('B1').font = { bold: true, size: 20 }

    worksheet.mergeCells('B2:F2')
    worksheet.getCell('B2').value = `Cantidad: ${radios.length}`

    const buf = await workbook.xlsx.writeBuffer()

    return buf as Buffer
}

export async function csv (
    radios: RadiosSchemaSelectType[]
): Promise<Buffer> {
    const data = [
        ['Código', 'Nombre', 'IMEI', 'SIM', 'Proveedor'],
        ...radios.map(radio => [
            radio.code,
            radio.name,
            radio.imei,
            radio.sim?.number,
            radio.sim?.provider
        ])
    ]

    const buf = Buffer.from(data.map(row => row.join(',')).join('\n'))

    return buf
}
