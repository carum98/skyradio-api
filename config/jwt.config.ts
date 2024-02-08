export default {
    token: {
        expiresIn: 32400, // 9 hours
        secret: process.env.SECRET_TOKEN ?? 'secret_token'
    },
    refreshToken: {
        expiresIn: 86400, // 24 hours
        secret: process.env.SECRET_REFRESH_TOKEN ?? 'secret_refresh_token'
    }
}
