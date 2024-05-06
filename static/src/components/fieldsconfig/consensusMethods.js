'use strict';

const _types = {
  F1: 'f1',
  JACCARD: 'jaccard',
  DICE: 'dice',
  MAJORITY: 'majority'
};

const config = {
  [_types.F1]: {
    display: 'F1',
  },
  [_types.JACCARD]: {
    display: 'Jaccard',
  },
  [_types.DICE]: {
    display: 'Dice',
  },
  [_types.MAJORITY]: {
    display: 'Majority',
  },
};

export default {
  default: _types.MAJORITY,
  config
};
