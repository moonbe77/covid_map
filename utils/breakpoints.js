const size = {
  xs: '420px',
  sm: '670px',
  lg: '1200px',
}

const device = {
  xs: `(max-width: ${size.xs})`,
  sm: `(max-width: ${size.sm})`,
  lg: `(max-width: ${size.lg})`
}

export default { size, device }