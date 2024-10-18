import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import ky from 'ky'
import { ChevronLeft, Loader2, MessageSquarePlus, Send } from 'lucide-react'
import { useMemo, useState } from 'react'

type Chat = {
  id: string
  name: string
  updatedAt: string
}

export const Route = createFileRoute('/c/')({
  component: Chat,
})

function Chat() {
  const { isPending, mutate } = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, godName: 'Veles' }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = (await reader?.read()) ?? {}
        if (done) break
        const chunk = decoder.decode(value)
        const event = JSON.parse(chunk.replace('data: ', ''))
        // Handle the event here (e.g., update state, show message)
        console.log('Received event:', event)
      }
    },
  })

  const [input, setInput] = useState('')

  const submit = () => {
    const message = input.trim()
    if (!message) return
    setInput('')
    mutate(message)
  }

  return (
    <div className="flex flex-col max-w-xl mx-auto gap-4 h-full items-center justify-center">
      <h1 className="text-lg md:text-3xl">Chat with me</h1>
      <div className="relative w-full">
        <Input
          placeholder="Message Veles"
          size="xl"
          disabled={isPending}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (e.shiftKey) {
                setInput((prev) => prev + '\r\n')
              } else {
                e.preventDefault()
                return submit()
              }
            }
          }}
        />
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1.5"
          onClick={() => submit()}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Send className="size-5" />
          )}
        </Button>
      </div>
    </div>
  )
}
