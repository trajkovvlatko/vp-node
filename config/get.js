const configFromEnv = () => {
  const host = process.env.POSTGRES_HOST;
  const port = process.env.POSTGRES_PORT;
  const user = process.env.POSTGRES_USER;
  const password = process.env.POSTGRES_PASSWORD;
  const database = process.env.POSTGRES_DB;
  if (host && port && user && password && database) {
    return {
      host,
      port,
      user,
      password,
      database,
    };
  } else {
    return;
  }
};

module.exports = configFromEnv();
