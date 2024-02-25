import { RadiosSchemaSelectType } from '@models/radios.model'

import { cellCircleColor, createPdf } from './util'

import ExcelJS from 'exceljs'

export async function xlsx (
    radios: RadiosSchemaSelectType[]
): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()

    const worksheet = workbook.addWorksheet('Inventario')

    worksheet.columns = [
        { key: 'code', width: 8 },
        { key: 'imei', width: 20 },
        { key: 'model', width: 10 }
    ]

    // Table
    worksheet.addTable({
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
            { name: 'Modelo', filterButton: true }
        ],
        rows: radios.map(radio => [
            radio.code,
            radio.imei,
            radio.model
        ])
    })

    worksheet.getColumn('C').eachCell(cellCircleColor)

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
