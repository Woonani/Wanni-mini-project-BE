# Wanni
## 프로젝트 소개

### Wanni는 학생들이 직접 출석 버튼을 누르면 부모님께 등원 문자가 전송되는 출결서비스 입니다.
  Wanni는 기존 서비스보다 학생 친화적인 UI를 제공합니다.
  그리고 소규모 공부방이나 개인 교습소를 위해 제작되어 너무 다양하고 복잡한 기능보다 필수적이고 사용하기 간편한 기능을 제공합니다.
  우리 프로젝트의 가치는 학생들이 직접 체크하는 출결서비스로 한명이 다수의 학생을 관리하는 공부방 선생님들의 수기로 관리하던 수고를 덜어주는데 있습니다. 

  주기능은 학생의 등원시간을 기록해주는 출결관리와 등원알림 문자 서비스 입니다.
  부가적으로 학생정보관리, 학원 시간표관리, 출결기록 조회, 메모 서비스를 제공합니다.
  UI 적으로 신경쓴 점 :  40대 선생님 사용자 맞춤 화면 구성(간결한 디자인, 선명한 글씨), 초등학생 맞춤 시각적인 출석확인 화면구현
  기능적으로 신경쓴 점 : 학생 검색 기능, 출석 히스토리 제공



## 최종 DB 생성 후 ERD
![Untitled](https://user-images.githubusercontent.com/86226500/232309483-26a565a4-109a-412f-bfdd-ab8ed80dd95d.png)

## 순서도
![Untitled (1)](https://user-images.githubusercontent.com/86226500/232309775-1c1e769f-cd1e-4d6f-a279-09dbab9b2571.png)

## 시작
디렉토리 이동
### 개발환경
개발용 PC의 OS는 `windows 10`을 사용 한다.
개발용 디렉토리는 다음과 같다.
`c:\\Workspace`
```console
> cd C:\\Workspace
```

### node.js 설치
version: v14.15.4
(nvm을 이용하여 버전관리 할 것. (윈도우용 nvm: [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases) ))

```
> nvm install 14.15.4 64
> nvm use 14.15.4 64
> nvm list
  * 14.15.4 (Currently using 64-bit executable)
    12.20.0

```

### npm 패키지 설치

위에 생성된 프로젝트 폴더로 이동 한 후 npm을 이용해서 nodejs패키지들을 설치 한다.

```
> cd BACKEND
> npm install

```

### nodemon 서비스 실행

소스 스크립트를 수정하면 이를 적용하기 위해서는 `node`서비스를 재시작 시켜야 한다.
매번 개발할때 그렇게 할 수 없으니 자동으로 재시작 해주는 `nodemon`서비스를 설치해서 사용하도록 한다.

#### nodemon 설치

```
> npm install nodemon -g

```

(-g 옵션으로 설치해야 한다.)

### nodemon을 통한 node서비스 실행

이제 앞으로 개발할때에는 다음과 같이 `nodemon`을 통해 실행 시키도록 한다.

```
> npm run start

```