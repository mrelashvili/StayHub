import { PAGE_SIZE } from '../utils/constants';
import { getToday } from '../utils/helpers';
import supabase, { supabaseUrl } from './supabase';

// MOCK MODE - Set to true to use mock data instead of Supabase
const USE_MOCK_DATA = true;

// Simulate network delay
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock bookings data for dashboard
const generateMockBookings = (numDays) => {
  const bookings = [];
  const today = new Date();
  
  for (let i = 0; i < numDays; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setUTCHours(0, 0, 0, 0);
    
    // Generate 2-5 bookings per day
    const bookingsPerDay = Math.floor(Math.random() * 4) + 2;
    for (let j = 0; j < bookingsPerDay; j++) {
      const totalPrice = Math.floor(Math.random() * 2000) + 200;
      const extrasPrice = Math.floor(Math.random() * 300) + 50;
      bookings.push({
        created_at: date.toISOString(),
        totalPrice,
        extrasPrice,
      });
    }
  }
  
  return bookings;
};

// Mock stays data
const generateMockStays = (numDays) => {
  const stays = [];
  const guestNames = [
    'John Smith', 'Emma Johnson', 'Michael Brown', 'Sarah Davis', 'David Wilson',
    'Lisa Anderson', 'James Taylor', 'Maria Garcia', 'Robert Martinez', 'Jennifer Lee',
    'William Jones', 'Patricia White', 'Richard Harris', 'Linda Clark', 'Joseph Lewis'
  ];
  
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  
  // Generate 12-18 stays within the date range
  const numStays = Math.floor(Math.random() * 7) + 12;
  for (let i = 0; i < numStays; i++) {
    // Start date should be within the last numDays
    const daysAgo = Math.floor(Math.random() * numDays);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - daysAgo);
    startDate.setUTCHours(0, 0, 0, 0);
    
    const numNights = Math.floor(Math.random() * 7) + 1;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + numNights);
    
    // More checked-in/checked-out than unconfirmed for realistic data
    const rand = Math.random();
    let status;
    if (rand < 0.6) status = 'checked-out';
    else if (rand < 0.9) status = 'checked-in';
    else status = 'unconfirmed';
    
    stays.push({
      id: `stay-${i + 1}`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      numNights,
      status,
      guests: {
        fullName: guestNames[Math.floor(Math.random() * guestNames.length)],
      },
    });
  }
  
  return stays;
};

// Mock today activity
const generateMockTodayActivity = () => {
  const activities = [];
  const guestData = [
    { fullName: 'John Smith', nationality: 'US', countryFlag: '🇺🇸' },
    { fullName: 'Emma Johnson', nationality: 'GB', countryFlag: '🇬🇧' },
    { fullName: 'Michael Brown', nationality: 'CA', countryFlag: '🇨🇦' },
    { fullName: 'Sarah Davis', nationality: 'AU', countryFlag: '🇦🇺' },
    { fullName: 'David Wilson', nationality: 'DE', countryFlag: '🇩🇪' },
  ];
  
  // Generate 2-4 activities for today
  const numActivities = Math.floor(Math.random() * 3) + 2;
  for (let i = 0; i < numActivities; i++) {
    const guest = guestData[Math.floor(Math.random() * guestData.length)];
    const numNights = Math.floor(Math.random() * 5) + 1;
    const status = i % 2 === 0 ? 'unconfirmed' : 'checked-in';
    
    activities.push({
      id: `activity-${i + 1}`,
      status,
      numNights,
      guests: {
        fullName: guest.fullName,
        nationality: guest.nationality,
        countryFlag: guest.countryFlag,
      },
    });
  }
  
  return activities;
};

