
require('dotenv').config()

const {responseSuccess,responseFail} = require('./response')

const {LB_ARShooterEventModel} = require('@models/lb_arshooter_event_vguy')


const postScoreLB_ARShooterEvent = async (request, response) => {

  const { email, userName , phoneNumber, score } = request.body

  const user = await LB_ARShooterEventModel().findOne({ where: { email: email } });
 
  if (user === null) {
    const LB_ARShooter = await LB_ARShooterEventModel().create({ 
      email: email,
      user_name: userName,
      phone_number: phoneNumber ? phoneNumber : "",
      score: score ? score : 0,
    });
  
    if (LB_ARShooter === null) {
      response.status(400).json(responseFail(LB_ARShooter))
    } else {
      response.status(200).json(responseSuccess(LB_ARShooter))
    }
  } else {

    const LB_ARShooterUpdate = await LB_ARShooterEventModel().update({
      score: score > user.score ? score : user.score ,
      }, {
        where: {
          email: email
        }
      }
      );
  
    if (LB_ARShooterUpdate === null) {
      response.status(400).json(responseFail(LB_ARShooterUpdate))
    } else {
      const userUpdated = await LB_ARShooterEventModel().findOne({ where: { email: email } });
      response.status(200).json(responseSuccess(userUpdated))
    }
  }
  
}

const resetRankingLB_ARShooterEvent = async ( request, response) => {

  const ids = [
    ... ( await LB_ARShooterEventModel().findAll({
      attributes: ['id'],
      raw : true
    })),
  ].map(player => player.id);

  // console.log("ids ==================================== ", ids)
const LB_ARShooter = await LB_ARShooterEventModel().update({
  score: 0 ,
  }, {
    where: {
      id : ids 
    }
  }
  );

  if (LB_ARShooter === null) {
    response.status(400).json(responseFail(LB_ARShooter))
  } else {
    response.status(200).json(responseSuccess(LB_ARShooter))
  }
}

const getRankLB_ARShootersEvent = async (request, response) => {
  const orderBy = request.query.orderBy ? request.query.orderBy : 'score';
  const sortBy = request.query.sortBy ? request.query.sortBy : 'DESC';
  const limit = request.query.limit ? request.query.limit : 1000;
  const email = request.query.email ? request.query.email : "";

  const LB_ARShooters = await LB_ARShooterEventModel().findAll({
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
      if(LB_ARShooters[index].email === email){
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

const getLB_ARShootersEvent = async (request, response) => {
  
  const orderBy = request.query.orderBy ? request.query.orderBy : 'score';
  const sortBy = request.query.sortBy ? request.query.sortBy : 'DESC';
  const limit = request.query.limit ? request.query.limit : 1000;
  const LB_ARShooters = await LB_ARShooterEventModel().findAll({
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

const getLB_ARShooterEventById = async (request, response) => {
  const id = parseInt(request.params.id)

  const LB_ARShooter = await LB_ARShooterEventModel().findOne({ 
    where: { id: id } ,
  });
  if (LB_ARShooter === null) {
    response.status(400).json(responseFail(LB_ARShooter))
  } else {
    response.status(200).json(responseSuccess(LB_ARShooter))
  }
}

const createLB_ARShooterEvent = async (request, response) => {
  const { email, userName , phoneNumber,  score } = request.query

  const LB_ARShooter = await LB_ARShooterEventModel().create({ 
    email: email,
    user_name: userName,
    phone_number: phoneNumber ? phoneNumber : "",
    score: score ? score : 0,
  });

  if (LB_ARShooter === null) {
    response.status(400).json(responseFail(LB_ARShooter))
  } else {
    response.status(200).json(responseSuccess(LB_ARShooter))
  }

}

const updateLB_ARShooterEvent = async (request, response) => {
  const id = parseInt(request.params.id)
  const { email, userName , phoneNumber,  score } = request.query

  const LB_ARShooter = await LB_ARShooterEventModel().update({
    email: email,
    user_name: userName,
    phone_number: phoneNumber ? phoneNumber : "",
    score: score ? score : 0,
    }, {
      where: {
        id: id
      }
    });

  if (LB_ARShooter === null) {
    response.status(400).json(responseFail(LB_ARShooter))
  } else {
    const LB_ARShooterUpdate = await LB_ARShooterEventModel().findOne({ where: { id: id } });
    response.status(200).json(responseSuccess(LB_ARShooterUpdate))
  }
}

const deleteLB_ARShooterEvent = async (request, response) => {
  const id = parseInt(request.params.id)

  const LB_ARShooter = await LB_ARShooterEventModel().destroy({ where: { id: id } });
  if (LB_ARShooter === null) {
    response.status(400).json(responseFail(LB_ARShooter))
  } else {
    response.status(200).json(responseSuccess(LB_ARShooter))
  }
}



module.exports = {
  getLB_ARShootersEvent,
  getLB_ARShooterEventById,
  createLB_ARShooterEvent,
  updateLB_ARShooterEvent,
  deleteLB_ARShooterEvent,
  postScoreLB_ARShooterEvent,
  getRankLB_ARShootersEvent,
  resetRankingLB_ARShooterEvent
}