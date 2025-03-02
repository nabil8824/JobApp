import bcrypt from 'bcrypt'

export const Hash = async ({ key, SALT_NUMBER=process.env.SALT_NUMBER }) => {
    

    return bcrypt.hashSync(key, +SALT_NUMBER)
} 