export const handleHttp = (res, error, errorRaw) => {
  console.log(errorRaw);
  res.status(500).send({ error });
};
