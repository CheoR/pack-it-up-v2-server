import { v2 as cloudinary } from 'cloudinary'
import config from '../config/cloudinary'

const defaultImgUri =
  'https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg'

cloudinary.config(config)

export default function uploadImage(uri: string) {
  console.log(`uploadImage: ${uri.length}`)
  const res = cloudinary.uploader.upload(uri || defaultImgUri, {
    public_id: 'olympic_flag',
  })

  console.log(`res is `)
  res
    .then((data) => {
      console.log(`res dta is `)
      console.log(data)
      console.log(data.secure_url)
    })
    .catch((err) => {
      console.log(err)
    })

  // Generate
  const url = cloudinary.url('olympic_flag', {
    width: 100,
    height: 150,
    Crop: 'fill',
  })

  // The output url
  console.log(`ouput url is `)
  console.log(url)
  // https://res.cloudinary.com/<cloud_name>/image/upload/h_150,w_100/olympic_flag
  return url
}
