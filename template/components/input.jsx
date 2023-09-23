'use client'
import axios from 'axios';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import path from 'path';

export function InputFile( {selected,onChange,onSubmit,submitting} ) {
  const center = selected.length === 0 ? "flex justify-center items-center flex-column h-screen" : "flex justify-center items-center flex-column ";
  return (
    <div className={center}>
      <div className="grid w-full max-w-sm items-center gap-1.5 flex-col">
        <Input id="picture" type="file" multiple onChange={onChange} />
        <Button type="button" onClick={onSubmit} disabled={submitting}>
          Submit
        </Button>
      </div>
    </div>
  );
}
