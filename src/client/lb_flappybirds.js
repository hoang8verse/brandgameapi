
require('dotenv').config()
const {responseSuccess,responseFail} = require('./response')
const {enrichCDP, ingestCDP} = require('../CDP/cdp')
const {LB_FlappyBirdModel} = require('@models/lb_flappybird')

const enrichCDP_FlappyBird = async (request, response) => {
// console.log(" request.body =============  " , request.body.user.userAppId)
  // const { userAppId } = request.body;
  let _env = {
    cdpendpoind :process.env.CDP_ENDPOIND_FB,
    cdpaid :process.env.CDP_AID_FB,
    orgid :process.env.ORG_ID_FB,
    appid :process.env.ZALO_APP_ID_FB,
    oaid :process.env.OA_APP_ID_FB,
}
let _state = {
  user : {
    userAppId : request.body.user.userAppId
  }
}

  let res = await enrichCDP(_env, _state);
  if (res === null) {
    response.status(400).json(responseFail(res))
  } else {
    response.status(200).json(responseSuccess(res))
  }
  
}

const ingestCDP_FlappyBird = async (request, response) => {

  // console.log(" request.body =============  " , request.body)
  // const { userAppId } = request.body;
  let _env = {
    cdpendpoind :process.env.CDP_ENDPOIND_FB,
    cdpaid :process.env.CDP_AID_FB,
    orgid :process.env.ORG_ID_FB,
    appid :process.env.ZALO_APP_ID_FB,
    oaid :process.env.OA_APP_ID_FB,
}
let _state = {
  user : {
    userAppId : request.body.user.userAppId,
    userName : request.body.user.userName,
    userPhone : request.body.user.phoneNumber,
    userAvatar : request.body.user.userAvatar,
    followedOA : request.body.user.followedOA == "0" ? false : true,
  }
}

let _data = {
  event : request.body.data.event,
  eventState : request.body.data.eventState,
  userEvent : "UserEvent"
}
  let res = await ingestCDP(_env, _state, _data);
  if (res === null) {
    response.status(400).json(responseFail(res))
  } else {
    response.status(200).json(responseSuccess(res))
  }
}

const postScoreLB_FlappyBird = async (request, response) => {

  const { userAppId, userName , avatar, gender, score } = request.body
  const user = await LB_FlappyBirdModel().findOne({ where: { user_app_id: userAppId } });
 
  if (user === null) {
    const LB_FlappyBird = await LB_FlappyBirdModel().create({ 
      user_app_id: userAppId,
      user_name: userName,
      avatar: avatar,
      gender: gender,
      score: score ? score : 0,
    });
  
    if (LB_FlappyBird === null) {
      response.status(400).json(responseFail(LB_))
    } else {
      response.status(200).json(responseSuccess(LB_FlappyBird))
    }
  } else {

    const LB_FlappyBirdUpdate = await LB_FlappyBirdModel().update({
      score: score > user.score ? score : user.score ,
      }, {
        where: {
          user_app_id: userAppId
        }
      }
      );
  
    if (LB_FlappyBirdUpdate === null) {
      response.status(400).json(responseFail(LB_FlappyBirdUpdate))
    } else {
      const userUpdated = await LB_FlappyBirdModel().findOne({ where: { user_app_id: userAppId } });
      response.status(200).json(responseSuccess(userUpdated))
    }
  }
  
}

const resetRankingLB_FlappyBird = async (request, response) => {

  const ids = [
    ... ( await LB_FlappyBirdModel().findAll({
      attributes: ['id'],
      raw : true
    })),
  ].map(player => player.id);

  // console.log("ids ==================================== ", ids)

  const LB_FlappyBird = await LB_FlappyBirdModel().update({
    score: 0 ,
    }, {
      where: {
        id : ids 
      }
    }
    );

  if (LB_FlappyBird === null) {
    response.status(400).json(responseFail(LB_FlappyBird))
  } else {
    response.status(200).json(responseSuccess(LB_FlappyBird))
  }
}

