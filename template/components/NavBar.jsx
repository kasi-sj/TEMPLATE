"use client"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

export default function ProfileForm() {
  return (
    <NavigationMenu style={{height:60 ,color:'black'}}>
    <NavigationMenuList style={{display:'flex' , justifyContent:'center'}}>
      <NavigationMenuItem >
      <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
        <NavigationMenuContent className="NavigationMenuContent">
          <div className="px-6 py-2">
            <a href="/">home</a>
          </div>
          <div className="px-6 py-2">
            <a href="/about">about</a>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
      <NavigationMenuTrigger>Sign Up</NavigationMenuTrigger>
        <NavigationMenuContent className="NavigationMenuContent">
          <div className="px-4 py-2">
            <a href="/signUp/Authenticator">Authenticator</a>
          </div>
          <div className="px-4 py-2">
            <a href="/signUp/Hospital">Hospital</a>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
  )
  
}