/**
 * @param {promise}  promise
*/
export function to(promise) {
    return promise
      .then(data => {
        return [null, data]
      })
      .catch(err => [err, null])
  }