// Mock Users for P2P Payments
export interface MockUser {
  id: string;
  name: string;
  mobile: string;
  password: string;
  upiId: string;
  avatar: string;
  balance: number;
  email: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    mobile: '9876543210',
    password: 'password123',
    upiId: 'rahul.sharma@okaxis',
    avatar: '👨',
    balance: 125000,
    email: 'rahul.sharma@email.com'
  },
  {
    id: '2',
    name: 'Priya Patel',
    mobile: '9876543211',
    password: 'password123',
    upiId: 'priya.patel@paytm',
    avatar: '👩',
    balance: 98000,
    email: 'priya.patel@email.com'
  },
  {
    id: '3',
    name: 'Amit Kumar',
    mobile: '9876543212',
    password: 'password123',
    upiId: 'amit.kumar@ybl',
    avatar: '👨‍💼',
    balance: 156000,
    email: 'amit.kumar@email.com'
  },
  {
    id: '4',
    name: 'Sneha Singh',
    mobile: '9876543213',
    password: 'password123',
    upiId: 'sneha.singh@okicici',
    avatar: '👩‍💼',
    balance: 87000,
    email: 'sneha.singh@email.com'
  },
  {
    id: '5',
    name: 'Vikram Reddy',
    mobile: '9876543214',
    password: 'password123',
    upiId: 'vikram.reddy@paytm',
    avatar: '🧑',
    balance: 210000,
    email: 'vikram.reddy@email.com'
  },
  {
    id: '6',
    name: 'Anjali Desai',
    mobile: '9876543215',
    password: 'password123',
    upiId: 'anjali.desai@okaxis',
    avatar: '👩‍🦰',
    balance: 145000,
    email: 'anjali.desai@email.com'
  },
  {
    id: '7',
    name: 'Rajesh Gupta',
    mobile: '9876543216',
    password: 'password123',
    upiId: 'rajesh.gupta@ybl',
    avatar: '👨‍🦳',
    balance: 189000,
    email: 'rajesh.gupta@email.com'
  },
  {
    id: '8',
    name: 'Kavya Nair',
    mobile: '9876543217',
    password: 'password123',
    upiId: 'kavya.nair@paytm',
    avatar: '👩‍🎓',
    balance: 72000,
    email: 'kavya.nair@email.com'
  }
];

// Get all users except current user (for P2P payments)
export const getOtherUsers = (currentMobile: string): MockUser[] => {
  return MOCK_USERS.filter(user => user.mobile !== currentMobile);
};

// Find user by mobile
export const findUserByMobile = (mobile: string): MockUser | undefined => {
  return MOCK_USERS.find(user => user.mobile === mobile);
};

// Find user by UPI ID
export const findUserByUPI = (upiId: string): MockUser | undefined => {
  return MOCK_USERS.find(user => user.upiId === upiId);
};

// Validate user credentials
export const validateUser = (mobile: string, password: string): MockUser | null => {
  const user = MOCK_USERS.find(u => u.mobile === mobile && u.password === password);
  return user || null;
};