// Mock bookings for the bookings page
const generateMockBookingsList = () => {
  const bookings = [];
  const guestData = [
    { fullName: 'Jonas Schmedtmann', email: 'hello@jonas.io' },
    { fullName: 'Jonathan Smith', email: 'johnsmith@test.eu' },
    { fullName: 'Emma Watson', email: 'emma@gmail.com' },
    { fullName: 'Mohammed Ali', email: 'mohammedali@yahoo.com' },
    { fullName: 'Maria Rodriguez', email: 'maria@gmail.com' },
    { fullName: 'Li Mei', email: 'li.mei@hotmail.com' },
    { fullName: 'Gabriel Silva', email: 'gabriel@gmail.com' },
    { fullName: 'John Doe', email: 'johndoe@gmail.com' },
    { fullName: 'David Smith', email: 'david@gmail.com' },
    { fullName: 'Marie Dupont', email: 'marie@gmail.com' },
    { fullName: 'Ramesh Patel', email: 'ramesh@gmail.com' },
    { fullName: 'Nina Williams', email: 'nina@hotmail.com' },
    { fullName: 'Taro Tanaka', email: 'taro@gmail.com' },
    { fullName: 'Abdul Rahman', email: 'abdul@gmail.com' },
    { fullName: 'Julie Nguyen', email: 'julie@gmail.com' },
    { fullName: 'Sara Lee', email: 'sara@gmail.com' },
    { fullName: 'Carlos Gomez', email: 'carlos@yahoo.com' },
    { fullName: 'Emma Brown', email: 'emma@gmail.com' },
    { fullName: 'Juan Hernandez', email: 'juan@yahoo.com' },
    { fullName: 'Ibrahim Ahmed', email: 'ibrahim@yahoo.com' },
  ];
  
  const cabinNames = ['001', '002', '003', '004', '005', '006', '007', '008'];
  const statuses = ['unconfirmed', 'checked-in', 'checked-out'];
  
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  
  // Generate 50-60 bookings
  const numBookings = Math.floor(Math.random() * 11) + 50;
  
  for (let i = 0; i < numBookings; i++) {
    const guest = guestData[Math.floor(Math.random() * guestData.length)];
    const cabinName = cabinNames[Math.floor(Math.random() * cabinNames.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Random dates in the past 60 days to future 30 days
    const daysOffset = Math.floor(Math.random() * 90) - 60;
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + daysOffset);
    startDate.setUTCHours(0, 0, 0, 0);
    
    const numNights = Math.floor(Math.random() * 10) + 1;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + numNights);
    
    const numGuests = Math.floor(Math.random() * 8) + 1;
    const totalPrice = Math.floor(Math.random() * 2000) + 200;
    
    // Created at date (booking was created some time before start date)
    const createdDaysAgo = Math.floor(Math.random() * 30) + 1;
    const created_at = new Date(startDate);
    created_at.setDate(created_at.getDate() - createdDaysAgo);
    created_at.setUTCHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);
    
    bookings.push({
      id: `booking-${i + 1}`,
      created_at: created_at.toISOString(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      numNights,
      numGuests,
      status,
      totalPrice,
      cabins: { name: cabinName },
      guests: {
        fullName: guest.fullName,
        email: guest.email,
      },
    });
  }
  
  return bookings;
};

export async function getBookings({ filter, sortBy, page }) {
  if (USE_MOCK_DATA) {
    await delay(400);
    
    let allBookings = generateMockBookingsList();
    
    // Apply filter
    if (filter && filter.field === 'status') {
      allBookings = allBookings.filter((booking) => booking.status === filter.value);
    }
    
    // Apply sorting
    if (sortBy) {
      allBookings.sort((a, b) => {
        let aValue = a[sortBy.field];
        let bValue = b[sortBy.field];
        
        // Handle nested objects
        if (sortBy.field === 'startDate' || sortBy.field === 'created_at') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }
        
        if (sortBy.direction === 'asc') {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });
    }
    
    // Apply pagination
    const count = allBookings.length;
    const pageNum = page || 1;
    const from = (pageNum - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const paginatedBookings = allBookings.slice(from, to + 1);
    
    console.log('🔧 MOCK MODE: Returning mock bookings', {
      total: count,
      page: pageNum,
      showing: paginatedBookings.length,
      filter: filter?.value || 'all',
    });
    
    return { data: paginatedBookings, count };
  }
  let query = supabase
    .from('bookings')
    .select(
      'id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)',
      { count: 'exact' }
    );

  /// Filter
  if (filter) query = query[filter.method || 'eq'](filter.field, filter.value);

  /// Sort
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === 'asc',
    });

  /// Pagination
  if (page) {
    const from = (page - 1) * PAGE_SIZE - 1;
    const to = from + PAGE_SIZE - 1;

    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) throw new Error('Bookings could not be loaded!');

  return { data, count };
}

