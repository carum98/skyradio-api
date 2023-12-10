import { Request, Response } from 'express'
import { ReportsService } from '@/services/reports.service'
import { ReportsFormatsType, ReportsSchemaClientsType } from '@/models/reports.model'

export class ReportsController {
    constructor (
        private readonly service: ReportsService
    ) {}

    public clients = async (req: Request, res: Response): Promise<void> => {
        const params = req.body as unknown as ReportsSchemaClientsType

        const data = await this.service.clients(params)

        this.responseFile(res, data, params.format)
    }

    private responseFile (res: Response, data: Buffer, format: ReportsFormatsType): void {
        const fileName = `skyradio-report-${Date.now()}`

        let fileExtension = ''
        let contentType = '' 

        switch (format) {
            case 'pdf':
                fileExtension = 'pdf'
                contentType = 'application/pdf'
                break
            case 'xlsx':
                fileExtension = 'xlsx'
                contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                break
            case 'csv':
                fileExtension = 'csv'
                contentType = 'text/csv'
                break
        }

        res.attachment(`${fileName}.${fileExtension}`)
        res.setHeader('Content-Type', contentType)
        res.status(200).end(data)
    }
}
