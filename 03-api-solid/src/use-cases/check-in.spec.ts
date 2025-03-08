import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-errors'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0),   
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

    it('should be able to check in', async () => {
      const { checkIn } = await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 0,
        userLongitude: 0
      })

      expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice times in the same day', async () => { 
      vi.setSystemTime(new Date (2022, 0, 20, 8, 0, 0))

      await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 0,
        userLongitude: 0
      })

      expect(() => sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 0,
        userLongitude: 0
      })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
    })

    it('should be able to check in twice but in different days', async () => { 
      vi.setSystemTime(new Date (2022, 0, 20, 8, 0, 0))

      await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 0,
        userLongitude: 0
      })

      vi.setSystemTime(new Date (2022, 0, 21, 8, 0, 0))

      const { checkIn } = await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 0,
        userLongitude: 0
      })

      expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in on distant gym', async () => {
      gymsRepository.items.push({
        id: 'gym-02',
        title: 'JavaScript Gym',
        description: '',
        phone: '',
        latitude: new Decimal(-14.4095261),
        longitude: new Decimal(-51.31668),
      })

      await expect(() => sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -19.810534,
        userLongitude: -40.8602125
      })).rejects.toBeInstanceOf(MaxDistanceError)
    })
})