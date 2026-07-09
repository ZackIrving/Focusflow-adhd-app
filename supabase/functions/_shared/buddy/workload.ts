export function calculateWorkload(
  activeTasks: number
): 'light' | 'medium' | 'heavy' {
  if (activeTasks <= 3) return 'light'
  if (activeTasks <= 7) return 'medium'

  return 'heavy'
}