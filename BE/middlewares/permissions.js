export const routers = [
  {
    url: "/api/users",
    permissions: [
      { method: "POST", role: ["Admin",] },
    ],
  },
  {
    url: "/api/users/:id",
    permissions: [
      { method: "PUT", role: ["Admin",] },
      { method: "DELETE", role: ["Admin",] },
    ],
  },
  {
    url: "/api/users/get-current-user",
    permissions: [
      { method: "GET", role: ["Admin",] },
    ],
  },
  {
    url: "/api/users/detail/:id",
    permissions: [
      { method: "GET", role: ["Admin",] },
    ],
  },
  {
    url: "/api/users/get-list",
    permissions: [
      { method: "GET", role: ["Admin",] },
    ],
  },
  {
    url: "/api/users/get-list-doctor",
    permissions: [
      { method: "GET" },
    ],
  },
  {
    url: "/api/users/detail-doctor/:id",
    permissions: [
      { method: "GET" },
    ],
  },
];