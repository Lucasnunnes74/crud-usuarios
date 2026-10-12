import { useState, useEffect, useReducer } from 'react'
import type { UserPersol } from '../type/usuario'

type Consulta = { usuarios: UserPersol[]; carregando: boolean; erro: string | null }
type Acao =
  | { type: 'BUSCA_INICIO' }
  | { type: 'BUSCA_SUCESSO'; payload: UserPersol[] }
  | { type: 'BUSCA_ERRO'; payload: string }

const estadoInicial: Consulta = { usuarios: [], carregando: true, erro: null }

function reducer(estado: Consulta, acao: Acao): Consulta {
  switch (acao.type) {
    case 'BUSCA_INICIO':
      return { ...estado, carregando: true, erro: null }
    case 'BUSCA_SUCESSO':
      return { ...estado, usuarios: acao.payload, carregando: false, erro: null }
    case 'BUSCA_ERRO':
      return { ...estado, erro: acao.payload, carregando: false }
    default:
      return estado
  }
}

function UserApi() {
  const [estado, atulEstado] = useReducer(reducer, estadoInicial)
  const { usuarios, carregando, erro } = estado
  const [busca, setBusca] = useState<string>('')
  const filtrados = usuarios.filter((list) =>
    list.name.toLowerCase().trim().includes(busca.toLowerCase().trim())
  )


  useEffect(() => {
    async function buscarUsuarios() {
      atulEstado({ type: 'BUSCA_INICIO' })
      try {
        const resposta = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!resposta.ok) {
          throw new Error('resposta')
        }
        const dados = await resposta.json()
        atulEstado({ type: 'BUSCA_SUCESSO', payload: dados })
      } catch {
        atulEstado({ type: 'BUSCA_ERRO', payload: 'Algo deu errado, erro' })
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
