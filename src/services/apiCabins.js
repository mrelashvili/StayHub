import supabase from './supebase';

export async function getCabins() {
  const { data: cabins, error } = await supabase.from('cabins').select('*');

  if (error) throw new Error('Cabins could not be loaded!');

  return cabins;
}

export async function deleteCabin(id) {
  const { error } = await supabase.from('cabins').delete().eq('id', id);

  if (error) throw new Error('Cabins could not be deleted!');
}
