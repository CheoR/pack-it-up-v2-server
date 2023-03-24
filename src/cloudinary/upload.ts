import { v2 as cloudinary } from 'cloudinary'

import config from '../config/cloudinary'

cloudinary.config(config)

const defaultImgUri =
  'https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg'

export default function uploadImage(uri: string, name: string) {
  const res = cloudinary.uploader.upload(uri || defaultImgUri, {
    public_id: name,
  })

  res
    .then((data) => {
      console.log(data)
    })
    .catch((err) => {
      console.log(err)
    })

  // Generate
  const url = cloudinary.url(name, {
    width: 100,
    height: 150,
    Crop: 'fill',
  })

  // The output url
  // https://res.cloudinary.com/<cloud_name>/image/upload/h_150,w_100/olympic_flag
  return url
}
