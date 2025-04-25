"use client"

import Image from "next/image"

function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("http") || src.startsWith("data:")) {
    return src
  }

  if (src.includes("res.cloudinary.com")) {
    return src
  }

  if (src.includes("placeholder.svg")) {
    return src
  }

  const imagePath = src.startsWith("/") ? src.slice(1) : src

  const params = [
    "f_auto",
    "c_limit",
    `w_${width}`,
    `q_${quality || "auto"}`,
  ]

  return `https://res.cloudinary.com/demo/image/upload/${params.join(",")}/${imagePath}`
}

interface TeamMemberImageProps {
  src: string
  alt: string
  style?: React.CSSProperties
  fill?: boolean
  width?: number
  height?: number
}

export default function TeamMemberImage({ src, alt, style, fill, width, height }: TeamMemberImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      style={style}
      loader={cloudinaryLoader}
    />
  )
}
