# Wiki Graph → Dialog 마이그레이션 설계

날짜: 2026-05-31

## 목표

1. Wiki 목록 페이지의 그래프 진입 버튼 레이블을 `Graph 보기` → `Graph`로 통일한다.
2. 별도 `/wiki/graph` 라우트를 제거하고, 버튼 클릭 시 MorphingDialog(큰 중앙 카드)로 그래프를 띄운다.

## 현재 구조

- `app/wiki/page.tsx` (서버 컴포넌트): Wiki 목록. 우측 상단에 `/wiki/graph`로 가는 `<Link>` 버튼("Graph 보기").
- `app/wiki/graph/page.tsx` (서버 컴포넌트): `getGraph()` 호출 후 `WikiGraphCanvas` 렌더.
- `components/widget/wiki-graph-canvas.tsx` (클라이언트): d3-force 기반 그래프 캔버스. 루트가 `-mx-4` + `border-y`(전체폭 페이지용)이고, 하단에 `문서 리스트로 보기`(`/wiki`) 링크 보유.
- `lib/wiki-graph.ts`: `getGraph()`는 서버에서 파일을 읽는다 → 클라이언트 직접 호출 불가.

## 변경 설계

### 1. `app/wiki/page.tsx` (서버)

- 인라인 `<Link href="/wiki/graph">` 버튼 제거.
- `getGraph()`를 호출해 graph 데이터를 생성하고, 신규 클라이언트 컴포넌트 `<WikiGraphDialog graph={graph} />`에 prop으로 전달.
- 헤더 우측에 `WikiGraphDialog`(트리거 버튼 포함)를 배치.

### 2. 신규 `app/wiki/graph-dialog.tsx` (클라이언트)

- `MorphingDialog` 구성:
  - `MorphingDialogTrigger`: 기존 버튼 스타일(둥근 테두리 pill)에 레이블 `Graph`.
  - `MorphingDialogContainer` + `MorphingDialogContent`: 큰 중앙 카드(예: `w-[90vw] max-w-4xl`, 고정 높이). 배경/보더/라운드로 카드 형태.
  - `MorphingDialogClose`: 닫기(X) 버튼.
  - 내부에 `<WikiGraphCanvas graph={graph} variant="dialog" />` 렌더.

### 3. `components/widget/wiki-graph-canvas.tsx`

- `variant?: 'page' | 'dialog'` prop 추가(기본 `'page'`로 기존 동작 보존; 본 작업 후 `'dialog'`만 사용).
- `'dialog'`일 때:
  - 루트의 `-mx-4` 제거, 캔버스 영역의 `border-y`는 카드 내부에 맞게 정리(보더 제거 또는 전체 `rounded` 카드에 위임).
  - 하단 `문서 리스트로 보기` 링크 제거(모달이므로 불필요). `searchMessage` 표시는 유지.
- 노드 클릭 시 `router.push('/wiki/<slug>')`로 이동하는 동작은 유지(이동하면 모달은 자연히 사라짐).

### 4. 삭제

- `app/wiki/graph/page.tsx` 및 `app/wiki/graph/` 디렉터리 제거.

## 고려사항

- MorphingDialog는 `layoutId` 기반 morph 애니메이션 → 작은 트리거 버튼에서 큰 카드로 확장되는 모션이 자연스럽다.
- `WikiGraphCanvas`는 ResizeObserver로 캔버스 크기를 잡으므로 모달 내 고정 높이에서도 정상 렌더된다.
- `getGraph()`는 서버에서만 호출되며, 직렬화 가능한 plain 객체이므로 클라이언트 컴포넌트로 prop 전달 가능.

## 검증

- `pnpm build`(정적 export) 성공.
- `/wiki`에서 `Graph` 버튼 클릭 → 모달로 그래프 표시, 닫기 동작, 노드 클릭 시 문서 이동 확인.
- `/wiki/graph` 직접 접근 시 404(라우트 제거됨) 확인.
