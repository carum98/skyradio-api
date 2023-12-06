import { Request, Response } from 'express'
import { ClientsService } from '@services/clients.service'
import { ClientsSchemaCreateType, ClientsSchemaUpdateType, ClientsRadiosSchemaType, ClientRadiosSwapSchemaType, ClientsExportType } from '@models/clients.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { LogsService } from '@/services/logs.service'
import { SessionUserInfoSchemaType } from '@/core/auth.shemas'

export class ClientsController {
    constructor (
        private readonly service: ClientsService,
        private readonly logs: LogsService
    ) {}

    public getAll = async (req: Request, res: Response): Promise<void> => {
        const { group_id } = req.body
        const query = req.query as unknown as PaginationSchemaType

        const data = await this.service.getAll(parseInt(group_id), query)

        res.json(data)
    }

    public get = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params

        const data = await this.service.get(code)

        res.json(data)
    }

    public create = async (req: Request, res: Response): Promise<void> => {
        const params = req.body as ClientsSchemaCreateType & SessionUserInfoSchemaType

        const data = await this.service.create(params)

        await this.logs.createClient({
            session: params,
            params: {
                client_code: data.code
            }
        })

        res.json(data)
    }

    public update = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const params = req.body as ClientsSchemaUpdateType

        const data = await this.service.update(code, params)

        res.json(data)
    }

    public delete = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params

        const data = await this.service.delete(code)

        if (data) {
            res.status(204).json()
        } else {
            res.status(400).json()
        }
    }

    public export = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const params = req.body as ClientsExportType

        const fileName = `export-${code}-${Date.now()}`

        let fileExtension = ''
        let contentType = ''

        switch (params.format) {
            case 'pdf':
                fileExtension = 'pdf'
                contentType = 'application/pdf'
                break
            case 'csv':
                fileExtension = 'csv'
                contentType = 'text/csv'
                break
            default:
                fileExtension = 'xlsx'
                contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                break
        }

        const data = await this.service.export(code, params)

        res.attachment(`${fileName}.${fileExtension}`)

        res.setHeader('Content-Type', contentType)

        res.status(200).end(data)
    }

    public getRadios = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const query = req.query as unknown as PaginationSchemaType

        const data = await this.service.getRadios(code, query)

        res.json(data)
    }

    public addRadios = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const params = req.body as ClientsRadiosSchemaType

        const data = await this.service.addRadios(code, params)

        if (data) {
            await this.logs.addRadiosToClient({
                session: req.body,
                params: {
                    client_code: code
                }
            }, params.radios_codes)

            res.status(204).json()
        } else {
            res.status(400).json()
        }
    }

    public swapRadios = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const params = req.body as ClientRadiosSwapSchemaType

        const data = await this.service.swapRadios(code, params)

        if (data) {
            await this.logs.swapRadioFromClient({
                session: req.body,
                params: {
                    client_code: code,
                    radio_code: params.radio_code_to
                }
            })

            res.status(204).json()
        } else {
            res.status(400).json()
        }
    }

    public removeRadios = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const params = req.body as ClientsRadiosSchemaType

        const data = await this.service.removeRadios(code, params)

        if (data) {
            await this.logs.removeRadiosFromClient({
                session: req.body,
                params: {
                    client_code: code
                }
            }, params.radios_codes)

            res.status(204).json()
        } else {
            res.status(400).json()
        }
    }

    public getLogs = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const query = req.query as unknown as PaginationSchemaType

        const data = await this.service.getLogs(code, query)

        res.json(data)
    }

    public getStats = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params

        const data = await this.service.getStats(code)

        res.json(data)
    }
}
