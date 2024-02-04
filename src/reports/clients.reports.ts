import { ClientsSchemaSelectType } from '@/models/clients.model'
import { RadiosSchemaSelectType } from '@/models/radios.model'

import fs from 'fs'
import path from 'path'

import ExcelJS from 'exceljs'

async function xlsx (
    client: ClientsSchemaSelectType,
    radios: RadiosSchemaSelectType[]
): Promise<Buffer> {
    const data = radios.map(radio => ({
        ...radio,
        model: radio.model.name,
        sim: radio.sim?.number ?? '-'
    }))

    const workbook = new ExcelJS.Workbook()

    const worksheet = workbook.addWorksheet(client.name)

    worksheet.columns = [
        { width: 8 },
        { width: 30 },
        { width: 15 },
        { width: 25 },
        { width: 15 }
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
            { name: 'Modelo', filterButton: true },
            { name: 'SIM', filterButton: true }
        ],
        rows: data.map(radio => [
            radio.code,
            radio.name,
            radio.imei,
            radio.model,
            radio.sim
        ])
    })

    // Header
    worksheet.mergeCells('B1:E1')
    worksheet.getCell('B1').value = client.name
    worksheet.getCell('B1').font = { bold: true, size: 20 }

    worksheet.mergeCells('B2:E2')
    worksheet.getCell('B2').value = 'Verdedor: ' + (client.seller?.name ?? '-')

    // Logo
    const logo = workbook.addImage({
        buffer: fs.readFileSync(path.resolve(__dirname, '../../assets/logo.png')),
        extension: 'png'
    })

    worksheet.mergeCells('A1:A2')
    worksheet.addImage(logo, {
        tl: { col: 0.95, row: 0 },
        ext: { width: 50, height: 50 }
    })

    const buf = await workbook.xlsx.writeBuffer()

    return buf as Buffer
}

async function csv (
    client: ClientsSchemaSelectType,
    radios: RadiosSchemaSelectType[]
): Promise<Buffer> {
    const data = radios.map(radio => ({
        ...radio,
        model: radio.model.name,
        sim: radio.sim?.number ?? '-'
    }))

    const workbook = new ExcelJS.Workbook()

    const worksheet = workbook.addWorksheet(client.name)

    worksheet.columns = [
        { header: 'Código', key: 'code' },
        { header: 'Nombre', key: 'name' },
        { header: 'Modelo', key: 'model' },
        { header: 'IMEI', key: 'imei' },
        { header: 'SIM', key: 'sim' }
    ]

    worksheet.addRows(data)

    const buf = await workbook.csv.writeBuffer()

    return buf as Buffer
}

export default {
    xlsx,
    csv
}
