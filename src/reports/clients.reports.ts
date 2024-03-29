import { ClientsSchemaSelectType } from '@models/clients.model'
import { RadiosSchemaSelectType } from '@models/radios.model'
import { AppsSchemaSelectType } from '@models/apps.model'

import { groupBy } from '@/utils/index'
import { cellCircleColor, createPdf, richTextColor } from './util'

import ExcelJS from 'exceljs'

export async function xlsx (
    client: ClientsSchemaSelectType,
    radios: RadiosSchemaSelectType[],
    apps: AppsSchemaSelectType[]
): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()

    const worksheet = workbook.addWorksheet('Detalle')

    worksheet.addTable({
        name: 'Modelos',
        ref: 'A5',
        headerRow: true,
        totalsRow: true,
        style: {
            theme: 'TableStyleLight9',
            showRowStripes: false
        },
        columns: [
            { name: 'Modelo', filterButton: false },
            { name: 'Cantidad', filterButton: false, totalsRowFunction: 'sum' }
        ],
        rows: Object.entries(groupBy(radios, radio => radio.model.name)).map(([model, radios]) => [
            radios[0].model,
            radios.length
        ])
    })

    worksheet.getColumn('A').width = 10
    worksheet.getColumn('A').eachCell(cellCircleColor)

    worksheet.getColumn('B').alignment = { horizontal: 'center' }

    worksheet.addTable({
        name: 'Proveedores',
        ref: 'D5',
        headerRow: true,
        totalsRow: true,
        style: {
            theme: 'TableStyleLight9',
            showRowStripes: false
        },
        columns: [
            { name: 'Proveedor', filterButton: false },
            { name: 'Cantidad', filterButton: false, totalsRowFunction: 'sum' }
        ],
        rows: Object.entries(groupBy(radios, radio => radio.sim?.provider.name)).map(([provider, radios]) => [
            radios[0].sim?.provider ?? { color: '#808080', name: 'Sin proveedor' },
            radios.length
        ])
    })

    worksheet.getColumn('D').width = 15
    worksheet.getColumn('D').eachCell(cellCircleColor)

    worksheet.getColumn('E').alignment = { horizontal: 'center' }

    worksheet.addTable({
        name: 'Extra',
        ref: 'G5',
        headerRow: true,
        style: {
            theme: 'TableStyleLight9',
            showRowStripes: false
        },
        columns: [
            { name: 'Tipo', filterButton: false },
            { name: 'Cantidad', filterButton: false }
        ],
        rows: [
            ['Apps', apps.length],
            ['Consola', client.console ? 1 : 0],
        ]
    })

    worksheet.getColumn('H').alignment = { horizontal: 'center' }

    const radiosSheet = workbook.addWorksheet('Radios')
    const simsSheet = workbook.addWorksheet('SIMs')
    const appsSheet = workbook.addWorksheet('Apps')

    radiosSheet.columns = [
        { key: 'name', width: 25 },
        { key: 'imei', width: 20 },
        { key: 'model', width: 10 },
        { key: 'sim', width: 15 },
        { key: 'provider', width: 15 }
    ]

    simsSheet.columns = [
        { key: 'number', width: 15 },
        { key: 'provider', width: 15 }
    ]

    appsSheet.columns = [
        { key: 'name', width: 25 },
        { key: 'license', width: 15 }
    ]

    radiosSheet.addTable({
        name: 'Radios',
        ref: 'A1',
        headerRow: true,
        totalsRow: false,
        style: {
            theme: 'TableStyleLight9',
            showRowStripes: false
        },
        columns: [
            { name: 'Nombre', filterButton: true },
            { name: 'IMEI', filterButton: true },
            { name: 'Modelo', filterButton: true },
            { name: 'SIM', filterButton: true },
            { name: 'Proveedor', filterButton: true }
        ],
        rows: radios.map(radio => [
            radio.name,
            radio.imei,
            radio.model,
            radio.sim?.number,
            radio.sim?.provider
        ])
    })

    radiosSheet.getColumn('C').eachCell(cellCircleColor)
    radiosSheet.getColumn('E').eachCell(cellCircleColor)

    simsSheet.addTable({
        name: 'SIMs',
        ref: 'A1',
        headerRow: true,
        totalsRow: false,
        style: {
            theme: 'TableStyleLight9',
            showRowStripes: false
        },
        columns: [
            { name: 'Número', filterButton: true },
            { name: 'Proveedor', filterButton: true }
        ],
        rows: radios.map(radio => [
            radio.sim?.number,
            radio.sim?.provider
        ])
    })

    simsSheet.getColumn('B').eachCell(cellCircleColor)

    appsSheet.addTable({
        name: 'Apps',
        ref: 'A1',
        headerRow: true,
        totalsRow: false,
        style: {
            theme: 'TableStyleLight9',
            showRowStripes: false
        },
        columns: [
            { name: 'Nombre', filterButton: true },
            { name: 'Licencia', filterButton: true }
        ],
        rows: apps.map(app => [
            app.name,
            app.license?.key
        ])
    })

    // Header
    worksheet.mergeCells('A1:D1')
    worksheet.getCell('A1').value = richTextColor({
        text: client.name,
        color: client.color,
        size: 20,
        shape: '██  '
    })

    worksheet.getCell('A1').alignment = { horizontal: 'left' }

    worksheet.getCell('A2').value = 'Vendedor:'
    worksheet.getCell('B2').value = client.seller?.name ?? '-'
    worksheet.getCell('B2').alignment = { horizontal: 'left' }

    worksheet.getCell('A3').value = 'Modalidad:'
    worksheet.getCell('B3').value = richTextColor({
        text: client.modality.name,
        color: client.modality.color
    })

    const buf = await workbook.xlsx.writeBuffer()

    return buf as Buffer
}

export async function csv (
    radios: RadiosSchemaSelectType[]
): Promise<Buffer> {
    const data = [
        ['Código', 'Nombre', 'IMEI', 'Modelo', 'SIM', 'Proveedor'],
        ...radios.map(radio => [
            radio.code,
            radio.name,
            radio.imei,
            radio.model.name,
            radio.sim?.number,
            radio.sim?.provider?.name
        ])
    ]

    return Buffer.from(data.map(row => row.join(',')).join('\n'))
}

export async function pdf (
    client: ClientsSchemaSelectType,
    radios: RadiosSchemaSelectType[]
): Promise<Buffer> {
    return await createPdf([
        {
            text: `Cliente: ${client.name}`,
            style: 'header'
        },
        {
            style: 'tableExample',
            table: {
            body: [
                    ['Código', 'Nombre', 'IMEI', 'Modelo', 'SIM', 'Proveedor'],
                    ...radios.map(radio => [
                        radio.code,
                        radio.name ?? '-',
                        radio.imei,
                        radio.model.name,
                        radio.sim?.number ?? '-',
                        radio.sim?.provider?.name ?? '-'
                    ])
                ]
            }
        }
    ])
}
