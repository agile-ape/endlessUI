import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === 'POST') {
    try {
      const { token } = req.body

      const data = await fetch('https://hcaptcha.com/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `response=${token}&secret=ES_3aa22ebb41a746cdaa481bd1babc8fac`,
      })

      const result = await data.json()

      return res.status(200).json({ message: result?.success ? 'success' : 'fail' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}
