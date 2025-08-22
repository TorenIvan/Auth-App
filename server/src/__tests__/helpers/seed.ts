import { faker } from '@faker-js/faker';
import { Db, ObjectId } from 'mongodb';
import * as bcrypt from 'bcryptjs';
import User, { Image } from '../../modules/user/v1/user.model';

export interface SeedOptions {
  userCount?: number;
  withImages?: boolean;
  includeAdmin?: boolean;
}

export interface SeededData {
  users: User[];
  adminUser?: User;
  testPasswords: { [email: string]: string };
}

/**
 * @description Generate a test image buffer
 */
function generateTestImageBuffer(): Buffer {
  // Create a simple 1x1 PNG buffer for testing
  const pngBuffer = Buffer.from([
    0x89,
    0x50,
    0x4e,
    0x47,
    0x0d,
    0x0a,
    0x1a,
    0x0a, // PNG signature
    0x00,
    0x00,
    0x00,
    0x0d,
    0x49,
    0x48,
    0x44,
    0x52, // IHDR chunk
    0x00,
    0x00,
    0x00,
    0x01,
    0x00,
    0x00,
    0x00,
    0x01, // 1x1 dimensions
    0x08,
    0x02,
    0x00,
    0x00,
    0x00,
    0x90,
    0x77,
    0x53,
    0xde,
    0x00,
    0x00,
    0x00,
    0x0c,
    0x49,
    0x44,
    0x41, // IDAT chunk
    0x54,
    0x08,
    0x99,
    0x01,
    0x01,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x37,
    0x6e,
    0xf9,
    0x24,
    0x00,
    0x00,
    0x00,
    0x00,
    0x49,
    0x45,
    0x4e,
    0x44,
    0xae,
    0x42, // IEND chunk
    0x60,
    0x82,
  ]);
  return pngBuffer;
}

function generateTestImage(): Image {
  return {
    _id: new ObjectId(),
    schemaVersion: 1,
    filename: `${faker.system.fileName()}.png`,
    mimetype: 'image/png',
    encoding: '7bit',
    data: generateTestImageBuffer(),
  };
}

/**
 * @description Generate a valid password that meets schema requirements.
 * Must have: uppercase, lowercase, number, 8-36 characters; according to schema.
 */
function generateValidPassword(): string {
  const length = faker.number.int({ min: 8, max: 16 });
  const uppercase = faker.string.alpha({ length: 2, casing: 'upper' });
  const lowercase = faker.string.alpha({ length: 2, casing: 'lower' });
  const numbers = faker.string.numeric(2);
  const remaining = faker.string.alphanumeric(length - 6);

  const password = faker.helpers
    .shuffle([...uppercase, ...lowercase, ...numbers, ...remaining])
    .join('');
  return password;
}

export function generateAuthCredentials(): {
  email: string;
  password: string;
} {
  return {
    email: faker.internet.email().toLowerCase(),
    password: generateValidPassword(),
  };
}

export function generateForgotPasswordData(): {
  email: string;
} {
  return {
    email: faker.internet.email().toLowerCase(),
  };
}

export function generateResetPasswordData(): {
  newPassword: string;
  confirmNewPassword: string;
} {
  const password = generateValidPassword();
  return {
    newPassword: password,
    confirmNewPassword: password,
  };
}

export function generateEmailVerificationData(): {
  email: string;
  token: string;
} {
  return {
    email: faker.internet.email().toLowerCase(),
    token: faker.string.uuid(),
  };
}

export async function generateTestUser(
  options: {
    withImage?: boolean;
    isVerified?: boolean;
    isActive?: boolean;
    signInMethod?: string;
    customEmail?: string;
    customPassword?: string;
  } = {}
): Promise<{ user: User; plainPassword: string }> {
  const plainPassword = options.customPassword || faker.internet.password({ length: 12 });
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user: User = {
    _id: new ObjectId(),
    schemaVersion: 1,
    username: faker.internet.username(),
    email: options.customEmail || faker.internet.email().toLowerCase(),
    phone: faker.helpers.maybe(() => faker.phone.number(), { probability: 0.7 }) || '',
    biography: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.6 }) || '',
    password: hashedPassword,
    signInMethod: options.signInMethod || 'email',
    isVerified: options.isVerified ?? faker.datatype.boolean({ probability: 0.8 }),
    isActive: options.isActive ?? faker.datatype.boolean({ probability: 0.8 }),
    image: options.withImage ? generateTestImage() : undefined,
    refreshToken: faker.string.uuid(),
  };

  return { user, plainPassword };
}

/**
 * @description Generate multiple test users
 */
export async function generateTestUsers(
  count: number,
  options: {
    withImages?: boolean;
    allVerified?: boolean;
  } = {}
): Promise<{ users: User[]; passwords: { [email: string]: string } }> {
  const users: User[] = [];
  const passwords: { [email: string]: string } = {};

  for (let i = 0; i < count; i++) {
    const { user, plainPassword } = await generateTestUser({
      withImage: options.withImages,
      isVerified: options.allVerified ?? undefined,
    });
    users.push(user);
    passwords[user.email] = plainPassword;
  }

  return { users, passwords };
}

export async function seedDatabase(db: Db, options: SeedOptions = {}): Promise<SeededData> {
  const { userCount = 10, withImages = false, includeAdmin = true } = options;

  const seededData: SeededData = {
    users: [],
    testPasswords: {},
  };

  const { users, passwords } = await generateTestUsers(userCount, {
    withImages,
    allVerified: false,
  });

  seededData.users = users;
  seededData.testPasswords = passwords;

  // If added admin and roles in the future
  if (includeAdmin) {
    const { user: adminUser, plainPassword } = await generateTestUser({
      withImage: withImages,
      isVerified: true,
      signInMethod: 'email',
      customEmail: 'admin@test.com',
      customPassword: 'AdminPass123!',
    });

    seededData.adminUser = adminUser;
    seededData.testPasswords[adminUser.email] = plainPassword;
    seededData.users.push(adminUser);
  }

  if (seededData.users.length > 0) {
    await db.collection('users').insertMany(seededData.users);
  }

  return seededData;
}
