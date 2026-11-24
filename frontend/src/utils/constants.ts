import { ItemCategory } from '@/types';

export const APP_CONFIG = {
  name: 'Campus Lost & Found',
  shortName: 'CLF',
  tagline: 'A smarter way to reconnect people with their belongings.',
  version: '0.1.0',
  supportEmail: 'lostfound@campus.edu',
  adminEmail: 'admin.lostfound@campus.edu',
};

export const CATEGORY_OPTIONS: { value: ItemCategory; label: string }[] = [
  { value: 'electronics', label: 'Electronics & Devices' },
  { value: 'id_cards', label: 'ID Cards & Badges' },
  { value: 'keys', label: 'Keys & Keychains' },
  { value: 'wallets', label: 'Wallets & Purses' },
  { value: 'bags', label: 'Backpacks & Bags' },
  { value: 'clothing', label: 'Clothing & Apparel' },
  { value: 'books', label: 'Books & Notebooks' },
  { value: 'accessories', label: 'Glasses & Accessories' },
  { value: 'sports', label: 'Sports & Fitness Equipment' },
  { value: 'other', label: 'Other Items' },
];

export const CAMPUS_LOCATIONS = [
  'Central Library',
  'Main Academic Block - 1st Floor',
  'Main Academic Block - 2nd Floor',
  'Main Academic Block - 3rd Floor',
  'Science & Technology Building',
  'Student Center & Cafeteria',
  'Sports Complex & Gymnasium',
  'North Hostel Quad',
  'South Hostel Quad',
  'Auditorium',
  'Campus Grounds & Parking',
  'Administrative Block',
];
