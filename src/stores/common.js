
export const state = {
  banner: true,
  bannerHeight: 'auto',
  sidebar: false
}

export const toggle = ({ common }, key) => {
  common[key] = !common[key]
  return { common }
}

export const set = ({ common }, key, value) => {
  common[key] = value
  return { common }
}
