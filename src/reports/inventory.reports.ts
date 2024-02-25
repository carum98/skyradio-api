import { RadiosSchemaSelectType } from '@models/radios.model'
import { SimsShemaSelectType } from '@models/sims.model'

import { cellCircleColor, createPdf } from './util'

import ExcelJS from 'exceljs'

export async function xlsx (
    radios: RadiosSchemaSelectType[],
    sims: SimsShemaSelectType[]
): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()

    // Sort radios by model
    radios.sort((a, b) => a.model.name.localeCompare(b.model.name))

    // Sort sims by provider
    sims.sort((a, b) => a.provider.name.localeCompare(b.provider.name))

    // Radios
    const worksheetRadios = workbook.addWorksheet('Radios')

    worksheetRadios.columns = [
        { key: 'code', width: 8 },
        { key: 'imei', width: 20 },
        { key: 'model', width: 10 }
    ]

    worksheetRadios.addTable({
        name: 'Radios',
        ref: 'A1',
        headerRow: true,
        totalsRow: true,
        style: {
            theme: 'TableStyleLight9',
            showRowStripes: false
        },
        columns: [
            { name: 'Código', filterButton: false },
            { name: 'IMEI', filterButton: true },
            { name: 'Modelo', filterButton: true, totalsRowFunction: 'count' }
        ],
        rows: radios.map(radio => [
            radio.code,
            radio.imei,
            radio.model
        ])
    })

    worksheetRadios.getColumn('C').eachCell(cellCircleColor)

    // Sims
    const worksheetSims = workbook.addWorksheet('Sims')

    worksheetSims.columns = [
        { key: 'code', width: 8 },
        { key: 'number', width: 10 },
        { key: 'provider', width: 15 }
    ]

    worksheetSims.addTable({
        name: 'Sims',
        ref: 'A1',
        headerRow: true,
        totalsRow: true,
        style: {
            theme: 'TableStyleLight9',
            showRowStripes: false
        },
        columns: [
            { name: 'Código', filterButton: false },
            { name: 'Número', filterButton: true },
            { name: 'Proveedor', filterButton: true, totalsRowFunction: 'count' }
        ],
        rows: sims.map(sim => [
            sim.code,
            sim.number,
            sim.provider
        ])
    })

    worksheetSims.getColumn('C').eachCell(cellCircleColor)

    const buf = await workbook.xlsx.writeBuffer()

    return buf as Buffer
}

export async function csv (
    radios: RadiosSchemaSelectType[]
): Promise<Buffer> {
    const csv = [
        ['Código', 'IMEI', 'Modelo'],
        ...radios.map(radio => [
            radio.code,
            radio.imei,
            radio.model.name
        ])
    ].map(row => row.join(','))

    return Buffer.from(csv.join('\n'))
}

export async function pdf (
    radios: RadiosSchemaSelectType[]
): Promise<Buffer> {
    return await createPdf([
        {
            text: 'Inventario',
            style: 'header'
        },
        {
            style: 'tableExample',
            table: {
                body: [
                    ['Código', 'IMEI', 'Modelo'],
                    ...radios.map(radio => [
                        radio.code,
                        radio.imei,
                        radio.model.name
                    ])
                ]
            }
        }
    ])
}
