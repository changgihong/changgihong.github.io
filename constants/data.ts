type Project = {
  name: string
  description: string
  link: string
  video: string
}

type WorkExperience = {
  company: string
  title: string
  start: string
  end: string
  link: string
  companyDescription: string
  responsibilities: string[]
  summary: string
}

type SocialLink = { label: string; link: string }

export const PROJECTS: Project[] = []

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: '(주)엔크레더블',
    title: 'Android Developer',
    start: '2026.07',
    end: 'Present',
    link: 'https://www.ncredible.ai/',
    companyDescription:
      '엔크레더블은 식품제조·육가공 현장의 업무를 디지털화하는 meatOS를 개발하는 기업입니다.',
    responsibilities: [
      '전자저울(meatStation) 및 스캐너(meatScanner) 앱의 신규 기능 개발 및 유지보수',
      '전용 PDA에 탑재되는 Kotlin Android 앱 개발',
      '디자이너와 협업하여 moduCheck(차기 meatOS) 리브랜딩 진행',
    ],
    summary:
      '식품제조·육가공 현장에서 사용하는 전자저울과 스캐너용 Kotlin Android 앱의 신규 기능 개발 및 유지보수를 담당하며, 디자이너와 협업해 moduCheck(차기 meatOS) 리브랜딩을 진행하고 있습니다.',
  },
  {
    company: '(주)베타브레인',
    title: 'Fullstack Developer',
    start: '2025.07',
    end: '2026.07',
    link: 'https://www.betabrain.co.kr',
    companyDescription: '베타브레인은 B2B 컨설팅 및 솔루션 제공 기업입니다.',
    responsibilities: [
      '풀스택 웹 애플리케이션 설계 및 개발, 배포 후 유지보수',
      '협력사 SI 개발',
      '솔루션 도입 문의 고객사 영업 지원',
    ],
    summary:
      'B2B 컨설팅 및 솔루션 제공 기업의 풀스택 개발을 담당하며, 프론트엔드와 백엔드를 아우르는 개발과 0 to 1 제품 메이킹 경험을 쌓았습니다.',
  },
  {
    company: '(주)데이터뱅크',
    title: 'Frontend Developer',
    start: '2024.05',
    end: '2025.06',
    link: 'https://www.data-bank.ai',
    companyDescription:
      '데이터뱅크는 에듀테크 솔루션 "테스트글라이더"를 제공하는 기업입니다.',
    responsibilities: ['테스트글라이더 웹, 백오피스 개발 및 유지보수'],
    summary:
      '에듀테크 솔루션 "테스트글라이더"의 프론트엔드 및 백오피스 개발을 담당하며, 대고객 서비스의 data driven UX/UI 개선을 지원했습니다.',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Github', link: 'https://github.com/changgihong' },
  { label: 'X', link: 'https://x.com/sscoderati' },
  { label: 'LinkedIn', link: 'https://www.linkedin.com/in/changgihong' },
]

export const EMAIL = 'chungup5495@gmail.com'
