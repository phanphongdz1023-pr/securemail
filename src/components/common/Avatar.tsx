interface Props {
  name: string
  picture?: string
  size?: number
}

export function Avatar({ name, picture, size = 32 }: Props) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (picture) {
    return (
      <img
        src={picture}
        alt={name}
        className="rounded-full"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      className="flex items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-semibold"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  )
}
