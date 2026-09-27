const tastingDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'Asia/Seoul',
})

export const formatTastingDate = (value: string) =>
  tastingDateFormatter.format(new Date(value))
