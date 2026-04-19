import { PrismaClient } from '@prisma/client';
import { validateCandidateData } from '../application/validator';
import { addCandidate } from '../application/services/candidateService';

/** Shared Prisma test double (real client is never used; see jest.mock below). */
type CandidateDelegate = {
  create: jest.Mock;
  update: jest.Mock;
  findUnique: jest.Mock;
};

type PrismaTestDouble = {
  candidate: CandidateDelegate;
  education: { create: jest.Mock; update: jest.Mock };
  workExperience: { create: jest.Mock; update: jest.Mock };
  resume: { create: jest.Mock };
};

jest.mock('@prisma/client', () => {
  const shared = {
    candidate: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    education: {
      create: jest.fn(),
      update: jest.fn(),
    },
    workExperience: {
      create: jest.fn(),
      update: jest.fn(),
    },
    resume: {
      create: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => shared),
    Prisma: {
      PrismaClientInitializationError: class PrismaClientInitializationError extends Error {
        name = 'PrismaClientInitializationError';
      },
    },
  };
});

const prisma = new PrismaClient() as unknown as PrismaTestDouble;

describe('Create candidate — form / request data reception', () => {
  it('rejects payload when email format is invalid', () => {
    expect(() =>
      validateCandidateData({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'not-an-email',
      }),
    ).toThrow('Invalid email');
  });
});

describe('Create candidate — database save (persistence)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const minimalValidCandidate = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
  };

  it('persists a valid candidate via Prisma create with the expected scalar fields', async () => {
    prisma.candidate.create.mockResolvedValue({
      id: 1,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      phone: null,
      address: null,
    });

    const saved = await addCandidate(minimalValidCandidate);

    expect(prisma.candidate.create).toHaveBeenCalledTimes(1);
    expect(prisma.candidate.create).toHaveBeenCalledWith({
      data: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
      },
    });
    expect(saved).toMatchObject({
      id: 1,
      email: 'jane.doe@example.com',
    });
  });

  it('maps Prisma unique violation to a stable application error', async () => {
    prisma.candidate.create.mockRejectedValue({ code: 'P2002' });

    await expect(addCandidate(minimalValidCandidate)).rejects.toThrow(
      'The email already exists in the database',
    );
  });
});
