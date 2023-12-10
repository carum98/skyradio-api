import { DataSource } from '@/core/data-source.core'
import { ReportsSchemaClientsType } from '@models/reports.model'
import { ClientsRepository } from '@repositories/clients.repository'
import { RadiosRepository } from '@repositories/radios.repository'

import XLSX from 'xlsx'
import PdfPrinter from 'pdfmake'
import { TDocumentDefinitions } from 'pdfmake/interfaces'
import * as vfsFonts from 'pdfmake/build/vfs_fonts'

export class ReportsService {
    private readonly client: ClientsRepository
    private readonly radios: RadiosRepository

    constructor (datasource: DataSource) {
        this.client = datasource.create(ClientsRepository)
        this.radios = datasource.create(RadiosRepository)
    }

    public async clients (params: ReportsSchemaClientsType): Promise<Buffer> {
        const client = await this.client.get(params.client_code)
        const radios = await this.radios.getByClient(params.client_code, { page: 1, per_page: 1000, sort_by: 'created_at', sort_order: 'desc' })

        const data = radios.data.map(radio => ({
            ...radio,
            model: radio.model.name,
            status: radio.status?.name ?? '-',
            sim: radio.sim?.number ?? '-'
        }))

        if (params.format === 'xlsx') {
            const ws = XLSX.utils.json_to_sheet(data, {
                origin: 'A2'
            })

            XLSX.utils.sheet_add_aoa(ws, [
                ['Cliente', client.name]
            ], { origin: 'A1' })

            const wb = XLSX.utils.book_new()

            XLSX.utils.book_append_sheet(wb, ws, 'Data')

            const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

            return buf
        } else if (params.format === 'csv') {
            const ws = XLSX.utils.json_to_sheet(data)

            const csv = XLSX.utils.sheet_to_csv(ws)

            return Buffer.from(csv)
        } else if (params.format === 'pdf') {
            return await createPdf({
                content: [
                    {
                        text: `Cliente: ${client.name}`,
                        style: 'header'
                    },
                    {
                        style: 'tableExample',
                        table: {
                        body: [
                            ['Código', 'Modelo', 'IMEI', 'Status', 'SIM'],
                            ...data.map(radio => [
                                    radio.code,
                                    radio.model,
                                    radio.imei,
                                    radio.status,
                                    radio.sim
                                ])
                            ]
                        }
                  }
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10]
                    },
                    tableExample: {
                        margin: [0, 5, 0, 15]
                    }
                }
            })
        } else {
            throw new Error('Formato inválido')
        }
    }
}

async function createPdf (docDefinition: TDocumentDefinitions): Promise<Buffer> {
    const Roboto = {
        normal: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-Regular.ttf'], 'base64'),
        bold: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-Medium.ttf'], 'base64'),
        italics: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-Italic.ttf'], 'base64'),
        bolditalics: Buffer.from(
          vfsFonts.pdfMake.vfs['Roboto-MediumItalic.ttf'],
          'base64'
        )
    }

    const printer = new PdfPrinter({ Roboto })
    const pdfDoc = printer.createPdfKitDocument(docDefinition)

    return await new Promise((resolve, reject) => {
      try {
        const chunks: Uint8Array[] = []
        pdfDoc.on('data', (chunk) => chunks.push(chunk))
        pdfDoc.on('end', () => resolve(Buffer.concat(chunks)))
        pdfDoc.end()
      } catch (err) {
        reject(err)
      }
    })
}
