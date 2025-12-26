import supabase from './supabase';

// MOCK MODE - Set to true to use mock data instead of Supabase
const USE_MOCK_DATA = true;

// Mock user data
const MOCK_USER = {
  id: 'mock-user-id-123',
  email: 'lewis@example.com',
  role: 'authenticated',
  user_metadata: {
    fullName: 'Lewis Hamilton',
    avatar: '',
  },
};

// Simulate network delay
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export async function signup({ fullName, email, password }) {
  if (USE_MOCK_DATA) {
    await delay();
    const mockUser = {
      ...MOCK_USER,
      email,
      user_metadata: { fullName, avatar: '' },
    };
    return { user: mockUser };
  }

  let { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: '',
      },
    },
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function login({ email, password }) {
  if (USE_MOCK_DATA) {
    await delay();
    // Accept any credentials for mock mode
    console.log('🔧 MOCK MODE: Login successful with', email);
    return { user: MOCK_USER };
  }

  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function getCurrentUser() {
  if (USE_MOCK_DATA) {
    await delay(300);
    // Return mock user to simulate being logged in
    console.log('🔧 MOCK MODE: Returning mock user');
    return MOCK_USER;
  }

  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  console.log(data);

  return data?.user;
}

export async function logout() {
  if (USE_MOCK_DATA) {
    await delay();
    console.log('🔧 MOCK MODE: Logout successful');
    return;
  }

  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}
