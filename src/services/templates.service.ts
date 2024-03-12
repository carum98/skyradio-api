import { SessionUserInfoSchemaType } from '@/core/auth.shemas'
import { DataSource } from '@/core/data-source.core'
import { RadiosModelRepository } from '@/repositories/radios_model.repository'
import { SimsProviderRepository } from '@/repositories/sims_provider.repository'

import ExcelJS from 'exceljs'

export class TemplatesService {
    private readonly models: RadiosModelRepository
    private readonly providers: SimsProviderRepository

    constructor (private readonly datasource: DataSource) {
        this.models = datasource.create(RadiosModelRepository)
        this.providers = datasource.create(SimsProviderRepository)
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
            { key: 'imei', width: 18, style: { numFmt: '0', alignment: { horizontal: 'left' } } },
            { key: 'model', width: 8, style: { alignment: { horizontal: 'center' } } },
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
                ['88888888888888888', 'T199', 0]
            ]
        })

        worksheet.getCell('B2').dataValidation = {
            type: 'list',
            formulae: [`=modelos!$A$1:$A$${models.length}`]
        }

        worksheet.getCell('C2').value = {
            formula: `=IF(B2="","",VLOOKUP(B2,modelos!$A$1:$B$${models.length},2,FALSE))`
        }

        const buffer = await workbook.xlsx.writeBuffer()

        return buffer as Buffer
    }

    public async getSimsTemplate (params: SessionUserInfoSchemaType): Promise<Buffer> {
        const providers = await this.providers.getAllWithId(params.group_id)

        const workbook = new ExcelJS.Workbook()
        workbook.calcProperties.fullCalcOnLoad = true

        const worksheet = workbook.addWorksheet('Sims')
        const worksheetProviders = workbook.addWorksheet('proveedores')

        providers.forEach(provider => {
            worksheetProviders.addRow([provider.name, provider.id])
        })

        worksheet.columns = [
            { key: 'number', width: 18, style: { numFmt: '0', alignment: { horizontal: 'left' } } },
            { key: 'provider', width: 8, style: { alignment: { horizontal: 'center' } } },
            { key: 'provider_id', hidden: true }
        ]

        worksheet.addTable({
            name: 'Sims',
            ref: 'A1',
            headerRow: true,
            totalsRow: false,
            style: {
                theme: 'TableStyleLight9',
                showRowStripes: false
            },
            columns: [
                { name: 'Numero', filterButton: false },
                { name: 'Proveedor', filterButton: false },
                { name: 'Proveedor ID', filterButton: false }
            ],
            rows: [
                ['88887777', 'Movistar', 0]
            ]
        })

        worksheet.getCell('B2').dataValidation = {
            type: 'list',
            formulae: [`=proveedores!$A$1:$A$${providers.length}`]
        }

        worksheet.getCell('C2').value = {
            formula: `=IF(B2="","",VLOOKUP(B2,proveedores!$A$1:$B$${providers.length},2,FALSE))`
        }

        const buffer = await workbook.xlsx.writeBuffer()

        return buffer as Buffer
    }
}
