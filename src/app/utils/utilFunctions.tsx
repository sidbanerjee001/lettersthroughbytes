import { s3 } from './awsConfig';

import supabase from '@/app/utils/supabase/client';

export async function uploadToS3(file: Blob, letter_title: string, order: number) {
    const params = {
        Bucket: 'lettersthroughbytes-images',
        Key: `images/${letter_title}-${order}.png`,
        Body: file,
        ContentType: 'image/png',
    };

    const uploadResponse = await s3.upload(params).promise();
    return uploadResponse.Location; // This will be the public URL of the uploaded image
}

export function base64ToBlob(base64Data: string, contentType = ''): Blob {
    const sliceSize = 512;
    const byteCharacters = atob(base64Data);
    const byteArrays : Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
}

export async function saveImageUrlToSupabase(title: string, imageUrl: string, order: number) {
    const { data, error } = await supabase
        .from('images')
        .insert([{ title: title, url: imageUrl, order: order }]);

    if (error) {
        console.error('Error saving to Supabase:', error);
    } else {
        console.log('Saved image URL to Supabase:', data);
    }
}

export async function getMostRecentImageID(title: string) {
    const { data, error } = await supabase
      .from('images')
      .select('order')
      .eq('title', title)
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching content:', error.message);
    } else {
      if (data.length == 0) {
        return 1;
      }
      return Number(data[data.length-1].order);
    }
}
