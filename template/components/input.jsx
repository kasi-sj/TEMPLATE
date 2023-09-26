'use client'
import axios from 'axios';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import path from 'path';

export function InputFile( {selected,onChange,onSubmit,submitting} ) {
  const center = !submitting ? "absolute w-screen flex justify-center items-center flex-column h-screen " : " hidden flex justify-center items-center flex-column px-5";
  return (
    <div className={center}>
      <div className="grid w-full max-w-sm items-center gap-1.5 flex-col">
        <Input id="picture" type="file" multiple onChange={onChange} />
        <Button type="button" onClick={onSubmit} >
          Submit
        </Button>
      </div>
    </div>
  );
}
