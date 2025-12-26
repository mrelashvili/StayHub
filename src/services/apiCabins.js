import supabase, { supabaseUrl } from './supabase';

// MOCK MODE - Set to true to use mock data instead of Supabase
const USE_MOCK_DATA = true;

// Simulate network delay
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock cabins data
const generateMockCabins = () => {
  return [
    {
      id: 1,
      name: '001',
      maxCapacity: 2,
      regularPrice: 250,
      discount: 0,
      image: `${supabaseUrl}/storage/v1/object/public/cabin-images/cabin-001.jpg`,
      description: 'Cozy wooden cabin for couples',
    },
    {
      id: 2,
      name: '002',
      maxCapacity: 2,
      regularPrice: 350,
      discount: 25,
      image: `${supabaseUrl}/storage/v1/object/public/cabin-images/cabin-002.jpg`,
      description: 'Luxury cabin for couples',
    },
    {
      id: 3,
      name: '003',
      maxCapacity: 4,
      regularPrice: 300,
      discount: 0,
      image: `${supabaseUrl}/storage/v1/object/public/cabin-images/cabin-003.jpg`,
      description: 'Family cabin for up to 4 people',
    },
    {
      id: 4,
      name: '004',
      maxCapacity: 4,
      regularPrice: 500,
      discount: 50,
      image: `${supabaseUrl}/storage/v1/object/public/cabin-images/cabin-004.jpg`,
      description: 'Premium family cabin',
    },
    {
      id: 5,
      name: '005',
      maxCapacity: 6,
      regularPrice: 350,
      discount: 0,
      image: `${supabaseUrl}/storage/v1/object/public/cabin-images/cabin-005.jpg`,
      description: 'Spacious cabin for groups',
    },
    {
      id: 6,
      name: '006',
      maxCapacity: 6,
      regularPrice: 800,
      discount: 100,
      image: `${supabaseUrl}/storage/v1/object/public/cabin-images/cabin-006.jpg`,
      description: 'Luxury group cabin',
    },
    {
      id: 7,
      name: '007',
      maxCapacity: 8,
      regularPrice: 600,
      discount: 100,
      image: `${supabaseUrl}/storage/v1/object/public/cabin-images/cabin-007.jpg`,
      description: 'Large cabin for big groups',
    },
    {
      id: 8,
      name: '008',
      maxCapacity: 10,
      regularPrice: 1400,
      discount: 0,
      image: `${supabaseUrl}/storage/v1/object/public/cabin-images/cabin-008.jpg`,
      description: 'Grand luxury cabin',
    },
  ];
};

export async function getCabins() {
  if (USE_MOCK_DATA) {
    await delay();
    const mockCabins = generateMockCabins();
    console.log('🔧 MOCK MODE: Returning mock cabins', mockCabins.length);
    return mockCabins;
  }

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
