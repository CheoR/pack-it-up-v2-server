import { v2 as cloudinary } from 'cloudinary'

import config from '../config/cloudinary'

cloudinary.config(config)

const defaultImgUri =
  'https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg'

async function getSecureUrl(name: string, uri: string): Promise<string | void> {
  const secure_url = await cloudinary.uploader
    .upload(uri || defaultImgUri, {
      public_id: name,
    })
    .then((data) => data.secure_url)
    .catch((err) => {
      console.log(err)
    })
  return secure_url
}

export default async function uploadImage(
  uri: string,
  name: string,
): Promise<string> {
  const secure_url = await getSecureUrl(name, uri)

  // Generate const url =
  cloudinary.url(name, {
    width: 100,
    height: 150,
    Crop: 'fill',
  })

  // The output url
  // https://res.cloudinary.com/<cloud_name>/image/upload/h_150,w_100/olympic_flag

  return typeof secure_url === 'string' ? secure_url : 'no_img'
}
