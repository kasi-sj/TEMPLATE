'use client'
import * as React from "react"
import Image from "next/image"
import Link from "next/link"

// import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { buttonVariants } from "../components/ui/button"
import { UserAuthForm } from "../components/UserAuthForm"
import {DropdownMenuRadioGroupIteam} from '../components/dropDown'
import { useState } from "react"


export default function AuthenticationPage() {
  const Router = useRouter();
  const [position, setPosition] = React.useState("Authenticator")
  const [ username , setUserName] = React.useState("");
  const [password , setPassword] = React.useState("");
  const [submitting , setSubmitting] = React.useState(false)
  async function onSubmit(event) {
    event.preventDefault()
    setSubmitting(true);
    const response = await fetch('/api/login',{
      method : 'POST',
      body:JSON.stringify({
        position:position,
        username:username,
        password:password,
      })
    })
    setSubmitting(false)
    if(response.ok){
      if(position=='Authenticator'){
        localStorage.setItem('Authenticator', username);
        Router.push('/logIn/Authenticator');
      }
      else{
        localStorage.setItem('Hospital', username);
        Router.push('/logIn/Hospital');
      }
    }
    setSubmitting(false)
  }
  return (
    <>
      <div className="container relative  h-[800px]  items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-1 flex items-center text-lg font-medium">
            <Image src="/images/logo.png"  width={100} height={100} />
            <h1>Bajaj Finserv Health Ltd   Template checker </h1>
          </div>
          <div className="relative z-20 mt-auto">
          <footer>
            We trust you 
          </footer>
        </div>
        </div>
        
        <div className="lg:p-8">
          <div className="mx-auto flex   flex-col justify-center space-y-6 w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              
              <h1 className="text-2xl font-semibold tracking-tight">
                Log into your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Select your roll
              </p>
              <DropdownMenuRadioGroupIteam position={position} setPosition={setPosition}/>
              <p className="text-sm text-muted-foreground">
                Enter your credentials
              </p>
            </div>
            <UserAuthForm username={username} setUserName={setUserName} password={password} setPassword={setPassword} onSubmit={onSubmit} submitting={submitting}/>

            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}