const getRankLB_FlappyBirds = async (request, response) => {
  const orderBy = request.query.orderBy ? request.query.orderBy : 'score';
  const sortBy = request.query.sortBy ? request.query.sortBy : 'DESC';
  const limit = request.query.limit ? request.query.limit : 1000;
  const userAppId = request.query.userAppId ? request.query.userAppId : "";

  const LB_FlappyBirds = await LB_FlappyBirdModel().findAll({
    order: [
      [orderBy, sortBy],
    ],
    limit : limit,
  });

  if (LB_FlappyBirds === null) {
    response.status(400).json(responseFail(LB_FlappyBirds))
  } else {

    let rank = 0;
    let user = {};
    for (let index = 0; index < LB_FlappyBirds.length; index++) {
      if(LB_FlappyBirds[index].user_app_id === userAppId){
        rank = index + 1;
        user = LB_FlappyBirds[index];
      }
      
    }
    let dataRes = {
      ranks : LB_FlappyBirds,
      user : user,
      userRank : rank
    }
    
    response.status(200).json(responseSuccess(dataRes))
  }
  
}

const getLB_FlappyBirds = async (request, response) => {
  const orderBy = request.query.orderBy ? request.query.orderBy : 'score';
  const sortBy = request.query.sortBy ? request.query.sortBy : 'DESC';
  const limit = request.query.limit ? request.query.limit : 1000;
  const LB_FlappyBirds = await LB_FlappyBirdModel().findAll({
    order: [
      [orderBy, sortBy],
    ],
    limit : limit,
  });
  if (LB_FlappyBirds === null) {
    response.status(400).json(responseFail(LB_FlappyBirds))
  } else {
    response.status(200).json(responseSuccess(LB_FlappyBirds))
  }
}

const getLB_FlappyBirdById = async (request, response) => {
  const id = parseInt(request.params.id)

  const LB_FlappyBird = await LB_FlappyBirdModel().findOne({ 
    where: { id: id } ,
  });
  if (LB_FlappyBird === null) {
    response.status(400).json(responseFail(LB_FlappyBird))
  } else {
    response.status(200).json(responseSuccess(LB_FlappyBird))
  }
}

const createLB_FlappyBird = async (request, response) => {
  const { userAppId, userName , avatar, gender, score } = request.query

  const LB_FlappyBird = await LB_FlappyBirdModel().create({ 
    user_app_id: userAppId,
    user_name: userName,
    avatar: avatar,
    gender: gender,
    score: score ? score : 0,
  });

  if (LB_FlappyBird === null) {
    response.status(400).json(responseFail(LB_FlappyBird))
  } else {
    response.status(200).json(responseSuccess(LB_FlappyBird))
  }

}

const updateLB_FlappyBird = async (request, response) => {
  const id = parseInt(request.params.id)
  const { userAppId, userName , avatar, gender, score } = request.query

  const LB_FlappyBird = await LB_FlappyBirdModel().update({
    user_app_id: userAppId,
    user_name: userName,
    avatar: avatar,
    gender: gender,
    score: score ? score : 0,
    }, {
      where: {
        id: id
      }
    });

  if (LB_FlappyBird === null) {
    response.status(400).json(responseFail(LB_FlappyBird))
  } else {
    const LB_FlappyBirdUpdate = await LB_FlappyBirdModel().findOne({ where: { id: id } });
    response.status(200).json(responseSuccess(LB_FlappyBirdUpdate))
  }
}

const deleteLB_FlappyBird = async (request, response) => {
  const id = parseInt(request.params.id)

  const LB_FlappyBird = await LB_FlappyBirdModel().destroy({ where: { id: id } });
  if (LB_FlappyBird === null) {
    response.status(400).json(responseFail(LB_FlappyBird))
  } else {
    response.status(200).json(responseSuccess(LB_FlappyBird))
  }
}



module.exports = {
  getLB_FlappyBirds,
  getLB_FlappyBirdById,
  createLB_FlappyBird,
  updateLB_FlappyBird,
  deleteLB_FlappyBird,
  postScoreLB_FlappyBird,
  getRankLB_FlappyBirds,
  enrichCDP_FlappyBird,
  ingestCDP_FlappyBird,
  resetRankingLB_FlappyBird,
}