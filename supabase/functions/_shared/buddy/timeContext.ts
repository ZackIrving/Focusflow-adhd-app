export type BuddyTimeOfDay =
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night'

export type BuddyDayType =
  | 'weekday'
  | 'weekend'

export interface BuddyTimeContext {
  timeOfDay: BuddyTimeOfDay
  dayType: BuddyDayType
  hour: number
}

export function buildTimeContext(): BuddyTimeContext {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay()

  let timeOfDay: BuddyTimeOfDay

  if (hour >= 5 && hour < 12) {
    timeOfDay = 'morning'
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'afternoon'
  } else if (hour >= 17 && hour < 21) {
    timeOfDay = 'evening'
  } else {
    timeOfDay = 'night'
  }

  const dayType: BuddyDayType =
    day === 0 || day === 6
      ? 'weekend'
      : 'weekday'

  return {
    timeOfDay,
    dayType,
    hour,
  }
}