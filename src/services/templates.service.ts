import { SessionUserInfoSchemaType } from '@/core/auth.shemas'
import { DataSource } from '@/core/data-source.core'
import { RadiosModelRepository } from '@/repositories/radios_model.repository'

import ExcelJS from 'exceljs'

export class TemplatesService {
    private readonly models: RadiosModelRepository

    constructor (private readonly datasource: DataSource) {
        this.models = datasource.create(RadiosModelRepository)
    }

    public async getRadiosTemplate (params: SessionUserInfoSchemaType): Promise<Buffer> {
        const models = await this.models.getAllWithId(params.group_id)

        const workbook = new ExcelJS.Workbook()
        workbook.calcProperties.fullCalcOnLoad = true

        const worksheet = workbook.addWorksheet('Radios')
        const worksheetModels = workbook.addWorksheet('modelos')

        models.forEach(model => {
            worksheetModels.addRow([model.name, model.id])
        })

        worksheet.columns = [
            { key: 'imei', width: 18 },
            { key: 'model', width: 8 },
            { key: 'model_id', hidden: true }
        ]

        worksheet.addTable({
            name: 'Radios',
            ref: 'A1',
            headerRow: true,
            totalsRow: false,
            style: {
                theme: 'TableStyleLight9',
                showRowStripes: false
            },
            columns: [
                { name: 'IMEI', filterButton: false },
                { name: 'Modelo', filterButton: false },
                { name: 'Modelo ID', filterButton: false }
            ],
            rows: [
                ['88888888888888888', 'T199']
            ]
        })

        worksheet.getCell('B2').dataValidation = {
            type: 'list',
            formulae: [`=modelos!$A$1:$A$${models.length}`]
        }

        worksheet.getCell('C2').value = {
            formula: `=VLOOKUP(@[Modelo],modelos!$A$1:$B$${models.length},2,FALSE)`
        }

        const buffer = await workbook.xlsx.writeBuffer()

        return buffer as Buffer
    }
}
