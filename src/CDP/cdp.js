
// Zalo app ID:1430101737888621583
// cdpaid: 84b59e3687c8ea7655181db9203e1bdf-1681892289716
// orgId: bdf66a48c3ebfaec10d2feb3492099ea
require('dotenv').config()
const md5 = require('md5')
const axios = require('axios')

const enrichCDP = async (env,state) => {
  // console.log(" env ===========  " , env)
  // console.log(" state.user.userAppId ===========  " , state.user.userAppId)
  const todayGetTime = new Date().getTime()
  try {
    const API_URL = `${env.cdpendpoind
      }/dhub-ip/api/v1.0/zmapps/${env.cdpaid || ""}/zoa/_enrich`;
    const response = await axios.post(
      API_URL,
      {
        orgId: env.orgid,
        userAppId: state.user.userAppId,
        requestedAt: todayGetTime,
      },
      {
        headers: {
          "Content-Type": "application/json",
          exp: md5(
            env.orgid +
            ":" +
            todayGetTime +
            ":" +
            env.cdpaid
          ),
        },
      }
    );
    // console.log(" response ===========  " , response.data)
    if (response.data.success) {
      // Object.keys(response.data.result).forEach((key) => {
      //   if (response.data.result[key] === null) {
      //     delete response.data.result[key];
      //   }
      // });
      console.log("enrichCDP response ===========  " , response.data)
      return response.data;

    }
  } catch (error) {
    console.log("enrich cdp error", error);
    return null;
  }
}

const ingestCDP = async (env , state, data) => {
  // console.log(" state ===========  " , state)
  // console.log(" data ===========  " , data)
  try {
    let request = state.user;
    request.oaId = env.oaid; 
    request.appId = env.appid;
    request.cdpaid = env.cdpaid;
    request.orgId = env.orgid;
    request.event = data.event;
    request.eventAt = new Date().getTime();
    request.eventData = data.eventState;
    request.trigger = data.userEvent ? "UserEvent" : "AutoEvent";

    // console.log(" request ===========  " , request)
    // message: 'Invalid value of: orgId, appId, oaId'
    
    const API_URL = `${env.cdpendpoind
      }/dhub-i/api/v1.0/zmalogs/${request.cdpaid}/ingest`;

      const response = await axios.post(API_URL, request, {
      headers: {
        "Content-Type": "application/json",
        exp: md5(
          request.orgId + ":" + request.eventAt + ":" + request.cdpaid
        ),
      },
    });

    // console.log(" response ===========  " , response.data)
    if (response.data.success) {
      // code response herr
      console.log(" ingestCDP response ===========  " , response.data)
    }


  } catch (error) {
    console.log("ingest cdp error", error);
  }
}
module.exports = {
  enrichCDP,
  ingestCDP,
}
