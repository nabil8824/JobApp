import bcrypt from 'bcrypt'


export const compare=async({  password , hashed  })=>{
 return  bcrypt.compareSync(password, hashed)
}