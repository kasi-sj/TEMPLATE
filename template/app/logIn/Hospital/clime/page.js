"use client"
import React, { useEffect, useState } from 'react'

const clime = () => {
  const [data , setData] = useState(null);
  const res=localStorage.getItem("claim");
  console.log(res);
  return (
    <div>
      {JSON.stringify(res)}
    </div>
  )
}

export default clime
