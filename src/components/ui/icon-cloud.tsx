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
    // 在 img 标签外层包裹一个 a 标签
    return (
        <a key={iconPath}>
            <img 
                src={iconPath}
                alt="tech icon"
                width={50}
                height={50}
                style={{ filter: theme === 'dark' ? 'invert(1)' : 'none' }}
            />
        </a>
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
      tooltip: null,
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
