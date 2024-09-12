export const transformToLocalTime = (isoString) => {
  const date = new Date(isoString);
  let allMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const day = date.getUTCDate()
  const month = allMonth[date.getUTCMonth()]
  const year = date.getUTCFullYear()
  const hour = date.getUTCHours()
  const minute = date.getUTCMinutes()

  return `${month} ${day}, ${hour}:${minute}, ${year}`

}
