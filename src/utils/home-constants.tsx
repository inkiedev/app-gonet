import { FontAwesome, Entypo,  MaterialCommunityIcons, MaterialIcons,  Feather } from '@expo/vector-icons';

export const optionsMenu = [
  {
    icon: <FontAwesome name="user" size={30} color="#ffffff" />,
    label: "Perfil",
  },
  {
    icon: <FontAwesome name="cog" size={30} color="#ffffff" />,
    label: "Configuracion App",
  },
  {
    icon: <MaterialIcons name="local-mall" size={30} color="#ffffff" />,
    label: "Agencias",
  },
  {
    icon: <Entypo name="wallet" size={30} color="#ffffff" />,
    label: "Consulta Pagos",
  },
  {
    icon: <MaterialIcons name="security" size={30} color="#ffffff" />,
    label: "Seguridad",
  },
  {
    icon: <Feather name="shopping-cart" size={30} color="#ffffff" />,
    label: "Adquiere mas",
  },
  {
    icon: <MaterialCommunityIcons name="logout-variant" size={30} color="#ffffff" />,
    label: "Cerrar Sesión",
  },
];
