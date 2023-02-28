const retrieveAccessToken = (authHeader: string | undefined) => {
  let accessToken: string | null = null;

  if (authHeader !== undefined) {
    if (authHeader.startsWith("Bearer ") === true) {
      accessToken = authHeader.split(" ")[1];
    }
    if (authHeader.startsWith("bearer ") === true) {
      accessToken = authHeader.split(" ")[1];
    }
  }

  return accessToken;
};

export { retrieveAccessToken };
