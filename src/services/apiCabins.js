import supabase from './supebase';

export async function getCabins() {
  const { data: cabins, error } = await supabase.from('cabins').select('*');

  if (error) throw new Error('Cabins could not be loaded!');

  return cabins;
}
