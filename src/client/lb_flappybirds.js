
const {responseSuccess,responseFail} = require('./response')

const {LB_FlappyBirdModel} = require('@models/lb_flappybird')

const getLB_FlappyBirds = async (request, response) => {
  const orderBy = request.query.orderBy ? request.query.orderBy : 'id';
  const sortBy = request.query.sortBy ? request.query.sortBy : 'ASC';
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
}