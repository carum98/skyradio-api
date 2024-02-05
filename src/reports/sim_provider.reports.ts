import { SimsShemaSelectType } from '@models/sims.model'
import { SimsProviderShemaSelectType } from '@models/sims_provider.model'

import { cellCircleColor, createPdf, setLogo } from './util'

import ExcelJS from 'exceljs'

export async function xlsx (
    simProvider: SimsProviderShemaSelectType,
    sims: SimsShemaSelectType[]
): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()

    const worksheet = workbook.addWorksheet(simProvider.name)

    worksheet.columns = [
        { key: 'code', width: 8 },
        { key: 'number', width: 15 }
    ]

    // Table
    worksheet.addTable({
        name: 'Sims',
        ref: 'A3',
        headerRow: true,
        totalsRow: false,
        style: {
            theme: 'TableStyleLight9',
            showRowStripes: false
        },
        columns: [
            { name: 'Código', filterButton: false },
            { name: 'Número', filterButton: false }
        ],
        rows: sims.map(sim => [
            sim.code,
            sim.number
        ])
    })

    worksheet.getColumn('B').eachCell(cellCircleColor)

    // Logo
    setLogo(workbook, worksheet)

    // Header
    worksheet.mergeCells('B1:D1')
    worksheet.getCell('B1').value = simProvider.name
    worksheet.getCell('B1').font = { bold: true, size: 20 }

    const buf = await workbook.xlsx.writeBuffer()

    return buf as Buffer
}

export function csv (
    sims: SimsShemaSelectType[]
): Buffer {
    const data = [
        ['Código', 'Número'],
        ...sims.map(sim => [
            sim.code,
            sim.number
        ])
    ]

    const buf = Buffer.from(data.map(row => row.join(',')).join('\n'))

    return buf
}

export async function pdf (
    simProvider: SimsProviderShemaSelectType,
    sims: SimsShemaSelectType[]
): Promise<Buffer> {
    return await createPdf([
        {
            text: `Proveedor: ${simProvider.name}`,
            style: 'header'
        },
        {
            style: 'tableExample',
            table: {
            body: [
                ['Código', 'Número'],
                ...sims.map(sim => [
                    sim.code,
                    sim.number
                ])
            ]
            }
        }
    ])
}
