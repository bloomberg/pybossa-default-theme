'use strict';

const _types = {
  F1: 'f1',
  JACCARD: 'jaccard',
  DICE: 'dice',
  MAJORITY: 'majority',
  OVERLAP: 'overlap'
};

function isPairwiseConsensus (consensusType) {
  const pairwiseFunctions = [_types.F1, _types.JACCARD, _types.DICE, _types.OVERLAP];
  return pairwiseFunctions.includes(consensusType);
}

const config = {
  [_types.MAJORITY]: {
    display: 'Majority'
  },
  [_types.F1]: {
    display: 'F1'
  },
  [_types.JACCARD]: {
    display: 'Jaccard'
  },
  [_types.DICE]: {
    display: 'Dice'
  },
  [_types.OVERLAP]: {
    display: 'Overlap'
  }
};

export default {
  default: _types.MAJORITY,
  config,
  isPairwiseConsensus
};
