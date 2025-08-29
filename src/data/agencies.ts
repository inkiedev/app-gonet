export const regionCoordinates = {
  latitude: -1.831239,
  longitude: -78.183406,
  latitudeDelta: 7.5,
  longitudeDelta: 7.5,
};

export const cities = [
  {
    label: "Quito",
    value: "quito",
    region: { latitude: -0.180653, longitude: -78.467834, latitudeDelta: 0.3, longitudeDelta: 0.3 },
  },
  {
    label: "Guayaquil",
    value: "guayaquil",
    region: { latitude: -2.170998, longitude: -79.922356, latitudeDelta: 0.3, longitudeDelta: 0.3 },
  },
  {
    label: "Cuenca",
    value: "cuenca",
    region: { latitude: -2.900128, longitude: -79.00589, latitudeDelta: 0.2, longitudeDelta: 0.2 },
  },
];

// Polygon data for each city (simple rectangles for demonstration)
export const polygons = {
  quito: [
    { latitude: -0.1, longitude: -78.4 },
    { latitude: -0.3, longitude: -78.4 },
    { latitude: -0.3, longitude: -78.6 },
    { latitude: -0.1, longitude: -78.6 },
  ],
  guayaquil: [
    { latitude: -2.1, longitude: -79.85 },
    { latitude: -2.3, longitude: -79.85 },
    { latitude: -2.3, longitude: -80.0 },
    { latitude: -2.1, longitude: -80.0 },
  ],
  cuenca: [
    { latitude: -2.88, longitude: -78.98 },
    { latitude: -2.92, longitude: -78.98 },
    { latitude: -2.92, longitude: -79.03 },
    { latitude: -2.88, longitude: -79.03 },
  ],
};


