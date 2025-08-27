import { BaseComponentProps } from "@/types/common";
import { JSX } from "react";
import { Platform } from "react-native";
import LogoLoaderPhone from "./loading.phone";
import LogoLoaderweb from "./loading.web";




interface LoadingPromp extends BaseComponentProps {
  scale?: number;
  variant?: 'default' | 'small' | 'large';
}

export default function LogoLoader(props: LoadingPromp): JSX.Element {

if (Platform.OS == "web")
    return LogoLoaderweb(props)

return LogoLoaderPhone(props)

}