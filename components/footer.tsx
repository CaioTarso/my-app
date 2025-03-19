export function Footer() {
  return (
    <footer className="py-6 px-4 bg-indigo-900 text-white">
      <div className="container mx-auto text-center">
        <p className="text-sm">© {new Date().getFullYear()} Interpret.AI. Todos os direitos reservados.</p>
        <p className="text-xs mt-2 text-indigo-200">
          As interpretações são geradas por inteligência artificial e devem ser consideradas apenas como possibilidades.
          Não substituem aconselhamento profissional.
        </p>
      </div>
    </footer>
  )
}

