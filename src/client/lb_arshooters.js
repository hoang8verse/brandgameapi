
require('dotenv').config()

const {responseSuccess,responseFail} = require('./response')
const {enrichCDP, ingestCDP} = require('../CDP/cdp')

const {LB_ARShooterModel} = require('@models/lb_arshooter')


const enrichCDP_ARShooter = async (request, response) => {
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
  
  const ingestCDP_ARShooter = async (request, response) => {
  
    // console.log(" request.body =============  " , request.body)
    // const { userAppId } = request.body;
    let _env = {
      cdpendpoind :process.env.CDP_ENDPOIND_AR,
      cdpaid :process.env.CDP_AID_AR,
      orgid :process.env.ORG_ID_AR,
      appid :process.env.ZALO_APP_ID_AR,
      oaid :process.env.OA_APP_ID_AR,
  }
  let _state = {
    user : {
      userAppId : request.body.user.userAppId,
      userName : request.body.user.userName,
      userPhone : request.body.user.phoneNumber,
      zoaUserAvatar : request.body.user.userAvatar,
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

const postScoreLB_ARShooter = async (request, response) => {

  const { userAppId, userName , avatar, gender, score } = request.body

  const user = await LB_ARShooterModel().findOne({ where: { user_app_id: userAppId } });
 
  if (user === null) {
    const LB_ARShooter = await LB_ARShooterModel().create({ 
      user_app_id: userAppId,
      user_name: userName,
      avatar: avatar,
      gender: gender,
      score: score ? score : 0,
    });
  
    if (LB_ARShooter === null) {
      response.status(400).json(responseFail(LB_ARShooter))
    } else {
      response.status(200).json(responseSuccess(LB_ARShooter))
    }
  } else {

    const LB_ARShooterUpdate = await LB_ARShooterModel().update({
      score: score > user.score ? score : user.score ,
      }, {
        where: {
          user_app_id: userAppId
        }
      }
      );
  
    if (LB_ARShooterUpdate === null) {
      response.status(400).json(responseFail(LB_ARShooterUpdate))
    } else {
      const userUpdated = await LB_ARShooterModel().findOne({ where: { user_app_id: userAppId } });
      response.status(200).json(responseSuccess(userUpdated))
    }
  }
  
}


const getRankLB_ARShooters = async (request, response) => {
  const orderBy = request.query.orderBy ? request.query.orderBy : 'score';
  const sortBy = request.query.sortBy ? request.query.sortBy : 'DESC';
  const limit = request.query.limit ? request.query.limit : 1000;
  const userAppId = request.query.userAppId ? request.query.userAppId : "";

  const LB_ARShooters = await LB_ARShooterModel().findAll({
    order: [
      [orderBy, sortBy],
    ],
    limit : limit,
  });
  if (LB_ARShooters === null) {
    response.status(400).json(responseFail(LB_ARShooters))
  } else {

    let rank = 0;
    let user = {};
    for (let index = 0; index < LB_ARShooters.length; index++) {
      if(LB_ARShooters[index].user_app_id === userAppId){
        rank = index + 1;
        user = LB_ARShooters[index];
      }
      
    }
    let dataRes = {
      ranks : LB_ARShooters,
      user : user,
      userRank : rank
    }
    
    response.status(200).json(responseSuccess(dataRes))
  }
  
}

const getLB_ARShooters = async (request, response) => {
  
  const orderBy = request.query.orderBy ? request.query.orderBy : 'score';
  const sortBy = request.query.sortBy ? request.query.sortBy : 'DESC';
  const limit = request.query.limit ? request.query.limit : 1000;
  const LB_ARShooters = await LB_ARShooterModel().findAll({
    order: [
      [orderBy, sortBy],
    ],
    limit : limit,
  });
  if (LB_ARShooters === null) {
    response.status(400).json(responseFail(LB_ARShooters))
  } else {
    response.status(200).json(responseSuccess(LB_ARShooters))
  }
}

const getLB_ARShooterById = async (request, response) => {
  const id = parseInt(request.params.id)

  const LB_ARShooter = await LB_ARShooterModel().findOne({ 
    where: { id: id } ,
  });
  if (LB_ARShooter === null) {
    response.status(400).json(responseFail(LB_ARShooter))
  } else {
    response.status(200).json(responseSuccess(LB_ARShooter))
  }
}

const createLB_ARShooter = async (request, response) => {
  const { userAppId, userName , avatar, gender, score } = request.query

  const LB_ARShooter = await LB_ARShooterModel().create({ 
    user_app_id: userAppId,
    user_name: userName,
    avatar: avatar,
    gender: gender,
    score: score ? score : 0,
  });

  if (LB_ARShooter === null) {
    response.status(400).json(responseFail(LB_ARShooter))
  } else {
    response.status(200).json(responseSuccess(LB_ARShooter))
  }

}

const updateLB_ARShooter = async (request, response) => {
  const id = parseInt(request.params.id)
  const { userAppId, userName , avatar, gender, score } = request.query

  const LB_ARShooter = await LB_ARShooterModel().update({
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

  if (LB_ARShooter === null) {
    response.status(400).json(responseFail(LB_ARShooter))
  } else {
    const LB_ARShooterUpdate = await LB_ARShooterModel().findOne({ where: { id: id } });
    response.status(200).json(responseSuccess(LB_ARShooterUpdate))
  }
}

const deleteLB_ARShooter = async (request, response) => {
  const id = parseInt(request.params.id)

  const LB_ARShooter = await LB_ARShooterModel().destroy({ where: { id: id } });
  if (LB_ARShooter === null) {
    response.status(400).json(responseFail(LB_ARShooter))
  } else {
    response.status(200).json(responseSuccess(LB_ARShooter))
  }
}



module.exports = {
  getLB_ARShooters,
  getLB_ARShooterById,
  createLB_ARShooter,
  updateLB_ARShooter,
  deleteLB_ARShooter,
  postScoreLB_ARShooter,
  getRankLB_ARShooters,
  enrichCDP_ARShooter,
  ingestCDP_ARShooter
}