export async function getBooking(id) {
  if (USE_MOCK_DATA) {
    await delay(300);
    
    // Generate a booking based on the ID
    const guestData = [
      { fullName: 'Jonas Schmedtmann', email: 'hello@jonas.io', nationality: 'Portugal', nationalID: '3525436345', countryFlag: 'https://flagcdn.com/pt.svg' },
      { fullName: 'Jonathan Smith', email: 'johnsmith@test.eu', nationality: 'Great Britain', nationalID: '4534593454', countryFlag: 'https://flagcdn.com/gb.svg' },
      { fullName: 'Emma Watson', email: 'emma@gmail.com', nationality: 'United Kingdom', nationalID: '1234578901', countryFlag: 'https://flagcdn.com/gb.svg' },
      { fullName: 'Mohammed Ali', email: 'mohammedali@yahoo.com', nationality: 'Egypt', nationalID: '987543210', countryFlag: 'https://flagcdn.com/eg.svg' },
      { fullName: 'Maria Rodriguez', email: 'maria@gmail.com', nationality: 'Spain', nationalID: '1098765321', countryFlag: 'https://flagcdn.com/es.svg' },
    ];
    
    const cabinNames = ['001', '002', '003', '004', '005', '006', '007', '008'];
    const statuses = ['unconfirmed', 'checked-in', 'checked-out'];
    
    const guest = guestData[Math.floor(Math.random() * guestData.length)];
    const cabinName = cabinNames[Math.floor(Math.random() * cabinNames.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    
    const daysOffset = Math.floor(Math.random() * 90) - 60;
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + daysOffset);
    startDate.setUTCHours(0, 0, 0, 0);
    
    const numNights = Math.floor(Math.random() * 10) + 1;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + numNights);
    
    const numGuests = Math.floor(Math.random() * 8) + 1;
    const totalPrice = Math.floor(Math.random() * 2000) + 200;
    const extrasPrice = Math.floor(Math.random() * 300) + 50;
    const hasBreakfast = Math.random() > 0.5;
    const isPaid = Math.random() > 0.3;
    
    const createdDaysAgo = Math.floor(Math.random() * 30) + 1;
    const created_at = new Date(startDate);
    created_at.setDate(created_at.getDate() - createdDaysAgo);
    created_at.setUTCHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);
    
    const mockBooking = {
      id,
      created_at: created_at.toISOString(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      numNights,
      numGuests,
      status,
      totalPrice,
      extrasPrice,
      hasBreakfast,
      isPaid,
      observations: Math.random() > 0.7 ? 'Guest has special dietary requirements' : '',
      cabins: {
        id: cabinNames.indexOf(cabinName) + 1,
        name: cabinName,
        maxCapacity: [2, 2, 4, 4, 6, 6, 8, 10][cabinNames.indexOf(cabinName)],
        regularPrice: [250, 350, 300, 500, 350, 800, 600, 1400][cabinNames.indexOf(cabinName)],
        discount: [0, 25, 0, 50, 0, 100, 100, 0][cabinNames.indexOf(cabinName)],
        image: `${supabaseUrl}/storage/v1/object/public/cabin-images/cabin-${cabinName.padStart(3, '0')}.jpg`,
        description: `Beautiful cabin ${cabinName}`,
      },
      guests: {
        id: Math.floor(Math.random() * 1000) + 1,
        fullName: guest.fullName,
        email: guest.email,
        nationality: guest.nationality,
        nationalID: guest.nationalID,
        countryFlag: guest.countryFlag,
      },
    };
    
    console.log('🔧 MOCK MODE: Returning mock booking', id);
    return mockBooking;
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('*, cabins(*), guests(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking not found');
  }

  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date) {
  if (USE_MOCK_DATA) {
    await delay(300);
    const dateObj = new Date(date);
    const today = new Date();
    const numDays = Math.ceil((today - dateObj) / (1000 * 60 * 60 * 24));
    const mockBookings = generateMockBookings(numDays);
    console.log('🔧 MOCK MODE: Returning mock bookings', mockBookings.length);
    return mockBookings;
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('created_at, totalPrice, extrasPrice')
    .gte('created_at', date)
    .lte('created_at', getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  if (USE_MOCK_DATA) {
    await delay(300);
    const dateObj = new Date(date);
    const today = new Date();
    const numDays = Math.ceil((today - dateObj) / (1000 * 60 * 60 * 24));
    const mockStays = generateMockStays(numDays);
    console.log('🔧 MOCK MODE: Returning mock stays', mockStays.length);
    return mockStays;
  }

  const { data, error } = await supabase
    .from('bookings')
    // .select('*')
    .select('*, guests(fullName)')
    .gte('startDate', date)
    .lte('startDate', getToday());

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  if (USE_MOCK_DATA) {
    await delay(300);
    const mockActivities = generateMockTodayActivity();
    console.log('🔧 MOCK MODE: Returning mock today activity', mockActivities.length);
    return mockActivities;
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('*, guests(fullName, nationality, countryFlag)')
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order('created_at');

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from('bookings')
    .update(obj)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking could not be updated');
  }
  return data;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from('bookings').delete().eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Booking could not be deleted');
  }
  return data;
}
