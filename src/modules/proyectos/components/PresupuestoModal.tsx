interface PresupuestoModalProps {
  url: string
  nombre: string
  onClose: () => void
}

export default function PresupuestoModal({ url, nombre, onClose }: PresupuestoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-screen h-screen max-w-none max-h-none flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4 bg-white flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-900">{nombre}</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Iframe con el archivo */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 'none' }}
          />
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex gap-3 flex-shrink-0">
        <a
            href={url}
            download
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium text-center"
          >
            Descargar
          </a>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-200 text-slate-900 rounded-md hover:bg-slate-300 text-sm font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}