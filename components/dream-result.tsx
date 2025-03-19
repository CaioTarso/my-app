"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2, ThumbsUp, ThumbsDown } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DreamResultProps {
  interpretation: string
  dream: string
}

export function DreamResult({ interpretation, dream }: DreamResultProps) {
  const [feedbackGiven, setFeedbackGiven] = useState(false)
  const [feedbackType, setFeedbackType] = useState<"positive" | "negative" | null>(null)

  const handleFeedback = (type: "positive" | "negative") => {
    setFeedbackGiven(true)
    setFeedbackType(type)
    // Here you could send the feedback to your backend
    console.log(`User gave ${type} feedback for interpretation`)
  }

  const generateDreamImage = async (): Promise<Blob> => {
    // Create a canvas element
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    // Set canvas dimensions - make it taller to fit interpretation
    canvas.width = 1200
    canvas.height = 1400 // Increased height to accommodate interpretation

    if (!ctx) throw new Error("Could not get canvas context")

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "#4338ca")
    gradient.addColorStop(1, "#7e22ce")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add some dream-like elements
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const radius = Math.random() * 50 + 10
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    // Add title
    ctx.font = "bold 60px Arial"
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.fillText("Meu Sonho", canvas.width / 2, 80)

    // Word wrap function for canvas
    const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines = 0) => {
      const words = text.split(" ")
      let line = ""
      let testLine = ""
      let lineCount = 0

      for (let n = 0; n < words.length; n++) {
        testLine = line + words[n] + " "
        const metrics = ctx.measureText(testLine)
        const testWidth = metrics.width

        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, y + lineCount * lineHeight)
          line = words[n] + " "
          lineCount++

          // Limit to maxLines if specified
          if (maxLines > 0 && lineCount >= maxLines) {
            if (n < words.length - 1) {
              line += "..."
            }
            ctx.fillText(line, x, y + lineCount * lineHeight)
            break
          }
        } else {
          line = testLine
        }
      }

      if (maxLines === 0 || lineCount < maxLines) {
        ctx.fillText(line, x, y + lineCount * lineHeight)
      }

      return lineCount + 1 // Return the number of lines written
    }

    // Add dream section
    ctx.font = "bold 40px Arial"
    ctx.fillStyle = "white"
    ctx.textAlign = "left"
    ctx.fillText("O Sonho:", 100, 160)

    // Add dream text
    const dreamText = dream.length > 200 ? dream.substring(0, 200) + "..." : dream
    ctx.font = "30px Arial"
    wrapText(dreamText, 100, 210, canvas.width - 200, 40, 4)

    // Add separator line
    ctx.beginPath()
    ctx.moveTo(100, 380)
    ctx.lineTo(canvas.width - 100, 380)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
    ctx.lineWidth = 2
    ctx.stroke()

    // Add interpretation section title
    ctx.font = "bold 40px Arial"
    ctx.fillStyle = "white"
    ctx.textAlign = "left"
    ctx.fillText("Interpretação:", 100, 440)

    // Add interpretation text
    ctx.font = "24px Arial"
    const interpretationLines = interpretation.split("\n").filter((line) => line.trim() !== "")
    let yPosition = 490

    // Process each paragraph of the interpretation
    for (let i = 0; i < interpretationLines.length; i++) {
      if (yPosition > canvas.height - 100) break // Stop if we're running out of space

      const linesWritten = wrapText(interpretationLines[i], 100, yPosition, canvas.width - 200, 34)
      yPosition += linesWritten * 34 + 20 // Add extra space between paragraphs
    }

    // Add site URL at the bottom
    ctx.font = "24px Arial"
    ctx.textAlign = "center"
    ctx.fillText("interpretai.vercel.app", canvas.width / 2, canvas.height - 50)

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error("Could not generate image"))
        }
      }, "image/png")
    })
  }

  const handleShare = async () => {
    try {
      // Generate image from dream
      const imageBlob = await generateDreamImage()
      const imageFile = new File([imageBlob], "meu-sonho.png", { type: "image/png" })

      if (navigator.share) {
        try {
          await navigator.share({
            title: "Minha Interpretação de Sonho",
            text: `Confira a interpretação do meu sonho!`,
            files: [imageFile],
            url: window.location.href,
          })
        } catch (error) {
          console.error("Error sharing:", error)

          // Fallback: download the image
          const link = document.createElement("a")
          link.href = URL.createObjectURL(imageBlob)
          link.download = "meu-sonho.png"
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          alert("Imagem do sonho baixada!")
        }
      } else {
        // Fallback for browsers that don't support the Web Share API
        const link = document.createElement("a")
        link.href = URL.createObjectURL(imageBlob)
        link.download = "meu-sonho.png"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        alert("Imagem do sonho baixada!")
      }
    } catch (error) {
      console.error("Error generating or sharing image:", error)
      alert("Não foi possível gerar a imagem do sonho.")
    }
  }

  return (
    <Card className="p-6 shadow-lg bg-white dark:bg-gray-800">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300">Interpretação do Seu Sonho</h2>

        <div className="prose dark:prose-invert max-w-none">
          {interpretation.split("\n").map((paragraph, index) => (
            <p key={index} className="text-gray-700 dark:text-gray-300">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFeedback("positive")}
                    disabled={feedbackGiven}
                    className={feedbackType === "positive" ? "bg-green-100 dark:bg-green-900" : ""}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Útil
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Esta interpretação foi útil?</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFeedback("negative")}
                    disabled={feedbackGiven}
                    className={feedbackType === "negative" ? "bg-red-100 dark:bg-red-900" : ""}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Impreciso
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Esta interpretação não foi precisa?</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" />
            Compartilhar como Imagem
          </Button>
        </div>

        {feedbackGiven && (
          <div className="text-sm text-center text-gray-500 dark:text-gray-400">
            Obrigado pelo seu feedback! Isso nos ajuda a melhorar nossas interpretações.
          </div>
        )}
      </div>
    </Card>
  )
}

