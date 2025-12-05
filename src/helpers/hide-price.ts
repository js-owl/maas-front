export const hiddenUsernames = ['diam-aero', 'bbb']

export const hiddenStatuses = ['pending', 'ccc']

export const shouldHidePrice = (username?: string | null, status?: string | null): boolean => {
  const u = !!username && hiddenUsernames.includes(username)
  const s = !status || hiddenStatuses.includes(status)

  console.log('username', u)
  console.log('status', s)
  console.log('hidePrice', u && s)

  return u && s
}


