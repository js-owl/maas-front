export const hiddenUsernames = ['AODMZ', 'KTSPECTR', 'AOIKAR', 'Kronshtadt']
export const hiddenStatuses = ['C3:NEW', 'C3:PREPARATION']

export const hidePrice = (username?: string | null, status?: string | null): boolean => {
  const u = !!username && hiddenUsernames.includes(username)
  const s = !status || hiddenStatuses.includes(status)

  console.log('username', u)
  console.log('status', s)
  console.log('hidePrice', u && s)

  return u && s
}
