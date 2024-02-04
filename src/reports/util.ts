import { hexaToArgb } from '@/utils/index'
import { Cell } from 'exceljs'

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
