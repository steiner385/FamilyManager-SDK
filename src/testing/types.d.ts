/// <reference types="jest" />

declare global {
  namespace NodeJS {
    interface Global {
      describe: jest.Describe;
      it: jest.It;
      expect: jest.Expect;
      beforeEach: jest.BeforeEach;
      afterEach: jest.AfterEach;
      jest: typeof jest;
    }
  }

  var describe: jest.Describe;
  var it: jest.It;
  var expect: jest.Expect;
  var beforeEach: jest.BeforeEach;
  var afterEach: jest.AfterEach;
  var jest: typeof jest;
}

export {};
