import { Request, Response } from 'express'
import { TemplatesService } from '@services/templates.service'
import { SessionUserInfoSchemaType } from '@/core/auth.shemas'

export class TemplatesController {
    constructor (
        private readonly templates: TemplatesService
    ) {}

    public getRadiosTemplate = async (req: Request, res: Response): Promise<void> => {
        const params = req.body as SessionUserInfoSchemaType

        const data = await this.templates.getRadiosTemplate(params)

        this.responseFile(res, data)
    }

    private responseFile (res: Response, data: Buffer): void {
        res.attachment('skyradio-template.xlsx')
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.status(200).end(data)
    }
}
