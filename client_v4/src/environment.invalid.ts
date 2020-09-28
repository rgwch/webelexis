// in config/environment.json now
// https://discourse.aurelia.io/t/environment-json-vs-environment-ts/2919/3
export default {
  baseURL: "http://localhost:3030/",
  debug: true,
  fhir: {
    client_id: "ch.webelexis.aurelia.v3",
    client_redirect: "#/auth",
    metadata: {},
    server_url: "http://localhost:8380/fhir"
  },
  metadata: {
    aclmapping: { guest: [] },
    ip: "?",
    roles: { guest: "guest", admin: "admin" },
    sitename: "Webelexis"
  },
  testing: true,
  transport: "feathers" // "fhir" or "feathers"
};
