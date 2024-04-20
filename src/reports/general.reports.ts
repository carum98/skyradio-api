import { AppsSchemaSelectType } from '@models/apps.model'
import { ClientsSchemaSelectType } from '@models/clients.model'
import { RadiosSchemaSelectType } from '@models/radios.model'
import { SimsShemaSelectType } from '@models/sims.model'
import { ConsoleSchemaSelectType } from '@models/clients_console.model'

import ExcelJS from 'exceljs'
import { cellCircleColor } from './util'
import { groupBy } from '@/utils'

export async function xlsx ({
    clients,
    radios,
    sims,
    apps,
    consoles
}: {
    clients: ClientsSchemaSelectType[]
    radios: RadiosSchemaSelectType[]
    sims: SimsShemaSelectType[]
    apps: AppsSchemaSelectType[]
    consoles: ConsoleSchemaSelectType[]
}): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()

    const worksheet = workbook.addWorksheet('Detalle')

    worksheet.addTable({
        name: 'Clientes',
        ref: 'A1',
        headerRow: true,
        totalsRow: true,
        style: {
            theme: 'TableStyleMedium2'
        },
        columns: [
            { name: 'Cliente', filterButton: false },
            { name: 'Cantidad', filterButton: false, totalsRowFunction: 'sum' }
        ],
        rows: clients
            .toSorted((a, b) => b.radios_count - a.radios_count)
            .map(client => [
                client,
                client.radios_count
            ])
    })
    worksheet.getColumn('A').eachCell(cellCircleColor)
    worksheet.getColumn('A').width = 45
    worksheet.getColumn('B').alignment = { horizontal: 'center' }

    worksheet.addTable({
        name: 'Modelos',
        ref: 'D1',
        headerRow: true,
        totalsRow: true,
        style: {
            theme: 'TableStyleMedium2'
        },
        columns: [
            { name: 'Modelo', filterButton: false },
            { name: 'Cantidad', filterButton: false, totalsRowFunction: 'sum' }
        ],
        rows: Object.entries(groupBy(radios, radio => radio.model.code))
            .map(([_, radios]) => [
                radios.at(0).model,
                radios.length
            ])
            .toSorted((a, b) => b[1] - a[1])
    })
    worksheet.getColumn('D').eachCell(cellCircleColor)
    worksheet.getColumn('D').width = 15
    worksheet.getColumn('E').alignment = { horizontal: 'center' }

    worksheet.addTable({
        name: 'Proveedores',
        ref: 'G1',
        headerRow: true,
        style: {
            theme: 'TableStyleMedium2'
        },
        columns: [
            { name: 'Proveedor', filterButton: false },
            { name: 'Cantidad', filterButton: false }
        ],
        rows: Object.entries(groupBy(radios, radio => radio.sim?.provider.code))
            .map(([_, radios]) => [
                radios.at(0).sim?.provider ?? { color: '#808080', name: 'Sin proveedor' },
                radios.length
            ])
            .toSorted((a, b) => b[1] - a[1])
    })
    worksheet.getColumn('G').eachCell(cellCircleColor)
    worksheet.getColumn('G').width = 15
    worksheet.getColumn('H').alignment = { horizontal: 'center' }

    worksheet.addTable({
        name: 'Modalidad',
        ref: 'J1',
        headerRow: true,
        style: {
            theme: 'TableStyleMedium2'
        },
        columns: [
            { name: 'Modalidad', filterButton: false },
            { name: 'Cantidad', filterButton: false }
        ],
        rows: Object.entries(groupBy(clients, client => client.modality.code))
            .map(([_, clients]) => [
                clients.at(0).modality,
                clients.length
            ])
            .toSorted((a, b) => b[1] - a[1])
    })
    worksheet.getColumn('J').eachCell(cellCircleColor)
    worksheet.getColumn('J').width = 15
    worksheet.getColumn('K').alignment = { horizontal: 'center' }

    worksheet.addTable({
        name: 'Vendedores',
        ref: 'M1',
        headerRow: true,
        style: {
            theme: 'TableStyleMedium2'
        },
        columns: [
            { name: 'Vendedor', filterButton: false },
            { name: 'Cantidad', filterButton: false }
        ],
        rows: Object.entries(groupBy(clients, client => client.seller?.code))
            .map(([_, clients]) => [
                clients.at(0).seller?.name ?? 'Sin vendedor',
                clients.length
            ])
            .toSorted((a, b) => b[1] - a[1])
    })
    worksheet.getColumn('M').width = 15
    worksheet.getColumn('N').alignment = { horizontal: 'center' }

    worksheet.addTable({
        name: 'Types',
        ref: 'P1',
        headerRow: true,
        style: {
            theme: 'TableStyleMedium2'
        },
        columns: [
            { name: 'Tipo', filterButton: false },
            { name: 'Cantidad', filterButton: false }
        ],
        rows: [
            ['Radios', radios.length],
            ['Sims', sims.length],
            ['Apps', apps.length],
            ['Consolas', consoles.length]
        ]
    })
    worksheet.getColumn('P').width = 15
    worksheet.getColumn('Q').alignment = { horizontal: 'center' }

    // Radios
    const worksheetRadios = workbook.addWorksheet('Radios')
    worksheetRadios.columns = [
        { header: 'Nombre', key: 'name', width: 15 },
        { header: 'IMEI', key: 'imei', width: 16 },
        { header: 'Modelo', key: 'model', width: 10 },
        { header: 'SIM', key: 'sim', width: 10 },
        { header: 'Proveedor', key: 'provider', width: 15 },
        { header: 'Cliente', key: 'client', width: 45 }
    ]
    worksheetRadios.addTable({
        name: 'Radios',
        ref: 'A1',
        headerRow: true,
        totalsRow: true,
        style: {
            theme: 'TableStyleMedium2'
        },
        columns: [
            { name: 'Nombre', filterButton: true },
            { name: 'IMEI', filterButton: true },
            { name: 'Modelo', filterButton: true },
            { name: 'SIM', filterButton: true },
            { name: 'Proveedor', filterButton: true },
            { name: 'Cliente', filterButton: true, totalsRowFunction: 'count' }
        ],
        rows: radios.map(radio => [
            radio.name,
            radio.imei,
            radio.model,
            radio.sim?.number,
            radio.sim?.provider,
            radio.client
        ])
    })
    worksheetRadios.getColumn('C').eachCell(cellCircleColor)
    worksheetRadios.getColumn('E').eachCell(cellCircleColor)
    worksheetRadios.getColumn('F').eachCell(cellCircleColor)

    // Sims
    const worksheetSims = workbook.addWorksheet('Sims')
    worksheetSims.columns = [
        { header: 'Número', key: 'number', width: 10 },
        { header: 'Proveedor', key: 'provider', width: 15 },
        { header: 'Cliente', key: 'client', width: 45 }
    ]
    worksheetSims.addTable({
        name: 'Sims',
        ref: 'A1',
        headerRow: true,
        totalsRow: true,
        style: {
            theme: 'TableStyleMedium2'
        },
        columns: [
            { name: 'Número', filterButton: true },
            { name: 'Proveedor', filterButton: true },
            { name: 'Cliente', filterButton: true, totalsRowFunction: 'count' }
        ],
        rows: sims.map(sim => [
            sim.number,
            sim.provider,
            sim.radio?.client
        ])
    })
    worksheetSims.getColumn('B').eachCell(cellCircleColor)
    worksheetSims.getColumn('C').eachCell(cellCircleColor)

    // Apps
    const worksheetApps = workbook.addWorksheet('Apps')
    worksheetApps.columns = [
        { header: 'Nombre', key: 'name', width: 15 },
        { header: 'Licencia', key: 'license', width: 20 },
        { header: 'Cliente', key: 'client', width: 45 }
    ]
    worksheetApps.addTable({
        name: 'Apps',
        ref: 'A1',
        headerRow: true,
        totalsRow: true,
        style: {
            theme: 'TableStyleMedium2'
        },
        columns: [
            { name: 'Nombre', filterButton: true },
            { name: 'Licencia', filterButton: true },
            { name: 'Cliente', filterButton: true, totalsRowFunction: 'count' }
        ],
        rows: apps.map(app => [
            app.name,
            app.license?.key,
            app.client
        ])
    })
    worksheetApps.getColumn('C').eachCell(cellCircleColor)

    // Consoles
    const worksheetConsoles = workbook.addWorksheet('Consolas')
    worksheetConsoles.columns = [
        { header: 'Licencia', key: 'license', width: 20 },
        { header: 'Cliente', key: 'client', width: 45 }
    ]
    worksheetConsoles.addTable({
        name: 'Consolas',
        ref: 'A1',
        headerRow: true,
        totalsRow: true,
        style: {
            theme: 'TableStyleMedium2'
        },
        columns: [
            { name: 'Licencia', filterButton: true },
            { name: 'Cliente', filterButton: true, totalsRowFunction: 'count' }
        ],
        rows: consoles.map(console => [
            console.license?.key,
            console.client
        ])
    })
    worksheetConsoles.getColumn('B').eachCell(cellCircleColor)

    const buf = await workbook.xlsx.writeBuffer()

    return buf as Buffer
}
