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

    public async importRadios (buffer: Buffer, params: SessionUserInfoSchemaType): Promise<void> {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(buffer)

        const worksheet = workbook.getWorksheet(1) as ExcelJS.Worksheet

        const radios = worksheet.getSheetValues().map(row => {
            const values = row as string[]

            return {
                imei: values.at(1),
                model_id: parseInt(values.at(2) as string),
                group_id: params.group_id
            }
        }) as RadiosSchemaCreateRawType[]

        await this.radios.createMany(radios)
    }
}
