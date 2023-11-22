import supabase, { supabaseUrl } from './supebase';

export async function getCabins() {
  const { data: cabins, error } = await supabase.from('cabins').select('*');

  if (error) throw new Error('Cabins could not be loaded!');

  return cabins;
}

export async function deleteCabin(id) {
  const { error } = await supabase.from('cabins').delete().eq('id', id);

  if (error) throw new Error('Cabin could not be deleted!');
}

export async function createCabin(newCabin) {
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    '/',
    ''
  );

  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
  /// Create cabin

  //https://kyeknrmeyfhsxsybkwjj.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg
  //https://kyeknrmeyfhsxsybkwjj.supabase.costorage/v1/object/public/cabin-images/0.496279497314007-cabin-008.jpg

  const { data, error } = await supabase
    .from('cabins')
    .insert([{ ...newCabin, image: imagePath }])
    .select();

  if (error) throw new Error('Cabin could not be created!');

  // Upload image

  const { error: storageError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, newCabin.image);

  // Delete cabin if there was an error uploading image.
  if (storageError) {
    await supabase.from('cabins').delete().eq('id', data.id);
    throw new Error(
      'Cabin image could not be uploaded and the cabin was not created!'
    );
  }

  return data;
}
