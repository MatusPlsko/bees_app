export type Hive = {
  id: string;
  name: string;
  owner: string;
  city: string;
  lat: number;
  lon: number;
  dashboardUrl?: string; // undefined = dashboard is not public
};

export const hives: Hive[] = [
  {
    id: "lucenec",
    name: "Lučenec",
    owner: "User User",
    city: "Lučenec",
    lat: 48.33249,
    lon: 19.66708,
    dashboardUrl:
      "http://147.175.150.184:8080/dashboard/83efda40-7e5c-11ef-9d7f-23b4ec4c1ac8?publicId=2be94650-894d-11ef-9d7f-23b4ec4c1ac8",
  },
  {
    id: "bratislava",
    name: "Bratislava",
    owner: "User User",
    city: "Bratislava",
    lat: 48.14816,
    lon: 17.10674,
    dashboardUrl:
      "http://147.175.150.184:8080/dashboard/9f9b2290-7e5c-11ef-9d7f-23b4ec4c1ac8?publicId=2be94650-894d-11ef-9d7f-23b4ec4c1ac8",
  },
  {
    id: "arduino-mega",
    name: "Arduino MEGA 2560",
    owner: "User User",
    city: "Trakovice",
    lat: 48.14816,
    lon: 17.10674,
    dashboardUrl:
      "http://147.175.150.184:8080/dashboard/65dae4f0-7e5c-11ef-9d7f-23b4ec4c1ac8?publicId=2be94650-894d-11ef-9d7f-23b4ec4c1ac8",
  },
  {
    id: "kosice",
    name: "Košice",
    owner: "User User",
    city: "Košice",
    lat: 48.71395,
    lon: 21.25808,
    dashboardUrl:
      "http://147.175.150.184:8080/dashboard/734075b0-7e5c-11ef-9d7f-23b4ec4c1ac8?publicId=2be94650-894d-11ef-9d7f-23b4ec4c1ac8",
  },
  {
    id: "poprad",
    name: "Poprad",
    owner: "User User",
    city: "Poprad",
    lat: 49.06144,
    lon: 20.29798,
    dashboardUrl:
      "http://147.175.150.184:8080/dashboard/a8cc5870-7e5c-11ef-9d7f-23b4ec4c1ac8?publicId=2be94650-894d-11ef-9d7f-23b4ec4c1ac8",
  },
  {
    id: "banska-bystrica",
    name: "Banská Bystrica",
    owner: "User User",
    city: "Banská Bystrica",
    lat: 48.73946,
    lon: 19.15349,
    dashboardUrl:
      "http://147.175.150.184:8080/dashboard/954f06d0-7e5c-11ef-9d7f-23b4ec4c1ac8?publicId=2be94650-894d-11ef-9d7f-23b4ec4c1ac8",
  },
  {
    id: "device-test",
    name: "Device - test",
    owner: "User User",
    city: "Piešťany",
    lat: 48.14816,
    lon: 17.10674,
    dashboardUrl: undefined, // Dashboard is not public
  },
];
