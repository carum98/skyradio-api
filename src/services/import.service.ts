import { DataSource } from '@/core/data-source.core'
import { RadiosRepository } from '@/repositories/radios.repository'

import ExcelJS from 'exceljs'

export class ImportService {
    private readonly radios: RadiosRepository

    constructor (private readonly datasource: DataSource) {
        this.radios = datasource.create(RadiosRepository)
    }

    public async importRadios (buffer: Buffer): Promise<void> {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(buffer)

        const worksheet = workbook.getWorksheet(1) as ExcelJS.Worksheet

        const radios = worksheet.getSheetValues().map(row => {
            const values = row as string[]

            return {
                imei: values.at(1),
                model: values.at(2),
            }
        })

        console.log(radios)
    }
}
