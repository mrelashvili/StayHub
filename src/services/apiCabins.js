import supabase, { supabaseUrl } from './supabase';

export async function getCabins() {
  const { data: cabins, error } = await supabase.from('cabins').select('*');

  if (error) throw new Error('Cabins could not be loaded!');

  return cabins;
}

export async function deleteCabin(id) {
  const { error } = await supabase.from('cabins').delete().eq('id', id);

  if (error) throw new Error('Cabin could not be deleted!');
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    '/',
    ''
  );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
  /// Create cabin

  //https://kyeknrmeyfhsxsybkwjj.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg
  //https://kyeknrmeyfhsxsybkwjj.supabase.costorage/v1/object/public/cabin-images/0.496279497314007-cabin-008.jpg

  // Create/edit cabin
  let query = supabase.from('cabins');

  //////////////////// <----->
  /// Create
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);
  /// Edit
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq('id', id);
  ////////////// <---------->

  const { data, error } = await query.select().single();

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
