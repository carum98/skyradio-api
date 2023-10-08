export default {
    token: {
        expiresIn: 1200, // 20 minutes
        secret: process.env.SECRET_TOKEN ?? 'secret_token'
    },
    refreshToken: {
        expiresIn: 3600, // 60 minutes
        secret: process.env.SECRET_REFRESH_TOKEN ?? 'secret_refresh_token'
    }
}
