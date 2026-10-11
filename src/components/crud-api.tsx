import { useState, useEffect } from 'react'
import type { UserPersol } from '../type/usuario'

function UserApi() {
  const [usuarios, setUsuarios] = useState<UserPersol[]>([])
  const [carregando, setCarregando] = useState<boolean>(true)
  const [erro, setErro] = useState<string | null>(null)
  const [busca, setBusca] = useState<string>('')
  const filtrados = usuarios.filter((list) =>
    list.name.toLowerCase().trim().includes(busca.toLowerCase().trim())
  )


  useEffect(() => {
    async function buscarUsuarios() {
      try {
        const resposta = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!resposta.ok) {
          throw new Error('resposta')
        }
        const dados = await resposta.json()
        return setUsuarios(dados)
      } catch {
        return setErro('Algo deu errado, erro');
      } finally {
        setCarregando(false)
      }
    }
    buscarUsuarios()
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-800">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-slate-900">
          Lista de usuários
        </h1>

        {carregando && <p className="mb-4 text-slate-500">Carregando...</p>}
        {erro && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {erro}
          </p>
        )}

        <input
          type="text"
          placeholder="Buscar por nome..."
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <p className="mt-2 mb-6 text-sm text-slate-500">
          Usuários encontrados: {filtrados.length} de {usuarios.length}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {filtrados.map((u) => (
            <div
              key={u.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <h2 className="font-semibold text-slate-900">{u.name}</h2>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
                  #{u.id}
                </span>
              </div>
              <ul className="space-y-1 text-sm text-slate-600">
                <li><b>E-mail:</b> {u.email}</li>
                <li><b>Endereço:</b> {u.address.city}</li>
                <li><b>Site:</b> <span className="text-indigo-600"><a href={"http://" + u.website} target='_blank' rel='nofollow'>{u.website}</a></span></li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default UserApi
