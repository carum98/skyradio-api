import { Request, Response } from 'express'
import { RadiosService } from '@services/radios.service'
import { RadiosCompanySchemaType, RadiosSchemaCreateType, RadiosSchemaUpdateType, RadiosSimsSchemaType } from '@/models/radios.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { SessionUserInfoSchemaType } from '@/core/auth.shemas'
import { LogsService } from '@/services/logs.service'

export class RadiosController {
    constructor (
        private readonly service: RadiosService,
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
        const params = req.body as RadiosSchemaCreateType

        const data = await this.service.create(params)

        await this.logs.createRadio({
            session: req.body,
            params: {
                radio_code: data.code
            }
        })

        res.json(data)
    }

    public update = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const params = req.body as RadiosSchemaUpdateType

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

    public getClients = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params

        const data = await this.service.getClients(code)

        res.json(data)
    }

    public addClient = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const params = req.body as RadiosCompanySchemaType

        const data = await this.service.addClient(code, params)

        if (data) {
            await this.logs.addRadioToClient({
                session: req.body,
                params: {
                    radio_code: code,
                    client_code: params.client_code
                }
            })

            res.status(204).json()
        } else {
            res.status(400).json()
        }
    }

    public removeClient = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const params = req.body as SessionUserInfoSchemaType

        const client = await this.service.getClients(code)
        const data = await this.service.removeClient(code, { client_code: client.code })

        if (data) {
            await this.logs.removeRadioFromClient({
                session: params,
                params: {
                    radio_code: code,
                    client_code: client.code
                }
            })

            res.status(204).json()
        } else {
            res.status(400).json()
        }
    }

    public getSim = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params

        const data = await this.service.getSim(code)

        res.json(data)
    }

    public addSim = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const params = req.body as RadiosSimsSchemaType

        const data = await this.service.addSim(code, params)

        if (data) {
            await this.logs.addSimToRadio({
                session: req.body,
                params: {
                    radio_code: code,
                    sim_code: params.sim_code
                }
            })

            res.status(204).json()
        } else {
            res.status(400).json()
        }
    }

    public removeSim = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params

        const radio = await this.service.get(code)
        const data = await this.service.removeSim(code)

        if (data) {
            await this.logs.removeSimFromRadio({
                session: req.body,
                params: {
                    radio_code: code,
                    sim_code: radio.sim?.code ?? ''
                }
            })

            res.status(204).json()
        } else {
            res.status(400).json()
        }
    }

    public swapSim = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const params = req.body as RadiosSimsSchemaType

        const data = await this.service.swapSim(code, params)

        if (data) {
            await this.logs.swapSimFromRadio({
                session: req.body,
                params: {
                    radio_code: code,
                    sim_code: params.sim_code
                }
            })

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
}
