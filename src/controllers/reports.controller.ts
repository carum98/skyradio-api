import { Request, Response } from 'express'
import { ReportsService } from '@/services/reports.service'
import { ReportsFormatsType, ReportsSchemaClientsType, ReportsSchemaModelsType, ReportsSchemaSellersType, ReportsSchemaSimsProviderType } from '@models/reports.model'

export class ReportsController {
    constructor (
        private readonly service: ReportsService
    ) {}

    public clients = async (req: Request, res: Response): Promise<void> => {
        const { group_id } = req.body
        const params = req.body as unknown as ReportsSchemaClientsType

        const data = await this.service.clients(group_id, params)

        this.responseFile(res, data, params.format)
    }

    public models = async (req: Request, res: Response): Promise<void> => {
        const { group_id } = req.body
        const params = req.body as unknown as ReportsSchemaModelsType

        const data = await this.service.models(group_id, params)

        this.responseFile(res, data, params.format)
    }

    public sellers = async (req: Request, res: Response): Promise<void> => {
        const { group_id } = req.body
        const params = req.body as unknown as ReportsSchemaSellersType

        const data = await this.service.sellers(group_id, params)

        this.responseFile(res, data, params.format)
    }

    public simsProvider = async (req: Request, res: Response): Promise<void> => {
        const { group_id } = req.body
        const params = req.body as unknown as ReportsSchemaSimsProviderType

        const data = await this.service.simsProvider(group_id, params)

        this.responseFile(res, data, params.format)
    }

    public inventory = async (req: Request, res: Response): Promise<void> => {
        const { group_id } = req.body

        const data = await this.service.inventory(group_id)

        this.responseFile(res, data, 'xlsx')
    }

    public general = async (req: Request, res: Response): Promise<void> => {
        const { group_id } = req.body

        const data = await this.service.general(group_id)

        this.responseFile(res, data, 'xlsx')
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
