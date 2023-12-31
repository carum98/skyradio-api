import { DataSource } from '@/core/data-source.core'
import { ReportsSchemaClientsType, ReportsSchemaModelsType, ReportsSchemaSellersType, ReportsSchemaSimsProviderType } from '@models/reports.model'
import { ClientsRepository } from '@repositories/clients.repository'
import { RadiosRepository } from '@repositories/radios.repository'
import { RadiosModelRepository } from '@repositories/radios_model.repository'
import { SellersRepository } from '@repositories/sellers.repository'
import { SimsProviderRepository } from '@repositories/sims_provider.repository'
import { SimsRepository } from '@repositories/sims.repository'

import XLSX from 'xlsx'
import PdfPrinter from 'pdfmake'
import { TDocumentDefinitions } from 'pdfmake/interfaces'
import * as vfsFonts from 'pdfmake/build/vfs_fonts'

export class ReportsService {
    private readonly client: ClientsRepository
    private readonly radios: RadiosRepository
    private readonly model: RadiosModelRepository
    private readonly seller: SellersRepository
    private readonly sims: SimsRepository
    private readonly provider: SimsProviderRepository

    constructor (datasource: DataSource) {
        this.client = datasource.create(ClientsRepository)
        this.radios = datasource.create(RadiosRepository)
        this.model = datasource.create(RadiosModelRepository)
        this.seller = datasource.create(SellersRepository)
        this.sims = datasource.create(SimsRepository)
        this.provider = datasource.create(SimsProviderRepository)
    }

    public async clients (group_id: number, params: ReportsSchemaClientsType): Promise<Buffer> {
        const client = await this.client.get(params.client_code)
        const radios = await this.radios.getAllBy(group_id, {
            client_code: params.client_code
        })

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

    public async models (group_id: number, params: ReportsSchemaModelsType): Promise<Buffer> {
        const modelInfo = await this.model.get(params.model_code)
        const radios = await this.radios.getAllBy(group_id, {
            model_code: params.model_code
        })

        const data = radios.data.map(radio => ({
            ...radio,
            client: radio.client?.name ?? '-',
            status: radio.status?.name ?? '-',
            sim: radio.sim?.number ?? '-'
        }))

        if (params.format === 'xlsx') {
            const ws = XLSX.utils.json_to_sheet(data, {
                origin: 'A2'
            })

            XLSX.utils.sheet_add_aoa(ws, [
                ['Modelo', modelInfo.name]
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
                        text: `Modelo: ${modelInfo.name}`,
                        style: 'header'
                    },
                    {
                        style: 'tableExample',
                        table: {
                        body: [
                            ['Código', 'Cliente', 'IMEI', 'Status', 'SIM'],
                            ...data.map(radio => [
                                    radio.code,
                                    radio.client,
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

    public async sellers (group_id: number, params: ReportsSchemaSellersType): Promise<Buffer> {
        const seller = await this.seller.get(params.seller_code)
        const clients = await this.client.getAllBy(group_id, {
            seller_code: params.seller_code
        })

        const data = clients.data.map(client => ({
            ...client,
            seller: client.seller?.name ?? '-',
            modality: client.modality?.name ?? '-'
        }))

        if (params.format === 'xlsx') {
            const ws = XLSX.utils.json_to_sheet(data, {
                origin: 'A2'
            })

            XLSX.utils.sheet_add_aoa(ws, [
                ['Vendedor', seller.name]
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
                        text: `Vendedor: ${seller.name}`,
                        style: 'header'
                    },
                    {
                        style: 'tableExample',
                        table: {
                        body: [
                            ['Código', 'Cliente', 'Rádios', 'Modalidade'],
                            ...data.map(client => [
                                    client.code,
                                    client.name,
                                    client.radios_count,
                                    client.modality
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

    public async simsProvider (group_id: number, params: ReportsSchemaSimsProviderType): Promise<Buffer> {
        const provider = await this.provider.get(params.provider_code)
        const sims = await this.sims.getAllBy(group_id, {
            provider_code: params.provider_code
        })

        const data = sims.data.map(sim => ({
            ...sim,
            provider: sim.provider?.name ?? '-',
            radio: sim.radio?.imei ?? '-'
        }))

        if (params.format === 'xlsx') {
            const ws = XLSX.utils.json_to_sheet(data, {
                origin: 'A2'
            })

            XLSX.utils.sheet_add_aoa(ws, [
                ['Proveedor', provider.name]
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
                        text: `Proveedor: ${provider.name}`,
                        style: 'header'
                    },
                    {
                        style: 'tableExample',
                        table: {
                        body: [
                            ['Código', 'Número', 'Rádio'],
                            ...data.map(sim => [
                                    sim.code,
                                    sim.number,
                                    sim.radio
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
