import multer from 'multer'
import path from 'path'

//destination to store images
 const imageStore = multer.diskStorage({
     destination:(req, file, callback) => {
         let folder = ''

         if(req.baseUrl.includes('users')){
             folder = 'users'
         }else if(req.baseUrl.includes('pets')){
             folder = 'pets'
         }
         callback(null, `public/images/${folder}`)
    },
     filename: (req, file, callback) => {
        callback(null, Date.now() + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname))
     }
 })

 const imageUpload = multer({
    storage: imageStore,
    fileFilter(req, file, callback) {
        if(!file.originalname.match(/\.(png|jpg)$/)){
            return callback(new Error('Por favor, envie apenas arquivos PNG ou JPG'))
        }
        callback(undefined, true)
    }
    
})

export default imageUpload