"use client";
import { useEffect } from "react";

export function Probe({ name }: { name: string }) {
  useEffect(() => {
    console.log(`[${name}] mount`);
    return () => console.log(`[${name}] unmount`);
  }, []);
  return null;
}