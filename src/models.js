const actionFlowPrefix = '__af__';

function afModelsGetProp (name) {
  return actionFlowPrefix + name;
}

const actionFlowModels = {};

actionFlowModels[afModelsGetProp('queue')] = {
  clientId: {
    type: String,
    required: true
  },
  descriptionHash: {
    type: String,
    required: true
  },
  setTime: {
    type: Number,
    required: true
  }
};

module.exports = {
  models: actionFlowModels,
  afModelsGetProp
};