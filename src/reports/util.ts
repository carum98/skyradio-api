import fs from 'fs'
import path from 'path'

import { hexaToArgb } from '@/utils/index'
import { Cell, Worksheet, Workbook } from 'exceljs'

export function cellCircleColor (cell: Cell): void {
    if (cell.value != null && typeof cell.value === 'object') {
        const value = cell.value as unknown as { name: string, color: string }

        cell.value = {
            richText: [
                {
                    text: '⬤',
                    font: {
                        bold: true,
                        color: {
                            argb: hexaToArgb(value.color)
                        }
                    }
                },
                {
                    text: ` ${value.name}`
                }
            ]
        }
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
