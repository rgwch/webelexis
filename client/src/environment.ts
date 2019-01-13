export default {
  debug: false,
  testing: false,
  baseURL: window.location.href,
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
  transport: "feathers" // "fhir" or "feathers"
};
  

