import { useEffect, useState } from "react";
import { IconProps } from "@phosphor-icons/react";

interface IIconProps {
	iconName: string;
	propsIcon?: IconProps;
}

const Icon = ({ iconName, propsIcon = {} }: IIconProps) => {
	const [IconComponent, setIconComponent] = useState<React.ElementType | null>(
		null,
	);
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		const cleanedIconName =
			iconName.trim().slice(0, 1).toUpperCase() + iconName.trim().slice(1);

		const importIcon = async () => {
			try {
				const module: any = await import(`@phosphor-icons/react`);
				const LoadedIcon = module[cleanedIconName];
				if (LoadedIcon) {
					setIconComponent(() => LoadedIcon);
				} else {
					setHasError(true);
				}
			} catch (error) {
				setHasError(true);
			}
		};

		importIcon();
	}, [iconName]);

	if (hasError) {
		return <span>Icon not found</span>;
	}

	if (!IconComponent) {
		return (
			<div className="flex items-center justify-center w-6 h-6">
				<div className="w-4 h-4 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
			</div>
		);
	}

	return <IconComponent {...propsIcon} />;
};

export default Icon;
export type { IIconProps };
