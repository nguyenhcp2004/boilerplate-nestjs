/* eslint-disable no-undef */
// E2E runs against the real services defined in .env (docker: postgres on
// 25432, redis on 6379, maildev on 1025). Only mark the node env; everything
// else comes from the .env file via ConfigModule.
process.env.NODE_ENV = 'test';
