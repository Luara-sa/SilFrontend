import { NextSeo, NextSeoProps } from "next-seo";
import React from "react";

type Props = {
  title?: string;
  fullTitle?: boolean;
  description?: string;
  image?: string;
  imageInfo?: {
    width?: number;
    height?: number;
    alt?: string;
    full?: true;
    type?: string;
  };
  link?: string;
} & Omit<
  NextSeoProps,
  | "titleTemplate"
  | "title"
  | "description"
  | "canonical"
  | "openGraph"
  | "languageAlternates"
>;

const url = process.env.NEXT_PUBLIC_SITE_URL!;

export const Seo: React.FC<Props> = ({
  title: _title,
  fullTitle = false,
  description,
  image,
  link = "",
  imageInfo = {},
  ...props
}) => {
  const title = fullTitle ? _title : `${_title} Dubai, UAE - Scandinavia Tech`;
  const fullLink = `${url}/${link}`;
  return (
    <NextSeo
      {...props}
      titleTemplate={fullTitle ? "%s" : undefined}
      title={_title}
      description={description}
      canonical={fullLink}
      openGraph={{
        description: description,
        url: fullLink,
        title: title,
        images: image
          ? [
              {
                url: imageInfo.full ? image : `${url}/${image}`,
                alt: imageInfo.alt ?? title,
                height: imageInfo.height,
                width: imageInfo.width,
                type: imageInfo.type,
              },
            ]
          : [],
      }}
      languageAlternates={[{ hrefLang: "en-ae", href: fullLink }]}
    />
  );
};
