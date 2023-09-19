type Ticket = {
  id: number
  user_address: string
  ticket_value: number
  purchase_time: number
}

export const createTicket = async (ticket: Ticket) => {
  try {
    const data = await fetch('/api/ticket', {
      method: 'POST',
      body: JSON.stringify(ticket),
    })

    return data.json()
  } catch (error) {
    console.log(error)
  }
}

export const getTickets = async () => {
  try {
    const data = await fetch('/api/ticket')
    return data.json()
  } catch (error) {
    console.log(error)
  }
}
