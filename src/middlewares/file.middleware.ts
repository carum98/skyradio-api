import multer from 'multer'

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

export function fileMiddleware () {
    return upload.single('file')
}
