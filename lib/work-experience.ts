type WorkPeriod = {
  start: string
  end: string
}

function parseYearMonth(date: string): { year: number; month: number } {
  if (date === 'Present') {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
  }

  const [year, month] = date.split('.').map(Number)
  return { year, month }
}

function monthsBetween(start: string, end: string): number {
  const startDate = parseYearMonth(start)
  const endDate = parseYearMonth(end)

  return (
    (endDate.year - startDate.year) * 12 +
    (endDate.month - startDate.month) +
    1
  )
}

export function formatTotalWorkExperience(jobs: WorkPeriod[]): string {
  const totalMonths = jobs.reduce(
    (sum, job) => sum + monthsBetween(job.start, job.end),
    0,
  )

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  if (years === 0) {
    return `${months}개월`
  }

  if (months === 0) {
    return `${years}년`
  }

  return `${years}년 ${months}개월`
}
