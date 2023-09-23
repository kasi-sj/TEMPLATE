import React from 'react'


const page = (route) => {
    const email = decodeURIComponent(route.params.user);
  return (
    <div>
      {(email)}
    </div>
  )
}

export default page
