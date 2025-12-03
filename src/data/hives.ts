export type Hive = {
  id: string;
  name: string;
  owner: string;
  city: string;
  dashboardUrl?: string; // undefined = dashboard is not public
};

export const hives: Hive[] = [
  {
    id: "lucenec",
    name: "Lučenec",
    owner: "User User",
    city: "Lučenec",
    dashboardUrl:
      "http://147.175.150.184:8080/dashboard/83efda40-7e5c-11ef-9d7f-23b4ec4c1ac8?publicId=2be94650-894d-11ef-9d7f-23b4ec4c1ac8",
  },
  {
    id: "bratislava",
    name: "Bratislava",
    owner: "User User",
    city: "Bratislava",
    dashboardUrl:
      "http://147.175.150.184:8080/dashboard/9f9b2290-7e5c-11ef-9d7f-23b4ec4c1ac8?publicId=2be94650-894d-11ef-9d7f-23b4ec4c1ac8",
  },
  {
    id: "arduino-mega",
    name: "Arduino MEGA 2560",
    owner: "User User",
    city: "Trakovice",
    dashboardUrl:
      "http://147.175.150.184:8080/dashboard/65dae4f0-7e5c-11ef-9d7f-23b4ec4c1ac8?publicId=2be94650-894d-11ef-9d7f-23b4ec4c1ac8",
  },
  {
    id: "kosice",
    name: "Košice",
    owner: "User User",
    city: "Košice",
    dashboardUrl:
      "http://147.175.150.184:8080/dashboard/734075b0-7e5c-11ef-9d7f-23b4ec4c1ac8?publicId=2be94650-894d-11ef-9d7f-23b4ec4c1ac8",
  },
  {
    id: "poprad",
    name: "Poprad",
    owner: "User User",
    city: "Poprad",
    dashboardUrl:
      "http://147.175.150.184:8080/dashboard/a8cc5870-7e5c-11ef-9d7f-23b4ec4c1ac8?publicId=2be94650-894d-11ef-9d7f-23b4ec4c1ac8",
  },
  {
    id: "banska-bystrica",
    name: "Banská Bystrica",
    owner: "User User",
    city: "Banská Bystrica",
    dashboardUrl:
      "http://147.175.150.184:8080/dashboard/954f06d0-7e5c-11ef-9d7f-23b4ec4c1ac8?publicId=2be94650-894d-11ef-9d7f-23b4ec4c1ac8",
  },
  {
    id: "device-test",
    name: "Device - test",
    owner: "User User",
    city: "Piešťany",
    dashboardUrl: undefined, // Dashboard is not public
  },
];
