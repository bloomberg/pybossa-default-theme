'use strict';

const _types = {
  F1: 'f1',
  JACCARD: 'jaccard',
  DICE: 'dice',
  MAJORITY: 'majority',
  OVERLAP: 'overlap'
};

const config = {
  [_types.MAJORITY]: {
    display: 'Majority',
  },
  [_types.F1]: {
    display: 'F1',
  },
  [_types.JACCARD]: {
    display: 'Jaccard',
  },
  [_types.DICE]: {
    display: 'Dice',
  },
  [_types.OVERLAP]: {
    display: 'Overlap',
  },
};

export default {
  default: _types.MAJORITY,
  config
};
