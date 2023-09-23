"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
// import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export function UserAuthForm({ username,setUserName, password , setPassword , onSubmit ,submitting}) {

  return (
    <div className={cn("grid gap-6")} >
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              User Id
            </Label>
            <Input
              id="text"
              placeholder="Enter User Id"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={submitting}
              onChange={(event)=>setUserName(event.target.value)}
              value={username}
            />
            <Input
              id="password"
              placeholder="Enter password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={submitting}
              onChange={(event)=>setPassword(event.target.value)}
              value={password}
            />
          </div>
          <Button disabled={submitting} type="submit">
            Log In
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>
      
    </div>
  )
}