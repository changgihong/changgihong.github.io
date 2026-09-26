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

export function formatTotalWorkExperience(jobs: WorkPeriod[]): string {
  const workedMonths = new Set<number>()

  for (const job of jobs) {
    const startDate = parseYearMonth(job.start)
    const endDate = parseYearMonth(job.end)
    const startMonth = startDate.year * 12 + startDate.month - 1
    const endMonth = endDate.year * 12 + endDate.month - 1

    // 이직한 달처럼 재직 기간이 겹치는 월은 한 번만 계산합니다.
    for (let month = startMonth; month <= endMonth; month++) {
      workedMonths.add(month)
    }
  }

  const totalMonths = workedMonths.size
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
