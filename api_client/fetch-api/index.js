const fetch = require("node-fetch");
const { HttpError } = require("../../api-commons/errors");

const {
  env: { CLIENT_END_POINT_URL, POLICIES_END_POINT_URL }
} = process;

const fetchAPI = (async endPoint => {

  if (endPoint === "clients") {
    const res = await fetch(CLIENT_END_POINT_URL);
    if (!res) throw new HttpError(`Mocky API client end point broken ${CLIENT_END_POINT_URL}`);
    const { clients } = await Promise.resolve(res.json());
    return clients;

  } else if (endPoint === "policies") {
    const res = await fetch(POLICIES_END_POINT_URL);
    if (!res) throw new HttpError(`Mocky API policies end point broken ${POLICIES_END_POINT_URL}`);
    const { policies } = await Promise.resolve(res.json());
    return policies;

  } else {
    throw new HttpError("This url does not match with any end point");
  }
})

module.exports = fetchAPI
