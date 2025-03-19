import { DreamForm } from "@/components/dream-form"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-indigo-800 dark:text-indigo-300 mb-4">Interpret.AI</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Descreva seu sonho e receba uma interpretação detalhada com IA sobre seus possíveis significados.
            </p>
          </div>

          <DreamForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}