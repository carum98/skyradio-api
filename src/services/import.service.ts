import { SessionUserInfoSchemaType } from '@/core/auth.shemas'
import { DataSource } from '@/core/data-source.core'
import { RadiosSchemaCreateRawType } from '@/models/radios.model'
import { RadiosRepository } from '@/repositories/radios.repository'

import ExcelJS from 'exceljs'

export class ImportService {
    private readonly radios: RadiosRepository

    constructor (private readonly datasource: DataSource) {
        this.radios = datasource.create(RadiosRepository)
    }

    public async importRadios (buffer: Buffer, params: SessionUserInfoSchemaType): Promise<string[]> {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(buffer)

        const worksheet = workbook.getWorksheet(1) as ExcelJS.Worksheet
        const worksheetModels = workbook.getWorksheet(2) as ExcelJS.Worksheet

        const models = worksheetModels.getSheetValues().map(row => {
            const values = row as string[]

            return {
                name: values.at(1),
                id: parseInt(values.at(2) as string)
            }
        })

        const radios = worksheet.getSheetValues().filter((row, index) => index !== 1 && row).map(row => {
            const values = row as string[]
            const model = models.find(item => item?.name === values.at(2)) as { id: number, name: string }

            return {
                imei: values.at(1)?.toString(),
                model_id: model.id,
                group_id: params.group_id
            }
        }) as RadiosSchemaCreateRawType[]

        return await this.radios.createMany(radios)
    }
}
