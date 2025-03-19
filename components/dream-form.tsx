"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { interpretDream } from "@/lib/actions"
import { DreamResult } from "@/components/dream-result"

export function DreamForm() {
  const [dream, setDream] = useState("")
  const [interpretation, setInterpretation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [characterCount, setCharacterCount] = useState(0)
  const MAX_CHARS = 2000

  const handleDreamChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= MAX_CHARS) {
      setDream(text)
      setCharacterCount(text.length)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dream.trim()) return

    setIsLoading(true)
    try {
      const result = await interpretDream(dream)
      setInterpretation(result)
    } catch (error) {
      console.error("Error interpreting dream:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card className="p-6 shadow-lg bg-white dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="dream" className="block text-lg font-medium text-gray-700 dark:text-gray-200">
              Descreva seu sonho
            </label>
            <Textarea
              id="dream"
              placeholder="Conte os detalhes do seu sonho aqui..."
              className="min-h-[200px] resize-y"
              value={dream}
              onChange={handleDreamChange}
            />
            <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
              {characterCount}/{MAX_CHARS} caracteres
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !dream.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Interpretando...
              </>
            ) : (
              "Interpretar Sonho"
            )}
          </Button>
        </form>
      </Card>

      {interpretation && <DreamResult interpretation={interpretation} dream={dream} />}
    </div>
  )
}

