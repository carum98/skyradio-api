import { RadiosSchemaSelectType } from '@models/radios.model'
import { SimsShemaSelectType } from '@models/sims.model'

import { cellCircleColor } from './util'

import ExcelJS from 'exceljs'
import { groupByAndCount } from '@/utils'

export async function xlsx (
    radios: RadiosSchemaSelectType[],
    sims: SimsShemaSelectType[]
): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()

    // Sort
    radios.sort((a, b) => a.model.name.localeCompare(b.model.name))
    sims.sort((a, b) => a.provider.name.localeCompare(b.provider.name))

    // Counters
    const counters = workbook.addWorksheet('Inventario')

    const radiosGroupBy = groupByAndCount(radios, (radio) => radio.model.code)
    const simsGroupBy = groupByAndCount(sims, (sim) => sim.provider.code)

    counters.columns = [
        { key: 'model', width: 15 },
        { key: 'count', width: 8 },
        { key: 'spacer', width: 15 },
        { key: 'provider', width: 15 },
        { key: 'count', width: 8 }
    ]

    counters.addTable({
        name: 'Modelos',
        ref: 'A1',
        headerRow: true,
        totalsRow: true,
        style: {
            theme: 'TableStyleLight9',
            showRowStripes: false
        },
        columns: [
            { name: 'Modelo' },
            { name: 'Cantidad', totalsRowFunction: 'sum' }
        ],
        rows: Object.values(radiosGroupBy).sort((a, b) => b.count - a.count).map(({ model, count }) => [model, count])
    })

    counters.getColumn('A').eachCell(cellCircleColor)

    counters.addTable({
        name: 'Proveedores',
        ref: 'D1',
        headerRow: true,
        totalsRow: true,
        style: {
            theme: 'TableStyleLight9',
            showRowStripes: false
        },
        columns: [
            { name: 'Proveedor' },
            { name: 'Cantidad', totalsRowFunction: 'sum' }
        ],
        rows: Object.values(simsGroupBy).sort((a, b) => b.count - a.count).map(({ provider, count }) => [provider, count])
    })

    counters.getColumn('D').eachCell(cellCircleColor)

    // Radios
    const worksheetRadios = workbook.addWorksheet('Radios')

    worksheetRadios.columns = [
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
            { name: 'IMEI', filterButton: true },
            { name: 'Modelo', filterButton: true, totalsRowFunction: 'count' }
        ],
        rows: radios.map(radio => [
            radio.imei,
            radio.model
        ])
    })

    worksheetRadios.getColumn('B').eachCell(cellCircleColor)

    // Sims
    const worksheetSims = workbook.addWorksheet('Sims')

    worksheetSims.columns = [
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
            { name: 'Número', filterButton: true },
            { name: 'Proveedor', filterButton: true, totalsRowFunction: 'count' }
        ],
        rows: sims.map(sim => [
            sim.number,
            sim.provider
        ])
    })

    worksheetSims.getColumn('B').eachCell(cellCircleColor)

    const buf = await workbook.xlsx.writeBuffer()

    return buf as Buffer
}
