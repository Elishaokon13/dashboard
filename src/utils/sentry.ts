export const isUserRejected = (err) => {
  // provider user rejected error code
  return typeof err === 'object' && 'code' in err && err.code === 4001
}

export const logError = (error: Error | unknown) => {
  console.error(error)
}
