const TIMER_SECONDS = 20;

export const states = [
  {
    taskId: 1,
    expiration: {
      get seconds () {
        return Math.trunc(Date.now() / 1000) + TIMER_SECONDS;
      }
    }
  }
];

export const intervalSeconds = TIMER_SECONDS + 2;