export const neighborhoods = {
  quito: [
    {
      label: "La Mariscal",
      value: "la-mariscal",
      polygon: [
        { latitude: -0.195, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.505 },
        { latitude: -0.195, longitude: -78.505 },
      ],
      region: { latitude: -0.200, longitude: -78.500, latitudeDelta: 0.02, longitudeDelta: 0.02 },
    },
    {
      label: "La Floresta",
      value: "la-floresta",
      polygon: [
        { latitude: -0.205, longitude: -78.485 },
        { latitude: -0.215, longitude: -78.485 },
        { latitude: -0.215, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.495 },
      ],
      region: { latitude: -0.210, longitude: -78.490, latitudeDelta: 0.02, longitudeDelta: 0.02 },
    },
  ],
  guayaquil: [],
  cuenca: [
    {
      label: "Vergel",
      value: "vergel",
      polygon: [
        { latitude: -0.195, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.505 },
        { latitude: -0.195, longitude: -78.505 },
      ],
      region: { latitude: -0.200, longitude: -78.500, latitudeDelta: 0.02, longitudeDelta: 0.02 },
    },
    {
      label: "Vergel 123 12323",
      value: "vergel1",
      polygon: [
        { latitude: -0.195, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.505 },
        { latitude: -0.195, longitude: -78.505 },
      ],
      region: { latitude: -0.200, longitude: -78.500, latitudeDelta: 0.02, longitudeDelta: 0.02 },
    },
    {
      label: "Vergel",
      value: "vergel2",
      polygon: [
        { latitude: -0.195, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.505 },
        { latitude: -0.195, longitude: -78.505 },
      ],
      region: { latitude: -0.200, longitude: -78.500, latitudeDelta: 0.02, longitudeDelta: 0.02 },
    },
    {
      label: "Vergel",
      value: "vergel3",
      polygon: [
        { latitude: -0.195, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.505 },
        { latitude: -0.195, longitude: -78.505 },
      ],
      region: { latitude: -0.200, longitude: -78.500, latitudeDelta: 0.02, longitudeDelta: 0.02 },
    },
    {
      label: "Vergel",
      value: "vergel12",
      polygon: [
        { latitude: -0.195, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.505 },
        { latitude: -0.195, longitude: -78.505 },
      ],
      region: { latitude: -0.200, longitude: -78.500, latitudeDelta: 0.02, longitudeDelta: 0.02 },
    },
    {
      label: "Vergel",
      value: "vergel13",
      polygon: [
        { latitude: -0.195, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.505 },
        { latitude: -0.195, longitude: -78.505 },
      ],
      region: { latitude: -0.200, longitude: -78.500, latitudeDelta: 0.02, longitudeDelta: 0.02 },
    },
    {
      label: "Vergel",
      value: "vergel21",
      polygon: [
        { latitude: -0.195, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.505 },
        { latitude: -0.195, longitude: -78.505 },
      ],
      region: { latitude: -0.200, longitude: -78.500, latitudeDelta: 0.02, longitudeDelta: 0.02 },
    },
    {
      label: "Vergel sapo sapo",
      value: "vergel23",
      polygon: [
        { latitude: -0.195, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.505 },
        { latitude: -0.195, longitude: -78.505 },
      ],
      region: { latitude: -0.200, longitude: -78.500, latitudeDelta: 0.02, longitudeDelta: 0.02 },
    },
    {
      label: "Vergel linea barrio informacion mas ",
      value: "vergel231",
      polygon: [
        { latitude: -0.195, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.505 },
        { latitude: -0.195, longitude: -78.505 },
      ],
      region: { latitude: -0.200, longitude: -78.500, latitudeDelta: 0.02, longitudeDelta: 0.02 },
    },
    {
      label: "Vergel",
      value: "vergel331",
      polygon: [
        { latitude: -0.195, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.505 },
        { latitude: -0.195, longitude: -78.505 },
      ],
      region: { latitude: -0.200, longitude: -78.500, latitudeDelta: 0.02, longitudeDelta: 0.02 },
    },
    {
      label: "Vergel",
      value: "vergel221",
      polygon: [
        { latitude: -0.195, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.505 },
        { latitude: -0.195, longitude: -78.505 },
      ],
      region: { latitude: -0.200, longitude: -78.500, latitudeDelta: 0.02, longitudeDelta: 0.02 },
    },
    {
      label: "Vergel",
      value: "vergel123",
      polygon: [
        { latitude: -0.195, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.495 },
        { latitude: -0.205, longitude: -78.505 },
        { latitude: -0.195, longitude: -78.505 },
      ],
      region: { latitude: -0.200, longitude: -78.500, latitudeDelta: 0.02, longitudeDelta: 0.02 },
    }



  ],
};

export const agencies = [
  // Quito
  {
    id: "1",
    name: "GoNet Quito Norte",
    address: "Av. de los Shyris N34-40 y Av. Eloy Alfaro, Quito",
    phone: "02 245 5888",
    location: {
      latitude: -0.1762,
      longitude: -78.4824,
    },
    city: "quito",
  },
  {
    id: "2",
    name: "GoNet La Carolina",
    address: "Av. de la República y, Quito",
    phone: "02 333 2145",
    location: {
      latitude: -0.189,
      longitude: -78.487,
    },
    city: "quito",
  },
  // Guayaquil
  {
    id: "3",
    name: "GoNet Guayaquil Centro",
    address: "Av. 9 de Octubre y Malecón Simón Bolívar, Guayaquil",
    phone: "04 252 2300",
    location: {
      latitude: -2.193,
      longitude: -79.88,
    },
    city: "guayaquil",
  },
  {
    id: "4",
    name: "GoNet Urdesa",
    address: "Calle Victor Emilio Estrada 626, Guayaquil",
    phone: "04 238 7458",
    location: {
      latitude: -2.168,
      longitude: -79.91,
    },
    city: "guayaquil",
  },
  // Cuenca
  {
    id: "5",
    name: "GoNet Cuenca",
    address: "Av. Remigio Crespo Toral y Av. Loja, Cuenca",
    phone: "07 288 8350",
    location: {
      latitude: -2.908,
      longitude: -79.01,
    },
    city: "cuenca",
  },
];