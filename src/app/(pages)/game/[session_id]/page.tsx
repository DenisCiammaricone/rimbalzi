'use client'
import { game } from "@/game/core"
import React from "react"

export default function Page({
  params,
}: {
  params: Promise<{ session_id: string }>
}) {
  const session_id = React.use(params).session_id
  return (<><div>Session ID: {session_id}</div><div>{game(7)}</div></>)
}