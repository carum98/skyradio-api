import { z } from 'zod'

export const ReportsFormats = ['xlsx', 'csv', 'pdf'] as const

export const ReportsSchemaClients = z.object({
    client_code: z.string().length(6),
    format: z.enum(ReportsFormats)
})

export const ReportsSchemaModels = z.object({
    model_code: z.string().length(6),
    format: z.enum(ReportsFormats)
})

export const ReportSchemaSellers = z.object({
    seller_code: z.string().length(6),
    format: z.enum(ReportsFormats)
})

export const ReportSchemaSimsProvider = z.object({
    provider_code: z.string().length(6),
    format: z.enum(ReportsFormats)
})

export const ReportsSchemaInventory = z.object({
    format: z.enum(ReportsFormats)
})

export type ReportsFormatsType = typeof ReportsFormats[number]
export type ReportsSchemaClientsType = z.infer<typeof ReportsSchemaClients>
export type ReportsSchemaModelsType = z.infer<typeof ReportsSchemaModels>
export type ReportsSchemaSellersType = z.infer<typeof ReportSchemaSellers>
export type ReportsSchemaSimsProviderType = z.infer<typeof ReportSchemaSimsProvider>
export type ReportsSchemaInventoryType = z.infer<typeof ReportsSchemaInventory>
