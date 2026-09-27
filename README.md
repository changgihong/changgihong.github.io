# changgihong.github.io

Astro에서 Next.js(App Router + MDX)로 마이그레이션한 블로그 프로젝트입니다.  
정적 export(`out/`)를 GitHub Pages로 배포합니다.

운영 주소: https://changgihong.github.io/
사이트 URL과 메타데이터의 공통 설정은 `constants/common.ts`에서 관리합니다.

## 환경

- Node.js 20+
- pnpm 10+

## 자주 쓰는 명령어

### 1) 의존성 설치

```bash
pnpm install
```

### 2) 로컬 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:3125` 접속

### 3) 프로덕션 빌드(static export)

```bash
pnpm build
```

`next.config.mjs`의 `output: 'export'` 설정으로 `out/` 디렉토리가 생성됩니다.

### 4) 빌드 결과 로컬 확인

```bash
pnpm start
```

### 5) 코드 검사

```bash
pnpm lint
pnpm typecheck
```

### 6) 공유 메타데이터 검사

```bash
pnpm test:metadata
```

사이트를 빌드한 뒤 홈·목록·개별 글의 정적 HTML에서 제목, 설명, OG·Twitter 태그와 canonical URL을 검사합니다.

## 로드맵

후속 작업 구상은 [ROADMAP.md](./ROADMAP.md)에 기록합니다.

## 와인 노트 작성

`content/wine/`에 MDX 파일을 추가하면 홈과 Wine 목록, 상세 페이지에 반영됩니다. 파일명에는 시음 날짜를 포함해 같은 와인을 다시 마신 기록도 별도로 남길 수 있습니다.

첫 노트의 frontmatter를 참고해 `title`, `description`, `producer`, `tastedAt`(시음 날짜), `date`(게시 날짜)를 작성합니다. `rating`은 선택 항목인 개인 평점(0–5)이며, `decanted`는 디켄팅 여부입니다. `vintage`, `country`, `region`, `updatedAt`도 선택 항목입니다. `draft: true`인 노트는 목록·상세 페이지·sitemap에서 제외됩니다.

본문의 항목은 자유롭게 작성하고, 메타데이터에서 제목과 설명을 공유 미리보기에 사용합니다.

예전의 짧은 기록은 `earlyRecord: true`로 표시하면 목록과 상세 페이지에 ‘초기 시음 기록’, 점수에는 ‘당시 평점’이 표시됩니다. 당시 메모를 보존하고, 남기지 않은 시음 항목은 생략합니다.

## 배포

- GitHub Actions 워크플로우: `.github/workflows/deploy.yml`
- `main` 브랜치에 push하면 `out/` 아티팩트를 GitHub Pages로 배포합니다.
