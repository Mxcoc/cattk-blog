"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import {
  Cloud,
  fetchSimpleIcons,
  ICloud,
  renderSimpleIcon,
  SimpleIcon,
} from "react-icon-cloud";

export type DynamicCloudProps = {
  iconSlugs: string[];
};

const renderCustomIcon = (iconPath: string, theme: string) => {
    return (
        <img 
            key={iconPath}
            src={iconPath} // 直接使用我们配置的本地路径
            alt="tech icon"
            width={50} // 可以根据需要调整图标大小
            height={50} // 可以根据需要调整图标大小
            style={{ filter: theme === 'dark' ? 'invert(1)' : 'none' }} // 让图标在暗色模式下反色
        />
    );
};

export default function IconCloud({ iconSlugs }: DynamicCloudProps) {
  const { theme } = useTheme();

  const cloudProps: Omit<ICloud, "children"> = {
    containerProps: {
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      },
    },
    options: {
      reverse: true,
      depth: 1,
      wheelZoom: false,
      imageScale: 2,
      activeCursor: "default",
      tooltip: "none",
      initial: [0.1, -0.1],
      clickToFront: 500,
      tooltipDelay: 0,
      outlineColour: "#0000",
      maxSpeed: 0.04,
      minSpeed: 0.02,
    },
  };

  const renderedIcons = useMemo(() => {
    return iconSlugs.map((slug) => renderCustomIcon(slug, theme ?? 'light'));
  }, [iconSlugs, theme]);

  return (
    <Cloud {...cloudProps}>
      {renderedIcons}
    </Cloud>
  );
}
