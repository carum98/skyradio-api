import fs from 'fs'
import path from 'path'

import { hexaToArgb } from '@/utils/index'
import { Cell, Worksheet, Workbook, RichText } from 'exceljs'

import PdfPrinter from 'pdfmake'
import { Content } from 'pdfmake/interfaces'
import * as vfsFonts from 'pdfmake/build/vfs_fonts'

export function cellCircleColor (cell: Cell): void {
    if (cell.value != null && !cell.formula && typeof cell.value === 'object') {
        const value = cell.value as unknown as { name: string, color: string }

        cell.value = richTextColor({
            text: value.name,
            color: value.color
        })
    }
}

export function richTextColor (params: { text: string, color: string, size?: number, shape?: string }): { richText: RichText[] } {
    const { text, color, size, shape = '⬤' } = params

    return {
        richText: [
            {
                text: shape,
                font: {
                    size,
                    bold: true,
                    color: {
                        argb: hexaToArgb(color)
                    }
                }
            },
            {
                text: ` ${text}`,
                font: {
                    size
                }
            }
        ]
    }
}

export function setLogo (workbook: Workbook, worksheet: Worksheet): void {
    const logo = workbook.addImage({
        buffer: fs.readFileSync(path.resolve(__dirname, '../../assets/logo.png')),
        extension: 'png'
    })

    worksheet.mergeCells('A1:A2')
    worksheet.addImage(logo, {
        tl: { col: 0.95, row: 0 },
        ext: { width: 50, height: 50 }
    })
}

export async function createPdf (content: Content): Promise<Buffer> {
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
    const pdfDoc = printer.createPdfKitDocument({
        content,
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
