### Wanni는 학생들이 직접 출석 버튼을 누르면 부모님께 등원 문자가 전송되는 출결서비스 입니다.
  Wanni는 기존 서비스보다 학생 친화적인 UI를 제공합니다.
  그리고 소규모 공부방이나 개인 교습소를 위해 제작되어 너무 다양하고 복잡한 기능보다 필수적이고 사용하기 간편한 기능을 제공합니다.
  우리 프로젝트의 가치는 학생들이 직접 체크하는 출결서비스로 한명이 다수의 학생을 관리하는 공부방 선생님들의 수기로 관리하던 수고를 덜어주는데 있습니다. 

  주기능은 학생의 등원시간을 기록해주는 출결관리와 등원알림 문자 서비스 입니다.
  부가적으로 학생정보관리, 학원 시간표관리, 출결기록 조회, 메모 서비스를 제공합니다.
  UI 적으로 신경쓴 점 : 간결한 디자인, 선명한 글씨, 시각적인 출결현황 화면구현
  기능적으로 신경쓴 점 : 학생 검색 기능, 출석 히스토리 제공

# 전체 구조

├── config


│   └── config.js                 # cors 설정 파일
├── lib                               # 자체 제작한 라이브러리 모음 폴더
│   ├── logger.js                 # 로그처리용 유틸
│   ├── middleware.js          # 미들웨어 함수 모음
│   └── util.js                      # 출석 문자송신 함수 모음
├── log                              # 로그 폴더
│   └── ...
├── models                         # DB를 모델링하는 sequelize의 모델 함수용 폴더
│   ├── connection.js           # DB연결 처리 함수
│   ├── comment.js
│   ├── schedule.js
│   ├── student.js
│   ├── index.js                    # sequelize를 이용한 DB설정 파일
│   └── user.js
├── node_modules                # npm install후 생성되는 라이브러리 모음 폴더
│   └── ...
├── routes                           # Router 폴더
│   ├── auth.js
│   ├── comment.js
│   ├── pwCheck.js
│   ├── schedule.js
│   ├── students.js
│   ├── index.js                    # Router 설정 인덱스 파일
│   └── user.js
├── utils                              # error 처리용 유틸
│   └── errorResponse.js
├── views                            # express에서 생성한 프론트용 화면(사용하지 않음)
│   ├── error.html
│   └── sequelize.html
├── .env                              # (개발용)환경설정 파일(직접 생성)
├── .gitignore
├── app.js                           # 앱 실행 메인 파일
├── package-lock.json
├── package.json
└── [README.md](http://readme.md/)

## 최종 DB 생성 후 ERD


## 순서도


## 시작
디렉토리 이동
## 개발환경
개발용 PC의 OS는 `windows 10`을 사용 한다.
개발용 디렉토리는 다음과 같다.
`c:\\Workspace`
```console
> cd C:\\Workspace
```

## node.js 설치
version: v14.15.4
(nvm을 이용하여 버전관리 할 것. (윈도우용 nvm: [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases) ))

```
> nvm install 14.15.4 64
> nvm use 14.15.4 64
> nvm list
  * 14.15.4 (Currently using 64-bit executable)
    12.20.0

```

## npm 패키지 설치

위에 생성된 프로젝트 폴더로 이동 한 후 npm을 이용해서 nodejs패키지들을 설치 한다.

```
> cd BACKEND
> npm install

```

## nodemon 서비스 실행

소스 스크립트를 수정하면 이를 적용하기 위해서는 `node`서비스를 재시작 시켜야 한다.
매번 개발할때 그렇게 할 수 없으니 자동으로 재시작 해주는 `nodemon`서비스를 설치해서 사용하도록 한다.

### nodemon 설치

```
> npm install nodemon -g

```

(-g 옵션으로 설치해야 한다.)

### nodemon을 통한 node서비스 실행

이제 앞으로 개발할때에는 다음과 같이 `nodemon`을 통해 실행 시키도록 한다.

```
> npm run start

```