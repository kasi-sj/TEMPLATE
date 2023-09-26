"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { cn } from "@/lib/utils"
import axios from "axios"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useUploadThing } from "@/lib/hooks/uploadthings"





const profileFormSchema = z.object({
  fieldName: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  field: z
    .string({
      required_error: "Please select an email to display.",
    }),
  bio: z.string().max(160).min(4),
  address : z.string().max(160).min(4),
  contactNo : z.string().max(10).min(10),
  password : z.string().min(7),
  // urls: z
  //   .array(
  //     z.object({
  //       value: z.string().url({ message: "Please enter a valid URL." }),
  //     })
  //   )
  //   .optional(),
  template:z.unknown()
})

const defaultValues = {
  field : "Hospital",
  fieldName : "Apolo",
  bio: "I own a computer.",
  address : "61/A kamarajar puram",
  contactNo :"9080725679",
  // urls: [
  //   { value: "https://apolo.com" },
  // ],
  password:"",
}

export default function ProfileForm() {
  const [submitting , setSubmitting] = useState(false)
  const [files , setFiles ] = useState(null);
  const [selectedFile , setSelectedFile] = useState(null);
  const {startUpload} = useUploadThing("media");
  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const { fields, append } = useFieldArray({
    name: "urls",
    control: form.control,
  })

  const router = useRouter();

  function handleFileInputChange(e) {
    setSelectedFile(e.target.files[0]);
    setFiles(Array.from(e.target.files));
  }

  async function onSubmit(data) {
    setSubmitting(true);

    if (!files) {
      console.log('No file selected.');
      setSubmitting(false);
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const fileData = {
        name: selectedFile.name,
        type: selectedFile.type,
        dataUrl: fileReader.result,
      };

      const response = await axios.post('/api/scan', JSON.stringify(fileData), {
        headers: {
          'Content-Type': 'application/json', 
        },
      });
      if(response.status != 200) {
        setSubmitting(false);
        return;
      }
      console.log(response.data);
      const result = response.data;
      console.log(files);
      const imageRes = await startUpload(files);
      if(!imageRes || !imageRes[0].fileUrl){
        setSubmitting(false);
        return;
      }
      const imgUrl = imageRes[0].fileUrl;
      data.contactNo = (result.hospital_contact?.phone).replaceAll("-","").replaceAll("+","").replaceAll(" ","");
      data.address = result.hospital_contact?.address
      data.fieldName = result.hospital_name;
      console.log(data);
      data.template = imgUrl;
      const resHos = await axios.post("/api/signUp",data);
      console.log(resHos);
      if(resHos.status != 200){
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
      router.push("/wait")
    }
    fileReader.readAsDataURL(selectedFile);
    
  }

  return (
    <div className="flex justify-center">
    <div className="w-1/2">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="field"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your domain" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Hospital">Hospital</SelectItem>
                  <SelectItem value="Medical">Medical</SelectItem>
                  <SelectItem value="Laboratory">Laboratory</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can select your domain {" "}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fieldName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Name</FormLabel>
              <FormControl>
                <Input placeholder="Apolo" {...field} disabled />
              </FormControl>
              <FormDescription>
              This is your hospital name. It can be your real name or a
                pseudonym. You can only change this once every 30 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations to
                link to them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                disabled
                  placeholder="Enter your address"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> your Address
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contect No</FormLabel>
              <FormControl>
                <Input placeholder="9876543210" {...field} disabled />
              </FormControl>
              <FormDescription>
              This is your hospital contact no
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template</FormLabel>
              <FormControl>
              <Input id="picture" type="file" onChange={handleFileInputChange} />
              </FormControl>
              <FormDescription>
              This is your hospital template
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="enter your password" {...field} />
              </FormControl>
              <FormDescription>
              This is your hospital password
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: "" })}
          >
            Add URL
          </Button>
        </div> */}
        <Button disabled={submitting} type="submit">Update profile</Button>
      </form>
    </Form>
      </div>
    </div>
  )
}