function timeAgo(timestamp) {
  let date = new Date(timestamp)
  let dateMillis = date.getTime()
  let seconds = Math.floor((new Date() - dateMillis) / 1000)

  let interval = seconds / 31536000

  if (interval > 1) {
    return Math.floor(interval) + ' years'
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return `on ${date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    })}`
  }
  interval = seconds / 86400
  if (interval > 1) {
    return `${Math.floor(interval)} ${
      Math.floor(interval) > 1 ? 'days' : 'day'
    } ago`
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + ' hours ago'
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + ' minutes ago'
  }
  return Math.floor(seconds) + ' seconds ago'
}
