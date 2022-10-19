//환경변수 관련
// const { sens } = require("../config");
const { sens } = require("../config/config.js");


// 암호화를 위한 CryptoJS 모듈 설치
const CryptoJS = require("crypto-js");



// 메시지 전송 함수 작성
// const { functionSMS } = require('functionSMS.js');
// const { sens } = require("../config");
const axios = require("axios");


// module.exports.sendAttendanceSMS = function(className, stuName, attendTime, phoneNum) {

module.exports.sendAttendanceSMS = async (className, stuName, attendTime, phoneNum) => {
    try {
    // // 학부모전화번호, 공부방이름, 학생이름, 등원시간
    // 등원시간 저장할 row를 Schedule 테이블에서 찾잖아?
    // 1. 그 attendTIme과
    // 2. 그 학생 id로 Student 테이블에서 stuName, stuPhoneNum, 
    // 3. 그 선생 id로 User 테이블에서 userNick 
    // 가져와서 문자에 변수로 넣어야 함

    //   const { tel } = req.body;
      const parentsPhoneNum = phoneNum; // SMS를 수신할 전화번호 Student Table
      const userClassName = className; // 학원이름 User Table
      const studentName = stuName; // 학생이름 Student Table
      const stuAttendance = attendTime; // 학생출석시간 Student Table
      const date = Date.now().toString(); // 날짜 string


    /////////////////////////////////////////////////////////////


      // 환경 변수
      const sens_service_id = sens.serviceId;
      const sens_access_key = sens.accessKey;
      const sens_secret_key = sens.secretKey;
      const sens_call_number = sens.callNumber;

      // url 관련 변수 선언 // 이거 왜 필요하지??
      const method = "POST";
      const space = " ";
      const newLine = "\n";
      const url = `https://sens.apigw.ntruss.com/sms/v2/services/${sens_service_id}/messages`;
      const url2 = `/sms/v2/services/${sens_service_id}/messages`;

      // signature 작성 : crypto-js 모듈을 이용하여 암호화
      console.log(1);
      const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, sens_secret_key);
      console.log(2);
      hmac.update(method);
      hmac.update(space);
      hmac.update(url2);
      hmac.update(newLine);
      hmac.update(date);
      hmac.update(newLine);
      console.log(sens_access_key);
      hmac.update(sens_access_key);
      const hash = hmac.finalize();
      console.log(4);
      const signature = hash.toString(CryptoJS.enc.Base64);
      console.log(5);

      // sens 서버로 요청 전송
    //   const smsRes = await 
    await axios({
        method: method,
        url: url,
        headers: {
          "Contenc-type": "application/json; charset=utf-8",
          "x-ncp-iam-access-key": sens_access_key,
          "x-ncp-apigw-timestamp": date,
          "x-ncp-apigw-signature-v2": signature,
        },
        data: {
          type: "SMS",
          countryCode: "82",
          from: sens_call_number, // 선생님번호 안하고 회사번호로 하고 , 문자서비스 요금은 월청구(나중에 기회가된다면 만들 시스템...)
          // 페이지가 추가되서 (출석 문자알림 서비스 신청 해서 user가 서비스신청하면 회사에서 서비스신청한 user 테이블 따로 만들어서 거기서 번호 끌어와서 db에서 찾아서 입력)
          content: `[${userClassName}] ${studentName} 학생이 등원하였습니다. - ${stuAttendance}`,
           // [완니썜공부방] 김나나 학생이 등원하였습니다. - 2022/10/18/14/01/22
          messages: [{ to: `${parentsPhoneNum}`, }],
        },
      })
    // .then(res => {

        //   console.log("response", smsRes.data);
        //   return res.status(200).json({ message: "SMS sent" });
    } catch(err){
      console.log(err);
    //   return res.status(404).json({ message: "SMS not sent" });
    }
}



// {
//     sendAttendanceSMS: async (req, res) => { 
//     // 환경 변수
//     const sens_service_id = sens.serviceId;
//     const sens_access_key = sens.accessKey;
//     const sens_secret_key = sens.secretKey;
//     const sens_call_number = sens.callNumber;

//     // ...
    
//   },
// };