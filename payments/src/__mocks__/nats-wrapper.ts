export const natsWrapper = {
  client: {
    // publish: (subject: string, data: string, cb: () => void) => {
    //     cb();
    // }
    publish: jest
      .fn()
      .mockImplementation((subject: string, data: string, cb: () => void) => {
        cb();
      }),
  },
};
