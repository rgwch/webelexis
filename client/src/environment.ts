export default {
  baseURL: "http://localhost:3030/",
  debug: true,
  fhir: {
    client_id: "ch.webelexis.aurelia.v3",
    client_redirect: "#/auth",
    server_url: "http://localhost:8380/fhir",
    metadata: {}
  },
  metadata: {
    aclmapping: { guest: [] },
    ip: "?",
    roles: { guest: "guest", admin: "admin" },
    sitename: "Webelexis"
  },
  testing: true,
  transport: "feathers"
};
