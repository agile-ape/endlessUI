import { socket } from '@/lib/socket'
import { useEffect } from 'react'

export interface Event {
  name: string
  handler(...args: any[]): any
}

export function useSocketEvents(events: Event[]) {
  // useEffect(() => {
  //   if (!socket.connected) {
  //     socket.connect()
  //   }

  //   return () => {
  //     socket.disconnect()
  //   }
  // }, [])

  useEffect(() => {
    for (const event of events) {
      socket.on(event.name, event.handler)
    }

    return function () {
      for (const event of events) {
        socket.off(event.name, event.handler)
      }
    }
  }, [])
}
