# 개인 프로필 웹사이트

`public/index.html`이 시작 페이지입니다. 아래 Node.js 로컬 서버로 실행합니다. HTML, CSS, 순수 JavaScript로 구현했으며 React나 Next.js 런타임은 사용하지 않습니다. 페이지에 보이는 기술 스택은 원본 디자인의 예시 프로젝트 소개입니다.

- 메뉴: Home / About / Projects / Contact 섹션 이동, 현재 위치 표시
- 프로젝트: 카드 전체와 하단 링크 클릭 가능, 새 탭으로 예시 링크 열기
- 연락처: 이메일 클릭 시 기본 메일 앱 열기, 이메일 복사
- 문의 양식: 내용을 채운 메일 작성창 열기 (서버 전송 기능 없음)
- 모바일: 화면 폭에 따른 카드 및 섹션 재배치, 펼침 메뉴
- 이력서: 예시 텍스트 파일 다운로드

모든 개인 정보, 사진, 경력, 성과와 프로젝트는 예시입니다. 프로젝트 주소는 `https://example.com/?project=...`이며 소셜 링크는 각 서비스 홈페이지입니다. 실제 정보와 주소로 교체해 주세요. 이메일 앱이 설정되어 있어야 메일 작성창을 사용할 수 있습니다.

`index.html`: 내용과 링크 / `styles.css`: 원본 디자인 기반 생성 CSS / `custom.css`: 반응형 및 접근성 보완 / `script.js`: 상호작용 / `assets/`: 원본 디자인 이미지

Google Fonts의 글꼴과 Material Symbols 아이콘은 인터넷 연결을 사용합니다. 로컬 CSS는 설치나 빌드 없이 적용됩니다.

스타일 재생성 (원본 유틸리티 클래스를 수정한 경우):

```sh
npm exec --yes --package=tailwindcss@3.4.17 -- tailwindcss -c tailwind.config.cjs -i tailwind-input.css -o public/styles.css --minify
```


## 로컬 실행

Node.js 22 이상에서 실행합니다. 외부 패키지가 없으므로 `npm install`이 필요 없습니다.

```sh
cd website-test
npm start
```

브라우저에서 http://localhost:3000 으로 접속합니다. 종료는 `Ctrl+C`입니다. `npm run dev`도 같은 서버를 실행합니다. 파일을 수정한 뒤 브라우저를 새로고침하면 반영됩니다.

포트가 사용 중이면 다음처럼 변경할 수 있습니다 (macOS/Linux):

```sh
PORT=3001 npm start
```

## 폴더 구조

```text
website-test/
├── public/                 # 로컬 서버와 Vercel이 제공하는 정적 파일
│   ├── index.html          # 시작 페이지
│   ├── styles.css
│   ├── custom.css
│   ├── script.js
│   ├── resume-example.txt
│   └── assets/
├── server.cjs              # Node.js 기본 모듈로 만든 로컬 전용 서버
├── package.json            # npm start / npm run dev
├── vercel.json             # 빌드 없이 public/ 정적 배포
├── tailwind.config.cjs     # 선택적 스타일 재생성 설정
├── tailwind-input.css
└── README.md
```

기존 웹사이트 파일은 내용을 변경하지 않고 `public/`로 옮겼습니다. HTML 내부 상대 경로는 그대로 사용합니다. 스타일 재생성 명령은 위에 있으며 평상시 실행이나 배포에는 필요 없습니다. 해당 명령을 직접 실행할 때에만 npm에서 Tailwind 도구를 내려받을 수 있습니다.

## 나중에 Vercel에 배포하기

저장소를 Vercel에서 가져올 때 **Root Directory**를 `website-test`로 지정합니다. 이 폴더 자체를 저장소 루트로 올린다면 Root Directory는 기본값으로 둡니다.

`vercel.json`에 Framework Preset `Other` (`null`), 빈 Build/Install Command, Output Directory `public`을 지정했습니다. Vercel은 `public/`의 정적 파일만 배포하며 로컬용 `server.cjs`를 실행할 필요가 없습니다. 현재 실제 배포는 수행하지 않았습니다.

설정 참고: [Vercel 공식 문서](https://vercel.com/docs/project-configuration/vercel-json)
