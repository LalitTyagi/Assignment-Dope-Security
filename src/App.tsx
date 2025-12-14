import Table from './components/Table';

function App() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground p-8 flex flex-col items-center">
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
          Dope-Security
        </h1>
      </header>
      <main className="w-full max-w-7xl mx-auto">
        <Table />
      </main>
    </div>
  )
}

export default App
