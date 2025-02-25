import { IconType } from "react-icons";

type IconProps = {
    icon: IconType;
    size?: number;
    color?: string;
};

const IconWrapper: React.FC<IconProps> = ({ icon, size = 24, color = "#000" }) => {
    const IconComponent = icon as React.ElementType;

    if (!IconComponent) {
        console.error("Icon is undefined or not passed correctly");
        return null;
    }

    return <IconComponent size={size} color={color}/>;
};

export default IconWrapper;
