export const routers = [
  {
    url: "/api/users",
    permissions: [
      { method: "POST", role: ["Admin",] },
      { method: "GET", role: ["Admin",] },
      { method: "PUT", role: ["Admin",] },
      { method: "DELETE", role: ["Admin",] },
    ],
  },
];
