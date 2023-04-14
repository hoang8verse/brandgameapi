
const {responseSuccess,responseFail} = require('./response')

const {LB_ARShooterModel} = require('@models/lb_arshooter')

const getLB_ARShooters = async (request, response) => {
  const orderBy = request.query.orderBy ? request.query.orderBy : 'id';
  const sortBy = request.query.sortBy ? request.query.sortBy : 'ASC';
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
}